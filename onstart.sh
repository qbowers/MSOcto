#!/bin/bash

parse_yaml() {
   local prefix=$2
   local s='[[:space:]]*' w='[a-zA-Z0-9_]*' fs=$(echo @|tr @ '\034')
   sed -ne "s|^\($s\)\($w\)$s:$s\"\(.*\)\"$s\$|\1$fs\2$fs\3|p" \
        -e "s|^\($s\)\($w\)$s:$s\(.*\)$s\$|\1$fs\2$fs\3|p"  $1 |
   awk -F$fs '{
      indent = length($1)/2;
      vname[indent] = $2;
      for (i in vname) {if (i > indent) {delete vname[i]}}
      if (length($3) > 0) {
         vn=""; for (i=0; i<indent; i++) {vn=(vn)(vname[i])("_")}
         printf("%s%s%s=\"%s\"\n", "'$prefix'",vn, $2, $3);
      }
   }'
}
#eval $(parse_yaml config.yaml "config_")


echo "OctoStart has been run"

cd /home/server/octo1
./venv/bin/octoprint serve --port=5001  --config config.yaml &
cd /home/server/octo2
./venv/bin/octoprint serve --port=5002  --config config.yaml &
cd /home/server/octo3
./venv/bin/octoprint serve --port=5003  --config config.yaml &
cd /home/server/octo4
./venv/bin/octoprint serve --port=5004  --config config.yaml &
cd /home/server/octo5
./venv/bin/octoprint serve --port=5005  --config config.yaml &
cd /home/server/octo6
./venv/bin/octoprint serve --port=5006  --config config.yaml &
cd /home/server/octo7
./venv/bin/octoprint serve --port=5007  --config config.yaml &
cd /home/server/octo8
./venv/bin/octoprint serve --port=5008  --config config.yaml &

#cd /home/server/MSOcto
#sudo node server.js 2>> log.txt

echo "OctoStart has finished"
