package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.repositories.DocumentRepository;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {
    private static final Logger LOG = LoggerFactory.getLogger(ReportServiceImpl.class);

    @Autowired
    private DocumentRepository documentRepository;

    private String defaultUrl ="https://intragate.development.ec.europa.eu/decide-drafting/ui/collection/";

    @Override
    public String generateProposalReport(String applnUrl) {
        List<Object[]> results = documentRepository.fetchProposalsReport();
        LOG.info("Total number of proposals : " + results.size());
        StringBuilder csv = new StringBuilder();

        csv.append("Title of the act," +
                "Type of act (template no)," +
                "Reference," +
                "EdiT link," +
                "Creation date," +
                "Lead DG," +
                "Other DGs," +
                "Contains exported milestones," +
                "Contains Milestone for ISC," +
                "ISC Milestone date," +
                "Contains Milestone Revision after ISC," +
                "Revision after ISC Milestone date," +
                "Contains Milestone Other," +
                "Other Milestone date," +
                "Contains Milestone for Decision," +
                "Decision Milestone date," +
                "ISC number," +
                "Link to the ISC," +
                "Link to Decision ," +
                "Confidentiality level," +
                "Contains annexes," +
                "Contains foreign annexes," +
                "Contains LFDS," +
                "Language"+
                "\n"
        );

        for (Object[] row : results) {
            csv.append(escapeCsv(row[0]))// title
                    .append(",")
                    .append(row[1])//type of act
                    .append(",")
                    .append(escapeCsv(row[2]))//refernce
                    .append(",")
                    .append(appendURL(row[2],applnUrl))//edit link
                    .append(",")
                    .append(formatDate(row[3]))//creation date
                    .append(",")
                    .append(escapeCsv(row[4]))//lead DG
                    .append(",")
                    .append(escapeCsv(formatStr(row[5])))//other DG
                    .append(",")
                    .append(formatYesNo(row[6]))//Contains milestones
                    .append(",")
                    .append(formatYesNo(row[7]))//Contains Milestone for ISC
                    .append(",")
                    .append(formatDate(row[8]))//ISC Milestone date,
                    .append(",")
                    .append(formatYesNo(row[9]))//Contains Milestone Revision after ISC
                    .append(",")
                    .append(formatDate(row[10]))//Revision after ISC Milestone date,
                    .append(",")
                    .append(formatYesNo(row[11]))//Contains Milestone Other
                    .append(",")
                    .append(formatDate(row[12]))//Other Milestone date,
                    .append(",")
                    .append(formatYesNo(row[13]))//Contains Milestone for Decision
                    .append(",")
                    .append(formatDate(row[14]))//Decision Milestone date,
                    .append(",")
                    .append(formatStr(row[15]))//ISC number,
                    .append(",")
                    .append(formatStr(row[16]))//Link to the ISC,
                    .append(",")
                    .append(formatStr(row[17]))//Link to Decision,
                    .append(",")
                    .append(formatStr(row[18]))//Confidentiality level,
                    .append(",")
                    .append(row[19]) //Contains annexes
                    .append(",")
                    .append(row[20]) //Contains foreign annexes
                    .append(",")
                    .append(row[21]) //Contains LFDS
                    .append(",")
                    .append(row[22]) //Language
                    .append("\n");
        }

        return csv.toString();
    }

    public String formatStr(Object value){
        if (value == null) {
            return "";
        }
        return value.toString();
    }

    public String formatYesNo(Object value){
        if (value == null) {
            return "No";
        }
        if ("Y".equals(value.toString())){
            return "Yes";
        }
        return "No";
    }

    private String appendURL(Object value,String applnUrl){
        if (value == null) {
            return "";
        }
        if (StringUtils.isBlank(applnUrl)) {
            applnUrl = defaultUrl;
        }
        String str = applnUrl+value;
        return str;
    }

    public String formatDate(Object inputDate) {

        if (inputDate == null) {
            return "";
        }

        DateTimeFormatter outputFormatter =
                DateTimeFormatter.ofPattern("MM/dd/yyyy");

        if (inputDate instanceof Timestamp) {
            LocalDateTime dt = ((Timestamp) inputDate).toLocalDateTime();
            return dt.format(outputFormatter);
        }

        if (inputDate instanceof LocalDateTime) {
            return ((LocalDateTime) inputDate).format(outputFormatter);
        }

        String dateStr = inputDate.toString();

        DateTimeFormatter inputFormatter =
                DateTimeFormatter.ofPattern("dd-MMM-yy HH:mm:ss.SSSSSS");

        try {
            LocalDateTime parsedDate = LocalDateTime.parse(dateStr, inputFormatter);
            return parsedDate.format(outputFormatter);
        } catch (Exception e) {
            // If format does not match, return original value
            return dateStr;
        }
    }

    private String escapeCsv(Object value) {
        if (value == null) {
            return "";
        }
        String str = value.toString();
        if (str.contains(",") || str.contains("\"") || str.contains("\n")) {
            return "\"" + str.replace("\"", "\"\"") + "\"";
        }
        return str;
    }
}
