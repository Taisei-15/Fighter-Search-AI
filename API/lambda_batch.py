import boto3
import json
from io import BytesIO
import time
import logging
import base64
import cgi
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    ctype, pdict = cgi.parse_header(event['params']['header']['content-type'])
    logger.info(pdict)
    pdict['boundary'] = bytes(pdict['boundary'], "utf-8")
    if ctype == 'multipart/form-data':
            fields = cgi.parse_multipart(BytesIO(base64.b64decode(event['body-json'])), pdict)

    model_name = fields['model'][0].decode("utf-8")

    timestamp = time.strftime("%Y%m%d-%H%M%S")
    job_name = 'transformjob' + timestamp
    indir = fields['indir'][0].decode("utf-8")
    outdir = fields['outdir'][0].decode("utf-8") + timestamp
    instance_type = fields['instance_type'][0].decode("utf-8")
    instance_count = int(fields['instance_count'][0].decode("utf-8"))

    runtime= boto3.client('sagemaker')
    response = runtime.create_transform_job(
        TransformJobName=job_name,
        ModelName=model_name,
        TransformInput={
            'DataSource': {
                'S3DataSource': {
                    'S3DataType': 'S3Prefix',
                    'S3Uri': indir
                }
            },
            'ContentType': 'image/jpeg',
        },
        TransformOutput={
            'S3OutputPath': outdir,
            'Accept': 'application/json'
        },
        TransformResources={
            'InstanceType': instance_type,
            'InstanceCount': instance_count,
        }
    )

    return {
        "statusCode": 200,
        "body": response
    }
