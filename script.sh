#!/bin/bash

cd /data/Projects/docker-cmd/vnm

sudo docker run --privileged --name vnm -v ~/vnm:/vnm -v /dev/shm:/dev/shm -e USER=neuro -p 6080:80 vnmd/vnm:20210708

firefox http://localhost:6080