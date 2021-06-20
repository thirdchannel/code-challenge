# 1. Parse a template file, specified as the first command line argument, into an in-memory representation.
template = File.read(ARGV[0])

# 2. Read a data file containing variable bindings from STDIN, parsing it into an in-memory representation.
dict = Hash.new
STDIN.read.split("\n").each do |line|
    if !line.match("=")
        next
    end
    line = line.strip

    key = line[0..(line.index('=') - 1)].strip
    value = line[(line.index('=') + 1)..line.length].strip

    dict[key] = line[value]
end

# 3. Use gsub to replace variable placeholder "keys" with their associated "values" in dict
dict.each do |k, v|
    template = template.gsub("((" + k + "))", v)
end

# 4. If any variable placeholders in the template remain (e.g. were not supplied) exit without output
if template.match(/\(\(.*\)\)/)
    exit
end

# 5. Output the result to STDOUT
STDOUT.write template