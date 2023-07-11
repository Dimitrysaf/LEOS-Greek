package eu.europa.ec.leos.services.collection.document;

import org.apache.jena.sparql.util.RomanNumeral;

/**
 * This Class is responsible for generating the Annex Number.
 *
 */
public class AnnexNumberGenerator {

	private AnnexNumberGenerator(){
	}
	private static final String ANNEX_TITLE_PREFIX = "Annex";

	/**
	 * @param number
	 *            number for conversion
	 * @return Roman Number
	 */
	public static String getAnnexNumber(int number) {
		try {
			if (number == 0) {
				return ANNEX_TITLE_PREFIX;
			} else {
				return ANNEX_TITLE_PREFIX +" "+ RomanNumeral.asRomanNumerals(number);
			}
		} catch (NumberFormatException exception) {
			// If number of outside limit of 1-3999, decimal number will be returned
			return ANNEX_TITLE_PREFIX +" " +number;
		}
	}

}
