import boto3
import json
from io import BytesIO
from PIL import Image
import base64
import numpy as np
import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)
def lambda_handler(event, context):

    labels = ['aeroplane', 'bicycle', 'bird', 'boat',
                         'bottle', 'bus', 'car', 'cat', 'chair',
                         'cow', 'diningtable', 'dog', 'horse',
                         'motorbike', 'person', 'pottedplant',
                         'sheep', 'sofa', 'train', 'tvmonitor']
    image = base64.b64decode(event['base64Image'])
    image = Image.open(BytesIO(image))
    transposed = np.array(image).transpose(2,0,1)

    npy = BytesIO()
    np.save(npy, transposed)
    ByteArr  = npy.getvalue()
    runtime= boto3.client('sagemaker-runtime')
    response = runtime.invoke_endpoint(EndpointName='エンドポイント名',
                                       ContentType='application/x-npy',
                                       Accept = 'application/json',
                                       Body=ByteArr)
    predictions = np.array(json.load(response['Body']))

    results =[]
    for i in range(predictions.shape[1]):
        bbox, label_index, score = predictions[:, i]
        result = {
            'class_name' : labels[label_index],
            'y_min': int(bbox[0]),
            'x_min': int(bbox[1]),
            'y_max': int(bbox[2]),
            'x_max': int(bbox[3]),
            'score': score
        }
        results.append(result)

    return {
        "statusCode": 200,
        "body": json.dumps(results)
    }
