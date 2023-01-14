import sys
from typing import Dict, Optional

# Constants
VAR_START_DELIM = "(("
VAR_END_DELIM = "))"


class SymbolTable:
    """Encapsulates a table of symbols in which each consists of a name and value."""
    def __init__(self):
        self.__dict: Dict[str, str] = {}

    def __str__(self):
        """Allows SymbolTable instances to be displayed to stdout using the built-in print() method."""
        ret = "{\n"
        for key in self.__dict:
            ret += f"\t{key}: {self.__dict[key]}\n"
        ret += "}"

        return ret

    def add_symbol(self, name: str, value: str):
        """Adds a symbol to the table."""
        self.__dict[name] = value

    def get_symbol(self, name: str) -> Optional[str]:
        """Retrieves a symbol from the table. If the given symbol name is not found, None is returned."""
        if name in self.__dict:
            return self.__dict[name]

        return None


def main():
    # Ensure that a template file has been provided
    if len(sys.argv) != 2:
        print(f"Usage: python3 {__file__} template-file")

    # Read the template file
    template_file = sys.argv[1]
    template = get_template(template_file)

    # Generate the symbol table
    symbol_table = get_symbols()

    # Insert the symbols into the template where applicable and print the result to stdout
    print(insert_symbols(template, symbol_table), end="")


def get_template(template_file: str) -> str:
    """Reads a given template file and returns its contents."""
    with open(template_file, "r") as f:
        template = f.read()
        f.close()

    return template


def get_symbols() -> SymbolTable:
    """Reads symbols from stdin in the form name=value and stores them in a SymbolTable."""
    symbol_table = SymbolTable()

    # Get input from stdin
    for line in sys.stdin:
        values = line.split("=")

        # Ignore invalid input
        if len(values) != 2:
            continue

        # Add the symbol to the table
        name, value = values
        symbol_table.add_symbol(name.strip(), value.strip())

    return symbol_table


def insert_symbols(template: str, symbol_table: SymbolTable) -> str:
    """Replaces all instances of variables within a given template string with their corresponding values within a
        given symbol table."""
    ret = template
    while True:
        # Search the template for delimiters enclosing a variable
        var_start_idx = ret.find(VAR_START_DELIM)
        var_end_idx = ret.find(VAR_END_DELIM)

        # If either required delimiter is not found, all symbols have been inserted
        if var_start_idx == -1 or var_end_idx == -1:
            break

        # Extract the variable name from the template
        var_name = ret[var_start_idx + 2: var_end_idx]

        # Retrieve the value of the variable from the symbol table
        var_value = symbol_table.get_symbol(var_name)

        # Return an empty string if the variable name is not found within the symbol table
        if var_value is None:
            return ""

        # Replace the delimiters and variable name with the value of the variable
        ret = ret.replace(VAR_START_DELIM + var_name + VAR_END_DELIM, var_value)

    return ret


if __name__ == "__main__":
    main()
