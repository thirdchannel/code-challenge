#!/bin/sh

if [[ $1 ]]
then
    # only allow files (no directories)
   if [[ -f "$1" ]]
   then
       node app.js "$1" "$2" "$3"
   else
       echo "Template not found: $1" >&2
   fi
else
   echo "Usage: run.sh <template>" >&2
fi




