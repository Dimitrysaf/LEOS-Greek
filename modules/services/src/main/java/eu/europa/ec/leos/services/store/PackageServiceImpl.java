/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
package eu.europa.ec.leos.services.store;

import cool.graph.cuid.Cuid;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.LinkedPackage;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.document.Memorandum;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.repository.store.PackageRepository;
import eu.europa.ec.leos.services.processor.content.TableOfContentProcessor;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.vo.response.FavouritePackageResponse;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static eu.europa.ec.leos.services.support.XmlHelper.BILL;
import static eu.europa.ec.leos.services.support.XmlHelper.DOC;

@Service
class PackageServiceImpl implements PackageService {
    private static final Logger LOG = LoggerFactory.getLogger(PackageServiceImpl.class);
    private static final String PACKAGE_NAME_PREFIX = "package_";

    private final PackageRepository packageRepository;
    private final Provider<StructureContext> structureContextProvider;
    private final TableOfContentProcessor tableOfContentProcessor;
    private String language;
    private boolean translated = false;
    private String originRef;

    @Value("${leos.workspaces.path}")
    protected String storagePath;
    
    PackageServiceImpl(PackageRepository packageRepository,
                       Provider<StructureContext> structureContextProvider,
                       TableOfContentProcessor tableOfContentProcessor) {
        this.packageRepository = packageRepository;
        this.structureContextProvider = structureContextProvider;
        this.tableOfContentProcessor = tableOfContentProcessor;
    }

    @Override
    public LeosPackage createPackage() {
        String name = generatePackageName();
        return packageRepository.createPackage(storagePath, name, originRef, language, translated);
    }

    @Override
    public void deletePackage(LeosPackage leosPackage) {
        packageRepository.deletePackage(leosPackage.getPath());
    }

    @Override
    public LeosPackage findPackageByDocumentId(String documentId) {
        return packageRepository.findPackageByDocumentId(documentId);
    }

    @Override
    public <T extends LeosDocument> LeosPackage findPackageByDocumentRef(String documentRef, Class<? extends T> type) {
        return packageRepository.findPackageByDocumentRef(documentRef, type);
    }

    @Override
    public LeosPackage findPackageByPackageId(String packageId) {
        return packageRepository.findPackageByPackageId(packageId);
    }

    @Override
    public List<LinkedPackage> findLinkedPackagesByPackageId(String pkgId) {
        return packageRepository.findLinkedPackageByPackageId(pkgId);
    }

    @Override
    public LinkedPackage findLinkedPackageByLinkedPkgId(String linkedPkgId) {
        return packageRepository.findLinkedPackageByLinkedPackageId(linkedPkgId);
    }

    @Override
    public FavouritePackageResponse getFavouritePackage(String ref, String userId) {
        return packageRepository.getFavouritePackage(ref, userId);
    }

    @Override
    public <T extends LeosDocument> List<T> findDocumentsByPackagePath(String path, Class<T> filterType, Boolean fetchContent) {
        return packageRepository.findDocumentsByPackagePath(path, filterType, fetchContent);
    }

    @Override
    public <T extends LeosDocument> T findDocumentByPackagePathAndName(String path, String name, Class<T> filterType) {
        return packageRepository.findDocumentByPackagePathAndName(path, name, filterType);
    }
    
    @Override
    public <T extends LeosDocument> List<T> findDocumentsByPackageId(String id, Class<T> filterType, Boolean allVersions, Boolean fetchContent) {
        return packageRepository.findDocumentsByPackageId(id, filterType, allVersions, fetchContent);
    }

    @Override
    public <T extends LeosDocument> List<T> findDocumentsByUserId(String userId, Class<T> filterType, String leosAuthority) {
        return packageRepository.findDocumentsByUserId(userId, filterType, leosAuthority);
    }

    private String generatePackageName() {
        return PACKAGE_NAME_PREFIX + Cuid.createCuid();
    }

    @Override
    public Map<String, List<TableOfContentItemVO>> getTableOfContent(String documentRef, TocMode mode) {
        LeosPackage leosPackage = findPackageByDocumentRef(documentRef, XmlDocument.class);
        List<XmlDocument> documents = findDocumentsByPackagePath(leosPackage.getPath(), XmlDocument.class, true);
        Map<String, List<TableOfContentItemVO>> tocItemsMap = new HashMap<>();
        for (XmlDocument document : documents) {
            final String startingNode;
            if (document instanceof Bill) {
                startingNode = BILL;
                structureContextProvider.get().useDocumentTemplate(document.getMetadata().get().getDocTemplate());
            } else if (document instanceof Annex || document instanceof Memorandum) {
                startingNode = DOC;
                structureContextProvider.get().useDocumentTemplate(document.getMetadata().get().getDocTemplate());
            } else {
                continue;  //skip proposal
            }

            List<TableOfContentItemVO> toc = tableOfContentProcessor.buildTableOfContent(startingNode, document.getContent().get().getSource().getBytes(), mode);
            tocItemsMap.put(document.getMetadata().get().getRef(), toc);
        }
        return tocItemsMap;
    }

    @Override
    public List<LeosMetadata> getDocumentsMetadata(String documentRef) {
        LeosPackage leosPackage = findPackageByDocumentRef(documentRef, XmlDocument.class);
        List<XmlDocument> documents = findDocumentsByPackagePath(leosPackage.getPath(), XmlDocument.class, false);
        Comparator<XmlDocument> annexIndexComparator = Comparator.comparing(o -> {
            if (o instanceof Annex) {
                Annex annex = (Annex) o;
                return annex.getMetadata().get().getIndex();
            }
            return 0;
        });
        return documents.stream()
                .filter(p -> p.getCategory() != LeosCategory.PROPOSAL)
                .sorted(Comparator.<XmlDocument, String>comparing(o -> "ANNEX".equals(o.getCategory().name())  ? "1" + o.getCategory().name() : "0" + o.getCategory().name())
                        .thenComparing(annexIndexComparator))
                .map(p -> p.getMetadata().get()).collect(Collectors.toList());
    }

    @Override
    public void useLanguage(String language) {
        this.language = language;
    }

    @Override
    public void useTranslated(Boolean translated) {
        this.translated = translated;
    }

    @Override
    public void useOriginRef(String originRef) {
        this.originRef = originRef;
    }
}
