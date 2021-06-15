
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
* This  programs implements command line file processor.
*/

public class TemplateParser {

    /**
     * This is the main method which process the data using different IO functions.
     * @param args Template name in args.
     * @return void.
     */
    public static void main(String[] args)  {

        // make sure argument 0 is available, default to "template" otherwise
        String template="";
        if (args == null || args.length == 0 || args[0].isEmpty()) {
            template = "template";
        }
        //currently it is one template pass it , we can pass multiple here
        ProcessTemplate(template =="" ? args[0] : template);
     }
    /**
     * process template for the template passed,.
     * @param template name in paramters.
     * @return void.
     */
    private static void ProcessTemplate(String template) {

        // setup the template by loading it from file into a string, throws IOException
        String templateString="";
        try {
             templateString = new String(Files.readAllBytes(Paths.get(template)));
        }catch(IOException ex)
        {
            //log the error and pass valid message
            throw new RuntimeException("Errors occured while parsing template");
        }
        // parse the template and build list of double-parentheses variables
        List<String> patternlist = new ArrayList<String>();
        Matcher patternMatcher = Pattern.compile("\\(\\(([^)]+)\\)\\)").matcher(templateString);
        while (patternMatcher.find()) {
            patternlist.add(patternMatcher.group());
        }

        // get a map of variable bindings from standard input stream
        Map<String, String> varMap = mapDataTemplateBindings(System.in);

        // make sure all variables are accounted for, abort otherwise!
        if (!isTemplateDataMapped(patternlist, varMap)) {
            System.err.println("ERROR Exiting: Not all data points available");
            System.exit(0);
        }

        // apply data to the template
        templateString = applyDataToTemplate(varMap, templateString);

        // print the new string to the output
        System.out.print(templateString);
    }

    /**
     * Read values from standard input and store them in key value pairs.
     * @return Map of variable names as keys and their values.
     */
    public static Map<String, String> mapDataTemplateBindings(InputStream input) {
        Map<String, String> map = new HashMap<String, String>();
        Scanner scanner = new Scanner(input);
        while (scanner.hasNextLine()) {
            //check if there is = it means there is key value pair
            String[] split = scanner.nextLine().split("=");
            if (split != null && split.length >= 2) {
                 map.put("(("+split[0].trim()+"))", split[1].trim());
            }
            }
        scanner.close();
        return map;
    }

    /**
     * Compare both tempalte list and data list .
     * @param templateList Containing all required variables from template.
     * @param map populated with data bindings.
     * @return True if all required variables are present in the map.
     */
    public static boolean isTemplateDataMapped(List<String> templateList, Map<String, String> map) {
        for (String key : templateList) {
            if (!map.containsKey(key)) {
                    return false;
            } 
        }
        return true;
    }

    /**
     * Replace all variables in the template string with values from the map.
     * @param map Contains data bindings with keys as variable names.
     * @param dataString Template string.
     * @return New string containing replaced variables with data.
     */
    public static String applyDataToTemplate(Map<String, String> map, String dataString) {

        for (Map.Entry<String, String> entry : map.entrySet()) {
            dataString = dataString.replaceAll(escapeSpecialCharacters(entry.getKey()), escapeSpecialCharacters(entry.getValue()));
        }
        return dataString;
    }

    /**
     * Escape all special characters to avoid illegal argument exceptions in regex.
     * @param string String containing meta characters.
     * @return String that is safe to use with regex.
     */
    public static String escapeSpecialCharacters(String string){
        // added escape characters we can update more as needed
        final String[] metaCharacters = {"\\","^","$","{","}","[","]","(",")",".","*","+","?","|","<",">","-","&","%"}; 
        for (int i = 0 ; i < metaCharacters.length ; i++){
            if(string.contains(metaCharacters[i])){
                string = string.replace(metaCharacters[i],"\\"+metaCharacters[i]);
            }
        }
        return string;
    }
}