package eu.europa.ec.leos.services.api;

import com.sun.istack.NotNull;
import eu.europa.ec.leos.domain.cmis.common.VersionType;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.ShowCleanVersionResponse;
import eu.europa.ec.leos.services.request.SaveAfterReplaceRequest;
import eu.europa.ec.leos.services.response.DocumentConfigResponse;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.apache.commons.lang.NotImplementedException;
import org.apache.http.MethodNotSupportedException;
import org.springframework.stereotype.Service;
import eu.europa.ec.leos.services.request.ReplaceAllMatchRequest;
import eu.europa.ec.leos.services.request.ReplaceMatchRequest;

import java.util.List;

@Service("proposalExplanatory")
@Instance(instances = {InstanceType.COMMISSION, InstanceType.OS})
public class ProposalCouncilExplanatoryApiService implements CouncilExplanatoryApiService {

    @Override
    public String getElement(String documentRef, String elementName, String elementId) {
        throw new NotImplementedException();
    }

    @Override
    public DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId) throws Exception {
        throw new NotImplementedException();
    }

    @Override
    public DocumentViewResponse saveElement(String documentRef, String elementId, String elementName, String elementFragment) throws Exception {
        throw new NotImplementedException();
    }

    @Override
    public DocumentViewResponse insertElement(String documentRef, String elementName, String elementId, Position position) {
        throw new NotImplementedException();
    }

    @Override
    public DocumentViewResponse mergeElement(String documentRef, String elementContent, String elementTag, String elementId) throws Exception {
        throw new NotImplementedException();
    }

    @Override
    public List<VersionVO> getRecentMinorVersions(String documentRef) {
        throw new NotImplementedException();
    }

    @Override
    public List<VersionVO> getVersionsData(String documentRef) {
        throw new NotImplementedException();
    }

    @Override
    public List<TableOfContentItemVO> getToc(String documentRef, TocMode mode) {
        throw new NotImplementedException();
    }

    @Override
    public List<TocItem> getTocItems(@NotNull String documentRef) {
        throw new NotImplementedException();
    }

    @Override
    public DocumentViewResponse getDocument(@NotNull String documentRef) {
        throw new NotImplementedException();
    }

    @Override
    public List<VersionVO> saveDocument(String documentRef, String checkInComment, VersionType versionType) {
        throw new NotImplementedException();
    }

    @Override
    public List<TableOfContentItemVO> saveToC(String documentRef, List<TableOfContentItemVO> toc) throws MethodNotSupportedException {
        throw new NotImplementedException();
    }

    @Override
    public List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase, boolean completeWords) throws Exception {
        throw new NotImplementedException();
    }

    @Override
    public DocumentViewResponse showVersion(String versionId) {
        throw new NotImplementedException();
    }

    @Override
    public String compare(String newVersionId, String oldVersionId) {
        throw new NotImplementedException();
    }

    @Override
    public DocumentViewResponse restoreToVersion(String documentRef, String versionId) {
        throw new NotImplementedException();
    }

    @Override
    public EditElementResponse editElement(String documentRef, String elementId, String elementTagName) {
        throw new NotImplementedException();
    }

    @Override
    public byte[] downloadVersion(String documentRef, boolean isWithAnnotations) throws Exception {
        throw new NotImplementedException();
    }

    @Override
    public byte[] downloadCleanVersion(String documentRef) {
        throw new NotImplementedException();
    }

    @Override
    public ShowCleanVersionResponse showCleanVersion(String documentRef) {
        throw new NotImplementedException();
    }

    @Override
    public byte[] downloadXmlVersionFiles(String documentRef, String versionId) {
        throw new NotImplementedException();
    }

    @Override
    public byte[] replaceAllTextInDocument(ReplaceAllMatchRequest event) throws Exception {
        throw new NotImplementedException();
    }

    @Override
    public byte[] replaceOneTextInDocument(ReplaceMatchRequest event) throws Exception {
        throw new NotImplementedException();
    }

    @Override
    public DocumentViewResponse saveAfterReplace(SaveAfterReplaceRequest event) {
        throw new NotImplementedException();
    }

    @Override
    public DocumentConfigResponse getDocumentConfig(String documentRef) {
        throw new NotImplementedException();
    }

    @Override
    public String fetchUserGuidance(String documentRef) {
        throw new NotImplementedException();
    }
}
