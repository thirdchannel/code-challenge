<?php

// 1. Parse a template file, specified as the first command line argument, into an in-memory representation.
$content = file_get_contents('template');

// 2. Read a data file containing variable bindings from STDIN, parsing it into an in-memory representation.
$lines = array_filter(explode("\n", $dataFile));
$templateDict = [];
while($line = fgets(STDIN)){
    $key = trim(substr($line, 0, strpos($line, '='))); // Leading or trailing whitespace in variable names and values stripped.
    $value = trim(substr($line,  strpos($line, '=') + 1, -1));
    $templateDict[$key] = $value;
}

// 3. Utilize str_replace's array shorthand to replace placeholders
$replaceThese = array_map(function($key){return "((".$key."))";}, array_keys($templateDict));
$withThese = array_values($templateDict);
$content = str_replace($replaceThese, $withThese, $content);

// 4. If any variable placeholders in the template remain (e.g. were not supplied) exit without output
preg_match_all("/\(\(.*\)\)/", $content, $matches);
if (!empty($matches[0])) {
    exit();
}

// 5. Output the result to STDOUT
fwrite(STDOUT, $content);
