#!/bin/sh

mkdir -p output

ls input | while read f
do
    ./run.sh -t template -d ./input/$f -o ./output/     
done

diff expected output

if [[ $? == 0 ]]
then
    echo "Tests passed"
else
    echo "Tests Failed"
fi


