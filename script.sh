#!/bin/bash

cd /data/Projects/expack-master/app

docker build -t getting-started .

docker run -dp 3000:3000 getting-started