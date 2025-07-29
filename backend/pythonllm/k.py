import json
import threading
import time
from kafka import KafkaConsumer, KafkaProducer
from queue import Queue

KAFKA_BROKER = "asus:9092"
CONSUMER_TOPIC = "youtube-request-activity"
PRODUCER_TOPIC = "youtube-response-activity"
GROUP_ID = "user-group"

# In-memory queue to pass IDs from consumer to producer
id_queue = Queue()

# Template response JSON with placeholder ID
template_response = {
    "id": None,
    "raw_descritions": [
        {
            "titleUrl": "https://www.youtube.com/watch?v=L5gcl-4nwVI",
            "description": "",
            "error": None,
            "title": "Watched Evergreen_16x9_AWS_UGC_20s_la.EN"
        },
        {
            "titleUrl": "https://www.youtube.com/watch?v=L5gcl-4nwVI",
            "description": "",
            "error": None,
            "title": "Watched Evergreen_16x9_AWS_UGC_20s_la.EN"
        }
    ],
    "cleaned_descriptions": [
        {
            "titleUrl": "https://www.youtube.com/watch?v=L5gcl-4nwVI",
            "description": "",
            "title": "watched evergreen_ x _aws_ugc_ s_la.en"
        },
        {
            "titleUrl": "https://www.youtube.com/watch?v=L5gcl-4nwVI",
            "description": "",
            "title": "watched evergreen_ x _aws_ugc_ s_la.en"
        }
    ],
    "model_promt": "1. Title:watched evergreen_ x _aws_ugc_ s_la.en\nDescription:\n\n2. Title:watched evergreen_ x _aws_ugc_ s_la.en\nDescription:\n\nAnalyze the above YouTube video history and provide a detailed career and personality assessment in a single JSON object...",
    "model_res": "{\"interests\": [\"Digital Content Creation\"], \"career_suggestions\": [\"Digital Content Strategist\"]}"
}


def consumer_thread():
    consumer = KafkaConsumer(
        CONSUMER_TOPIC,
        bootstrap_servers=[KAFKA_BROKER],
        group_id=GROUP_ID,
        # value_deserializer=lambda m: json.loads(m.decode('utf-8')),
        auto_offset_reset='earliest',
        enable_auto_commit=True
    )

    print("[Consumer] Started...")
    for message in consumer:
        print("[Consumer]: ", message)
        id_queue.put(222)
        # value = message.value
        # if isinstance(value, dict) and "id" in value:
        #     print(f"[Consumer] Received ID: {value['id']}")
        #     id_queue.put(value["id"])


def producer_thread():
    producer = KafkaProducer(
        bootstrap_servers=[KAFKA_BROKER],
        value_serializer=lambda m: json.dumps(m, separators=(',', ':')).encode('utf-8')
    )

    print("[Producer] Started...")
    while True:
        # producer.send(PRODUCER_TOPIC, "this is from producer")
        # producer.flush()
        # continue
        try:
            request_id = id_queue.get(timeout=10)
            payload = template_response.copy()
            payload["id"] = request_id
            producer.send(PRODUCER_TOPIC, payload)
            producer.flush()
            print(f"[Producer] Sent response for ID: {request_id}")
        except:
            pass  # No log here — silence if nothing to do


# Start both threads
t1 = threading.Thread(target=consumer_thread, daemon=True)
t2 = threading.Thread(target=producer_thread, daemon=True)

t1.start()
t2.start()

# Keep main thread alive
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Shutting down...")
