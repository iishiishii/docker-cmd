@ECHO OFF

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

cd "$parent_path/vnm"

docker run --privileged --name vnm -v C:/vnm:/vnm -e USER=neuro -p 6080:80 vnmd/vnm:20210708
