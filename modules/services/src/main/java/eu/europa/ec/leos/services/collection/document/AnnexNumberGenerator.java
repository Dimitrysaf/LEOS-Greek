package eu.europa.ec.leos.services.collection.document;

import org.apache.jena.sparql.util.RomanNumeral;

/**
 * This Class is responsible for generating the Annex Number.
 *
 */
public class AnnexNumberGenerator {

	private AnnexNumberGenerator(){
	}

	/**
	 * @param number
	 *            number for conversion
	 * @return Roman Number
	 */
	public static String getAnnexNumber(String annexTitlePrefix, int number) {
		try {
			if (number == 0) {
				return annexTitlePrefix;
			} else {
				return annexTitlePrefix +" "+ RomanNumeral.asRomanNumerals(number);
			}
		} catch (NumberFormatException exception) {
			// If number of outside limit of 1-3999, decimal number will be returned
			return annexTitlePrefix +" " +number;
		}
	}

}
