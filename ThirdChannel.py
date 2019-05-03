import sys

# this method will read a file and parse the variable name and values and return them in a dictionary
def parse_input_file(input_file):
    try:
        key_values = {}
        with open(input_file) as file:
            for line in file:
                parsed_line = line.split("=")
                parsed_line_length = len(parsed_line)
                if parsed_line_length == 2:

                    # strip leading or trailing whitespace in variable names and values
                    key = parsed_line[0].strip()
                    value = parsed_line[1].strip()
                    key_values[key] = value
                else:
                    continue
        return key_values

    except:
        print("Error could not open input_file: ", input_file)

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

def substitute_template(template_file, input_file):

    # Read in input file as dictionary
    input_file_dict = parse_input_file(input_file)

    # missing variable placeholders in the dictionary will result in no output
    if is_valid_dict(input_file_dict):
        # Read in template file
        with open(template_file, 'r') as file:
            filedata = file.read()

        # perform substitution
        for key in input_file_dict:
            filedata = filedata.replace('((' + key + '))', input_file_dict[key])

        print(filedata.strip())

#command line inputs
template_file = sys.argv[1]
input_file = sys.argv[2]

# output the result to output_file
substitute_template(template_file, input_file)
