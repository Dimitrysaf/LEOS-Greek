package eu.europa.ec.leos.services.dto.response;

import eu.europa.ec.leos.domain.cmis.LeosCategory;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;

import java.util.List;


public class MilestoneDocumentView {

    private String xmlContent;
    private String version;
    private String contentFileName;
    private Boolean isCoverPage;
    private LeosCategory leosCategory;
    private Integer order;
    private String tocData;
    private boolean isPdfRenditionsPresent;

    public MilestoneDocumentView(String xmlContent, String version, String contentFileName, Boolean isCoverPage, boolean isPdfRenditionsPresent) {
        this.xmlContent = xmlContent;
        this.version = version;
        this.contentFileName = contentFileName;
        this.isCoverPage = isCoverPage;
        this.isPdfRenditionsPresent = isPdfRenditionsPresent;
    }


    public String getXmlContent() {
        return xmlContent;
    }

    public void setXmlContent(String xmlContent) {
        this.xmlContent = xmlContent;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getContentFileName() {
        return contentFileName;
    }

    public void setContentFileName(String contentFileName) {
        this.contentFileName = contentFileName;
    }

    public Boolean getCoverPage() {
        return isCoverPage;
    }

    public void setCoverPage(Boolean coverPage) {
        isCoverPage = coverPage;
    }

    public LeosCategory getLeosCategory() {
        return leosCategory;
    }

    public void setLeosCategory(LeosCategory leosCategory) {
        this.leosCategory = leosCategory;
    }

    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public String getTocData() {
        return tocData;
    }

    public void setTocData(String tocData) {
        this.tocData = tocData;
    }

    public boolean isPdfRenditionsPresent() {
        return isPdfRenditionsPresent;
    }

    public void setPdfRenditionsPresent(boolean pdfRenditionsPresent) {
        isPdfRenditionsPresent = pdfRenditionsPresent;
    }
}
