# ThirdChannel Code Challenge 

## Introduction

This code challenge will test your ability to quickly develop a
solution to a straightforward, but open-ended, problem. You can use
any language you are most comfortable with, and you are free to use
existing libraries. It can be solved in a variety of ways but we've
structured it so that you won't be able to to use a single off the
shelf solution. 

## Program

Command line template and data file processor.


## Requirements

* Parse a template file, specified as the first command line argument, into an
  in-memory representation.
* Read a data file containing variable bindings from STDIN, parsing it into an in-memory representation.
* Apply the data to the template.
* Output the result to STDOUT.
* If any variable placeholders in the template are not supplied,
your program should not produce any output.
* Leading or trailing whitespace in variable names and values should be stripped.

## Example

### Template

```
Hello, ((person)).
```

The text wrapped in double-parentheses (`((` and `))`) is a variable placeholder.

### Data file

```
person=Jane Doe
```

Each line in the data file represents a variable binding.
In this example, `person` is a variable name, and `Jane Doe` is its corresponding variable value.

### Output

```
Hello, Jane Doe.
```

The variable placeholder has been replaced with the corresponding variable value.

## Running

There is a script in the root of this directory called `run.sh`,
which you will use to launch your program.
You will most likely need to alter it to run the program you build,
depending on the language used.

The run script will be called like:

```
./run.sh template-file < data-file > output-file
```

That is, a template file will be supplied as the first argument,
the data file will be supplied via STDIN,
and your program should output the result on STDOUT.

## Testing

There is a script called `test.sh`,
which will execute `run.sh` with the example template called `template`
for every file in the `input` directory.
It will capture the output of your program for
each of these input files into the `output` directory.
It will then compare the `output` directory to the `expected` directory,
which contains the expected outputs from a correct program.
You can use this test script as you develop.
Once the test passes, you are done!

## Considerations

* How does your program handle errors?
* How robust is your program against invalid input?
* Is it written in a way that another programmer can understand it?
* Is there enough testing?

## Submitting Your Code

Please fork the repository to your own account, do your work there, and submit a pull request.

Good luck!
