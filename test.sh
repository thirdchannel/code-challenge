#!/bin/sh

ls input | while read f
do
    ./run.sh template < "input/$f" > "output/$f"     
done

diff expected output

if [[ $? == 0 ]]
then
    echo "Tests passed"
else
    echo "Tests Failed"
fi

