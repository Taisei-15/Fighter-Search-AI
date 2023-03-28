import os

import chainer
import numpy as np

from chainercv.datasets import voc_bbox_label_names
from chainercv.links import SSD300

import io
from six import BytesIO
from PIL import Image
import sys
import logging
import pathlib
import tensorflow as tf
from tensorflow.keras import layers, losses, optimizers, applications
from tensorflow.keras.utils import image_dataset_from_directory, plot_model
import matplotlib.pyplot as plt

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logger.addHandler(logging.StreamHandler(sys.stdout))
IMG_SIZE = (128, 128)

def model_fn(model_dir):
    data_augmentation = tf.keras.Sequential()
    data_augmentation.add(layers.RandomFlip('horizontal_and_vertical'))
    data_augmentation.add(layers.RandomRotation(0.4))
    preprocess_input = applications.densenet.preprocess_input

    # (b) create base model using ResNet50
    IMG_SHAPE = IMG_SIZE + (3,)
    base_model = applications.ResNet50(input_shape=IMG_SHAPE,
                                include_top=False,
                                weights='imagenet')

    # (c) Freeze layers
    base_model.trainable = False
    # (d) Classification layer
    nClass = len(class_names)

    global_avg = layers.GlobalAveragePooling2D()
    output_layer = layers.Dense(nClass, activation='softmax')
    inputs = tf.keras.Input(shape=IMG_SHAPE)
    x = data_augmentation(inputs)
    x = preprocess_input(inputs)
    x = base_model(x)
    x = global_avg(x)
    outputs = output_layer(x)

    model = tf.keras.Model(inputs=inputs, outputs=outputs)
    return model

  
def _npy_loads(data):
    """
    Deserializes npy-formatted bytes into a numpy array
    """
    stream = BytesIO(data)
    return np.load(stream)

def _jpg_loads(data):
    """
    Deserializes jpg-formatted bytes into a numpy array
    """
    file_jpgdata = io.BytesIO(data)
    pilimage = Image.open(file_jpgdata)
    return np.asarray(pilimage).transpose((2,0,1))


def input_fn(input_bytes, content_type):
    """This function is called on the byte stream sent by the client, and is used to deserialize the
    bytes into a Python object suitable for inference by predict_fn -- in this case, a NumPy array.
    
    This implementation is effectively identical to the default implementation used in the Chainer
    container, for NPY formatted data. This function is included in this script to demonstrate
    how one might implement `input_fn`.
    Args:
        input_bytes (numpy array): a numpy array containing the data serialized by the Chainer predictor
        content_type: the MIME type of the data in input_bytes
    Returns:
        a NumPy array represented by input_bytes.
    """
    if content_type == 'application/x-npy':
        return _npy_loads(input_bytes)
    elif content_type == 'image/jpeg':
        return _jpg_loads(input_bytes)
    else:
        raise ValueError('Content type must be application/x-npy')

def predict_fn(input_data, model):
    """
    This function receives a NumPy array and makes a prediction on it using the model returned
    by `model_fn`.
    
    The default predictor used by `Chainer` serializes input data to the 'npy' format:
    https://docs.scipy.org/doc/numpy-1.14.0/neps/npy-format.html

    The Chainer container provides an overridable pre-processing function `input_fn`
    that accepts the serialized input data and deserializes it into a NumPy array.
    `input_fn` is invoked before `predict_fn` and passes its return value to this function
    (as `input_data`)
    
    The Chainer container provides an overridable post-processing function `output_fn`
    that accepts this function's return value and serializes it back into `npy` format, which
    the Chainer predictor can deserialize back into a NumPy array on the client.

    Args:
        input_data (bytes): a NumPy array containing the data serialized by the Chainer predictor
        model: the return value of `model_fn`
    Returns:
        a NumPy array containing predictions which will be returned to the client

    For more on `input_fn`, `predict_fn` and `output_fn`, please visit the sagemaker-python-sdk repository:
    https://github.com/aws/sagemaker-python-sdk

    For more on the Chainer container, please visit the sagemaker-chainer-containers repository:
    https://github.com/aws/sagemaker-chainer-containers
    """
    logger.info("prediction start")
    logger.info(type(input_data))
    logger.info(input_data.shape)
    with chainer.using_config('train', False), chainer.no_backprop_mode():
        bboxes, labels, scores = model.predict([input_data])
        bbox, label, score = bboxes[0], labels[0], scores[0]
        return np.array([bbox.tolist(), label, score])

    class_names = ['A10','AV8B','B1','B2','B52','C17','E2','EF2000','F117','F14','F15','F16','F18','F22','F35','F4','J20','Mig31','Mirage2000','RQ4','SR71','Su57','U2','US2','V22']
    
    image_batch, label_batch = pf_test.as_numpy_iterator().next()
    predicted_labels = np.argmax(model.predict(image_batch), axis=1)
    list_prd = []
    
    for prd in predicted_labels:
        print(class_names[prd])
        list_prd.append(class_names[prd])

    return np.array(list_prd)