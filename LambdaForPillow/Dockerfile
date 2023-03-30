FROM public.ecr.aws/lambda/python:3.7
RUN pip install --upgrade pip
RUN pip install pillow
RUN pip install numpy
COPY app.py /var/task/
CMD [ "app.handler" ]