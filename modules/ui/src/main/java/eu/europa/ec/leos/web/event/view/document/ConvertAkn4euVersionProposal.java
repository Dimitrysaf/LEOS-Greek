package eu.europa.ec.leos.web.event.view.document;

import eu.europa.ec.leos.domain.cmis.document.XmlDocument;

import java.util.List;

public class ConvertAkn4euVersionProposal {
    private List<XmlDocument> documents;

    public ConvertAkn4euVersionProposal(List<XmlDocument> documents) {
        this.documents = documents;
    }

    public List<XmlDocument> getDocuments() {
        return documents;
    }

    public void setDocuments(List<XmlDocument> documents) {
        this.documents = documents;
    }
}
