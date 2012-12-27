#!/bin/bash

script=`readlink -f $0`
dir=`dirname $script`
cd $dir
python main.py
