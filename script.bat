@ECHO OFF 

cd /data/Projects/docker-cmd/application

docker build -t getting-started .

docker run -dp 3000:3000 getting-started

http-server -p 3000