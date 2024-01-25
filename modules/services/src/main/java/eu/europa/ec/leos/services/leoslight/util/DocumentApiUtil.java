/*
 * Copyright 2024 European Commission
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
import eu.europa.ec.leos.domain.repository.metadata.AnnexMetadata;
import eu.europa.ec.leos.domain.repository.metadata.BillMetadata;
import eu.europa.ec.leos.domain.repository.metadata.FinancialStatementMetadata;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.repository.metadata.MemorandumMetadata;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.domain.vo.MetadataVO;
import eu.europa.ec.leos.repository.LeosRepository;
import io.atlassian.fugue.Pair;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;


public class DocumentApiUtil {

    public static final String APPLICATION_ZIP_VALUE = "application/zip";

    public static ResponseEntity<Object> buildFileAttachment(byte[] outputFile, String filename) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(
                ContentDisposition
                        .builder("attachment")
                        .filename(filename)
                        .build());
        headers.setContentType(MediaType.valueOf(APPLICATION_ZIP_VALUE));
        headers.setContentLength(outputFile.length);
        return new ResponseEntity<>(outputFile, headers, HttpStatus.OK);
    }

    public static LeosDocument getLeosDocument(String docURL, LeosRepository leosRepository) {
        String docRef = docURL.substring(docURL.lastIndexOf('/') + 1);
        Class docType = getDocumentType(docRef);
        LeosDocument savedDocument = leosRepository.findDocumentByRef(docRef, docType);
        return savedDocument;
    }

    public static Pair<Class, LeosMetadata> getDocumentData(DocumentVO documentVO, MetadataVO metadataVO, String locale, String docRef) {
        LeosMetadata metaData;
        Pair<Class, LeosMetadata> result;
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
                result = new Pair<>(Annex.class, metaData);
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
                result = new Pair<>(Bill.class, metaData);
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
                result = new Pair<>(Memorandum.class, metaData);
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
                result = new Pair<>(FinancialStatement.class, metaData);
                break;
            default:
                throw new IllegalStateException("Unexpected value: " + documentVO.getDocumentType().name());
        }
        return result;
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
        } else {
            return null;
        }
    }

}
