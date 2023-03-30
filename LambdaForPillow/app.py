import boto3
import json
from io import BytesIO
from PIL import Image
import base64
import numpy as np

def handler(event, context):
    print(event)

    return {
        "statusCode": 200,
        "body": json.dumps(event)
    }
