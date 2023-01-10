import os

import redis
from rq import Worker, Queue, Connection
from dotenv import load_dotenv
load_dotenv()

listen = ['high', 'default', 'low']

redis_url = os.getenv('REDIS_URL', os.environ['REDIS_URL'])

conn = redis.from_url(redis_url, decode_responses=False)

if __name__ == '__main__':
    with Connection(conn):
        worker = Worker(map(Queue, listen))
        worker.work()