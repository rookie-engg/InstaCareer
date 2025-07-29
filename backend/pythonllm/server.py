import json, kafka
import sys, signal

from typing import List, Tuple
from concurrent.futures import Future, ThreadPoolExecutor
from queue import Empty

from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO

from queue import Queue
from threading import Thread, Event
from project_types import Task, TaskResult
from task import video_description_task_executor

from ollama_llm import OllamaLLM
from db.database import Database
from youtube.youtube_types import VideoDescription

quit_event = Event()

task_queue: Queue[Task] = Queue()
task_result_queue: Queue[TaskResult] = Queue()
save_desc_queue: Queue[Tuple[List[VideoDescription], List[VideoDescription]]] = Queue()

app = Flask(__name__)
CORS(app=app)
socketio = SocketIO(app=app, cors_allowed_origins='*')

PUT_INTO_TASK_QUEUE = 'put-into-task-queue'
SEND_TASK_RESPONSE = 'get-response'

def database_writer_worker(
    save_desc_queue: Queue[Tuple[List[VideoDescription], List[VideoDescription]]],
    database_instance: Database,
    max_workers: int,
    quit_event: Event
) -> None:
    try:
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            while not quit_event.is_set():
                try:
                    raw, processed = save_desc_queue.get(timeout=1)
                    executor.submit(
                        database_instance.
                        save_in_raw_youtube_description_bulk,
                        descs=raw
                    ).add_done_callback(
                        lambda _: print(
                            'Saved raw description to database'
                        )
                    )
                    executor.submit(
                        database_instance.
                        save_in_processed_youtube_description_bulk,
                        descs=processed
                    ).add_done_callback(
                        lambda _: print(
                            'Saved processed description to database'
                        )
                    )
                except Empty:
                    continue
                except Exception as e:
                    print(e)
                    print("Error in database_writer_worker")
                    # quit_event.set()
    except Exception as e:
        print(e)
        print("Fatal error in database_writer_worker")
        quit_event.set()

def task_result_dispatcher(q: Queue[TaskResult]) -> None:
    try:
        while not quit_event.is_set():
            try:
                res = q.get(timeout=1)
                with app.app_context():
                    socketio.emit(SEND_TASK_RESPONSE, json.dumps(res))
                print(f'task with id: {res["id"]} sent to client')
            except Empty:
                continue
            except Exception as e:
                print(e)
                print("Error in task_result_dispatcher")
                # quit_event.set()
    except Exception:
        print(e)
        print("Fatal error in task_result_dispatcher")
        quit_event.set()

def task_result_kafka_producer(
        q: Queue[TaskResult], 
        producer: kafka.KafkaProducer,
        reply_topic: str
    ) -> None:

    while not quit_event.is_set():
        try:
            val = q.get(timeout=1)
            print("Sending task result to kafka queue: \n")
            print('-'*10)
            print(val)
            print('-'*10)
            producer.send(reply_topic, value=val)
        except Empty:
            continue

def task_processor_worker(
    ollama_instance: OllamaLLM,
    database_instance: Database,
    suffix_prompt: str,
    task_q: Queue[Task],
    task_res: Queue[TaskResult],
    max_workers: int,
    quit_event: Event
) -> None:
    try:
        def callback(task_result: TaskResult) -> None:
            try:
                res = task_result.result()
                # print(res)
                task_res.put(res)
                print(
                    f'task with id {res["id"]} completed and added to queue'
                )
            except Exception as e:
                print(e)
                print("Error in task result callback")
                # quit_event.set()

        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            while not quit_event.is_set():
                try:
                    task = task_q.get(timeout=1)
                    future = executor.submit(
                        video_description_task_executor,
                        task=task,
                        suffix_prompt=suffix_prompt,
                        ollama_instance=ollama_instance,
                        database_instance=database_instance,
                        save_desc_queue=save_desc_queue
                    )
                    future.add_done_callback(callback)
                except Empty:
                    continue
                except Exception as e:
                    print(e)
                    print("Error in task_processor_worker")

    except Exception as e:
        print(e)
        print("Fatal error in task_processor_worker")
        quit_event.set()

class TaskParsingException(Exception):
    def __init__(self, msg: str):
        super().__init__(msg)

def is_valid_task(data) -> Tuple[bool, str | None]:
    try:
        # task = json.loads(data)
        task = data
        if not isinstance(task, dict):
            raise TaskParsingException('Invalid json structure')

        if 'id' not in task:
            raise TaskParsingException('missing field id')

        if 'activities' not in task:
            raise TaskParsingException('missing field activities')

        if not isinstance(task['activities'], list):
            raise TaskParsingException(
                'invalid type of activities; should be list'
            )

        for activity in task['activities']:
            if 'title' not in activity:
                raise TaskParsingException('missing field title in activities')
            if 'titleUrl' not in activity:
                raise TaskParsingException('missing field titleUrl in activities')

    except json.JSONDecodeError as e:
        return False, f"JSON parse error: {e}"
    except TaskParsingException as e:
        return False, str(e)
    except Exception as e:
        return False, str(e)

    return True, None

@socketio.on(PUT_INTO_TASK_QUEUE)
def handle_incoming_task(data: str):
    try:
        task = json.loads(data)
        if not isinstance(task, dict):
            raise TaskParsingException('Invalid json structure')

        if 'id' not in task:
            raise TaskParsingException('missing field id')

        if 'activities' not in task:
            raise TaskParsingException('missing field activities')

        if not isinstance(task['activities'], list):
            raise TaskParsingException(
                'invalid type of activities; should be list'
            )

        for activity in task['activities']:
            # if 'url' not in activity:
            #     raise TaskParsingException('missing field url in activities')
            if 'title' not in activity:
                raise TaskParsingException('missing field title in activities')
            if 'titleUrl' not in activity:
                raise TaskParsingException('missing field titleUrl in activities')

        task_queue.put(task)  # type: ignore
        return 200, None

    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        return 401, f'error parsing json data: {e}'
    except TaskParsingException as e:
        print(e)
        return 401, str(e)
    except Exception as e:
        print("Unknown error in handle_incoming_task")
        return 500, str(e)
    
@app.route('/health')
def health():
    return "OK", 200
    
def handle_signal(sig, frame):
    quit_event.set()
    sys.exit(0)

signal.signal(signal.SIGINT, handle_signal)
# signal.signal(signal.SIGTERM, handle_signal)

if __name__ == '__main__':
    from dotenv import load_dotenv
    load_dotenv(verbose=True, override=True)
    from os import environ

    print('loaded ENV values')
    from pprint import pprint
    for k, v in environ.items():
        print(f'{k.ljust(15)}: {v}')

    max_workers = 5
    with open('./prompt/all.text') as file:
        prompt = file.read()

    ollama_instance = OllamaLLM(
        host=environ.get('OLLAMA_HOST'),
        port=int(environ.get('OLLAMA_PORT')),
        model=environ.get('OLLAMA_MODEL'),
    )
    database_instance = Database(
        host=environ.get('DATABASE_HOST'),
        port=int(environ.get('DATABASE_PORT')),
        username=environ.get('DATABASE_USERNAME'),
        password=environ.get('DATABASE_PASSWORD'),
        dname=environ.get('DATABASE_NAME'),
        auth_source=environ.get('DATABASE_AUTH_SOURCE')
    )

    topic = environ.get('KAFKA_CONSUMER_TOPIC')
    kafka_grp = environ.get('KAFKA_GROUP')
    reply_topic = environ.get('KAFKA_REPLY_TOPIC')
    kafka_server = environ.get('KAFKA_SERVER')

    consumer = kafka.KafkaConsumer(
        topic,
        bootstrap_servers=[kafka_server],
        group_id=kafka_grp,
        auto_offset_reset='latest',
        enable_auto_commit=True,  
        value_deserializer=lambda m: json.loads(m.decode('utf-8'))
    )

    producer = kafka.KafkaProducer(
        bootstrap_servers=[kafka_server],
        value_serializer=lambda m: json.dumps(m).encode('utf-8')
    )

    save_to_db_thread = Thread(
        target=database_writer_worker,
        kwargs={
            'save_desc_queue': save_desc_queue,
            'database_instance': database_instance,
            'max_workers': max_workers,
            'quit_event': quit_event,
        }
    )
    result_dispatch_thread = Thread(
        target=task_result_dispatcher,
        args=(task_result_queue,)
    )
    kafka_producer_thread = Thread(
        target=task_result_kafka_producer,
        args=(task_result_queue, producer, reply_topic,)
    )
    task_processor_thread = Thread(
        target=task_processor_worker,
        kwargs={
            'task_q': task_queue,
            'task_res': task_result_queue,
            'suffix_prompt': prompt,
            'ollama_instance': ollama_instance,
            'database_instance': database_instance,
            'max_workers': max_workers,
            'quit_event': quit_event,
        }
    )
    save_to_db_thread.start()
    # result_dispatch_thread.start()
    kafka_producer_thread.start()
    task_processor_thread.start()

    try:
        # socketio.run(
        #     app=app,
        #     host=environ.get('SERVER_HOST'),
        #     port=int(environ.get('SERVER_PORT')),
        #     debug=False,
        #     allow_unsafe_werkzeug=True
        # )
        print('starting the kafka consumer')

        for msg in consumer:
            # print(msg)
            # print(msg.value.get('id'))
            # continue
            msg = msg.value
            id = msg.get('id')
            if not id:
                continue
            print(f'message recived id: {id}')

            is_valid, err = is_valid_task(msg)
            if not is_valid:
                producer.send(reply_topic, value={
                    'id': id,
                    'err': err,
                    'result': None
                })
                continue

            task_queue.put(msg)

    except Exception as e:
        print(e)
        quit_event.set()
        exit(1)