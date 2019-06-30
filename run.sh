#!/bin/sh

# Parse a template file, specified as the first command line argument, into an in-memory representation.
# Read a data file containing variable bindings from STDIN, parsing it into an in-memory representation.
# Apply the data to the template.
# Output the result to STDOUT.
# If any variable placeholders in the template are not supplied, your program should not produce any output.
# Leading or trailing whitespace in variable names and values should be stripped.
npm install
node app.js "$@"





