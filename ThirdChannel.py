import sys

# this method will read in file contents and parse the variable name and values and return them in a dictionary
def parse_input_file(input_contents):
    key_values = {}
    for line in input_contents:
        parsed_line = line.split("=")
        parsed_line_length = len(parsed_line)

        if parsed_line_length == 2:

            # strip leading or trailing whitespace in variable names and values
            key = parsed_line[0].strip()
            value = parsed_line[1].strip()
            key_values[key] = value

    return key_values


# this method will check the dictionary passed and see if it has the necessary keys and that the values associated
# with the keys are not None nor empty
def is_valid_dict(dict):
    necessary_keys = ['name', 'product', 'gift', 'gift-value', 'representative']
    for key in necessary_keys:
        if key in dict and dict[key]:
            continue
        else:
            return False
    return True

def substitute_template(template_file, input_contents):

    # Read in input file as dictionary
    input_file_dict = parse_input_file(input_contents)

    # missing variable placeholders in the dictionary will result in no output
    if is_valid_dict(input_file_dict):
        # Read in template file
        with open(template_file, 'r') as file:
            filedata = file.read()

        # perform substitution
        for key in input_file_dict:
            filedata = filedata.replace('((' + key + '))', input_file_dict[key])

        print(filedata.strip())

if __name__ == "__main__":
    try:
        # command line inputs
        template_file = sys.argv[1]
        input_contents = sys.stdin.readlines()

        # output the result to output_file
        substitute_template(template_file, input_contents)
    except:
        print("Error creating substituted template!")
