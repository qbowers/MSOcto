#!/bin/bash
 echo "Making octo #$1"

su octoprint$1
cd ~


git clone https://github.com/foosel/OctoPrint.git
cd OctoPrint
virtualenv venv
./venv/bin/python setup.py install
