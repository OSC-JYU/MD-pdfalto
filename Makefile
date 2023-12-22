IMAGES := $(shell docker images -f "dangling=true" -q)
CONTAINERS := $(shell docker ps -a -q -f status=exited)
IMAGE := md-pdfalto
VOLUME := md-pdfalto-data
PWD=$(shell pwd)

create_volume:
	docker volume create $(VOLUME)

build:
	docker build -t artturimatias/$(IMAGE) .

start:
	docker run -d --name md-pdfalto \
		-v $(VOLUME):/src/data \
		-p 8100:8300 \
		--restart unless-stopped \
		artturimatias/$(IMAGE)

clean:
	docker rm -f $(CONTAINERS)
	docker rmi -f $(IMAGES)


