FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y curl tesseract-ocr tesseract-ocr-fin tesseract-ocr-swe wget unzip

# Install Node.js
RUN apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

COPY pdfalto /src/pdfalto
COPY package.json /src/package.json
RUN cd /src; npm install

RUN useradd -rm -d /home/node -s /bin/bash  -u 1000 node

COPY --chown=node . /src
WORKDIR /src

USER node
CMD ["node", "index.js"]




