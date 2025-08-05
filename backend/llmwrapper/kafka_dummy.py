import json
import threading
import time
from kafka import KafkaConsumer, KafkaProducer
from queue import Queue

KAFKA_BROKER = "localhost:9092"
CONSUMER_TOPIC = "youtube-request-activity"
PRODUCER_TOPIC = "youtube-response-activity"
GROUP_ID = "user-group"

# In-memory queue to pass IDs from consumer to producer
id_queue = Queue()

# Template response JSON with placeholder ID
template_response = {
    "error": None,
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
    # "model_res": "{\"interests\": [\"Digital Content Creation\"], \"career_suggestions\": [\"Digital Content Strategist\"]}"
    "model_res": """{
    "interests":[
        "Technology", "Data Analysis", "Machine Learning", "Artificial Intelligence",
        "Programming", "Digital Marketing", "Online Education", "Personal Development",
        "Productivity", "Self-Improvement"
    ],
    "career_suggestions":[
        "Data Scientist", "Machine Learning Engineer", "AI Developer", "Digital Marketing Analyst",
        "Product Manager (Tech)", "Business Analyst (Data Focused)", "Technical Content Creator"
    ],
    "mapped_interest_to_careers":{
        "Technology": ["Data Scientist", "AI Developer", "Machine Learning Engineer"],
        "Data Analysis": ["Data Scientist", "Business Analyst (Data Focused)"],
        "Machine Learning": ["Machine Learning Engineer", "AI Developer"],
        "Digital Marketing": ["Digital Marketing Analyst"],
        "Online Education": ["Technical Content Creator", "Instructional Designer (Tech)"],
        "Personal Development": ["Product Manager (Tech)", "Business Analyst (Data Focused)"]
    },
    "career_justifications":{
        "Data Scientist":"Based on interest in data analysis and technology, a Data Scientist role aligns well, utilizing analytical skills and programming knowledge.",
        "Machine Learning Engineer":"The focus on machine learning and AI indicates a strong fit for a Machine Learning Engineer, building and deploying AI models.",
        "Digital Marketing Analyst":"Interest in digital marketing, combined with analytical skills, suggests a role as a Digital Marketing Analyst.",
        "Product Manager (Tech)":"The self-improvement and technology interests combined with a desire for personal development points to a Product Manager role within the tech industry.",
        "Business Analyst (Data Focused)":"The interest in data analysis and personal development suggests a role as a Business Analyst, focusing on data-driven insights."
    },
    "confidence_scores":{
        "Data Scientist":0.9,
        "Machine Learning Engineer":0.8,
        "Digital Marketing Analyst":0.75,
        "Product Manager (Tech)":0.85,
        "Business Analyst (Data Focused)":0.7,
        "Technical Content Creator":0.65
    },
    "values":[
        "Knowledge", "Growth", "Innovation", "Efficiency", "Impact", "Learning", "Self-Improvement"
    ],
    "emotional_patterns":[
        "Optimistic", "Motivated", "Curious", "Driven", "Reflective", "Persistent"
    ],
    "self_concept_attributes":[
        "Analytical", "Resourceful", "Ambitious", "Adaptable", "Logical", "Creative"
    ],
    "ocean_traits":{
        "openness":{ "score":80, "description":"Highly imaginative and curious, enjoys new experiences and ideas." },
        "conscientiousness":{ "score":85, "description":"Highly organized and detail-oriented, striving for excellence and efficiency." },
        "extraversion":{ "score":40, "description":"Prefers quiet reflection and focused work, but can engage in collaborative projects." },
        "agreeableness":{ "score":65, "description":"Generally cooperative and helpful, but can be critical when assessing information." },
        "neuroticism":{ "score":50, "description":"Experiences occasional stress and self-doubt, but generally maintains a positive outlook." }
    }
}"""

}


def consumer_thread():
    consumer = KafkaConsumer(
        CONSUMER_TOPIC,
        bootstrap_servers=[KAFKA_BROKER],
        group_id=GROUP_ID,
        value_deserializer=lambda m: json.loads(m.decode('utf-8')),
        auto_offset_reset='latest',
        enable_auto_commit=True
    )

    print("[Consumer] Started...")
    for message in consumer:
        print("[Consumer]: ", message)
        # id_queue.put(222)
        value = message.value
        if isinstance(value, dict) and "id" in value:
            print(f"[Consumer] Received ID: {value['id']}")
            id_queue.put(value["id"])


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
