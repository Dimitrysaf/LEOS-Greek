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
package eu.europa.ec.leos.services.label;

import eu.europa.ec.leos.domain.common.ErrorCode;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.AnnexMetadata;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.services.api.DocumentApiService;
import eu.europa.ec.leos.services.api.GenericDocumentApiService;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.label.ref.Ref;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Node;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Instance(instances = {InstanceType.OS, InstanceType.COMMISSION})
public class ReferenceLabelServiceImplProposal extends ReferenceLabelServiceImpl {

    @Autowired
    private CloneContext cloneContext;

    @Autowired
    private TrackChangesContext trackChangesContext;

    @Override
    public Result<String> generateSoftMoveLabel(Ref ref, String referenceLocation, Node sourceNode,
                                                String direction, String documentRefSource) {
        if (trackChangesContext != null && trackChangesContext.isTrackChangesEnabled()) {
            return super.generateSoftMoveLabel(ref, referenceLocation, sourceNode, direction, documentRefSource);
        }
        return new Result<String>("", null);
    }

    @Override
    public Result<String> generateRefLabelForDocNode(Ref ref) {
        final String docRef = ref.getHref().substring("docNodeRef_".length());
        final XmlDocument targetDocument = workspaceService.findDocumentByRef(docRef, XmlDocument.class);
        final LeosPackage targetPackage = packageService.findPackageByDocumentRef(targetDocument.getMetadata().get().getRef(), XmlDocument.class);
        final List<XmlDocument> targetSiblings = packageService.findDocumentsByPackagePath(targetPackage.getPath(), XmlDocument.class, true);
        Optional<Annex> annex = targetSiblings.stream()
                .filter(doc -> LeosCategory.ANNEX.equals(doc.getCategory()) && doc.getName().replace(".xml","").equals(docRef))
                .map(doc -> (Annex) doc)
                .findFirst();
        AnnexMetadata annexMetadata = annex.isPresent()  ? annex.get().getMetadata().get() : null;
        if (annexMetadata == null || !annexMetadata.getCategory().equals(LeosCategory.ANNEX)) {
            return new Result<>("", ErrorCode.DOCUMENT_ANNEX_INDEX_NOT_FOUND);
        }
        String[] refContent = annexMetadata.getNumber().split(" ");
        String refLabel = refContent.length == 1 ? String.format("<ref href=\"%s\" xml:id=\"%s\">%s</ref>", ref.getHref(), ref.getId(), refContent[0])
                : String.format("%s <ref href=\"%s\" xml:id=\"%s\">%s</ref>", refContent[0], ref.getHref(), ref.getId(), refContent[1]);
        return new Result<>(refLabel, null);
    }
}
