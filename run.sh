#!/bin/sh

if [[ $1 ]]
then
# check if file exists
   if [[ -e "$1" ]]
   then

    #declare array  and iterator
    declare -a dataArray
    iterator=0
     
    # loop to read data  to array

    while read f
      do
        lineLength=$(echo -n "input/$f" | wc -m)
        #ignore if line is empty and then add to array
         if ! test -z "$f"; then
           if grep -q "=" <<< "$f" ; then
              dataArray[iterator]=$(sed -e 's#.*=\(\)#\1#' <<< "input/$f")
              iterator=`expr $iterator + 1`
            fi
         fi
      done
      
    # loop through templates and replace variables
    if [[ ${#dataArray[@]} >  4 ]]; then
        { cat $1; cat; } | while read line
       do
       # ideally instead of using 0 or 1 indexer can be used with names but for test just using indexer
        if [[ $line == *"((name))"* ]]; then
          # replace any name tags
          echo $(sed "s/((name))/${dataArray[0]}/g" <<< $line)
          
          # replace any product , gift and git-calue tags
        elif [[ $line == *"((product))"* ]]; then
          echo $(sed -e "s/((product))/${dataArray[1]}/g" -e "s/((gift))/${dataArray[2]}/g" -e "s/((gift-value))/${dataArray[3]}/g" <<< $line)
      
         # replace any represenatative tags
        elif [[ $line == *"((representative))"* ]]; then
             echo $(sed "s/((representative))/${dataArray[4]}/g" <<< $line)
        else
          # just print line if no conditions match
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




