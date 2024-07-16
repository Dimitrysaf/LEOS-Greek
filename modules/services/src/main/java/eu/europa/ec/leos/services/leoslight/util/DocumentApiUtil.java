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
package eu.europa.ec.leos.services.leoslight.util;

import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.document.Memorandum;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.metadata.AnnexMetadata;
import eu.europa.ec.leos.domain.repository.metadata.BillMetadata;
import eu.europa.ec.leos.domain.repository.metadata.FinancialStatementMetadata;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.repository.metadata.MemorandumMetadata;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.domain.vo.MetadataVO;
import eu.europa.ec.leos.repository.LeosRepository;
import io.atlassian.fugue.Pair;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.Map;


public class DocumentApiUtil {

    public static final String APPLICATION_ZIP_VALUE = "application/zip";
    public static final String APPLICATION_XML_VALUE = "application/xml";

    public static ResponseEntity<Object> buildFileAttachment(byte[] outputFile, String filename, String mediaType) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(
                ContentDisposition
                        .builder("attachment")
                        .filename(filename)
                        .build());
        headers.setContentType(MediaType.valueOf(mediaType));
        headers.setContentLength(outputFile.length);
        return new ResponseEntity<>(outputFile, headers, HttpStatus.OK);
    }

    public static LeosDocument getLeosDocument(String docURL, LeosRepository leosRepository) {
        String docRef = docURL.substring(docURL.lastIndexOf('/') + 1);
        Class docType = getDocumentType(docRef);
        return leosRepository.findDocumentByRef(docRef, docType);
    }

    public static Map<String, Object> getDocumentMetadata(String docRef, LeosRepository leosRepository) {
        Class docType = getDocumentType(docRef);
        return leosRepository.findDocumentMetadataByRef(docRef, docType);
    }

    public static LeosMetadata getLeosMetaData(DocumentVO documentVO, String locale, String docRef) {
        LeosMetadata metaData;
        MetadataVO metadataVO = documentVO.getMetadata();
        switch (documentVO.getDocumentType()) {
            case ANNEX:
                metaData = new AnnexMetadata(metadataVO.getDocStage(),
                        metadataVO.getDocType(),
                        metadataVO.getDocPurpose(),
                        metadataVO.getTemplate(),
                        locale,
                        metadataVO.getDocTemplate(),
                        docRef,
                        1,
                        "" + documentVO.getDocNumber(),
                        documentVO.getTitle(),
                        documentVO.getId(),
                        documentVO.getVersionSeriesId(),
                        metadataVO.getEeaRelevance(),
                        documentVO.getRef());
                break;
            case BILL:
                metaData = new BillMetadata(metadataVO.getDocStage(),
                        metadataVO.getDocType(),
                        metadataVO.getDocPurpose(),
                        metadataVO.getTemplate(),
                        locale,
                        metadataVO.getDocTemplate(),
                        docRef,
                        documentVO.getId(),
                        documentVO.getVersionSeriesId(),
                        metadataVO.getEeaRelevance());
                break;
            case MEMORANDUM:
                metaData = new MemorandumMetadata(metadataVO.getDocStage(),
                        metadataVO.getDocType(),
                        metadataVO.getDocPurpose(),
                        metadataVO.getTemplate(),
                        locale,
                        metadataVO.getDocTemplate(),
                        docRef,
                        documentVO.getId(),
                        documentVO.getVersionSeriesId(),
                        metadataVO.getEeaRelevance());
                break;
            case STAT_FINANC_LEGIS:
                metaData = new FinancialStatementMetadata(metadataVO.getDocStage(),
                        metadataVO.getDocType(),
                        metadataVO.getDocPurpose(),
                        metadataVO.getTemplate(),
                        locale,
                        metadataVO.getDocTemplate(),
                        docRef,
                        documentVO.getTitle(),
                        documentVO.getId(),
                        documentVO.getVersionSeriesId(),
                        metadataVO.getEeaRelevance());
                break;
            case PROPOSAL:
                metaData = new ProposalMetadata(metadataVO.getDocStage(),
                        metadataVO.getDocType(),
                        metadataVO.getDocPurpose(),
                        metadataVO.getTemplate(),
                        locale,
                        metadataVO.getDocTemplate(),
                        docRef,
                        documentVO.getTitle(),
                        documentVO.getId(),
                        metadataVO.getEeaRelevance());
                break;
            default:
                throw new IllegalStateException("Unexpected value: " + documentVO.getDocumentType().name());
        }
        return metaData;
    }

    public static Class getDocumentType(String docRef) {
        if (docRef.startsWith("REG") || docRef.startsWith("DIR") || docRef.startsWith("DEC")) {
            return Bill.class;
        } else if (docRef.startsWith("STAT_FINANC_LEGIS")) {
            return FinancialStatement.class;
        } else if (docRef.startsWith("EXPL_MEMORANDUM")) {
            return Memorandum.class;
        } else if (docRef.startsWith("ANNEX")) {
            return Annex.class;
        } else if(docRef.startsWith("main")) {
            return Proposal.class;
        } else {
            return null;
        }
    }

}
