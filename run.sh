#!/bin/sh

if [[ $1 ]]
then
   if [[ -e "$1" ]]
   then
    declare -a variableArray
    counter=0
    while read f
      do
        stringLength=$(echo -n "input/$f" | wc -m)
        if [ $stringLength != 10 ]; then
          variableArray[counter]=$(sed -e 's#.*=\(\)#\1#' <<< "input/$f")
          counter=`expr $counter + 1`
        fi
      done
      
    if [[ ${#variableArray[@]} >  4 ]]; then
        { cat $1; cat; } | while read line
       do
        if [[ $line == *"((name))"* ]]; then
          echo $(sed "s/((name))/${variableArray[0]}/g" <<< $line)
        elif [[ $line == *"((product))"* ]]; then
          echo $(sed -e "s/((product))/${variableArray[1]}/g" -e "s/((gift))/${variableArray[2]}/g" -e "s/((gift-value))/${variableArray[3]}/g" <<< $line)
        elif [[ $line == *"((representative))"* ]]; then
             echo $(sed "s/((representative))/${variableArray[4]}/g" <<< $line)
        else
          echo $line
        fi
      done
    fi
   else
       echo "Template not found: $1" >&2
   fi
else
   echo "Usage: run.sh <template>" >&2
fi




