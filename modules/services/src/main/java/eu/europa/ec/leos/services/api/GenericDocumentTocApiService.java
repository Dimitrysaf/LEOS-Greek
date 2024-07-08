package eu.europa.ec.leos.services.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.common.base.Stopwatch;
import com.sun.istack.NotNull;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.integration.rest.UserJSON;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMapHelper;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.util.DocumentVOProvider;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.SaveElementResponse;
import eu.europa.ec.leos.services.dto.response.VersionInfoVO;
import eu.europa.ec.leos.services.exception.NotFoundException;
import eu.europa.ec.leos.services.export.ExportDW;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.export.ExportVersions;
import eu.europa.ec.leos.services.export.FileHelper;
import eu.europa.ec.leos.services.processor.ElementProcessor;
import eu.europa.ec.leos.services.processor.FinancialStatementProcessor;
import eu.europa.ec.leos.services.processor.content.TableOfContentProcessor;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.request.ReplaceAllMatchRequest;
import eu.europa.ec.leos.services.request.ReplaceMatchRequest;
import eu.europa.ec.leos.services.request.SaveAfterReplaceRequest;
import eu.europa.ec.leos.services.response.DocumentConfigResponse;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.services.search.SearchService;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.structure.lang.LanguageGroupService;
import eu.europa.ec.leos.services.structure.lang.LanguageMapHolder;
import eu.europa.ec.leos.services.support.LeosXercesUtils;
import eu.europa.ec.leos.services.support.VersionsUtil;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.services.template.TemplateConfigurationService;
import eu.europa.ec.leos.services.user.UserHelper;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.services.utils.LanguageMapUtils;
import eu.europa.ec.leos.services.utils.StructureConfigUtils;
import eu.europa.ec.leos.services.validation.ValidationService;
import eu.europa.ec.leos.vo.response.FavouritePackageResponse;
import eu.europa.ec.leos.vo.response.RecentPackageResponse;
import eu.europa.ec.leos.vo.structure.AlternateConfig;
import eu.europa.ec.leos.vo.structure.Attribute;
import eu.europa.ec.leos.vo.structure.Level;
import eu.europa.ec.leos.vo.structure.NumberingConfig;
import eu.europa.ec.leos.vo.structure.RefConfig;
import eu.europa.ec.leos.vo.structure.TocItem;
import eu.europa.ec.leos.vo.structure.TocItemType;
import eu.europa.ec.leos.vo.structure.TocItemTypeName;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import io.atlassian.fugue.Maybe;
import io.atlassian.fugue.Option;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.inject.Provider;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Properties;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class GenericDocumentTocApiService {
    private static final Logger LOG = LoggerFactory.getLogger(GenericDocumentTocApiService.class);

    private static final Map<LeosCategory, String> DOCUMENT_TOC_STARTING_NODE = new HashMap<LeosCategory, String>() {{
        this.put(LeosCategory.BILL, "bill");
        this.put(LeosCategory.MEMORANDUM, "doc");
        this.put(LeosCategory.ANNEX, "doc");
        this.put(LeosCategory.PROPOSAL, "doc");
        this.put(LeosCategory.STAT_FINANC_LEGIS, "doc");
        this.put(LeosCategory.COUNCIL_EXPLANATORY, "doc");
        this.put(LeosCategory.COVERPAGE, "coverPage");
    }};
    private final LeosRepository leosRepository;
    private final TableOfContentProcessor tableOfContentProcessor;
    private final Provider<StructureContext> structureContextProvider;
    private final DocumentLanguageContext documentLanguageContext;

    @Autowired
    public GenericDocumentTocApiService(@NotNull LeosRepository leosRepository,
                                        @NotNull TableOfContentProcessor tableOfContentProcessor,
                                        @NotNull Provider<StructureContext> structureContextProvider,
                                        @NotNull DocumentLanguageContext documentLanguageContext) {
        this.leosRepository = Objects.requireNonNull(leosRepository);
        this.tableOfContentProcessor = Objects.requireNonNull(tableOfContentProcessor);
        this.structureContextProvider = Objects.requireNonNull(structureContextProvider);
        this.documentLanguageContext = documentLanguageContext;
    }

    public List<TableOfContentItemVO> getTableOfContent(@NotNull String docRef,
                                                        @NotNull TocMode mode) throws NotFoundException {
        XmlDocument document = this.findDocumentByRef(docRef);
        String docTemplate = LeosXercesUtils.getDocTemplate(document);
        byte[] content = LeosXercesUtils.getDocumentContent(document);
        String startingNode = Optional.ofNullable(DOCUMENT_TOC_STARTING_NODE.get(document.getCategory()))
                .orElseThrow(
                        () -> new RuntimeException(String.format("Starting node not found for document %s", docRef)));
        documentLanguageContext.setDocumentLanguage(document.getMetadata().get().getLanguage());
        this.getStructureContext().useDocumentTemplate(docTemplate);
        List<TableOfContentItemVO> toc = this.tableOfContentProcessor.buildTableOfContent(startingNode, content, mode);
        return toc;
    }
    private StructureContext getStructureContext() {
        return this.structureContextProvider.get();
    }
    private <T extends XmlDocument> T findDocumentByRef(@NotNull Class<T> docClass,
                                                        @NotNull String docRef) throws NotFoundException {
        return Optional.ofNullable(this.leosRepository.findDocumentByRef(docRef, docClass))
                .orElseThrow(
                        () -> new NotFoundException(String.format("Not found document with %s reference", docRef)));
    }

    private XmlDocument findDocumentByRef(@NotNull String docRef) throws NotFoundException {
        return this.findDocumentByRef(XmlDocument.class, docRef);
    }

}
