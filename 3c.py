import string, time, StringIO, sys, json, os, re

if sys.platform == "win32": #to fix carriage returns that caused test cases to fail on windows
   import os, msvcrt
   msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)
        
def main():
    lines = sys.stdin.readlines()
    
    data={}
    for line in lines:#convert stdin lines to dictionary entries assuming the format is correct
        if '=' not in line: #some invalid input handling
            continue
        s=line.split("=")
        if len(s)!=2:#skip over broken lines
            continue
        data[s[0].strip()]=s[1].strip()#remove extra whitespace
    
    with open(sys.argv[1], 'r') as template: #assuming file exists as its existence is checked in run.sh
        output=template.read() #read file to string
        
    match = re.search(r'\(\((.+?)\)\)', output)
    while match is not None:#continue while there is still a matching regex
        if match.group(1) in data:
            output = re.sub(r'\(\((.+?)\)\)', data[match.group(1)], output,1)#replace first occurrence of regex with dictionary value of key group
            match = re.search(r'\(\((.+?)\)\)', output)
        else:
            return #return if a place holder is not supplied

    for line in output.splitlines():#print output if it made it this far
        sys.stdout.write(line.rstrip()+'\n')
    
    #
       
if __name__ == '__main__':
    main()
