import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.InputStreamReader;
import java.util.*;

public class BindingResolver 
{
	public static void main(String[] args) throws Exception
	{
		StringBuffer tmplStringBuff = new StringBuffer();
		try
		{
			//Read in template, throw exception if the argument isn't a valid file path.
			BufferedReader template = new BufferedReader(new FileReader(new File(args[0])));
			String line = null;
			while((line = template.readLine()) != null)
				tmplStringBuff.append(line + "\r\n");
			template.close();
		}
		catch (Exception fnfe)
		{
			System.out.print( ((args != null && args.length>0) ? "Unable to locate template " + args[0]
					: "No template specified.") );
			return;
		}
		
		//Read in data file path from STDIN
		String tmplString = tmplStringBuff.toString();
		BufferedReader data = null; 
		try
		{
			//Load contents of data file, throw exception if the data file path isn't valid.
			data = new BufferedReader(new InputStreamReader (System.in));
		}
		catch (Exception fnfe)
		{
			fnfe.printStackTrace();
			System.out.print( "Unable to locate input file.");
			if(data != null)
				data.close();
			return;	
		}
		//Read each line of the data file into a list of lists of strings.
		//Each row in the data file corresponds to an element in the top level list.
		//The bind and bind value are each converted to strings and placed as elements, in that order, in the child lists.
		String binding = null;
		List<List<String>> bindList = new ArrayList<List<String>>();
		while((binding = data.readLine()) != null)
		{
			ArrayList<String> singleBind = new ArrayList<String>();
			//Skip this row if there is no bind value.
			int equals = binding.indexOf("=");
			if(equals > -1 && equals+1 <= binding.length())
			{
				//Remove preceding/following whitespace from the bind and bind value.
				String bind = binding.substring(0, equals).trim();
				singleBind.add("((" + bind + "))");
				String value = binding.substring(equals+1, binding.length()).trim();
				singleBind.add(value);
			}
			//If a valid bind / bind value pair has been loaded in, add it to the parent list.
			if(singleBind.size()>1)
				bindList.add(singleBind);
		}
		data.close();
		Iterator<List<String>> iBL = bindList.iterator();
		//For each valid bind pair, replace the bind with the bind value.
		//Skip any binds from the data file that are not present in the template.
		while(iBL.hasNext())
		{
			List<String> currentPair = iBL.next();
			String bindKey = currentPair.get(0);
			String bindValue = currentPair.get(1);
			if(tmplString.indexOf(bindKey)>-1)
				tmplString = tmplString.replace(bindKey, bindValue);
		}
		//Check for any binds in the template which were not present in the data file.
		int openInd = 0;
		int closeInd = 0;
		if((openInd = tmplString.indexOf("(("))>-1 && (closeInd = tmplString.indexOf("))"))>-1 && openInd<closeInd)
		{
			return;
		}
		System.out.print(tmplString);
		return;
		
	}
}
