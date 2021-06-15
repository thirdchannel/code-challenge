<?php
// 1. Parse a template file, specified as the first command line argument, into an in-memory representation.
$content = file_get_contents('template');

// 2. Read a data file containing variable bindings from STDIN, parsing it into an in-memory representation.
$line = readline();

if (!file_exists($line)) {
    exit();
}
$dataFile = file_get_contents($line);

// 3. Apply the data to the template.
$lines = array_filter(explode("\n", $dataFile));
foreach($lines as $line) {
    $key = trim(substr($line, 0, strpos($line, '=')));
    $value = trim(substr($line,  strpos($line, '=') + 1, -1));
    $content = str_replace("((".$key."))", $value, $content);
};

// Check for remaining double parens, indicating some template variables were not supplied
preg_match_all("/\(\(.*\)\)/", $content, $matches);
if (!empty($matches[0])) {
    exit();
}

// 4. Output the result to STDOUT.
fwrite(STDOUT, $content);

