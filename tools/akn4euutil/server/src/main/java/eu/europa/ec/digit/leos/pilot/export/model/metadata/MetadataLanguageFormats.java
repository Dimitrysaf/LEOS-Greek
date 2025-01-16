package eu.europa.ec.digit.leos.pilot.export.model.metadata;

import java.lang.IllegalArgumentException;

public enum MetadataLanguageFormats
{

    BG("BG", "BUL","dd.M.yyyy", "Брюксел", "Люксембург", "Страсбург","%s, ","%s г."),
    CS("CS", "CES","dd.M.yyyy", "Bruselu", "Lucemburku", "Štrasburku", "V %s ", "dne %s"),
    DA("DA", "DAN","dd.M.yyyy", "Bruxelles", "Luxembourg", "Strasbourg", "%s, ", "den %s"),
    DE("DE", "DEU","dd.M.yyyy","Brüssel", "Luxemburg", "Straßburg", "%s, ", "den %s"),
    EL("EL", "ELL","dd.M.yyyy", "Βρυξέλλες", "Λουξεμβούργο", "Στρασβούργο", "%s, ", " %s"),
    EN("EN", "ENG","dd.M.yyyy", "Brussels", "Luxembourg", "Strasbourg", "%s, ", "%s"),
    ES("ES", "SPA","dd.M.yyyy", "Bruselas", "Luxemburgo", "Estrasburgo", "%s, ", "%s"),
    ET("ET", "EST","dd.M.yyyy", "Brüssel", "Luxembourgis", "Strasbourgis", "%s ", "%s"),
    FI("FI", "FIN","dd.M.yyyy", "Brysselissä", "Luxemburgissa", "Strasbourgissa", "%s ", "%s"),
    FR("FR", "FRA","dd.M.yyyy", "Bruxelles", "Luxembourg", "Strasbourg", "%s, ", "le %s"),
    GA("GA", "GLE","dd.M.yyyy", "Bhruiséil", "Lucsamburg", "Strasbourg", "An %s, ", "%s"),
    HR("HR", "HRV","dd.M.yyyy.", "Bruxelles", "Luxembourg", "Strasbourg", "%s, ", "%s"),
    HU("HU", "HUN","yyyy.M.dd.", "Brüsszelben", "Luxembourgban", "Strasbourgban", "%s, ", "%s"),
    IT("IT", "ITA","dd.M.yyyy", "Bruxelles", "Lussemburgo", "Strasburgo", "%s, ", "%s"),
    LT("LT", "LIT","yyyy MM dd", "Briuselyje", "Liuksemburge", "Strasbūre", "%s, ", "%s ."),
    LV("LV", "LAV","dd.M.yyyy", "Briselē", "Luksemburgā","Strasbūrā", "%s, ", "%s"),
    MT("MT", "MLT","dd.M.yyyy", "Brussell", "Lussemburgu", "Strasburgu", "%s ", "%s"),
    NL("NL", "NLD","dd.M.yyyy", "Brussel", "Luxemburg", "Straatsburg", "%s, ", "%s"),
    PL("PL", "POL","dd.M.yyyy", "Brukseli", "Luksemburgu", "Strasburgu", "%s, ", "dnia %s г."),
    PT("PT", "POR","dd.M.yyyy", "Bruxelas", "Luxemburgo", "Estrasburgo", "%s, ", "%s"),
    RO("RO", "RON","dd.M.yyyy", "Bruxelles", "Luxemburg", "Strasbourg", "%s, ", "%s"),
    SK("SK", "SLK","dd. M. yyyy", "Bruseli", "Luxemburgu", "Štrasburgu", "%s, ", "%s"),
    SL("SL", "SLV","dd.M.yyyy", "Bruslju", "Luxembourgu", "Strasbourgu", "%s,", "%s"),
    SV("SV", "SWE","dd.M.yyyy", "Bryssel", "Luxemburg", "Strasbourg", "%s ", "den %s");

    private final String format;

    private final String iso639_1;

    private final String iso639_2t;

    private final String brussels;
    private final String luxembourg;
    private final String strasbourg;
    private String locationFormat;
    private String dateFormat;


    private MetadataLanguageFormats(String iso639_1, String iso639_2t, String format,
                                    String brussels, String luxembourg, String strasbourg, String locationFormat, String dateFormat){
        this.iso639_1 = iso639_1;
        this.iso639_2t = iso639_2t;
        this.format = format;
        this.brussels = brussels;
        this.luxembourg = luxembourg;
        this.strasbourg = strasbourg;
        this.locationFormat = locationFormat;
        this.dateFormat = dateFormat;
    }

    public String getFormat() {
        return format;
    }

    public String getIso639_1() {
        return iso639_1;
    }

    public String getIso639_2t() {
        return iso639_2t;
    }

    public String getBrussels()
    {
        return brussels;
    }

    public String getLuxembourg()
    {
        return luxembourg;
    }

    public String getStrasbourg()
    {
        return strasbourg;
    }

    public String getLocationDisplayValue(String locationId){
        switch (locationId) {
            case "BEL_BRU":
                return getBrussels();
            case "LUX_LUX":
                return getLuxembourg();
            case "FRA_SXB":
                return getStrasbourg();
            default:
                throw new IllegalArgumentException();
        }
    }

    public String formatDate(String date){
        return String.format(this.dateFormat, date);
    }

    public String formatLocation(String location) {
        return String.format(this.locationFormat, location);
    }

    @Override
    public String toString(){
        return String.format("MetadataLanguageFormats(ISO-639-1: %s / ISO-639-2T: %s / Format: %s)",
                this.iso639_1, this.iso639_2t, this.format);
    }

    public static MetadataLanguageFormats ofIso639_2T(String value) throws IllegalArgumentException {
        if (value != null) {
            if (MetadataLanguageFormats.BG.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.BG;
            }
            if (MetadataLanguageFormats.CS.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.CS;
            }
            if (MetadataLanguageFormats.DA.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.DA;
            }
            if (MetadataLanguageFormats.DE.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.DE;
            }
            if (MetadataLanguageFormats.EL.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.EL;
            }
            if (MetadataLanguageFormats.EN.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.EN;
            }
            if (MetadataLanguageFormats.ES.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.ES;
            }
            if (MetadataLanguageFormats.ET.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.ET;
            }
            if (MetadataLanguageFormats.FI.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.FI;
            }
            if (MetadataLanguageFormats.FR.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.FR;
            }
            if (MetadataLanguageFormats.GA.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.GA;
            }
            if (MetadataLanguageFormats.HR.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.HR;
            }
            if (MetadataLanguageFormats.HU.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.HU;
            }
            if (MetadataLanguageFormats.IT.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.IT;
            }
            if (MetadataLanguageFormats.LT.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.LT;
            }
            if (MetadataLanguageFormats.LV.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.LV;
            }
            if (MetadataLanguageFormats.MT.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.MT;
            }
            if (MetadataLanguageFormats.NL.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.NL;
            }
            if (MetadataLanguageFormats.PL.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.PL;
            }
            if (MetadataLanguageFormats.PT.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.PT;
            }
            if (MetadataLanguageFormats.RO.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.RO;
            }
            if (MetadataLanguageFormats.SK.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.SK;
            }
            if (MetadataLanguageFormats.SL.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.SL;
            }
            if (MetadataLanguageFormats.SV.getIso639_2t().equals(value)){
                return MetadataLanguageFormats.SV;
            }
        }
        throw new IllegalArgumentException();
    }

    public static MetadataLanguageFormats ofIso639_1(String value) throws IllegalArgumentException {
        if (value != null) {
            if (MetadataLanguageFormats.BG.getIso639_1().equals(value)){
                return MetadataLanguageFormats.BG;
            }
            if (MetadataLanguageFormats.CS.getIso639_1().equals(value)){
                return MetadataLanguageFormats.CS;
            }
            if (MetadataLanguageFormats.DA.getIso639_1().equals(value)){
                return MetadataLanguageFormats.DA;
            }
            if (MetadataLanguageFormats.DE.getIso639_1().equals(value)){
                return MetadataLanguageFormats.DE;
            }
            if (MetadataLanguageFormats.EL.getIso639_1().equals(value)){
                return MetadataLanguageFormats.EL;
            }
            if (MetadataLanguageFormats.EN.getIso639_1().equals(value)){
                return MetadataLanguageFormats.EN;
            }
            if (MetadataLanguageFormats.ES.getIso639_1().equals(value)){
                return MetadataLanguageFormats.ES;
            }
            if (MetadataLanguageFormats.ET.getIso639_1().equals(value)){
                return MetadataLanguageFormats.ET;
            }
            if (MetadataLanguageFormats.FI.getIso639_1().equals(value)){
                return MetadataLanguageFormats.FI;
            }
            if (MetadataLanguageFormats.FR.getIso639_1().equals(value)){
                return MetadataLanguageFormats.FR;
            }
            if (MetadataLanguageFormats.GA.getIso639_1().equals(value)){
                return MetadataLanguageFormats.GA;
            }
            if (MetadataLanguageFormats.HR.getIso639_1().equals(value)){
                return MetadataLanguageFormats.HR;
            }
            if (MetadataLanguageFormats.HU.getIso639_1().equals(value)){
                return MetadataLanguageFormats.HU;
            }
            if (MetadataLanguageFormats.IT.getIso639_1().equals(value)){
                return MetadataLanguageFormats.IT;
            }
            if (MetadataLanguageFormats.LT.getIso639_1().equals(value)){
                return MetadataLanguageFormats.LT;
            }
            if (MetadataLanguageFormats.LV.getIso639_1().equals(value)){
                return MetadataLanguageFormats.LV;
            }
            if (MetadataLanguageFormats.MT.getIso639_1().equals(value)){
                return MetadataLanguageFormats.MT;
            }
            if (MetadataLanguageFormats.NL.getIso639_1().equals(value)){
                return MetadataLanguageFormats.NL;
            }
            if (MetadataLanguageFormats.PL.getIso639_1().equals(value)){
                return MetadataLanguageFormats.PL;
            }
            if (MetadataLanguageFormats.PT.getIso639_1().equals(value)){
                return MetadataLanguageFormats.PT;
            }
            if (MetadataLanguageFormats.RO.getIso639_1().equals(value)){
                return MetadataLanguageFormats.RO;
            }
            if (MetadataLanguageFormats.SK.getIso639_1().equals(value)){
                return MetadataLanguageFormats.SK;
            }
            if (MetadataLanguageFormats.SL.getIso639_1().equals(value)){
                return MetadataLanguageFormats.SL;
            }
            if (MetadataLanguageFormats.SV.getIso639_1().equals(value)){
                return MetadataLanguageFormats.SV;
            }
        }
        throw new IllegalArgumentException();
    }
}