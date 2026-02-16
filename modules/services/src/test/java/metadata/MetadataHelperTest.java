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
package metadata;


import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.repository.domain.ContentImpl;
import eu.europa.ec.leos.repository.domain.SourceImpl;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportResource;
import eu.europa.ec.leos.services.metadata.MetadataHelper;
import eu.europa.ec.leos.services.metadata.MetadataOptions;
import eu.europa.ec.leos.test.support.LeosTest;
import freemarker.template.Configuration;
import freemarker.template.Template;
import io.atlassian.fugue.Option;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.Mockito.when;

public class MetadataHelperTest extends LeosTest {
    private static Logger LOG = LoggerFactory.getLogger(MetadataHelperTest.class);

    @Mock
    private Configuration freemarkerConfiguration;

    @InjectMocks
    private MetadataHelper metadataHelperImpl;

    private String template = "metadata/metadata.ftl";

    @BeforeEach
    public void init() {
        ReflectionTestUtils.setField(metadataHelperImpl, "templateMetadata", template);
    }

    @Test
    public void test_createContentFile() throws Exception {
        final String expectedProposalName = "main-cm3ddull700116474j3fwlge2-en";
        final String memorandumName = "EXPL_MEMORANDUM-cm3eap4jf0002x4747q5srh8c-en";
        final String billName = "REG-cm3eap5jy0004x474vrrfrq1z-en";
        final ExportLW exportOptions = new ExportLW(ExportOptions.Output.PDF);

        final ExportResource proposal = new ExportResource(LeosCategory.PROPOSAL);
        Map<String, String> tagRefs = new HashMap<String, String>();
        tagRefs.put("coverPage", "coverPage");
        proposal.setResourceId(expectedProposalName);
        proposal.setName(expectedProposalName);
        proposal.setComponentsIdsMap(tagRefs);
        proposal.setExportOptions(exportOptions);

        ExportResource memorandum = new ExportResource(LeosCategory.MEMORANDUM);
        memorandum.setResourceId(memorandumName);
        memorandum.setName(memorandumName);
        memorandum.setComponentsIdsMap(tagRefs);
        proposal.addChildResource(memorandum);

        ExportResource bill = new ExportResource(LeosCategory.BILL);
        bill.setResourceId(billName);
        bill.setName(billName);
        bill.setComponentsIdsMap(tagRefs);
        proposal.addChildResource(bill);

        ByteArrayOutputStream result = null;
        FileOutputStream fileOutputStream = null;
        String resultString;
        try {
            InputStream inputStream = this.getClass().getResource("/eu/europa/ec/leos/freemarker/templates/metadata/metadata.ftl").openStream();
            Reader targetReader = new InputStreamReader(inputStream);
            final Template t = new Template("metadata.ftl", targetReader, null);
            byte[] xmlContent = getFileContent("/document/originalProposals/proposal_original.xml");

            String proposalId = "555";
            List<Collaborator> collaborators = new ArrayList<>();
            collaborators.add(new Collaborator("login", "OWNER", "SG"));
            Content.Source proposalSource = new SourceImpl(new ByteArrayInputStream(xmlContent));
            Content proposalContent = new ContentImpl("PR-00.xml", "mime type", xmlContent.length, proposalSource);
            ProposalMetadata proposalMetadata = new ProposalMetadata("", "REGULATION for EC", "", "PR-00.xml", "EN", "", "proposal-ref", "", "0.1.0", false, false);
            Proposal leosProposal = new Proposal(proposalId, "Proposal", "login", Instant.now(), "login", Instant.now(), "", "", "", "", VersionType.MAJOR, true,
                    "REGULATION for EC", collaborators,
                    Arrays.asList(""), "login", Instant.now(), Option.some(proposalContent), Option.some(proposalMetadata), true, "", "", "", null,
                    ContributionVO.ContributionStatus.CONTRIBUTION_DONE.name(), false, null, null, null);

            MetadataOptions metadataOptions = new MetadataOptions();
            List<MetadataOptions.FieldNode> fields = new ArrayList();
            fields.add(new MetadataOptions.FieldNode("packageTitle", "title"));
            fields.add(new MetadataOptions.FieldNode("internalRef", "ref"));
            fields.add(new MetadataOptions.FieldNode("authenticLang", String.join("-", Arrays.asList("en", "fr"))));
            metadataOptions.addTask("legfileName", leosProposal, fields);

            when(freemarkerConfiguration.getTemplate(template)).thenReturn(t);
            result = metadataHelperImpl.createContentFile(metadataOptions, proposal);
            resultString = result.toString();
            assertThat(resultString, notNullValue());
            LOG.debug(resultString);
        }
        catch (Exception e) {
            fail("XML Parsing failed: " + e.getMessage());
        }
        finally {
            if (fileOutputStream != null) {
                fileOutputStream.close();
            }
        }
    }

    private byte[] getFileContent(String fileName) {
        try {
            InputStream inputStream = this.getClass().getResource(fileName).openStream();
            byte[] content = new byte[inputStream.available()];
            inputStream.read(content);
            inputStream.close();
            return content;
        } catch (IOException e) {
            throw new IllegalStateException("Cannot read bytes from file: " + fileName);
        }
    }
}
