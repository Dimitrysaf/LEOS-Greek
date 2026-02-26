package eu.europa.ec.leos.services.collection.milestone.helpers;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.common.LeosFile;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.services.export.ZipPackageUtil;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.support.XmlHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static eu.europa.ec.leos.services.support.XmlHelper.ANNEX_FILE_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.DEC_FILE_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.DIR_FILE_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.STAT_DIGIT_FINANC_LEGIS_FILE_PREFIX;

public class MilestoneHelper {
    private MilestoneHelper(){
    }
    private static final Logger LOG = LoggerFactory.getLogger(MilestoneHelper.class);

    private static final String TOC_HTML = "_toc.html";
    private static final String XML = ".xml";
    public static final String PROCESSED = "_processed";
    public static final String ACCEPTED_ADDED = "_accepted_added";
    public static final String ACCEPTED_DELETED = "_accepted_deleted";

    private static final String TMP_DIR = "java.io.tmpdir";
    private static final String MILESTONE_DIR = "/milestone/";

    public static Map<String, Object> filterAndSortFiles(Map<String, Object> files, String fileFilter) {
        final List<String> tabOrder = Arrays.asList(XmlHelper.ANNEX_FILE_PREFIX, XmlHelper.STAT_DIGIT_FINANC_LEGIS_FILE_PREFIX, XmlHelper.REG_FILE_PREFIX,
                DIR_FILE_PREFIX,
                DEC_FILE_PREFIX,
                XmlHelper.MEMORANDUM_FILE_PREFIX);
        return files.entrySet().stream().
                filter(e -> (!e.getKey().contains(TOC_HTML) && e.getKey().endsWith(fileFilter))).
                sorted(Collections.reverseOrder(Comparator.comparing((Map.Entry e) -> {
                    String key = e.getKey().toString();
                    int prefixSeparatorIndex = key.indexOf("-");
                    if (prefixSeparatorIndex > 0) {
                        return tabOrder.indexOf(key.substring(0, prefixSeparatorIndex));
                    } else {
                        return (int) (key.toLowerCase().charAt(0));
                    }
                }))).
                collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
                        (e1, e2) -> e2, LinkedHashMap::new));
    }

    public static Map<String, Object> getMilestoneFiles(LegDocument legDocument) throws IOException {
        Content content = legDocument.getContent().getOrError(() -> "Document content is required!");
        return ZipPackageUtil.unzipFilesFromByteArray(content.getSource().getBytes());
    }

    public static Map<String, Object> populateAnnexAddedMap(List<Annex> clonedAnnexesList, LegDocument legDocument,
                                                            List<Annex> annexList) {
        Map<String, Object> annexAddedMap = new HashMap<>();
        for(Annex annexDocument : clonedAnnexesList) {
            if (annexDocument.getName().startsWith(ANNEX_FILE_PREFIX) && !(annexDocument.getClonedFrom() != null && annexDocument.getClonedFrom().startsWith(ANNEX_FILE_PREFIX))) {
                String annexFilename = annexDocument.getName();
                final String annexName = annexFilename.substring(0, annexFilename.lastIndexOf('.'));
                //Populate list of new annexes from contribution which are already accepted in original proposal
                Optional<Annex> acceptedAnnex = annexList.stream().filter(annex ->
                        annexName.equalsIgnoreCase(annex.getMetadata().get().getClonedRef())).findFirst();
                //Populate list of new annexes from contribution which are rejected
                Optional<String> rejectedAnnex = legDocument.getContainedDocuments().stream().filter(
                        fileName -> fileName.contains(PROCESSED) && fileName.startsWith(annexName)).findFirst();
                Object obj = annexDocument.getContent().get().getSource().getBytes();
                if (rejectedAnnex.isPresent()) {
                    //Add the processed annexes with the suffix "_processed"
                    String processedAnnexFilename = annexName.concat(PROCESSED);
                    annexAddedMap.put(processedAnnexFilename, obj);
                } else if (acceptedAnnex.isPresent()) {
                    String processedAnnexFilename = annexName.concat(ACCEPTED_ADDED);
                    annexAddedMap.put(processedAnnexFilename, obj);
                } else {
                    annexAddedMap.put(annexName, obj);
                }
            }
        }
        return annexAddedMap;
    }

    public static Map<String, Object> populateDocsAddedMap(List<XmlDocument> xmlDocuments, Map<String, Object> originalFiles, LegDocument legDocument,
                                                            List<Annex> annexList) {
        Map<String, Object> docsAddedMap = new HashMap<>();
        Map<String, Object> xmlFiles = filterAndSortFiles(originalFiles, XML);
        for(XmlDocument xmlDocument : xmlDocuments) {
            String docName = xmlDocument.getName();
            final String filename = docName.substring(0, docName.lastIndexOf("."));
            Object obj = xmlDocument.getContent().get().getSource().getBytes();
            if (filename.startsWith(ANNEX_FILE_PREFIX) && !(xmlDocument.getClonedFrom() != null && xmlDocument.getClonedFrom().startsWith(ANNEX_FILE_PREFIX))) {
                //Populate list of new annexes from contribution which are already accepted in original proposal
                Optional<Annex> acceptedAnnex = annexList.stream().filter(annex ->
                        filename.equalsIgnoreCase(annex.getMetadata().get().getClonedRef())).findFirst();
                //Populate list of new annexes from contribution which are rejected
                Optional<String> rejectedAnnex = legDocument.getContainedDocuments().stream().filter(
                        fileName -> fileName.contains(PROCESSED) && fileName.startsWith(filename)).findFirst();

                if (rejectedAnnex.isPresent()) {
                    //Add the processed annexes with the suffix "_processed"
                    String processedAnnexFilename = filename.concat(PROCESSED);
                    docsAddedMap.put(processedAnnexFilename, obj);
                } else if (acceptedAnnex.isPresent()) {
                    String processedAnnexFilename = filename.concat(ACCEPTED_ADDED);
                    docsAddedMap.put(processedAnnexFilename, obj);
                } else {
                    docsAddedMap.put(filename, obj);
                }
            } else if (filename.startsWith(STAT_DIGIT_FINANC_LEGIS_FILE_PREFIX)) {
                Optional<String> acceptedDoc = xmlFiles.keySet().stream().filter(doc -> doc.startsWith(STAT_DIGIT_FINANC_LEGIS_FILE_PREFIX)).findFirst();
                //Populate list of new annexes from contribution which are rejected
                Optional<String> rejectedDoc = legDocument.getContainedDocuments().stream().filter(
                        fileName -> fileName.contains(PROCESSED) && fileName.startsWith(filename)).findFirst();

                if (rejectedDoc.isPresent()) {
                    //Add the processed docs with the suffix "_processed"
                    String processedAnnexFilename = filename.concat(PROCESSED);
                    docsAddedMap.put(processedAnnexFilename, obj);
                } else if (acceptedDoc.isPresent()) {
                    String processedAnnexFilename = filename.concat(ACCEPTED_ADDED);
                    docsAddedMap.put(processedAnnexFilename, obj);
                } else {
                    docsAddedMap.put(filename, obj);
                }
            }
        }
        return docsAddedMap;
    }

    public static Map<String, Object> populateAnnexDeletedMap(Map<String, Object> originalContentFiles, List<Annex> clonedAnnex
            , LegDocument originalLegDocument, List<Annex> annexList) {
        Map<String, Object> annexDeletedMap = new HashMap<>();
        Map<String, Object> originalXmlFiles = MilestoneHelper.filterAndSortFiles(originalContentFiles, XML);
        for (Map.Entry<String, Object> entry : originalXmlFiles.entrySet()) {
            boolean found = false;
            String originalEntryKey = entry.getKey().substring(0, entry.getKey().indexOf(XML));
            if (originalEntryKey.startsWith(ANNEX_FILE_PREFIX)) {
                for (Annex cloneAnnex : clonedAnnex) {
                    String entryKey = cloneAnnex.getName();
                    if (entryKey.startsWith(ANNEX_FILE_PREFIX)) {
                        String originalDocRef = cloneAnnex.getClonedFrom();
                        if (originalEntryKey.equalsIgnoreCase(originalDocRef)) {
                            found = true;
                            break;
                        }
                    }
                }
                if (!found) {
                    //Populate list of deleted annexes from contribution which are already accepted in original proposal
                    Optional<Annex> acceptedAnnex = annexList.stream().filter(annex ->
                            originalEntryKey.equalsIgnoreCase(annex.getMetadata().get().getRef())).findFirst();
                    //Populate list of deleted annexes from contribution which are rejected
                    Optional<String> rejectedAnnex = originalLegDocument.getContainedDocuments().stream().filter(
                            fileName -> fileName.contains(PROCESSED) && fileName.startsWith(originalEntryKey)).findFirst();

                    if (!acceptedAnnex.isPresent()) {
                        annexDeletedMap.put(originalEntryKey.concat(ACCEPTED_DELETED), entry.getValue());
                    } else if (rejectedAnnex.isPresent()) {
                        //Add the processed annexes with the suffix "_processed"
                        annexDeletedMap.put(originalEntryKey.concat(PROCESSED), entry.getValue());
                    } else {
                        annexDeletedMap.put(originalEntryKey, entry.getValue());
                    }
                }
            }
        }
        return annexDeletedMap;
    }

    public static Map<String, Object> populateDocsDeletedMap(Map<String, Object> originalContentFiles,
                                                              Map<String, Object> contentFiles, LegDocument originalLegDocument,
                                                              List<Annex> annexList) {
        Map<String, Object> docsDeletedMap = new HashMap<>();
        Map<String, Object> originalXmlFiles = MilestoneHelper.filterAndSortFiles(originalContentFiles, XML);
        Map<String, Object> xmlFiles = MilestoneHelper.filterAndSortFiles(contentFiles, XML);
        for (Map.Entry<String, Object> entry : originalXmlFiles.entrySet()) {
            boolean found = false;
            String originalEntryKey = entry.getKey().substring(0, entry.getKey().indexOf(XML));
            if (originalEntryKey.startsWith(ANNEX_FILE_PREFIX)) {
                for(Annex annex : annexList) {
                    if(annex.getClonedFrom() != null && annex.getClonedFrom().equals(originalEntryKey)) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    //Populate list of deleted annexes from contribution which are already accepted in original proposal
                    Optional<Annex> acceptedAnnex = annexList.stream().filter(annex ->
                            originalEntryKey.equalsIgnoreCase(annex.getMetadata().get().getClonedRef())).findFirst();
                    //Populate list of deleted annexes from contribution which are rejected
                    Optional<String> rejectedAnnex = originalLegDocument.getContainedDocuments().stream().filter(
                            fileName -> fileName.contains(PROCESSED) && fileName.startsWith(originalEntryKey)).findFirst();

                    if (acceptedAnnex.isPresent()) {
                        docsDeletedMap.put(originalEntryKey.concat(ACCEPTED_DELETED), entry.getValue());
                    } else if (rejectedAnnex.isPresent()) {
                        //Add the processed annexes with the suffix "_processed"
                        docsDeletedMap.put(originalEntryKey.concat(PROCESSED), entry.getValue());
                    } else {
                        docsDeletedMap.put(originalEntryKey, entry.getValue());
                    }
                }
            } else if (originalEntryKey.startsWith(STAT_DIGIT_FINANC_LEGIS_FILE_PREFIX)) {
                final String docFilename = entry.getKey().substring(0, entry.getKey().indexOf(XML));
                Optional<String> acceptedDoc = xmlFiles.keySet().stream().filter(doc -> doc.startsWith(STAT_DIGIT_FINANC_LEGIS_FILE_PREFIX)).findFirst();
                //Populate list of new docs from contribution which are rejected
                Optional<String> rejectedAnnex = originalLegDocument.getContainedDocuments().stream().filter(
                        fileName -> fileName.contains(PROCESSED) && fileName.startsWith(docFilename)).findFirst();

                if (rejectedAnnex.isPresent()) {
                    //Add the processed docs with the suffix "_processed"
                    String processedAnnexFilename = docFilename.concat(PROCESSED);
                    docsDeletedMap.put(processedAnnexFilename, entry.getValue());
                } else if (acceptedDoc.isPresent()) {
                    String processedAnnexFilename = docFilename.concat(ACCEPTED_DELETED);
                    docsDeletedMap.put(processedAnnexFilename, entry.getValue());
                } else {
                    docsDeletedMap.put(docFilename, entry.getValue());
                }
            }
        }
        return docsDeletedMap;
    }
}
