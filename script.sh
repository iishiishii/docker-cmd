#!/bin/bash
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

cd "$parent_path/vnm"

(curl --silent --retry 30 --retry-delay 1 --retry-connrefused \
       http://localhost:6080 ; \
     firefox http://localhost:6080) &
sudo docker run --privileged --name vnm -v ~/vnm:/vnm -v /dev/shm:/dev/shm -e USER=neuro -p 6080:80 vnmd/vnm:20210708 