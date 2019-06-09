
import java.util.List;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.Map;
import java.util.HashMap;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.IOException;
import java.io.InputStream;

/**
* This CodeChallenge program implements command line template and data file processor.
* @author  Dmitriy Safro
* @version 1.0
* @since   2019-06-09 
*/

public class CodeChallenge {

    /**
     * This is the main method which makes use of standard input and output streams.
     * @param args Template filename at index 0.
     * @return Nothing.
     * @exception IOException On file input error.
     */
    public static void main(String[] args) throws IOException {

        // make sure argument 0 is available, default to "template" otherwise
        if (args == null || args.length == 0 || args[0].isEmpty()) {
            args = new String[] {"template"};
        }

        String templateFilename = args[0];

        // setup the template by loading it from file into a string, throws IOException
        String templateString = new String(Files.readAllBytes(Paths.get(templateFilename)));

        // build a list of all double-parentheses variables from the template
        List<String> varList = listVariablesFromTemplate(templateString);

        // get a map of variable bindings from standard input stream
        Map<String, String> varMap = mapVariableBindings(System.in);

        // make sure all variables are accounted for, abort otherwise!
        if (!confirmVariables(varList, varMap)) {
            System.err.println("ABORT: Required variable(s) missing!");
            System.out.print("");
            System.exit(0);
        }

        // apply data to the template and get the new string
        templateString = applyDataToTemplate(varMap, templateString);

        // write the new string to standard output stream
        System.out.print(templateString);

    }

    /**
     * Extract all double-parentheses variables from a string using regex.
     * @param string The string template containing variable placeholders.
     * @return List of variables as strings ((with double-parentheses)).
     */
    public static List<String> listVariablesFromTemplate(String string) {
        List<String> list = new ArrayList<String>();
        Matcher matcher = Pattern.compile("\\(\\(([^)]+)\\)\\)").matcher(string);
        while (matcher.find()) {
            list.add(matcher.group());
        }        
        return list;
    }

    /**
     * Read values from standard input and store them in key value pairs.
     * @return Map of variable names as keys and their values.
     */
    public static Map<String, String> mapVariableBindings(InputStream input) {
        Map<String, String> map = new HashMap<String, String>();
        Scanner scanner = new Scanner(input);
        while (scanner.hasNextLine()) {
            String[] split = scanner.nextLine().split("=");
            if (split != null && split.length >= 2) {
                // add double-parentheses to map keys for easy matching
                map.put("(("+split[0].trim()+"))", split[1].trim());
            }
        }
        scanner.close();
        return map;
    }

    /**
     * Confirm if all required variables from the list exist in the map as keys.
     * @param list Containing all required variables from template.
     * @param map Loaded with data bindings.
     * @return True if all required variables are present in the map.
     */
    public static boolean confirmVariables(List<String> list, Map<String, String> map) {
        for (String key : list) {
            if (!map.containsKey(key)) {
                    return false;
            } 
        }
        return true;
    }

    /**
     * Replace all variables in the template string with values from the map.
     * @param map Contains data bindings with keys as variable names.
     * @param string Template string with double-parentheses variable names.
     * @return New string containing replaced variables with data.
     */
    public static String applyDataToTemplate(Map<String, String> map, String string) {
        String newString = string;
        for (Map.Entry<String, String> entry : map.entrySet()) {
            String key = entry.getKey();
            String val = entry.getValue();
            newString = newString.replaceAll(escapeMetaCharacters(key), escapeMetaCharacters(val));
        }
        return newString;
    }

    /**
     * Escape all special characters to avoid illegal argument exceptions in regex.
     * @param inputString String containing meta characters.
     * @return String that is safe to use with regex.
     */
    public static String escapeMetaCharacters(String string){
        final String[] metaCharacters = {"\\","^","$","{","}","[","]","(",")",".","*","+","?","|","<",">","-","&","%"}; 
        for (int i = 0 ; i < metaCharacters.length ; i++){
            if(string.contains(metaCharacters[i])){
                string = string.replace(metaCharacters[i],"\\"+metaCharacters[i]);
            }
        }
        return string;
    }
}