#!/bin/bash
 echo "Making octo #$1"

su octoprint$1
cd ~


git clone https://github.com/foosel/OctoPrint.git
cd OctoPrint
virtualenv venv
./venv/bin/python setup.py install
cd ../.octoprint
echo "accessControl:
  enabled: false
api:
  key: E4543DBB21944C7290E0849A46F98480
folder:
  logs: /home/server/.octo$1/logs
  timelapse: /home/server/.octo$1/timelapse
  timelapse_tmp: /home/server/.octo$1/timelapse/tmp
  uploads: /home/server/.octo$1/uploads
  watched: /home/server/.octo$1/watched
plugins:
  announcements:
    _config_version: 1
    channels:
      _blog:
        read_until: 1534163400
      _important:
        read_until: 1521111600
      _octopi:
        read_until: 1527588900
      _plugins:
        read_until: 1531785600
      _releases:
        read_until: 1532527200
  cura:
    cura_engine: /usr/bin/cura
  discovery:
    upnpUuid: 7639283c-8fe0-4463-89e4-e8765b13b224
  softwareupdate:
    _config_version: 6
printerProfiles:
  default: _default
server:
  firstRun: false
  onlineCheck:
    enabled: true
  pluginBlacklist:
    enabled: true
  secretKey: lxCtAUKzqWAJY5rPq2ZDIgVcmD4eJxUR
  seenWizards:
    corewizard: 3
    cura: null
" > config.yaml

chmod +rw config.yaml
