#!/bin/sh

if [[ $1 ]]
then
   if [[ -e "$1" ]]
   then
       java -cp ./bin/ BindingResolver "$1"
   else
       echo "Template not found: $1" >&2
   fi
else
   echo "Usage: run.sh <template>" >&2
fi
