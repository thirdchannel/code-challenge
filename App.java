

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

import com.sun.security.auth.SolarisPrincipal;

import javafx.scene.effect.Light.Spot;

public class App {
	public static void main(String[] args) {

		try {
			if (args.length != 3) {
				System.out.println("Number of Arguments Incorrect");
				return;
			}
			/*Reading files through arguments so that files can be passed during compile time */ 
			File file = new File(args[1]);

			BufferedReader br = new BufferedReader(new FileReader(file));
			BufferedWriter output = null;
			
			String st="";
			String name = "";
			String product = "";
			String gift = "";
			String giftValue = "";
			String representative = "";
			String result ="";
			/* parsing through input file reading key value pairs */
			while ((st = br.readLine()) != null) {
				st = st.trim();
				String[] strings = st.split("=");
				

				if (strings[0] != "" && strings[0].trim().equalsIgnoreCase("name")) {
					name = strings[1].trim();
				} else if (strings[0] != "" && strings[0].trim().equalsIgnoreCase("product")) {
					product = strings[1].trim();
				} else if (strings[0] != "" && strings[0].trim().equalsIgnoreCase("gift")) {
					gift = strings[1].trim();
				} else if (strings[0] != "" && strings[0].trim().equalsIgnoreCase("gift-value")) {
					giftValue = strings[1].trim();
				} else if (strings[0] != "" && strings[0].trim().equalsIgnoreCase("representative")) {
					representative = strings[1].trim();
				}

			}
			/* if input file contains all variable placeholders read the template file and replace the placeholder values into Result*/
			if(name != "" && product !="" && gift!= "" && giftValue !="" && representative !="" ){
				
				File templateFile = new File(args[0]);

				BufferedReader bufferedReader = new BufferedReader(new FileReader(templateFile));
				
				StringBuilder builder = new StringBuilder();
				
				while ((st = bufferedReader.readLine()) != null) {
					builder.append(st.trim());
					builder.append("\n");
				}
				
				String out = builder.toString().replace("((name))","%1$s").replace("((product))", "%2$s").replace("((gift))", "%3$s").replace("((gift-value))", "%4$s").replace("((representative))", "%5$s");
				
				result = String.format(out, new Object[] {name,product,gift,giftValue,representative});	
				
			}
			/* Write results into output file */
	        try {
	            File outputFile = new File(args[2]);
	            output = new BufferedWriter(new FileWriter(outputFile));
	            output.write(result);
	        } catch ( IOException e ) {
	            e.printStackTrace();
	        } finally {
	          if ( output != null ) {
	            output.close();
	          }
	        }

		} catch (IOException e) {
			
			e.printStackTrace();
		}
	}
}
