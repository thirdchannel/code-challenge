This code challenge will test your ability to quickly develop a
solution to a straightforward, but open-ended, problem. You can use
any language you are most comfortable with, and you are free to use
existing libraries. It can be solved in a variety of ways but we've
structured it so that you won't be able to to use a single off the
shelf solution. 

Program:

Command line template and data file processor.


Requirements:

* Parse a template file, specified as a command line argument, into an
  in-memory representation
* Read a data file from STDIN, parsing it into an in-memory representation
* Apply the data to the template
* Output the result to STDOUT


Here is an example of a template:

Hello, ((name))

A data file for this template is:

name=Jane Doe

Applying this to the template would result in the text:

Hello, Jane Doe

The name within the double-parenthesis in the template corresponds to
the value in the data file.


There is a script in the root of this directory called "run" which you
will use to launch your program. You will most likely need to alter it
to run the program you build, depending on the language used.

The run script will be called like:

run template-name < data-file > output

There is also a script called "test", which will launch the "run"
script with the example template called "template" for every file in
the directory called "source". It will capture the output of your
program for each of these input files into another directory called
"dest". It will then compare the output with a directory of expected
files called "expected". You can use this test script as you
develop. Once the test passes, you are done!

Good luck!




