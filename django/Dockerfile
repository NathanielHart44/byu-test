FROM python:3.10

WORKDIR /
COPY ./requirements.txt /
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    protobuf-compiler \
    default-mysql-client \
    libgl1-mesa-glx \
    build-essential \
    libssl-dev \
    libpcre3-dev \
    zlib1g-dev \
    libxml2-dev && \
    rm -rf /var/lib/apt/lists/*

# Clone TensorFlow models repository and install Object Detection API
RUN git clone https://github.com/tensorflow/models.git && \
    cd models/research/ && \
    protoc object_detection/protos/*.proto --python_out=. && \
    cp object_detection/packages/tf2/setup.py . && \
    python -m pip install .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir --upgrade -r requirements.txt
COPY . /
EXPOSE 80

CMD ["python", "byutest/manage.py", "runserver", "0.0.0.0:80"]
