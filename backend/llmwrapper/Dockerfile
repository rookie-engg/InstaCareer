# FROM python:3.11
FROM pytorch/pytorch:2.7.0-cuda11.8-cudnn9-runtime

WORKDIR /usr/app

COPY ./nltk_data /usr/share/nltk_data
COPY ./db ./db
COPY ./youtube ./youtube
COPY ./ollama_llm.py ./project_types.py ./
COPY ./server.py ./task.py ./
COPY ./prompt ./prompt
COPY ./requirements.txt ./

RUN python3 -m pip install -r requirements.txt

ENV NLTK_DATA=/usr/share/nltk_data \ 
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

CMD [ "python", "server.py"]