/*
 * Copyright 2023 European Commission
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
package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.TestUtils;
import eu.europa.ec.leos.repository.common.VersionType;
import eu.europa.ec.leos.repository.controllers.requests.QueryFilter;
import eu.europa.ec.leos.repository.entities.Document;
import eu.europa.ec.leos.repository.entities.DocumentContent;
import eu.europa.ec.leos.repository.entities.DocumentMilestone;
import eu.europa.ec.leos.repository.entities.DocumentMilestoneList;
import eu.europa.ec.leos.repository.entities.DocumentV;
import eu.europa.ec.leos.repository.entities.DocumentVersion;
import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.Collaborator;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.repositories.DocumentContentRepository;
import eu.europa.ec.leos.repository.repositories.DocumentMilestoneListRepository;
import eu.europa.ec.leos.repository.repositories.DocumentMilestoneRepository;
import eu.europa.ec.leos.repository.repositories.DocumentRepository;
import eu.europa.ec.leos.repository.repositories.DocumentVRepository;
import eu.europa.ec.leos.repository.repositories.DocumentVersionRepository;
import eu.europa.ec.leos.repository.repositories.PackageRepository;
import eu.europa.ec.leos.repository.utils.ConversionUtils;
import org.assertj.core.util.Sets;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.jupiter.api.Assertions;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class DocumentServiceTests {

    private static final Logger LOG = LoggerFactory.getLogger(DocumentServiceTests.class);

    @Autowired
    DocumentService documentService;
    @Autowired
    PackageService packageService;
    @Autowired
    PackageRepository packageRepository;
    @Autowired
    DocumentRepository documentRepository;
    @Autowired
    DocumentVRepository documentVRepository;
    @Autowired
    DocumentVersionRepository documentVersionRepository;
    @Autowired
    DocumentContentRepository documentContentRepository;
    @Autowired
    DocumentMilestoneRepository documentMilestoneRepository;
    @Autowired
    DocumentMilestoneListRepository documentMilestoneListRepository;

    private final String USER_ID = "jane";
    private eu.europa.ec.leos.repository.model.Package pkg;

    @Before
    public void setup() {
        pkg = packageService.createPackage("test", false, null, "demo");
    }

    @After
    public void clean() throws RepositoryException {
        packageService.deletePackage(pkg.getName());
    }

    private LeosDocument docCreation() throws RepositoryException {
        Map<String, ?> properties = new HashMap() {{
            put("ref", "REG-clh5v2p720007ng28khrr03h7-en");
            put("collaborators", ConversionUtils.getLeosCollaboratorsAsLinkedHashMap(Arrays.asList(new Collaborator("jane", "OWNER", "DGT.R.3"))));
            put("eeaRelevance", "false");
            put ("docPurpose", "TEST ON SUBPARAGRAPHS AS INTRO");
            put("title", "Proposal for a REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL TEST ON SUBPARAGRAPHS AS INTRO");
            put("docType", "REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL");
            put("language", "EN");
            put("initialCreatedBy", "jane");
            put("category", "BILL");
            put("docTemplate", "BL-023");
            put("initialCreationDate", ConversionUtils.getLeosDateAsString(new Date(), ConversionUtils.LEOS_REPO_DATE_FORMAT));
            put("template", "SJ-023");
            put("docStage", "Proposal for a");
        }};
        return documentService.createDocumentFromSource("BL-023", pkg.getName(),
                "REG-clh5v2p720007ng28khrr03h7-en.xml", properties, "0.1.0", 1, "First version", USER_ID);
    }

    @Test
   
    public void test_createDocumentFromContent() throws RepositoryException {
        Map<String, ?> properties = new HashMap() {{
            put("ref", "REG-clh5v2p720007ng28khrr03h7-en");
            put("collaborators", ConversionUtils.getLeosCollaboratorsAsLinkedHashMap(Arrays.asList(new Collaborator("jane", "OWNER", "DGT.R.3"))));
            put("eeaRelevance", "false");
            put ("docPurpose", "TEST ON SUBPARAGRAPHS AS INTRO");
            put("procedureType", "ORDINARY_LEGISLATIVE_PROC");
            put("title", "Proposal for a REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL TEST ON SUBPARAGRAPHS AS INTRO");
            put("docType", "REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL");
            put("language", "EN");
            put("initialCreatedBy", USER_ID);
            put("category", "BILL");
            put("docTemplate", "BL-023");
            put("initialCreationDate", ConversionUtils.getLeosDateAsString(new Date(), ConversionUtils.LEOS_REPO_DATE_FORMAT));
            put("template", "SJ-023");
            put("docStage", "Proposal for a");
        }};
        String content = "<akomaNtoso xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\" xmlns:leos=\"urn:eu:europa:ec:leos\">\n" +
                "    <bill name=\"REG\">\n" +
                "        <meta>\n" +
                "            <identification source=\"~_COM\">\n" +
                "                <FRBRWork>\n" +
                "                    <FRBRthis value=\"\"/>\n" +
                "                    <FRBRuri value=\"\"/>\n" +
                "                    <FRBRdate date=\"2999-01-01\" name=\"\"/>\n" +
                "                    <FRBRauthor href=\"\"/>\n" +
                "                    <FRBRcountry value=\"EU\"/>\n" +
                "                    <FRBRprescriptive value=\"true\"/>\n" +
                "                </FRBRWork>\n" +
                "                <FRBRExpression>\n" +
                "                    <FRBRthis value=\"\"/>\n" +
                "                    <FRBRuri value=\"\"/>\n" +
                "                    <FRBRdate date=\"2999-01-01\" name=\"\"/>\n" +
                "                    <FRBRauthor href=\"\"/>\n" +
                "                    <FRBRlanguage language=\"en\" xml:id=\"_FRBRlanguage\"/>\n" +
                "                </FRBRExpression>\n" +
                "                <FRBRManifestation>\n" +
                "                    <FRBRthis value=\"\"/>\n" +
                "                    <FRBRuri value=\"\"/>\n" +
                "                    <FRBRdate date=\"2999-01-01\" name=\"\"/>\n" +
                "                    <FRBRauthor href=\"\"/>\n" +
                "\t\t\t\t\t<preservation xmlns:akn4eu=\"http://imfc.europa.eu/akn4eu\">\n" +
                "                \t\t<akn4eu:akn4euVersion value=\"4.0.0.0\"/>\n" +
                "                \t</preservation>\n" +
                "                </FRBRManifestation>\n" +
                "            </identification>\n" +
                "            <references source=\"~_COM\">\n" +
                "                <TLCLocation href=\"http://publications.europa.eu/resource/authority/place/BEL_BRU\" showAs=\"Brussels\" xml:id=\"_BEL_BRU\"/>\n" +
                "                <TLCOrganization href=\"http://publications.europa.eu/resource/authority/corporate-body/CONSIL\" showAs=\"Council of the European Union\" xml:id=\"_CONSIL\"/>\n" +
                "                <TLCOrganization href=\"http://publications.europa.eu/resource/authority/corporate-body/EP\" showAs=\"European Parliament\" xml:id=\"_EP\"/>\n" +
                "                <TLCOrganization href=\"http://publications.europa.eu/resource/authority/corporate-body/COM\" showAs=\"European Commission\" xml:id=\"_COM\"/>\n" +
                "                <TLCRole href=\"http://publications.europa.eu/resource/authority/role/PRESID\" showAs=\"President\" xml:id=\"_PRESID\"/>\n" +
                "                <TLCReference href=\"http://publications.europa.eu/resource/authority/resource-type/REG\" name=\"docType\" showAs=\"Regulation\" xml:id=\"_REG\"/>\n" +
                "                <TLCReference href=\"http://eurovoc.europa.eu/5456\" name=\"contentSubject\" showAs=\"Legal basis\" xml:id=\"_legalBasis\"/>\n" +
                "                <TLCReference href=\"http://publications.europa.eu/resource/authority/language/ENG\" name=\"language\" showAs=\"en\" xml:id=\"_language\"/>\n" +
                "                <TLCReference href=\"http://eur-lex.europa.eu/procedure/EN/YYYY_NNN\" name=\"procedureReference\" shortForm=\"YYYY/NNN/AAA\" showAs=\"YYYY/NNNN (AAA)\" xml:id=\"_procedure_YYYY_NNN\"/>\n" +
                "                <TLCReference href=\"http://publications.europa.eu/resource/authority/document-identifier-format/COM_NUMBER\" name=\"identifier\" shortForm=\"AAA/YYYY/NNN\" showAs=\"AAA(YYYY) NNN\" xml:id=\"_azs3y\"/>\n" +
                "                <TLCConcept href=\"http://publications.europa.eu/resource/subdivision-content/ART_DEF\" showAs=\"Article on definitions\" xml:id=\"_ART_DEF\"/>\n" +
                "            </references>\n" +
                "            <proprietary source=\"~_leos\">\n" +
                "                <leos:templateVersion>2.1.0</leos:templateVersion>\n" +
                "                <leos:docVersion>0.1.0</leos:docVersion>\n" +
                "                <leos:template>SJ-023</leos:template>\n" +
                "                <leos:docTemplate>BL-023</leos:docTemplate>\n" +
                "            <leos:docPurpose xml:id=\"_proprietary__docpurpose\">TEST ON SUBPARAGRAPHS AS INTRO</leos:docPurpose><leos:docStage xml:id=\"_proprietary__docstage\">Proposal for a</leos:docStage><leos:ref>REG-clh5v2p720007ng28khrr03h7-en</leos:ref><leos:docType xml:id=\"_proprietary__doctype\">REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL</leos:docType><leos:objectId/></proprietary>\n" +
                "        </meta>\n" +
                "        <preface xml:id=\"_preface\"><container name=\"procedureIdentifier\" xml:id=\"_preface__procedureIdentifier\">\n" +
                "                <p xml:id=\"_preface__procedureIdentifier__p\">\n" +
                "                    <docketNumber refersTo=\"~_procedure_YYYY_NNN\" xml:id=\"_preface__procedureIdentifier__p__docketNumber\"/>\n" +
                "                </p>\n" +
                "            </container><longTitle xml:id=\"_preface__longtitle\">\n" +
                "                <p xml:id=\"_preface__longtitle__p\">\n" +
                "                    <docStage xml:id=\"_preface__longtitle__p__docstage\">Proposal for a</docStage>\n" +
                "                    <docType refersTo=\"~_REG\" xml:id=\"_preface__longtitle__p__doctype\">REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL</docType>\n" +
                "                    <docPurpose xml:id=\"_preface__longtitle__p__docpurpose\">TEST ON SUBPARAGRAPHS AS INTRO</docPurpose>\n" +
                "                </p>\n" +
                "            </longTitle></preface>\n" +
                "        <preamble xml:id=\"_preamble\"><formula name=\"actingEntity\" xml:id=\"_preamble__formula_1\"><p xml:id=\"_preamble__formula_1__p\">THE EUROPEAN PARLIAMENT AND THE COUNCIL OF THE EUROPEAN UNION,</p></formula><citations leos:editable=\"false\" xml:id=\"_cits\"><citation leos:editable=\"true\" refersTo=\"~_legalBasis\" xml:id=\"_cit_1\"><p xml:id=\"_cit_1__p\">Having regard to the Treaty on the Functioning of the European Union, and in particular Article [...] thereof,</p></citation><citation leos:editable=\"true\" xml:id=\"_cit_2\"><p xml:id=\"_cit_2__p\">Having regard to the proposal from the European Commission,</p></citation><citation leos:editable=\"true\" xml:id=\"_cit_3\"><p xml:id=\"_cit_3__p\">After transmission of the draft legislative act to the national Parliaments,</p></citation><citation leos:editable=\"true\" xml:id=\"_cit_4\"><p xml:id=\"_cit_4__p\">Having regard to the opinion of the European Economic and Social Committee<authorialNote marker=\"1\" placement=\"bottom\" xml:id=\"_authorialnote_1\"><p xml:id=\"_authorialNote_1__p\">OJ C [...], [...], p. [...]</p></authorialNote>,</p></citation><citation leos:editable=\"true\" xml:id=\"_cit_5\"><p xml:id=\"_cit_5__p\">Having regard to the opinion of the Committee of the Regions<authorialNote marker=\"2\" placement=\"bottom\" xml:id=\"_authorialnote_2\"><p xml:id=\"_authorialNote_2__p\">OJ C [...], [...], p. [...]</p></authorialNote>,</p></citation><citation leos:editable=\"true\" xml:id=\"_cit_6\"><p xml:id=\"_cit_6__p\">Acting in accordance with the ordinary legislative procedure,</p></citation></citations><recitals leos:editable=\"false\" xml:id=\"_recs\"><intro xml:id=\"_recitalsIntro\"><p xml:id=\"_recs_intro\">Whereas:</p></intro><recital leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_rec_d1e87_yDZ4Zl\"><num xml:id=\"_recs_XCsSrR\">(1)</num><p xml:id=\"_recs_ulxeEc\">The G-20 Declaration of 2 April 2009 on Strengthening of the Financial System called for internationally consistent efforts that are aimed at strengthening transparency, accountability and regulation by improving the quantity and quality of capital in the banking system once the economic recovery is assured. That declaration also called for introduction of a supplementary non-risk based measure to contain the build-up of leverage in the banking system, and the development of a framework for stronger liquidity buffers. In response to the mandate given by the G-20, in September 2009 the Group of Central Bank Governors and Heads of Supervision (GHOS), agreed on a number of measures to strengthen the regulation of the banking sector. Those measures were endorsed by the G-20 leaders at their Pittsburgh Summit of 24-25 September 2009 and were set out in detail in December 2009. In July and September 2010, GHOS issued two further announcements on design and calibration of those new measures, and in December 2010, the Basel Committee on Banking Supervision (BCBS) published the final measures, that are referred to as the Basel III framework.</p></recital><recital leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_rec_d1e102_XaJ7NE\"><num xml:id=\"_recs_JEhFHz\">(2)</num><p xml:id=\"_recs_3OXO70\">The High Level Group on Financial Supervision in the EU chaired by Jacques de LarosiÃ¨re (the \"de LarosiÃ¨re group\") invited the Union to develop a more harmonised set of financial regulations. In the context of the future European supervisory architecture, the European Council of 18 and 19 June 2009 also stressed the need to establish a 'European Single Rule Book' applicable to all credit institutions and investment firms in the internal market.</p></recital><recital leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_rec_d1e123_u3HqXn\"><num xml:id=\"_recs_Iu05Xc\">(3)</num><p xml:id=\"_recs_xOYg00\">As stated in the de LarosiÃ¨re group's report of 25 February 2009 (the \"de LarosiÃ¨re report\"), \"a Member State should be able to adopt more stringent national regulatory measures considered to be domestically appropriate for safeguarding financial stability as long as the principles of the internal market and agreed minimum core standards are respected\".</p></recital><recital leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_rec_d1e140_6fumxe\"><num xml:id=\"_recs_MAIeaf\">(4)</num><p xml:id=\"_recs_hWTdCU\">Directive 2006/48/EC of the European Parliament and of the Council of 14 June 2006 relating to the taking up and pursuit of the business of credit institutions<authorialNote marker=\"3\" placement=\"bottom\" xml:id=\"_recs_GxwEi4\"><p xml:id=\"_recs_47tCGA\">OJ L 177, 30.6.2006, p. 1.</p></authorialNote> and Directive 2006/49/EC of the European Parliament and of the Council of 14 June 2006 on the capital adequacy of investment firms and credit institutions<authorialNote marker=\"4\" placement=\"bottom\" xml:id=\"_recs_CKfi1V\"><p xml:id=\"_recs_hAHO4G\">OJ L 177, 30.6.2006, p. 201.</p></authorialNote> have been significantly amended on several occasions. Many provisions of Directives 2006/48/EC and 2006/49/EC are applicable to both credit institutions and investment firms. For the sake of clarity and in order to ensure a coherent application of those provisions, they should be merged into new legislative acts that are applicable to both credit institutions and investment firms, namely this Regulation and Directive 2013/36/EU of the European Parliament and of the Council<authorialNote marker=\"5\" placement=\"bottom\" xml:id=\"_recs_UA0WBT\"><p xml:id=\"_recs_vZjFbO\">See page 338 of this Official Journal.</p></authorialNote>. For greater accessibility, the provisions of the Annexes to Directives 2006/48/EC and 2006/49/EC should be integrated into the enacting terms of Directive 2013/36/EU and this Regulation.</p></recital><recital leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_rec_d1e171_Wh4gEw\"><num xml:id=\"_recs_98Inku\">(5)</num><p xml:id=\"_recs_obh6wx\">Together, this Regulation and Directive 2013/36/EU should form the legal framework governing the access to the activity, the supervisory framework and the prudential rules for credit institutions and investment firms (referred to collectively as \"institutions\"). This Regulation should therefore be read together with that Directive</p></recital><recital leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_rec_d1e181_U27toi\"><num xml:id=\"_recs_lkQnin\">(6)</num><p xml:id=\"_recs_hHh6R0\">Directive 2013/36/EU, based on Article 53(1) of the Treaty on the Functioning of the European Union (TFEU), should, inter alia, contain the provisions concerning the access to the activity of institutions, the modalities for their governance, and their supervisory framework, such as provisions governing the authorisation of the business, the acquisition of qualifying holdings, the exercise of the freedom of establishment and of the freedom to provide services, the powers of the competent authorities of the home and the host Member States in this regard and the provisions governing the initial capital and the supervisory review of institutions.</p></recital></recitals><formula name=\"enactingFormula\" xml:id=\"_preamble__formula_2\"><p xml:id=\"_preamble__formula_2__p\">HAVE ADOPTED THIS REGULATION:</p></formula></preamble>\n" +
                "        <body xml:id=\"_body\"><article leos:autonumbering=\"true\" leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_art_1\"><num leos:editable=\"false\" xml:id=\"_art_1__num\">Article 1</num><heading xml:id=\"_art_1__heading\">Scope</heading><paragraph xml:id=\"_art_1__para_1\"><num xml:id=\"_art_1__para_1__num\">1.</num><list xml:id=\"_art_1_geFV8v\"><subparagraph refersTo=\"~_INP\" xml:id=\"_art_1_9QazpL\"><content xml:id=\"_art_1__para_1__content\"><p xml:id=\"_art_1__para_1__content__p\">This a custom article.</p></content></subparagraph><point xml:id=\"_art_1_SHnaUi\"><num xml:id=\"_art_1_AXTACj\">(a)</num><content xml:id=\"_art_1_XN3rWq\"><p xml:id=\"_art_1_FPpGfE\">First point</p></content></point><point xml:id=\"_art_1_iTVvtl\"><num xml:id=\"_art_1_dRmzE0\">(b)</num><list xml:id=\"_art_1_kSgdA1\"><subparagraph refersTo=\"~_INP\" xml:id=\"_art_1_H6p1HX\"><content xml:id=\"_art_1_GS0DdI\"><p xml:id=\"_art_1_eXY3hF\">Second point</p></content></subparagraph><point xml:id=\"_art_1_F93I9z\"><num xml:id=\"_art_1_ZqC4os\">(i)</num><subparagraph xml:id=\"_art_1_Mh9DZe\"><content xml:id=\"_art_1_w1YbyI\"><p xml:id=\"_art_1_R8N7Td\">ThirdÂ point</p></content></subparagraph><list xml:id=\"_art_1_jI1hMO\"><subparagraph refersTo=\"~_INP\" xml:id=\"_art_1_sf68he\"><content xml:id=\"_art_1_8FSQqS\"><p xml:id=\"_art_1_EpY1x9\">This a subparagraph</p></content></subparagraph><point xml:id=\"_art_1_AW7mmk\"><num xml:id=\"_art_1_jwMvmL\">(1)</num><list xml:id=\"_art_1_muTM7F\"><subparagraph refersTo=\"~_INP\" xml:id=\"_art_1_QrNUIS\"><content xml:id=\"_art_1_HETZsY\"><p xml:id=\"_art_1_f4OEmt\">Fourth point</p></content></subparagraph><indent xml:id=\"_art_1_9s4ttT\"><num xml:id=\"_art_1_voHCfe\">-</num><content xml:id=\"_art_1_rCBV4d\"><p xml:id=\"_art_1_k4tadc\">Fifth point</p></content></indent><indent xml:id=\"_art_1_yaLnZJ\"><num xml:id=\"_art_1_s5BMgC\">-</num><content xml:id=\"_art_1_nULcgG\"><p xml:id=\"_art_1_ZQobfc\">Sixth point</p></content></indent></list></point><point xml:id=\"_art_1_eKKPn2\"><num xml:id=\"_art_1_FSGx3w\">(2)</num><content xml:id=\"_art_1_9fpI8j\"><p xml:id=\"_art_1_gOZi4q\">Seventh point</p></content></point></list></point><point xml:id=\"_art_1_HoMy6w\"><num xml:id=\"_art_1_FMxDhW\">(ii)</num><content xml:id=\"_art_1_QFdcr3\"><p xml:id=\"_art_1_EIYM9P\">Eighth point</p></content></point></list></point><point xml:id=\"_art_1_aIbX3e\"><num xml:id=\"_art_1_KYwp8p\">(c)</num><content xml:id=\"_art_1_Sz0b9M\"><p xml:id=\"_art_1_rhD89v\">Ninth point</p></content></point></list></paragraph></article><article xml:id=\"__akn_article_hzxjht\"><num leos:editable=\"false\" xml:id=\"__akn_article_hzxjht_hFjWXc\">Article 2</num><heading xml:id=\"__akn_article_hzxjht_fgAYSz\">This is another custom article</heading><paragraph xml:id=\"__akn_article_hzxjht-par1\"><num xml:id=\"__akn_article_hzxjht_aJZ16Y\">1.</num><list xml:id=\"__akn_article_hzxjht_OnUIxn\"><subparagraph refersTo=\"~_INP\" xml:id=\"__akn_article_hzxjht_rQlOr2\"><content xml:id=\"__akn_article_hzxjht_LRnBuU\"><p xml:id=\"__akn_article_hzxjht_7pjIlC\">This is a custom article</p></content></subparagraph><point xml:id=\"__akn_article_hzxjht_SX6Wnt\"><num xml:id=\"__akn_article_hzxjht_VRV5uJ\">(a)</num><content xml:id=\"__akn_article_hzxjht_QCnF8X\"><p xml:id=\"__akn_article_hzxjht_gXycDf\">First point</p></content></point><point xml:id=\"__akn_article_hzxjht_CsvjQW\"><num xml:id=\"__akn_article_hzxjht_wWtx4s\">(b)</num><subparagraph xml:id=\"__akn_article_hzxjht_Z28up8\"><content xml:id=\"__akn_article_hzxjht_PxB8cw\"><p xml:id=\"__akn_article_hzxjht_FYV82j\">Second point</p></content></subparagraph><subparagraph xml:id=\"__akn_article_hzxjht_uuUspu\"><content xml:id=\"__akn_article_hzxjht_St6ZDw\"><p xml:id=\"__akn_article_hzxjht_YHS3kS\">Subparagraph</p></content></subparagraph></point></list></paragraph></article><article leos:autonumbering=\"true\" leos:deletable=\"true\" leos:editable=\"true\" refersTo=\"~_ART_DEF\" xml:id=\"_art_definitions\"><num leos:editable=\"false\" xml:id=\"_art_definitions__num\">Article 3</num><heading xml:id=\"_art_definitions_heading\">This a custom definitions'article</heading><paragraph xml:id=\"_art_definitions__para_1\"><list xml:id=\"_art_definitions_LeuEaR\"><subparagraph refersTo=\"~_INP\" xml:id=\"_art_definitions_1W34RQ\"><content xml:id=\"_art_definitions__para_1__content\"><p xml:id=\"_art_definitions__para_1__content__p\">First Definition:</p></content></subparagraph><point xml:id=\"_art_definitions_nKs23b\"><num xml:id=\"_art_definitions_ni8c8y\">(1)</num><content xml:id=\"_art_definitions_fWqT0p\"><p xml:id=\"_art_definitions_04YNrk\">First point of first definition</p></content></point><point xml:id=\"_art_definitions_a4EgBD\"><num xml:id=\"_art_definitions_pfOZXa\">(2)</num><content xml:id=\"_art_definitions_rxFETG\"><p xml:id=\"_art_definitions_fXWjBW\">Second point of first definition</p></content></point><point xml:id=\"_art_definitions_BPcicX\"><num xml:id=\"_art_definitions_aYiudH\">(3)</num><content xml:id=\"_art_definitions_qBrHcK\"><p xml:id=\"_art_definitions_Jk3bog\">Third point of first definition</p></content></point></list></paragraph><paragraph xml:id=\"_art_definitions_VDNHWQ\"><content xml:id=\"_art_definitions_EEo5dt\"><p xml:id=\"_art_definitions_sePP8N\">Second definition</p></content></paragraph></article><article leos:autonumbering=\"true\" leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_art_3\"><num leos:editable=\"false\" xml:id=\"_art_3__num\">Article 4</num><heading xml:id=\"_art_3__heading\">Entry into force</heading><paragraph xml:id=\"_art_3__para_1\">\n" +
                "                    <content xml:id=\"_art_3__para_1__content\">\n" +
                "                        <p xml:id=\"_art_3__para_1__content__p\">This Regulation shall enter into force on the [...] day following that of its publication in the <i xml:id=\"_art_3__para_1__content__p__i\">Official Journal of the European Union</i>.</p>\n" +
                "                    </content>\n" +
                "                </paragraph></article><article leos:deletable=\"true\" leos:editable=\"true\" refersTo=\"~_ART_DEF\" xml:id=\"_imp_art_d1e2906_LwbJdq\"><num xml:id=\"_imp_art_d1e2906_LwbJdq_Yg3FEZ\">Article 5</num><heading xml:id=\"_imp_art_d1e2906_LwbJdq_IjvaEH\">Definitions specific to capital requirements for credit risk</heading><paragraph xml:id=\"_imp_art_d1e2906_LwbJdq_Md10Ef\"><list xml:id=\"_imp_art_d1e2906_LwbJdq_WcPVHw\"><subparagraph refersTo=\"~_INP\" xml:id=\"_imp_art_d1e2906_LwbJdq_4jgd6m\"><content xml:id=\"_imp_art_d1e2906_LwbJdq_bvn4xT\"><p xml:id=\"_imp_art_d1e2906_LwbJdq_Mbecjg\">For the purposes of Part Three, Title II, the following definitions shall apply:</p></content></subparagraph><point xml:id=\"_imp_art_d1e2906_LwbJdq_AzuKIe\"><num xml:id=\"_imp_art_d1e2906_LwbJdq_WZeZNA\">(1)</num><content xml:id=\"_imp_art_d1e2906_LwbJdq_qvtvkD\"><p xml:id=\"_imp_art_d1e2906_LwbJdq_2vFOU6\">'exposure' means an asset or off-balance sheet item;</p></content></point><point xml:id=\"_imp_art_d1e2906_LwbJdq_d9ZKDr\"><num xml:id=\"_imp_art_d1e2906_LwbJdq_G4AvCk\">(2)</num><content xml:id=\"_imp_art_d1e2906_LwbJdq_Jhe0Cy\"><p xml:id=\"_imp_art_d1e2906_LwbJdq_8wHnvT\">'loss' means economic loss, including material discount effects, and material direct and indirect costs associated with collecting on the instrument;</p></content></point><point xml:id=\"_imp_art_d1e2906_LwbJdq_Gwkf1R\"><num xml:id=\"_imp_art_d1e2906_LwbJdq_C2oju6\">(3)</num><content xml:id=\"_imp_art_d1e2906_LwbJdq_YpAXY7\"><p xml:id=\"_imp_art_d1e2906_LwbJdq_p2kYaw\">'expected loss' or 'EL' means the ratio of the amount expected to be lost on an exposure from a potential default of a counterparty or dilution over a one year period to the amount outstanding at default.</p></content></point></list></paragraph></article><article leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_art_d1e3059_Z7uv35\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_ies6QN\">Article 6</num><heading xml:id=\"_imp_art_d1e3059_Z7uv35_q8SPlv\">Derogation to the application of liquidity requirements on an individual basis</heading><paragraph xml:id=\"_imp_art_d1e3059_Z7uv35_MWSJ0w\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_hMtOUZ\">1.</num><list xml:id=\"_imp_art_d1e3059_Z7uv35_dtZk06\"><subparagraph refersTo=\"~_INP\" xml:id=\"_imp_art_d1e3059_Z7uv35_u3EJ2l\"><content xml:id=\"_imp_art_d1e3059_Z7uv35_0mJ4nP\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_BxqVm7\">The competent authorities may waive in full or in part the application of Part Six to an institution and to all or some of its subsidiaries in the Union and supervise them as a single liquidity sub-group so long as they fulfil all of the following conditions:</p></content></subparagraph><point xml:id=\"_imp_art_d1e3059_Z7uv35_9R39fK\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_BLioV7\">(a)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_IxKXGT\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_ll4LyA\">the parent institution on a consolidated basis or a subsidiary institution on a sub-consolidated basis complies with the obligations laid down in Part Six;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_CtMujS\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_Jska5n\">(b)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_mW1evj\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_y4a2Sd\">the parent institution on a consolidated basis or the subsidiary institution on a sub-consolidated basis monitors and has oversight at all times over the liquidity positions of all institutions within the group or sub-group, that are subject to the waiver and ensures a sufficient level of liquidity for all of these institutions;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_546qJM\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_SqQ8VU\">(c)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_N1AJS0\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_MdWlhP\">the institutions have entered into contracts that, to the satisfaction of the competent authorities, provide for the free movement of funds between them to enable them to meet their individual and joint obligations as they come due;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_S1rdZv\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_AIT4og\">(d)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_eA5knH\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_UAXgmj\">there is no current or foreseen material practical or legal impediment to the fulfilment of the contracts referred to in (c).</p></content></point><subparagraph refersTo=\"~_WRP\" xml:id=\"_imp_art_d1e3059_Z7uv35_ZAN3q8\"><content xml:id=\"_imp_art_d1e3059_Z7uv35_rSo5JT\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_GQ4IyZ\">By 1 January 2014 the Commission shall report to the European Parliament and the Council on any legal obstacles which are capable of rendering impossible the application of point (c) of the first subparagraph and is invited to make a legislative proposal, if appropriate, by 31 December 2015 on which of those obstacles should be removed.</p></content></subparagraph></list></paragraph><paragraph xml:id=\"_imp_art_d1e3059_Z7uv35_EzoMrm\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_AuFmw9\">2.</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_cH4ewI\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_Qpdpnq\">The competent authorities may waive in full or in part the application of Part Six to an institution and to all or some of its subsidiaries where all institutions of the single liquidity sub-group are authorised in the same Member State and provided that the conditions in paragraph 1 are fulfilled.</p></content></paragraph><paragraph xml:id=\"_imp_art_d1e3059_Z7uv35_jtezEw\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_y1k4AL\">3.</num><list xml:id=\"_imp_art_d1e3059_Z7uv35_KScj9w\"><subparagraph refersTo=\"~_INP\" xml:id=\"_imp_art_d1e3059_Z7uv35_XKNETv\"><content xml:id=\"_imp_art_d1e3059_Z7uv35_g3d4hy\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_QZ34tb\">Where institutions of the single liquidity sub-group are authorised in several Member States, paragraph 1 shall only be applied after following the procedure laid down in Article 21 and only to the institutions whose competent authorities agree about the following elements:</p></content></subparagraph><point xml:id=\"_imp_art_d1e3059_Z7uv35_B9LT9N\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_BDBgGS\">(a)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_Lnmmvo\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_vX1YKy\">their assessment of the compliance of the organisation and of the treatment of liquidity risk with the conditions set out in Article 86 of Directive 2013/36/EU across the single liquidity sub-group;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_ZA2kEN\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_NlU4Um\">(b)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_AzA3PH\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_1SgFmb\">the distribution of amounts, location and ownership of the required liquid assets to be held within the single liquidity sub-group;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_j62xFv\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_WOP7PF\">(c)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_ySMimG\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_h8HIAT\">the determination of minimum amounts of liquid assets to be held by institutions for which the application of Part Six will be waived;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_G2xok3\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_tiVheH\">(d)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_ZKsSOS\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_HhvqfH\">the need for stricter parameters than those set out in Part Six;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_jjPic6\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_vk9dH5\">(e)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_mi23EY\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_ca2g6j\">unrestricted sharing of complete information between the competent authorities;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_HyMmk0\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_ZdG8cD\">(f)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_95Uu1Q\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_Q1rLLw\">a full understanding of the implications of such a waiver.</p></content></point></list></paragraph><paragraph xml:id=\"_imp_art_d1e3059_Z7uv35_5rOUce\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_KoKpox\">4.</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_fg09r0\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_wrcElq\">Competent authorities may also apply paragraphs 1, 2 and 3 to institutions which are members of the same institutional protection scheme referred to in Article 113(7)(b), provided that they meet all the conditions laid down in Article 113(7), and to other institutions linked by a relationship referred to in Article 113(6) provided that they meet all the conditions laid down therein. Competent authorities shall in that case determine one of the institutions subject to the waiver to meet Part Six on the basis of the consolidated situation of all institutions of the single liquidity sub-group.</p></content></paragraph><paragraph xml:id=\"_imp_art_d1e3059_Z7uv35_iDYEvF\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_qGmvdk\">5.</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_ZLQjNB\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_3WLcVC\">Where a waiver has been granted under paragraph 1 or paragraph 2, the competent authorities may also apply Article 86 of Directive 2013/36/EU, or parts thereof, at the level of the single liquidity sub-group and waive the application of Article 86 of Directive 2013/36/EU, or parts thereof, on an individual basis.</p></content></paragraph></article><article leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_art_d1e3182_mIryFf\"><num xml:id=\"_imp_art_d1e3182_mIryFf_Gyc8Mr\">Article 7</num><heading xml:id=\"_imp_art_d1e3182_mIryFf_PNS8r9\">Waiver for credit institutions permanently affiliated to a central body</heading><paragraph xml:id=\"_imp_art_d1e3182_mIryFf_pukrNM\"><num xml:id=\"_imp_art_d1e3182_mIryFf_CdEbd3\">1.</num><list xml:id=\"_imp_art_d1e3182_mIryFf_gzYfkO\"><subparagraph refersTo=\"~_INP\" xml:id=\"_imp_art_d1e3182_mIryFf_jHtJmK\"><content xml:id=\"_imp_art_d1e3182_mIryFf_8tAhA2\"><p xml:id=\"_imp_art_d1e3182_mIryFf_94BE5x\">Competent authorities may, in accordance with national law, partially or fully waive the application of the requirements set out in Parts Two to Eight to one or more credit institutions situated in the same Member State and which are permanently affiliated to a central body which supervises them and which is established in the same Member State, if the following conditions are met:</p></content></subparagraph><point xml:id=\"_imp_art_d1e3182_mIryFf_dMxdMz\"><num xml:id=\"_imp_art_d1e3182_mIryFf_exQEDc\">(a)</num><content xml:id=\"_imp_art_d1e3182_mIryFf_7EcfQV\"><p xml:id=\"_imp_art_d1e3182_mIryFf_OLVwAp\">the commitments of the central body and affiliated institutions are joint and several liabilities or the commitments of its affiliated institutions are entirely guaranteed by the central body;</p></content></point><point xml:id=\"_imp_art_d1e3182_mIryFf_QIStxi\"><num xml:id=\"_imp_art_d1e3182_mIryFf_jhG7uM\">(b)</num><content xml:id=\"_imp_art_d1e3182_mIryFf_Gslcsd\"><p xml:id=\"_imp_art_d1e3182_mIryFf_lEUTha\">the solvency and liquidity of the central body and of all the affiliated institutions are monitored as a whole on the basis of consolidated accounts of these institutions;</p></content></point><point xml:id=\"_imp_art_d1e3182_mIryFf_wJOMCL\"><num xml:id=\"_imp_art_d1e3182_mIryFf_c60YFP\">(c)</num><content xml:id=\"_imp_art_d1e3182_mIryFf_4ocvUO\"><p xml:id=\"_imp_art_d1e3182_mIryFf_xw1gim\">the management of the central body is empowered to issue instructions to the management of the affiliated institutions.</p></content></point><subparagraph refersTo=\"~_WRP\" xml:id=\"_imp_art_d1e3182_mIryFf_Dc7U9J\"><content xml:id=\"_imp_art_d1e3182_mIryFf_vP5eJc\"><p xml:id=\"_imp_art_d1e3182_mIryFf_Wxzi7Y\">Member States may maintain and make use of existing national legislation regarding the application of the waiver referred to in the first subparagraph as long as it does not conflict with this Regulation and Directive 2013/36/EU.</p></content></subparagraph></list></paragraph><paragraph xml:id=\"_imp_art_d1e3182_mIryFf_A3K8qw\"><num xml:id=\"_imp_art_d1e3182_mIryFf_KAZuU2\">2.</num><content xml:id=\"_imp_art_d1e3182_mIryFf_DLf1TH\"><p xml:id=\"_imp_art_d1e3182_mIryFf_cTa9NN\">Where the competent authorities are satisfied that the conditions set out in paragraph 1 are met, and where the liabilities or commitments of the central body are entirely guaranteed by the affiliated institutions, the competent authorities may waive the application of Parts Two to Eight to the central body on an individual basis.</p></content></paragraph></article><article leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_art_d1e3535_JiKGQm\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_NaiSCu\">Article 8</num><heading xml:id=\"_imp_art_d1e3535_JiKGQm_EomKhm\">Entities excluded from the scope of prudential consolidation</heading><paragraph xml:id=\"_imp_art_d1e3535_JiKGQm_ArHCGF\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_84uFHk\">1.</num><list xml:id=\"_imp_art_d1e3535_JiKGQm_JU9sTf\"><subparagraph refersTo=\"~_INP\" xml:id=\"_imp_art_d1e3535_JiKGQm_msRlUj\"><content xml:id=\"_imp_art_d1e3535_JiKGQm_KM7AUd\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_KMFAL3\">An institution, financial institution or an ancillary services undertaking which is a subsidiary or an undertaking in which a participation is held, need not to be included in the consolidation where the total amount of assets and off-balance sheet items of the undertaking concerned is less than the smaller of the following two amounts:</p></content></subparagraph><point xml:id=\"_imp_art_d1e3535_JiKGQm_dO8Wh6\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_KCEM13\">(a)</num><content xml:id=\"_imp_art_d1e3535_JiKGQm_qzLH8C\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_Nr7qxp\">EUR 10 million;</p></content></point><point xml:id=\"_imp_art_d1e3535_JiKGQm_p9N0yW\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_3coE5X\">(b)</num><content xml:id=\"_imp_art_d1e3535_JiKGQm_W6qM2g\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_Fd4Nwn\">1 % of the total amount of assets and off-balance sheet items of the parent undertaking or the undertaking that holds the participation.</p></content></point></list></paragraph><paragraph xml:id=\"_imp_art_d1e3535_JiKGQm_q4prPY\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_qhWEfN\">2.</num><list xml:id=\"_imp_art_d1e3535_JiKGQm_EVvucO\"><subparagraph refersTo=\"~_INP\" xml:id=\"_imp_art_d1e3535_JiKGQm_AP67uO\"><content xml:id=\"_imp_art_d1e3535_JiKGQm_q4equ8\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_VYxXhe\">The competent authorities responsible for exercising supervision on a consolidated basis pursuant to Article 111 of Directive 2013/36/EU may on a case-by-case basis decide in the following cases that an institution, financial institution or ancillary services undertaking which is a subsidiary or in which a participation is held need not be included in the consolidation:</p></content></subparagraph><point xml:id=\"_imp_art_d1e3535_JiKGQm_yhouV8\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_ulx7DF\">(a)</num><content xml:id=\"_imp_art_d1e3535_JiKGQm_E2xUGt\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_Gsm9U9\">where the undertaking concerned is situated in a third country where there are legal impediments to the transfer of the necessary information;</p></content></point><point xml:id=\"_imp_art_d1e3535_JiKGQm_DYEgPn\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_0al2Oc\">(b)</num><content xml:id=\"_imp_art_d1e3535_JiKGQm_FEvuVt\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_mPgJCc\">where the undertaking concerned is of negligible interest only with respect to the objectives of monitoring credit institutions;</p></content></point><point xml:id=\"_imp_art_d1e3535_JiKGQm_vgNJTn\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_ycG7G0\">(c)</num><content xml:id=\"_imp_art_d1e3535_JiKGQm_uxxrmF\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_zxylYR\">where, in the opinion of the competent authorities responsible for exercising supervision on a consolidated basis, the consolidation of the financial situation of the undertaking concerned would be inappropriate or misleading as far as the objectives of the supervision of credit institutions are concerned.</p></content></point></list></paragraph><paragraph xml:id=\"_imp_art_d1e3535_JiKGQm_fX0TNG\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_fksg6I\">3.</num><content xml:id=\"_imp_art_d1e3535_JiKGQm_sjuNrS\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_ZGBDba\">Where, in the cases referred to in paragraph 1 and point (b) of paragraph 2, several undertakings meet the criteria set out therein, they shall nevertheless be included in the consolidation where collectively they are of non-negligible interest with respect to the specified objectives.</p></content></paragraph></article><clause leos:alternative=\"true\" leos:deletable=\"true\" leos:editable=\"true\" leos:optionlist=\"listOption1\" leos:selectedoption=\"1\" xml:id=\"_clause_1\">\n" +
                "                <content xml:id=\"_clause_1__content\">\n" +
                "                    <p xml:id=\"_clause_1__content__p\">This Regulation shall be binding in its entirety and directly applicable in all Member States.</p>\n" +
                "                </content>\n" +
                "            </clause></body>\n" +
                "        <conclusions xml:id=\"_conclusions\"><p xml:id=\"_conclusions__p_1\">Done at <location refersTo=\"~_BEL_BRU\" xml:id=\"_conclusions__p__location_1\">Brussels</location>, <date date=\"9999-01-01\" xml:id=\"_akn_aviQud\"/></p><block name=\"signatory\" xml:id=\"_conclusions__block_1\">\n" +
                "                <signature xml:id=\"_conclusions__block_1__signature_1\">\n" +
                "                    <organization refersTo=\"~_EP\" xml:id=\"_conclusions__block_1__signature_1__organization\">For the European Parliament</organization>\n" +
                "                    <role refersTo=\"~_PRESID\" xml:id=\"_conclusions__block_1__signature_1__role\">The President</role>\n" +
                "                    <person refersTo=\"\" xml:id=\"_conclusions__block_1__signature_1__person\">[...]</person>\n" +
                "                </signature>\n" +
                "                <signature xml:id=\"_conclusions__block_1__signature_2\">\n" +
                "                    <organization refersTo=\"~_CONSIL\" xml:id=\"_conclusions__block_1__signature_2__organization\">For the Council</organization>\n" +
                "                    <role refersTo=\"~_PRESID\" xml:id=\"_conclusions__block_1__signature_2__role\">The President</role>\n" +
                "                    <person refersTo=\"\" xml:id=\"_conclusions__block_1__signature_2__person\">[...]</person>\n" +
                "                </signature>\n" +
                "            </block></conclusions>\n" +
                "    </bill>\n" +
                "</akomaNtoso>";
        LeosDocument doc = documentService.createDocumentFromContent(pkg.getName(),
                    "REG-clh5v2p720007ng28khrr03h7-en.xml", properties, "0.1.1", 3,
                    content.getBytes(StandardCharsets.UTF_8), "First version", USER_ID);
        assertNotNull(doc);
        Optional<Document> docT = documentRepository.findDocumentByRef(doc.getRef());
        assertTrue(docT.isPresent());
        Optional<DocumentVersion> docV = documentVersionRepository.findDocumentVersionByVersionLabelAndDocumentId(doc.getVersionLabel(),
                docT.get().getId());
        assertTrue(docV.isPresent());
        Optional<DocumentContent> docC = documentContentRepository.findDocumentContentByVersion(docV.get());
        assertTrue(docC.isPresent());
        LeosDocument lastVersion = documentService.findDocumentById(doc.getVersionId(), "BILL", true);
        assertEquals("jane", lastVersion.getCreatedBy());
        assertEquals("jane", lastVersion.getUpdatedBy());
        assertEquals("0.1.1", lastVersion.getVersionLabel());
        assertEquals("ORDINARY_LEGISLATIVE_PROC", doc.getMetadata().get("procedureType"));
        assertEquals("First version", lastVersion.getComments());
        assertTrue(lastVersion.getUpdatedOn().compareTo(lastVersion.getCreatedOn()) >= 0);
        assertTrue(Arrays.equals(lastVersion.getSource(), content.getBytes(StandardCharsets.UTF_8)));
        assertNotNull(doc.getMetadata().get("collaborators"));
        List<Collaborator> collaborators = (List<Collaborator>) doc.getMetadata().get("collaborators");
        assertEquals(collaborators.size(), 1);
        assertEquals(collaborators.get(0).getLogin(), "jane");
        assertEquals(collaborators.get(0).getRole(), "OWNER");
    }

    @Test
   
    public void test_createDocumentMilestoneFromContent() throws RepositoryException {
        Map<String, ?> properties = new HashMap() {{
            put("status", "IN_PREPARATION");
            put("containedDocuments", Arrays.asList("ANNEX-clfwd4ig3000h9256za2lfv6x-en.xml", "DIR-clfwc8tt900099256foj1l39z-en.xml",
                    "EXPL_MEMORANDUM-clfwc8sc60008925620y1bsfl-en.xml", "main-clfwc8rhf00079256x6j3x0t9-en.xml", "STAT_FINANC_LEGIS-clfwcle7j000a9256o4cvc2p6-en.xml"));
            put("category", "LEG");
            put("milestoneComments", Arrays.asList("For Interservice Consultation"));
            put("jobDate", ConversionUtils.getLeosDateAsString(new Date(), ConversionUtils.LEOS_REPO_DATE_FORMAT));
            put("initialCreationDate", ConversionUtils.getLeosDateAsString(new Date(), ConversionUtils.LEOS_REPO_DATE_FORMAT));
            put("initialCreatedBy", USER_ID);
            put ("name", "PROP_ACT-clilif9gy0000ro28zt8al0yh-en.leg");
            put("jobId", "230607113102710TBXAVVHGGP");
        }};
        byte[] content = TestUtils.getFileContent("/milestone/PROP_ACT-TEST-EN.leg");
        LeosDocument doc = documentService.createDocumentFromContent(pkg.getName(),
                "PROP_ACT-clilif9gy0000ro28zt8al0yh-en.leg", properties, "0.1.1", 3,
                content, "First version", USER_ID);
        assertNotNull(doc);
        Optional<DocumentMilestone> docMilestone = documentMilestoneRepository.findById(doc.getVersionId());
        assertTrue(docMilestone.isPresent());
        List<DocumentMilestoneList> milestonesDocuments =
                documentMilestoneListRepository.findDocumentMilestoneListsByMilestone(docMilestone.get());
        assertFalse(milestonesDocuments.isEmpty());
    }

    @Test
    @Transactional
    public void test_createDocumentFromSource() throws RepositoryException {
        Map<String, ?> properties = new HashMap() {{
            put("ref", "REG-clh5v2p720007ng28khrr03h7-en");
            put("collaborators", ConversionUtils.getLeosCollaboratorsAsLinkedHashMap(Arrays.asList(new Collaborator("jane", "OWNER", "DGT.R.3"),
                    new Collaborator("demo", "REVIEWER", "CNECT"))));
            put("eeaRelevance", "false");
            put ("docPurpose", "TEST ON SUBPARAGRAPHS AS INTRO");
            put("title", "Proposal for a REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL TEST ON SUBPARAGRAPHS AS INTRO");
            put("docType", "REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL");
            put("procedureType", "ORDINARY_LEGISLATIVE_PROC");
            put("language", "EN");
            put("initialCreatedBy", "jane");
            put("docTemplate", "BL-023");
            put("initialCreationDate", ConversionUtils.getLeosDateAsString(new Date(), ConversionUtils.LEOS_REPO_DATE_FORMAT));
            put("template", "SJ-023");
            put("category", "BILL");
            put("docStage", "Proposal for a");
        }};
        LeosDocument t = documentService.findTemplateByName("BL-023");
        assertNotNull(t);
        LeosDocument doc = documentService.createDocumentFromSource("BL-023", pkg.getName(),
                    "REG-clh5v2p720007ng28khrr03h7-en.xml", properties, "0.1.1", 3, "First version", USER_ID);
        assertNotNull(doc);
        Optional<Document> docT = documentRepository.findDocumentByRef(doc.getRef());
        assertTrue(docT.isPresent());
        Optional<DocumentVersion> docV = documentVersionRepository.findDocumentVersionByVersionLabelAndDocumentId(doc.getVersionLabel(),
                docT.get().getId());
        assertTrue(docV.isPresent());
        Optional<DocumentContent> docC = documentContentRepository.findDocumentContentByVersion(docV.get());
        assertTrue(docC.isPresent());
        doc = documentService.findDocumentById(doc.getVersionId(), "BILL", true);
        assertEquals("jane", doc.getCreatedBy());
        assertEquals("jane", doc.getUpdatedBy());
        assertEquals("0.1.1", doc.getVersionLabel());
        assertEquals("ORDINARY_LEGISLATIVE_PROC", doc.getMetadata().get("procedureType"));
        assertEquals("First version", doc.getComments());
        assertTrue(doc.getUpdatedOn().compareTo(doc.getCreatedOn()) >= 0);
        assertTrue(new String(doc.getSource()).equals(new String(t.getSource())));
        assertNotNull(doc.getMetadata().get("collaborators"));
        List<Collaborator> collaborators = (List<Collaborator>) doc.getMetadata().get("collaborators");
        assertEquals(collaborators.size(), 2);
        assertEquals(collaborators.get(0).getLogin(), "jane");
        assertEquals(collaborators.get(0).getRole(), "OWNER");
    }

    @Test
   
    public void test_searchDocument() throws RepositoryException {
        LeosDocument doc = docCreation();
        Optional<LeosDocument> docOpt = documentService.findDocumentByName(doc.getName());
        assertNotNull(docOpt);
        assertTrue(docOpt.isPresent());
        LeosDocument newDoc = docOpt.get();
        assertEquals(newDoc.getName(), doc.getName());
        assertTrue(Arrays.equals(newDoc.getSource(), doc.getSource()));
        assertEquals(newDoc.getRef(), doc.getRef());
        assertEquals(newDoc.getCategory(), doc.getCategory());
        assertEquals(pkg.getId(), newDoc.getPackageId());
    }

    @Test
    public void test_searchDocumentWithFilter() throws RepositoryException {
        LeosDocument doc = docCreation();
        QueryFilter filter = new QueryFilter();
        filter.addFilter(new QueryFilter.Filter("procedureType", "IN", true, "ORDINARY_LEGISLATIVE_PROC"
                , "SPECIAL_LEGISLATIVE_ACTS", "COMMISSION_LEGAL_ACTS", "COUNCIL_LEGAL_ACTS", "COUNCIL_INTERNAL_DOCUMENT"));
        filter.addFilter(new QueryFilter.Filter("template", "IN", true, "SJ-019"
                , "SJ-023"));
        Set<String> categories = Sets.set("PROPOSAL");
        List<LeosDocument> docs = documentService.findDocumentsUsingFilter("%", categories, filter, 0, 5, false);
        assertEquals(docs.size(), 1);
        assertEquals(docs.get(0).getMetadata().get("procedureType"), "ORDINARY_LEGISLATIVE_PROC");
        assertEquals(docs.get(0).getCategory(), "PROPOSAL");
    }

    @Test
    public void test_searchDocumentWithFilterInPackage() throws RepositoryException {
        LeosDocument doc = docCreation();
        QueryFilter filter = new QueryFilter();
        filter.addFilter(new QueryFilter.Filter("procedureType", "IN", true, "ORDINARY_LEGISLATIVE_PROC"
                , "SPECIAL_LEGISLATIVE_ACTS", "COMMISSION_LEGAL_ACTS", "COUNCIL_LEGAL_ACTS", "COUNCIL_INTERNAL_DOCUMENT"));
        filter.addFilter(new QueryFilter.Filter("template", "IN", true, "SJ-019"
                , "SJ-023"));
        Set<String> categories = Sets.set("PROPOSAL");
        List<LeosDocument> docs = documentService.findDocumentsUsingFilter("package_leos", categories, filter, 0, 5, false);
        assertEquals(docs.size(), 1);
        assertEquals(docs.get(0).getMetadata().get("procedureType"), "ORDINARY_LEGISLATIVE_PROC");
        assertEquals(docs.get(0).getCategory(), "PROPOSAL");
    }

    @Test
    public void test_countDocumentWithFilter() throws RepositoryException {
        LeosDocument doc = docCreation();
        QueryFilter filter = new QueryFilter();
        filter.addFilter(new QueryFilter.Filter("procedureType", "IN", true, "ORDINARY_LEGISLATIVE_PROC"
                , "SPECIAL_LEGISLATIVE_ACTS", "COMMISSION_LEGAL_ACTS", "COUNCIL_LEGAL_ACTS", "COUNCIL_INTERNAL_DOCUMENT"));
        filter.addFilter(new QueryFilter.Filter("template", "IN", true, "SJ-019"
                , "SJ-023"));
        Set<String> categories = Sets.set("PROPOSAL");
        long count = documentService.countDocumentsUsingFilter("%", categories, filter);
        assertEquals(count, 1);
    }

    @Test
    public void test_countDocumentWithFilterInPackage() throws RepositoryException {
        LeosDocument doc = docCreation();
        QueryFilter filter = new QueryFilter();
        filter.addFilter(new QueryFilter.Filter("procedureType", "IN", true, "ORDINARY_LEGISLATIVE_PROC"
                , "SPECIAL_LEGISLATIVE_ACTS", "COMMISSION_LEGAL_ACTS", "COUNCIL_LEGAL_ACTS", "COUNCIL_INTERNAL_DOCUMENT"));
        filter.addFilter(new QueryFilter.Filter("template", "IN", true, "SJ-019"
                , "SJ-023"));
        Set<String> categories = Sets.set("PROPOSAL");
        long count = documentService.countDocumentsUsingFilter("package_leos", categories, filter);

        assertEquals(count, 1);
    }

    @Test
    public void test_searchDocumentWithFilterRole() throws RepositoryException {
        LeosDocument doc = docCreation();
        QueryFilter filter = new QueryFilter();
        filter.addFilter(new QueryFilter.Filter("procedureType", "IN", true, "ORDINARY_LEGISLATIVE_PROC"
                , "SPECIAL_LEGISLATIVE_ACTS", "COMMISSION_LEGAL_ACTS", "COUNCIL_LEGAL_ACTS", "COUNCIL_INTERNAL_DOCUMENT"));
        filter.addFilter(new QueryFilter.Filter("template", "IN", true, "SJ-019"
                , "SJ-023"));
        filter.addFilter(new QueryFilter.Filter("role", "IN", false, "demo::OWNER::DGT.R.3"
                , "demo::CONTRIBUTOR::DGT.R.3", "demo::REVIEWER::DGT.R.3", "demo::OWNER"
                , "demo::CONTRIBUTOR", "demo::REVIEWER"));
        Set<String> categories = Sets.set("PROPOSAL");
        filter.addSortOrder(new QueryFilter.SortOrder(QueryFilter.FilterType.lastModificationDate.name(), QueryFilter.SORT_DESCENDING));

        List<LeosDocument> docs = documentService.findDocumentsUsingFilter("%", categories, filter, 0, 5, false);
        assertEquals(1, docs.size());
        assertEquals("ORDINARY_LEGISLATIVE_PROC", docs.get(0).getMetadata().get("procedureType"));
        assertEquals("PROPOSAL", docs.get(0).getCategory());
    }

    @Test
    public void test_updateDocument() throws Exception {
        String newTitle = "New Title";
        LeosDocument doc = docCreation();
        Map<String, Object> properties = new HashMap();
        properties.putAll(doc.getMetadata());
        List<Collaborator> collaborators = (List<Collaborator>) doc.getMetadata().get("collaborators");
        properties.put("collaborators", ConversionUtils.getLeosCollaboratorsAsLinkedHashMap(collaborators));
        properties.put("title", newTitle);
        String content = "<akomaNtoso xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\" xmlns:leos=\"urn:eu:europa:ec:leos\">\n" +
                "    <bill name=\"REG\">\n" +
                "        <meta>\n" +
                "            <identification source=\"~_COM\">\n" +
                "                <FRBRWork>\n" +
                "                    <FRBRthis value=\"\"/>\n" +
                "                    <FRBRuri value=\"\"/>\n" +
                "                    <FRBRdate date=\"2999-01-01\" name=\"\"/>\n" +
                "                    <FRBRauthor href=\"\"/>\n" +
                "                    <FRBRcountry value=\"EU\"/>\n" +
                "                    <FRBRprescriptive value=\"true\"/>\n" +
                "                </FRBRWork>\n" +
                "                <FRBRExpression>\n" +
                "                    <FRBRthis value=\"\"/>\n" +
                "                    <FRBRuri value=\"\"/>\n" +
                "                    <FRBRdate date=\"2999-01-01\" name=\"\"/>\n" +
                "                    <FRBRauthor href=\"\"/>\n" +
                "                    <FRBRlanguage language=\"en\" xml:id=\"_FRBRlanguage\"/>\n" +
                "                </FRBRExpression>\n" +
                "                <FRBRManifestation>\n" +
                "                    <FRBRthis value=\"\"/>\n" +
                "                    <FRBRuri value=\"\"/>\n" +
                "                    <FRBRdate date=\"2999-01-01\" name=\"\"/>\n" +
                "                    <FRBRauthor href=\"\"/>\n" +
                "\t\t\t\t\t<preservation xmlns:akn4eu=\"http://imfc.europa.eu/akn4eu\">\n" +
                "                \t\t<akn4eu:akn4euVersion value=\"4.0.0.0\"/>\n" +
                "                \t</preservation>\n" +
                "                </FRBRManifestation>\n" +
                "            </identification>\n" +
                "            <references source=\"~_COM\">\n" +
                "                <TLCLocation href=\"http://publications.europa.eu/resource/authority/place/BEL_BRU\" showAs=\"Brussels\" xml:id=\"_BEL_BRU\"/>\n" +
                "                <TLCOrganization href=\"http://publications.europa.eu/resource/authority/corporate-body/CONSIL\" showAs=\"Council of the European Union\" xml:id=\"_CONSIL\"/>\n" +
                "                <TLCOrganization href=\"http://publications.europa.eu/resource/authority/corporate-body/EP\" showAs=\"European Parliament\" xml:id=\"_EP\"/>\n" +
                "                <TLCOrganization href=\"http://publications.europa.eu/resource/authority/corporate-body/COM\" showAs=\"European Commission\" xml:id=\"_COM\"/>\n" +
                "                <TLCRole href=\"http://publications.europa.eu/resource/authority/role/PRESID\" showAs=\"President\" xml:id=\"_PRESID\"/>\n" +
                "                <TLCReference href=\"http://publications.europa.eu/resource/authority/resource-type/REG\" name=\"docType\" showAs=\"Regulation\" xml:id=\"_REG\"/>\n" +
                "                <TLCReference href=\"http://eurovoc.europa.eu/5456\" name=\"contentSubject\" showAs=\"Legal basis\" xml:id=\"_legalBasis\"/>\n" +
                "                <TLCReference href=\"http://publications.europa.eu/resource/authority/language/ENG\" name=\"language\" showAs=\"en\" xml:id=\"_language\"/>\n" +
                "                <TLCReference href=\"http://eur-lex.europa.eu/procedure/EN/YYYY_NNN\" name=\"procedureReference\" shortForm=\"YYYY/NNN/AAA\" showAs=\"YYYY/NNNN (AAA)\" xml:id=\"_procedure_YYYY_NNN\"/>\n" +
                "                <TLCReference href=\"http://publications.europa.eu/resource/authority/document-identifier-format/COM_NUMBER\" name=\"identifier\" shortForm=\"AAA/YYYY/NNN\" showAs=\"AAA(YYYY) NNN\" xml:id=\"_azs3y\"/>\n" +
                "                <TLCConcept href=\"http://publications.europa.eu/resource/subdivision-content/ART_DEF\" showAs=\"Article on definitions\" xml:id=\"_ART_DEF\"/>\n" +
                "            </references>\n" +
                "            <proprietary source=\"~_leos\">\n" +
                "                <leos:templateVersion>2.1.0</leos:templateVersion>\n" +
                "                <leos:docVersion>0.1.0</leos:docVersion>\n" +
                "                <leos:template>SJ-023</leos:template>\n" +
                "                <leos:docTemplate>BL-023</leos:docTemplate>\n" +
                "            <leos:docPurpose xml:id=\"_proprietary__docpurpose\">TEST ON SUBPARAGRAPHS AS INTRO</leos:docPurpose><leos:docStage xml:id=\"_proprietary__docstage\">Proposal for a</leos:docStage><leos:ref>REG-clh5v2p720007ng28khrr03h7-en</leos:ref><leos:docType xml:id=\"_proprietary__doctype\">REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL</leos:docType><leos:objectId/></proprietary>\n" +
                "        </meta>\n" +
                "        <preface xml:id=\"_preface\"><container name=\"procedureIdentifier\" xml:id=\"_preface__procedureIdentifier\">\n" +
                "                <p xml:id=\"_preface__procedureIdentifier__p\">\n" +
                "                    <docketNumber refersTo=\"~_procedure_YYYY_NNN\" xml:id=\"_preface__procedureIdentifier__p__docketNumber\"/>\n" +
                "                </p>\n" +
                "            </container><longTitle xml:id=\"_preface__longtitle\">\n" +
                "                <p xml:id=\"_preface__longtitle__p\">\n" +
                "                    <docStage xml:id=\"_preface__longtitle__p__docstage\">Proposal for a</docStage>\n" +
                "                    <docType refersTo=\"~_REG\" xml:id=\"_preface__longtitle__p__doctype\">REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL</docType>\n" +
                "                    <docPurpose xml:id=\"_preface__longtitle__p__docpurpose\">TEST ON SUBPARAGRAPHS AS INTRO</docPurpose>\n" +
                "                </p>\n" +
                "            </longTitle></preface>\n" +
                "        <preamble xml:id=\"_preamble\"><formula name=\"actingEntity\" xml:id=\"_preamble__formula_1\"><p xml:id=\"_preamble__formula_1__p\">THE EUROPEAN PARLIAMENT AND THE COUNCIL OF THE EUROPEAN UNION,</p></formula><citations leos:editable=\"false\" xml:id=\"_cits\"><citation leos:editable=\"true\" refersTo=\"~_legalBasis\" xml:id=\"_cit_1\"><p xml:id=\"_cit_1__p\">Having regard to the Treaty on the Functioning of the European Union, and in particular Article [...] thereof,</p></citation><citation leos:editable=\"true\" xml:id=\"_cit_2\"><p xml:id=\"_cit_2__p\">Having regard to the proposal from the European Commission,</p></citation><citation leos:editable=\"true\" xml:id=\"_cit_3\"><p xml:id=\"_cit_3__p\">After transmission of the draft legislative act to the national Parliaments,</p></citation><citation leos:editable=\"true\" xml:id=\"_cit_4\"><p xml:id=\"_cit_4__p\">Having regard to the opinion of the European Economic and Social Committee<authorialNote marker=\"1\" placement=\"bottom\" xml:id=\"_authorialnote_1\"><p xml:id=\"_authorialNote_1__p\">OJ C [...], [...], p. [...]</p></authorialNote>,</p></citation><citation leos:editable=\"true\" xml:id=\"_cit_5\"><p xml:id=\"_cit_5__p\">Having regard to the opinion of the Committee of the Regions<authorialNote marker=\"2\" placement=\"bottom\" xml:id=\"_authorialnote_2\"><p xml:id=\"_authorialNote_2__p\">OJ C [...], [...], p. [...]</p></authorialNote>,</p></citation><citation leos:editable=\"true\" xml:id=\"_cit_6\"><p xml:id=\"_cit_6__p\">Acting in accordance with the ordinary legislative procedure,</p></citation></citations><recitals leos:editable=\"false\" xml:id=\"_recs\"><intro xml:id=\"_recitalsIntro\"><p xml:id=\"_recs_intro\">Whereas:</p></intro><recital leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_rec_d1e87_yDZ4Zl\"><num xml:id=\"_recs_XCsSrR\">(1)</num><p xml:id=\"_recs_ulxeEc\">The G-20 Declaration of 2 April 2009 on Strengthening of the Financial System called for internationally consistent efforts that are aimed at strengthening transparency, accountability and regulation by improving the quantity and quality of capital in the banking system once the economic recovery is assured. That declaration also called for introduction of a supplementary non-risk based measure to contain the build-up of leverage in the banking system, and the development of a framework for stronger liquidity buffers. In response to the mandate given by the G-20, in September 2009 the Group of Central Bank Governors and Heads of Supervision (GHOS), agreed on a number of measures to strengthen the regulation of the banking sector. Those measures were endorsed by the G-20 leaders at their Pittsburgh Summit of 24-25 September 2009 and were set out in detail in December 2009. In July and September 2010, GHOS issued two further announcements on design and calibration of those new measures, and in December 2010, the Basel Committee on Banking Supervision (BCBS) published the final measures, that are referred to as the Basel III framework.</p></recital><recital leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_rec_d1e102_XaJ7NE\"><num xml:id=\"_recs_JEhFHz\">(2)</num><p xml:id=\"_recs_3OXO70\">The High Level Group on Financial Supervision in the EU chaired by Jacques de LarosiÃ¨re (the \"de LarosiÃ¨re group\") invited the Union to develop a more harmonised set of financial regulations. In the context of the future European supervisory architecture, the European Council of 18 and 19 June 2009 also stressed the need to establish a 'European Single Rule Book' applicable to all credit institutions and investment firms in the internal market.</p></recital><recital leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_rec_d1e123_u3HqXn\"><num xml:id=\"_recs_Iu05Xc\">(3)</num><p xml:id=\"_recs_xOYg00\">As stated in the de LarosiÃ¨re group's report of 25 February 2009 (the \"de LarosiÃ¨re report\"), \"a Member State should be able to adopt more stringent national regulatory measures considered to be domestically appropriate for safeguarding financial stability as long as the principles of the internal market and agreed minimum core standards are respected\".</p></recital><recital leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_rec_d1e140_6fumxe\"><num xml:id=\"_recs_MAIeaf\">(4)</num><p xml:id=\"_recs_hWTdCU\">Directive 2006/48/EC of the European Parliament and of the Council of 14 June 2006 relating to the taking up and pursuit of the business of credit institutions<authorialNote marker=\"3\" placement=\"bottom\" xml:id=\"_recs_GxwEi4\"><p xml:id=\"_recs_47tCGA\">OJ L 177, 30.6.2006, p. 1.</p></authorialNote> and Directive 2006/49/EC of the European Parliament and of the Council of 14 June 2006 on the capital adequacy of investment firms and credit institutions<authorialNote marker=\"4\" placement=\"bottom\" xml:id=\"_recs_CKfi1V\"><p xml:id=\"_recs_hAHO4G\">OJ L 177, 30.6.2006, p. 201.</p></authorialNote> have been significantly amended on several occasions. Many provisions of Directives 2006/48/EC and 2006/49/EC are applicable to both credit institutions and investment firms. For the sake of clarity and in order to ensure a coherent application of those provisions, they should be merged into new legislative acts that are applicable to both credit institutions and investment firms, namely this Regulation and Directive 2013/36/EU of the European Parliament and of the Council<authorialNote marker=\"5\" placement=\"bottom\" xml:id=\"_recs_UA0WBT\"><p xml:id=\"_recs_vZjFbO\">See page 338 of this Official Journal.</p></authorialNote>. For greater accessibility, the provisions of the Annexes to Directives 2006/48/EC and 2006/49/EC should be integrated into the enacting terms of Directive 2013/36/EU and this Regulation.</p></recital><recital leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_rec_d1e171_Wh4gEw\"><num xml:id=\"_recs_98Inku\">(5)</num><p xml:id=\"_recs_obh6wx\">Together, this Regulation and Directive 2013/36/EU should form the legal framework governing the access to the activity, the supervisory framework and the prudential rules for credit institutions and investment firms (referred to collectively as \"institutions\"). This Regulation should therefore be read together with that Directive</p></recital><recital leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_rec_d1e181_U27toi\"><num xml:id=\"_recs_lkQnin\">(6)</num><p xml:id=\"_recs_hHh6R0\">Directive 2013/36/EU, based on Article 53(1) of the Treaty on the Functioning of the European Union (TFEU), should, inter alia, contain the provisions concerning the access to the activity of institutions, the modalities for their governance, and their supervisory framework, such as provisions governing the authorisation of the business, the acquisition of qualifying holdings, the exercise of the freedom of establishment and of the freedom to provide services, the powers of the competent authorities of the home and the host Member States in this regard and the provisions governing the initial capital and the supervisory review of institutions.</p></recital></recitals><formula name=\"enactingFormula\" xml:id=\"_preamble__formula_2\"><p xml:id=\"_preamble__formula_2__p\">HAVE ADOPTED THIS REGULATION:</p></formula></preamble>\n" +
                "        <body xml:id=\"_body\"><article leos:autonumbering=\"true\" leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_art_1\"><num leos:editable=\"false\" xml:id=\"_art_1__num\">Article 1</num><heading xml:id=\"_art_1__heading\">Scope</heading><paragraph xml:id=\"_art_1__para_1\"><num xml:id=\"_art_1__para_1__num\">1.</num><list xml:id=\"_art_1_geFV8v\"><subparagraph refersTo=\"~_INP\" xml:id=\"_art_1_9QazpL\"><content xml:id=\"_art_1__para_1__content\"><p xml:id=\"_art_1__para_1__content__p\">This a custom article.</p></content></subparagraph><point xml:id=\"_art_1_SHnaUi\"><num xml:id=\"_art_1_AXTACj\">(a)</num><content xml:id=\"_art_1_XN3rWq\"><p xml:id=\"_art_1_FPpGfE\">First point</p></content></point><point xml:id=\"_art_1_iTVvtl\"><num xml:id=\"_art_1_dRmzE0\">(b)</num><list xml:id=\"_art_1_kSgdA1\"><subparagraph refersTo=\"~_INP\" xml:id=\"_art_1_H6p1HX\"><content xml:id=\"_art_1_GS0DdI\"><p xml:id=\"_art_1_eXY3hF\">Second point</p></content></subparagraph><point xml:id=\"_art_1_F93I9z\"><num xml:id=\"_art_1_ZqC4os\">(i)</num><subparagraph xml:id=\"_art_1_Mh9DZe\"><content xml:id=\"_art_1_w1YbyI\"><p xml:id=\"_art_1_R8N7Td\">ThirdÂ point</p></content></subparagraph><list xml:id=\"_art_1_jI1hMO\"><subparagraph refersTo=\"~_INP\" xml:id=\"_art_1_sf68he\"><content xml:id=\"_art_1_8FSQqS\"><p xml:id=\"_art_1_EpY1x9\">This a subparagraph</p></content></subparagraph><point xml:id=\"_art_1_AW7mmk\"><num xml:id=\"_art_1_jwMvmL\">(1)</num><list xml:id=\"_art_1_muTM7F\"><subparagraph refersTo=\"~_INP\" xml:id=\"_art_1_QrNUIS\"><content xml:id=\"_art_1_HETZsY\"><p xml:id=\"_art_1_f4OEmt\">Fourth point</p></content></subparagraph><indent xml:id=\"_art_1_9s4ttT\"><num xml:id=\"_art_1_voHCfe\">-</num><content xml:id=\"_art_1_rCBV4d\"><p xml:id=\"_art_1_k4tadc\">Fifth point</p></content></indent><indent xml:id=\"_art_1_yaLnZJ\"><num xml:id=\"_art_1_s5BMgC\">-</num><content xml:id=\"_art_1_nULcgG\"><p xml:id=\"_art_1_ZQobfc\">Sixth point</p></content></indent></list></point><point xml:id=\"_art_1_eKKPn2\"><num xml:id=\"_art_1_FSGx3w\">(2)</num><content xml:id=\"_art_1_9fpI8j\"><p xml:id=\"_art_1_gOZi4q\">Seventh point</p></content></point></list></point><point xml:id=\"_art_1_HoMy6w\"><num xml:id=\"_art_1_FMxDhW\">(ii)</num><content xml:id=\"_art_1_QFdcr3\"><p xml:id=\"_art_1_EIYM9P\">Eighth point</p></content></point></list></point><point xml:id=\"_art_1_aIbX3e\"><num xml:id=\"_art_1_KYwp8p\">(c)</num><content xml:id=\"_art_1_Sz0b9M\"><p xml:id=\"_art_1_rhD89v\">Ninth point</p></content></point></list></paragraph></article><article xml:id=\"__akn_article_hzxjht\"><num leos:editable=\"false\" xml:id=\"__akn_article_hzxjht_hFjWXc\">Article 2</num><heading xml:id=\"__akn_article_hzxjht_fgAYSz\">This is another custom article</heading><paragraph xml:id=\"__akn_article_hzxjht-par1\"><num xml:id=\"__akn_article_hzxjht_aJZ16Y\">1.</num><list xml:id=\"__akn_article_hzxjht_OnUIxn\"><subparagraph refersTo=\"~_INP\" xml:id=\"__akn_article_hzxjht_rQlOr2\"><content xml:id=\"__akn_article_hzxjht_LRnBuU\"><p xml:id=\"__akn_article_hzxjht_7pjIlC\">This is a custom article</p></content></subparagraph><point xml:id=\"__akn_article_hzxjht_SX6Wnt\"><num xml:id=\"__akn_article_hzxjht_VRV5uJ\">(a)</num><content xml:id=\"__akn_article_hzxjht_QCnF8X\"><p xml:id=\"__akn_article_hzxjht_gXycDf\">First point</p></content></point><point xml:id=\"__akn_article_hzxjht_CsvjQW\"><num xml:id=\"__akn_article_hzxjht_wWtx4s\">(b)</num><subparagraph xml:id=\"__akn_article_hzxjht_Z28up8\"><content xml:id=\"__akn_article_hzxjht_PxB8cw\"><p xml:id=\"__akn_article_hzxjht_FYV82j\">Second point</p></content></subparagraph><subparagraph xml:id=\"__akn_article_hzxjht_uuUspu\"><content xml:id=\"__akn_article_hzxjht_St6ZDw\"><p xml:id=\"__akn_article_hzxjht_YHS3kS\">Subparagraph</p></content></subparagraph></point></list></paragraph></article><article leos:autonumbering=\"true\" leos:deletable=\"true\" leos:editable=\"true\" refersTo=\"~_ART_DEF\" xml:id=\"_art_definitions\"><num leos:editable=\"false\" xml:id=\"_art_definitions__num\">Article 3</num><heading xml:id=\"_art_definitions_heading\">This a custom definitions'article</heading><paragraph xml:id=\"_art_definitions__para_1\"><list xml:id=\"_art_definitions_LeuEaR\"><subparagraph refersTo=\"~_INP\" xml:id=\"_art_definitions_1W34RQ\"><content xml:id=\"_art_definitions__para_1__content\"><p xml:id=\"_art_definitions__para_1__content__p\">First Definition:</p></content></subparagraph><point xml:id=\"_art_definitions_nKs23b\"><num xml:id=\"_art_definitions_ni8c8y\">(1)</num><content xml:id=\"_art_definitions_fWqT0p\"><p xml:id=\"_art_definitions_04YNrk\">First point of first definition</p></content></point><point xml:id=\"_art_definitions_a4EgBD\"><num xml:id=\"_art_definitions_pfOZXa\">(2)</num><content xml:id=\"_art_definitions_rxFETG\"><p xml:id=\"_art_definitions_fXWjBW\">Second point of first definition</p></content></point><point xml:id=\"_art_definitions_BPcicX\"><num xml:id=\"_art_definitions_aYiudH\">(3)</num><content xml:id=\"_art_definitions_qBrHcK\"><p xml:id=\"_art_definitions_Jk3bog\">Third point of first definition</p></content></point></list></paragraph><paragraph xml:id=\"_art_definitions_VDNHWQ\"><content xml:id=\"_art_definitions_EEo5dt\"><p xml:id=\"_art_definitions_sePP8N\">Second definition</p></content></paragraph></article><article leos:autonumbering=\"true\" leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_art_3\"><num leos:editable=\"false\" xml:id=\"_art_3__num\">Article 4</num><heading xml:id=\"_art_3__heading\">Entry into force</heading><paragraph xml:id=\"_art_3__para_1\">\n" +
                "                    <content xml:id=\"_art_3__para_1__content\">\n" +
                "                        <p xml:id=\"_art_3__para_1__content__p\">This Regulation shall enter into force on the [...] day following that of its publication in the <i xml:id=\"_art_3__para_1__content__p__i\">Official Journal of the European Union</i>.</p>\n" +
                "                    </content>\n" +
                "                </paragraph></article><article leos:deletable=\"true\" leos:editable=\"true\" refersTo=\"~_ART_DEF\" xml:id=\"_imp_art_d1e2906_LwbJdq\"><num xml:id=\"_imp_art_d1e2906_LwbJdq_Yg3FEZ\">Article 5</num><heading xml:id=\"_imp_art_d1e2906_LwbJdq_IjvaEH\">Definitions specific to capital requirements for credit risk</heading><paragraph xml:id=\"_imp_art_d1e2906_LwbJdq_Md10Ef\"><list xml:id=\"_imp_art_d1e2906_LwbJdq_WcPVHw\"><subparagraph refersTo=\"~_INP\" xml:id=\"_imp_art_d1e2906_LwbJdq_4jgd6m\"><content xml:id=\"_imp_art_d1e2906_LwbJdq_bvn4xT\"><p xml:id=\"_imp_art_d1e2906_LwbJdq_Mbecjg\">For the purposes of Part Three, Title II, the following definitions shall apply:</p></content></subparagraph><point xml:id=\"_imp_art_d1e2906_LwbJdq_AzuKIe\"><num xml:id=\"_imp_art_d1e2906_LwbJdq_WZeZNA\">(1)</num><content xml:id=\"_imp_art_d1e2906_LwbJdq_qvtvkD\"><p xml:id=\"_imp_art_d1e2906_LwbJdq_2vFOU6\">'exposure' means an asset or off-balance sheet item;</p></content></point><point xml:id=\"_imp_art_d1e2906_LwbJdq_d9ZKDr\"><num xml:id=\"_imp_art_d1e2906_LwbJdq_G4AvCk\">(2)</num><content xml:id=\"_imp_art_d1e2906_LwbJdq_Jhe0Cy\"><p xml:id=\"_imp_art_d1e2906_LwbJdq_8wHnvT\">'loss' means economic loss, including material discount effects, and material direct and indirect costs associated with collecting on the instrument;</p></content></point><point xml:id=\"_imp_art_d1e2906_LwbJdq_Gwkf1R\"><num xml:id=\"_imp_art_d1e2906_LwbJdq_C2oju6\">(3)</num><content xml:id=\"_imp_art_d1e2906_LwbJdq_YpAXY7\"><p xml:id=\"_imp_art_d1e2906_LwbJdq_p2kYaw\">'expected loss' or 'EL' means the ratio of the amount expected to be lost on an exposure from a potential default of a counterparty or dilution over a one year period to the amount outstanding at default.</p></content></point></list></paragraph></article><article leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_art_d1e3059_Z7uv35\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_ies6QN\">Article 6</num><heading xml:id=\"_imp_art_d1e3059_Z7uv35_q8SPlv\">Derogation to the application of liquidity requirements on an individual basis</heading><paragraph xml:id=\"_imp_art_d1e3059_Z7uv35_MWSJ0w\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_hMtOUZ\">1.</num><list xml:id=\"_imp_art_d1e3059_Z7uv35_dtZk06\"><subparagraph refersTo=\"~_INP\" xml:id=\"_imp_art_d1e3059_Z7uv35_u3EJ2l\"><content xml:id=\"_imp_art_d1e3059_Z7uv35_0mJ4nP\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_BxqVm7\">The competent authorities may waive in full or in part the application of Part Six to an institution and to all or some of its subsidiaries in the Union and supervise them as a single liquidity sub-group so long as they fulfil all of the following conditions:</p></content></subparagraph><point xml:id=\"_imp_art_d1e3059_Z7uv35_9R39fK\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_BLioV7\">(a)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_IxKXGT\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_ll4LyA\">the parent institution on a consolidated basis or a subsidiary institution on a sub-consolidated basis complies with the obligations laid down in Part Six;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_CtMujS\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_Jska5n\">(b)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_mW1evj\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_y4a2Sd\">the parent institution on a consolidated basis or the subsidiary institution on a sub-consolidated basis monitors and has oversight at all times over the liquidity positions of all institutions within the group or sub-group, that are subject to the waiver and ensures a sufficient level of liquidity for all of these institutions;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_546qJM\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_SqQ8VU\">(c)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_N1AJS0\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_MdWlhP\">the institutions have entered into contracts that, to the satisfaction of the competent authorities, provide for the free movement of funds between them to enable them to meet their individual and joint obligations as they come due;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_S1rdZv\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_AIT4og\">(d)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_eA5knH\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_UAXgmj\">there is no current or foreseen material practical or legal impediment to the fulfilment of the contracts referred to in (c).</p></content></point><subparagraph refersTo=\"~_WRP\" xml:id=\"_imp_art_d1e3059_Z7uv35_ZAN3q8\"><content xml:id=\"_imp_art_d1e3059_Z7uv35_rSo5JT\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_GQ4IyZ\">By 1 January 2014 the Commission shall report to the European Parliament and the Council on any legal obstacles which are capable of rendering impossible the application of point (c) of the first subparagraph and is invited to make a legislative proposal, if appropriate, by 31 December 2015 on which of those obstacles should be removed.</p></content></subparagraph></list></paragraph><paragraph xml:id=\"_imp_art_d1e3059_Z7uv35_EzoMrm\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_AuFmw9\">2.</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_cH4ewI\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_Qpdpnq\">The competent authorities may waive in full or in part the application of Part Six to an institution and to all or some of its subsidiaries where all institutions of the single liquidity sub-group are authorised in the same Member State and provided that the conditions in paragraph 1 are fulfilled.</p></content></paragraph><paragraph xml:id=\"_imp_art_d1e3059_Z7uv35_jtezEw\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_y1k4AL\">3.</num><list xml:id=\"_imp_art_d1e3059_Z7uv35_KScj9w\"><subparagraph refersTo=\"~_INP\" xml:id=\"_imp_art_d1e3059_Z7uv35_XKNETv\"><content xml:id=\"_imp_art_d1e3059_Z7uv35_g3d4hy\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_QZ34tb\">Where institutions of the single liquidity sub-group are authorised in several Member States, paragraph 1 shall only be applied after following the procedure laid down in Article 21 and only to the institutions whose competent authorities agree about the following elements:</p></content></subparagraph><point xml:id=\"_imp_art_d1e3059_Z7uv35_B9LT9N\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_BDBgGS\">(a)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_Lnmmvo\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_vX1YKy\">their assessment of the compliance of the organisation and of the treatment of liquidity risk with the conditions set out in Article 86 of Directive 2013/36/EU across the single liquidity sub-group;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_ZA2kEN\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_NlU4Um\">(b)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_AzA3PH\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_1SgFmb\">the distribution of amounts, location and ownership of the required liquid assets to be held within the single liquidity sub-group;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_j62xFv\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_WOP7PF\">(c)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_ySMimG\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_h8HIAT\">the determination of minimum amounts of liquid assets to be held by institutions for which the application of Part Six will be waived;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_G2xok3\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_tiVheH\">(d)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_ZKsSOS\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_HhvqfH\">the need for stricter parameters than those set out in Part Six;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_jjPic6\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_vk9dH5\">(e)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_mi23EY\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_ca2g6j\">unrestricted sharing of complete information between the competent authorities;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_HyMmk0\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_ZdG8cD\">(f)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_95Uu1Q\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_Q1rLLw\">a full understanding of the implications of such a waiver.</p></content></point></list></paragraph><paragraph xml:id=\"_imp_art_d1e3059_Z7uv35_5rOUce\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_KoKpox\">4.</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_fg09r0\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_wrcElq\">Competent authorities may also apply paragraphs 1, 2 and 3 to institutions which are members of the same institutional protection scheme referred to in Article 113(7)(b), provided that they meet all the conditions laid down in Article 113(7), and to other institutions linked by a relationship referred to in Article 113(6) provided that they meet all the conditions laid down therein. Competent authorities shall in that case determine one of the institutions subject to the waiver to meet Part Six on the basis of the consolidated situation of all institutions of the single liquidity sub-group.</p></content></paragraph><paragraph xml:id=\"_imp_art_d1e3059_Z7uv35_iDYEvF\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_qGmvdk\">5.</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_ZLQjNB\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_3WLcVC\">Where a waiver has been granted under paragraph 1 or paragraph 2, the competent authorities may also apply Article 86 of Directive 2013/36/EU, or parts thereof, at the level of the single liquidity sub-group and waive the application of Article 86 of Directive 2013/36/EU, or parts thereof, on an individual basis.</p></content></paragraph></article><article leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_art_d1e3182_mIryFf\"><num xml:id=\"_imp_art_d1e3182_mIryFf_Gyc8Mr\">Article 7</num><heading xml:id=\"_imp_art_d1e3182_mIryFf_PNS8r9\">Waiver for credit institutions permanently affiliated to a central body</heading><paragraph xml:id=\"_imp_art_d1e3182_mIryFf_pukrNM\"><num xml:id=\"_imp_art_d1e3182_mIryFf_CdEbd3\">1.</num><list xml:id=\"_imp_art_d1e3182_mIryFf_gzYfkO\"><subparagraph refersTo=\"~_INP\" xml:id=\"_imp_art_d1e3182_mIryFf_jHtJmK\"><content xml:id=\"_imp_art_d1e3182_mIryFf_8tAhA2\"><p xml:id=\"_imp_art_d1e3182_mIryFf_94BE5x\">Competent authorities may, in accordance with national law, partially or fully waive the application of the requirements set out in Parts Two to Eight to one or more credit institutions situated in the same Member State and which are permanently affiliated to a central body which supervises them and which is established in the same Member State, if the following conditions are met:</p></content></subparagraph><point xml:id=\"_imp_art_d1e3182_mIryFf_dMxdMz\"><num xml:id=\"_imp_art_d1e3182_mIryFf_exQEDc\">(a)</num><content xml:id=\"_imp_art_d1e3182_mIryFf_7EcfQV\"><p xml:id=\"_imp_art_d1e3182_mIryFf_OLVwAp\">the commitments of the central body and affiliated institutions are joint and several liabilities or the commitments of its affiliated institutions are entirely guaranteed by the central body;</p></content></point><point xml:id=\"_imp_art_d1e3182_mIryFf_QIStxi\"><num xml:id=\"_imp_art_d1e3182_mIryFf_jhG7uM\">(b)</num><content xml:id=\"_imp_art_d1e3182_mIryFf_Gslcsd\"><p xml:id=\"_imp_art_d1e3182_mIryFf_lEUTha\">the solvency and liquidity of the central body and of all the affiliated institutions are monitored as a whole on the basis of consolidated accounts of these institutions;</p></content></point><point xml:id=\"_imp_art_d1e3182_mIryFf_wJOMCL\"><num xml:id=\"_imp_art_d1e3182_mIryFf_c60YFP\">(c)</num><content xml:id=\"_imp_art_d1e3182_mIryFf_4ocvUO\"><p xml:id=\"_imp_art_d1e3182_mIryFf_xw1gim\">the management of the central body is empowered to issue instructions to the management of the affiliated institutions.</p></content></point><subparagraph refersTo=\"~_WRP\" xml:id=\"_imp_art_d1e3182_mIryFf_Dc7U9J\"><content xml:id=\"_imp_art_d1e3182_mIryFf_vP5eJc\"><p xml:id=\"_imp_art_d1e3182_mIryFf_Wxzi7Y\">Member States may maintain and make use of existing national legislation regarding the application of the waiver referred to in the first subparagraph as long as it does not conflict with this Regulation and Directive 2013/36/EU.</p></content></subparagraph></list></paragraph><paragraph xml:id=\"_imp_art_d1e3182_mIryFf_A3K8qw\"><num xml:id=\"_imp_art_d1e3182_mIryFf_KAZuU2\">2.</num><content xml:id=\"_imp_art_d1e3182_mIryFf_DLf1TH\"><p xml:id=\"_imp_art_d1e3182_mIryFf_cTa9NN\">Where the competent authorities are satisfied that the conditions set out in paragraph 1 are met, and where the liabilities or commitments of the central body are entirely guaranteed by the affiliated institutions, the competent authorities may waive the application of Parts Two to Eight to the central body on an individual basis.</p></content></paragraph></article><article leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_art_d1e3535_JiKGQm\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_NaiSCu\">Article 8</num><heading xml:id=\"_imp_art_d1e3535_JiKGQm_EomKhm\">Entities excluded from the scope of prudential consolidation</heading><paragraph xml:id=\"_imp_art_d1e3535_JiKGQm_ArHCGF\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_84uFHk\">1.</num><list xml:id=\"_imp_art_d1e3535_JiKGQm_JU9sTf\"><subparagraph refersTo=\"~_INP\" xml:id=\"_imp_art_d1e3535_JiKGQm_msRlUj\"><content xml:id=\"_imp_art_d1e3535_JiKGQm_KM7AUd\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_KMFAL3\">An institution, financial institution or an ancillary services undertaking which is a subsidiary or an undertaking in which a participation is held, need not to be included in the consolidation where the total amount of assets and off-balance sheet items of the undertaking concerned is less than the smaller of the following two amounts:</p></content></subparagraph><point xml:id=\"_imp_art_d1e3535_JiKGQm_dO8Wh6\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_KCEM13\">(a)</num><content xml:id=\"_imp_art_d1e3535_JiKGQm_qzLH8C\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_Nr7qxp\">EUR 10 million;</p></content></point><point xml:id=\"_imp_art_d1e3535_JiKGQm_p9N0yW\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_3coE5X\">(b)</num><content xml:id=\"_imp_art_d1e3535_JiKGQm_W6qM2g\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_Fd4Nwn\">1 % of the total amount of assets and off-balance sheet items of the parent undertaking or the undertaking that holds the participation.</p></content></point></list></paragraph><paragraph xml:id=\"_imp_art_d1e3535_JiKGQm_q4prPY\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_qhWEfN\">2.</num><list xml:id=\"_imp_art_d1e3535_JiKGQm_EVvucO\"><subparagraph refersTo=\"~_INP\" xml:id=\"_imp_art_d1e3535_JiKGQm_AP67uO\"><content xml:id=\"_imp_art_d1e3535_JiKGQm_q4equ8\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_VYxXhe\">The competent authorities responsible for exercising supervision on a consolidated basis pursuant to Article 111 of Directive 2013/36/EU may on a case-by-case basis decide in the following cases that an institution, financial institution or ancillary services undertaking which is a subsidiary or in which a participation is held need not be included in the consolidation:</p></content></subparagraph><point xml:id=\"_imp_art_d1e3535_JiKGQm_yhouV8\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_ulx7DF\">(a)</num><content xml:id=\"_imp_art_d1e3535_JiKGQm_E2xUGt\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_Gsm9U9\">where the undertaking concerned is situated in a third country where there are legal impediments to the transfer of the necessary information;</p></content></point><point xml:id=\"_imp_art_d1e3535_JiKGQm_DYEgPn\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_0al2Oc\">(b)</num><content xml:id=\"_imp_art_d1e3535_JiKGQm_FEvuVt\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_mPgJCc\">where the undertaking concerned is of negligible interest only with respect to the objectives of monitoring credit institutions;</p></content></point><point xml:id=\"_imp_art_d1e3535_JiKGQm_vgNJTn\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_ycG7G0\">(c)</num><content xml:id=\"_imp_art_d1e3535_JiKGQm_uxxrmF\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_zxylYR\">where, in the opinion of the competent authorities responsible for exercising supervision on a consolidated basis, the consolidation of the financial situation of the undertaking concerned would be inappropriate or misleading as far as the objectives of the supervision of credit institutions are concerned.</p></content></point></list></paragraph><paragraph xml:id=\"_imp_art_d1e3535_JiKGQm_fX0TNG\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_fksg6I\">3.</num><content xml:id=\"_imp_art_d1e3535_JiKGQm_sjuNrS\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_ZGBDba\">Where, in the cases referred to in paragraph 1 and point (b) of paragraph 2, several undertakings meet the criteria set out therein, they shall nevertheless be included in the consolidation where collectively they are of non-negligible interest with respect to the specified objectives.</p></content></paragraph></article><clause leos:alternative=\"true\" leos:deletable=\"true\" leos:editable=\"true\" leos:optionlist=\"listOption1\" leos:selectedoption=\"1\" xml:id=\"_clause_1\">\n" +
                "                <content xml:id=\"_clause_1__content\">\n" +
                "                    <p xml:id=\"_clause_1__content__p\">This Regulation shall be binding in its entirety and directly applicable in all Member States.</p>\n" +
                "                </content>\n" +
                "            </clause></body>\n" +
                "        <conclusions xml:id=\"_conclusions\"><p xml:id=\"_conclusions__p_1\">Done at <location refersTo=\"~_BEL_BRU\" xml:id=\"_conclusions__p__location_1\">Brussels</location>, <date date=\"9999-01-01\" xml:id=\"_akn_aviQud\"/></p><block name=\"signatory\" xml:id=\"_conclusions__block_1\">\n" +
                "                <signature xml:id=\"_conclusions__block_1__signature_1\">\n" +
                "                    <organization refersTo=\"~_EP\" xml:id=\"_conclusions__block_1__signature_1__organization\">For the European Parliament</organization>\n" +
                "                    <role refersTo=\"~_PRESID\" xml:id=\"_conclusions__block_1__signature_1__role\">The President</role>\n" +
                "                    <person refersTo=\"\" xml:id=\"_conclusions__block_1__signature_1__person\">[...]</person>\n" +
                "                </signature>\n" +
                "                <signature xml:id=\"_conclusions__block_1__signature_2\">\n" +
                "                    <organization refersTo=\"~_CONSIL\" xml:id=\"_conclusions__block_1__signature_2__organization\">For the Council</organization>\n" +
                "                    <role refersTo=\"~_PRESID\" xml:id=\"_conclusions__block_1__signature_2__role\">The President</role>\n" +
                "                    <person refersTo=\"\" xml:id=\"_conclusions__block_1__signature_2__person\">[...]</person>\n" +
                "                </signature>\n" +
                "            </block></conclusions>\n" +
                "    </bill>\n" +
                "</akomaNtoso>";
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR,
                "BILL", content.getBytes(StandardCharsets.UTF_8), "Second Version", pkg.getName());

        assertNotNull(doc);
        List<LeosDocument> docVersions = documentService.findAllVersionsByRef("REG-clh5v2p720007ng28khrr03h7-en");
        assertEquals(2, docVersions.size());
        doc = documentService.findDocumentById(doc.getVersionId(), "BILL", true);
        assertEquals(pkg.getName(), doc.getUpdatedBy());
        assertEquals("0.1.1", doc.getVersionLabel());
        assertEquals("Second Version", doc.getComments());
        assertTrue(doc.getUpdatedOn().compareTo(doc.getCreatedOn()) >= 0);
        assertTrue(Arrays.equals(doc.getSource(),content.getBytes(StandardCharsets.UTF_8)));
        assertEquals(doc.getMetadata().get("title"), newTitle);
    }

    @Test
    public void test_updateDocumentMajor() throws Exception {
        String newTitle = "New Title";
        LeosDocument doc = docCreation();
        Map<String, Object> properties = new HashMap();
        properties.putAll(doc.getMetadata());
        List<Collaborator> collaborators = (List<Collaborator>) doc.getMetadata().get("collaborators");
        properties.put("collaborators", ConversionUtils.getLeosCollaboratorsAsLinkedHashMap(collaborators));
        properties.put("title", newTitle);
        String content = "<akomaNtoso xmlns=\"http://docs.oasis-open.org/legaldocml/ns/akn/3.0\" xmlns:leos=\"urn:eu:europa:ec:leos\">\n" +
                "    <bill name=\"REG\">\n" +
                "        <meta>\n" +
                "            <identification source=\"~_COM\">\n" +
                "                <FRBRWork>\n" +
                "                    <FRBRthis value=\"\"/>\n" +
                "                    <FRBRuri value=\"\"/>\n" +
                "                    <FRBRdate date=\"2999-01-01\" name=\"\"/>\n" +
                "                    <FRBRauthor href=\"\"/>\n" +
                "                    <FRBRcountry value=\"EU\"/>\n" +
                "                    <FRBRprescriptive value=\"true\"/>\n" +
                "                </FRBRWork>\n" +
                "                <FRBRExpression>\n" +
                "                    <FRBRthis value=\"\"/>\n" +
                "                    <FRBRuri value=\"\"/>\n" +
                "                    <FRBRdate date=\"2999-01-01\" name=\"\"/>\n" +
                "                    <FRBRauthor href=\"\"/>\n" +
                "                    <FRBRlanguage language=\"en\" xml:id=\"_FRBRlanguage\"/>\n" +
                "                </FRBRExpression>\n" +
                "                <FRBRManifestation>\n" +
                "                    <FRBRthis value=\"\"/>\n" +
                "                    <FRBRuri value=\"\"/>\n" +
                "                    <FRBRdate date=\"2999-01-01\" name=\"\"/>\n" +
                "                    <FRBRauthor href=\"\"/>\n" +
                "\t\t\t\t\t<preservation xmlns:akn4eu=\"http://imfc.europa.eu/akn4eu\">\n" +
                "                \t\t<akn4eu:akn4euVersion value=\"4.0.0.0\"/>\n" +
                "                \t</preservation>\n" +
                "                </FRBRManifestation>\n" +
                "            </identification>\n" +
                "            <references source=\"~_COM\">\n" +
                "                <TLCLocation href=\"http://publications.europa.eu/resource/authority/place/BEL_BRU\" showAs=\"Brussels\" xml:id=\"_BEL_BRU\"/>\n" +
                "                <TLCOrganization href=\"http://publications.europa.eu/resource/authority/corporate-body/CONSIL\" showAs=\"Council of the European Union\" xml:id=\"_CONSIL\"/>\n" +
                "                <TLCOrganization href=\"http://publications.europa.eu/resource/authority/corporate-body/EP\" showAs=\"European Parliament\" xml:id=\"_EP\"/>\n" +
                "                <TLCOrganization href=\"http://publications.europa.eu/resource/authority/corporate-body/COM\" showAs=\"European Commission\" xml:id=\"_COM\"/>\n" +
                "                <TLCRole href=\"http://publications.europa.eu/resource/authority/role/PRESID\" showAs=\"President\" xml:id=\"_PRESID\"/>\n" +
                "                <TLCReference href=\"http://publications.europa.eu/resource/authority/resource-type/REG\" name=\"docType\" showAs=\"Regulation\" xml:id=\"_REG\"/>\n" +
                "                <TLCReference href=\"http://eurovoc.europa.eu/5456\" name=\"contentSubject\" showAs=\"Legal basis\" xml:id=\"_legalBasis\"/>\n" +
                "                <TLCReference href=\"http://publications.europa.eu/resource/authority/language/ENG\" name=\"language\" showAs=\"en\" xml:id=\"_language\"/>\n" +
                "                <TLCReference href=\"http://eur-lex.europa.eu/procedure/EN/YYYY_NNN\" name=\"procedureReference\" shortForm=\"YYYY/NNN/AAA\" showAs=\"YYYY/NNNN (AAA)\" xml:id=\"_procedure_YYYY_NNN\"/>\n" +
                "                <TLCReference href=\"http://publications.europa.eu/resource/authority/document-identifier-format/COM_NUMBER\" name=\"identifier\" shortForm=\"AAA/YYYY/NNN\" showAs=\"AAA(YYYY) NNN\" xml:id=\"_azs3y\"/>\n" +
                "                <TLCConcept href=\"http://publications.europa.eu/resource/subdivision-content/ART_DEF\" showAs=\"Article on definitions\" xml:id=\"_ART_DEF\"/>\n" +
                "            </references>\n" +
                "            <proprietary source=\"~_leos\">\n" +
                "                <leos:templateVersion>2.1.0</leos:templateVersion>\n" +
                "                <leos:docVersion>0.1.0</leos:docVersion>\n" +
                "                <leos:template>SJ-023</leos:template>\n" +
                "                <leos:docTemplate>BL-023</leos:docTemplate>\n" +
                "            <leos:docPurpose xml:id=\"_proprietary__docpurpose\">TEST ON SUBPARAGRAPHS AS INTRO</leos:docPurpose><leos:docStage xml:id=\"_proprietary__docstage\">Proposal for a</leos:docStage><leos:ref>REG-clh5v2p720007ng28khrr03h7-en</leos:ref><leos:docType xml:id=\"_proprietary__doctype\">REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL</leos:docType><leos:objectId/></proprietary>\n" +
                "        </meta>\n" +
                "        <preface xml:id=\"_preface\"><container name=\"procedureIdentifier\" xml:id=\"_preface__procedureIdentifier\">\n" +
                "                <p xml:id=\"_preface__procedureIdentifier__p\">\n" +
                "                    <docketNumber refersTo=\"~_procedure_YYYY_NNN\" xml:id=\"_preface__procedureIdentifier__p__docketNumber\"/>\n" +
                "                </p>\n" +
                "            </container><longTitle xml:id=\"_preface__longtitle\">\n" +
                "                <p xml:id=\"_preface__longtitle__p\">\n" +
                "                    <docStage xml:id=\"_preface__longtitle__p__docstage\">Proposal for a</docStage>\n" +
                "                    <docType refersTo=\"~_REG\" xml:id=\"_preface__longtitle__p__doctype\">REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL</docType>\n" +
                "                    <docPurpose xml:id=\"_preface__longtitle__p__docpurpose\">TEST ON SUBPARAGRAPHS AS INTRO</docPurpose>\n" +
                "                </p>\n" +
                "            </longTitle></preface>\n" +
                "        <preamble xml:id=\"_preamble\"><formula name=\"actingEntity\" xml:id=\"_preamble__formula_1\"><p xml:id=\"_preamble__formula_1__p\">THE EUROPEAN PARLIAMENT AND THE COUNCIL OF THE EUROPEAN UNION,</p></formula><citations leos:editable=\"false\" xml:id=\"_cits\"><citation leos:editable=\"true\" refersTo=\"~_legalBasis\" xml:id=\"_cit_1\"><p xml:id=\"_cit_1__p\">Having regard to the Treaty on the Functioning of the European Union, and in particular Article [...] thereof,</p></citation><citation leos:editable=\"true\" xml:id=\"_cit_2\"><p xml:id=\"_cit_2__p\">Having regard to the proposal from the European Commission,</p></citation><citation leos:editable=\"true\" xml:id=\"_cit_3\"><p xml:id=\"_cit_3__p\">After transmission of the draft legislative act to the national Parliaments,</p></citation><citation leos:editable=\"true\" xml:id=\"_cit_4\"><p xml:id=\"_cit_4__p\">Having regard to the opinion of the European Economic and Social Committee<authorialNote marker=\"1\" placement=\"bottom\" xml:id=\"_authorialnote_1\"><p xml:id=\"_authorialNote_1__p\">OJ C [...], [...], p. [...]</p></authorialNote>,</p></citation><citation leos:editable=\"true\" xml:id=\"_cit_5\"><p xml:id=\"_cit_5__p\">Having regard to the opinion of the Committee of the Regions<authorialNote marker=\"2\" placement=\"bottom\" xml:id=\"_authorialnote_2\"><p xml:id=\"_authorialNote_2__p\">OJ C [...], [...], p. [...]</p></authorialNote>,</p></citation><citation leos:editable=\"true\" xml:id=\"_cit_6\"><p xml:id=\"_cit_6__p\">Acting in accordance with the ordinary legislative procedure,</p></citation></citations><recitals leos:editable=\"false\" xml:id=\"_recs\"><intro xml:id=\"_recitalsIntro\"><p xml:id=\"_recs_intro\">Whereas:</p></intro><recital leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_rec_d1e87_yDZ4Zl\"><num xml:id=\"_recs_XCsSrR\">(1)</num><p xml:id=\"_recs_ulxeEc\">The G-20 Declaration of 2 April 2009 on Strengthening of the Financial System called for internationally consistent efforts that are aimed at strengthening transparency, accountability and regulation by improving the quantity and quality of capital in the banking system once the economic recovery is assured. That declaration also called for introduction of a supplementary non-risk based measure to contain the build-up of leverage in the banking system, and the development of a framework for stronger liquidity buffers. In response to the mandate given by the G-20, in September 2009 the Group of Central Bank Governors and Heads of Supervision (GHOS), agreed on a number of measures to strengthen the regulation of the banking sector. Those measures were endorsed by the G-20 leaders at their Pittsburgh Summit of 24-25 September 2009 and were set out in detail in December 2009. In July and September 2010, GHOS issued two further announcements on design and calibration of those new measures, and in December 2010, the Basel Committee on Banking Supervision (BCBS) published the final measures, that are referred to as the Basel III framework.</p></recital><recital leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_rec_d1e102_XaJ7NE\"><num xml:id=\"_recs_JEhFHz\">(2)</num><p xml:id=\"_recs_3OXO70\">The High Level Group on Financial Supervision in the EU chaired by Jacques de LarosiÃ¨re (the \"de LarosiÃ¨re group\") invited the Union to develop a more harmonised set of financial regulations. In the context of the future European supervisory architecture, the European Council of 18 and 19 June 2009 also stressed the need to establish a 'European Single Rule Book' applicable to all credit institutions and investment firms in the internal market.</p></recital><recital leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_rec_d1e123_u3HqXn\"><num xml:id=\"_recs_Iu05Xc\">(3)</num><p xml:id=\"_recs_xOYg00\">As stated in the de LarosiÃ¨re group's report of 25 February 2009 (the \"de LarosiÃ¨re report\"), \"a Member State should be able to adopt more stringent national regulatory measures considered to be domestically appropriate for safeguarding financial stability as long as the principles of the internal market and agreed minimum core standards are respected\".</p></recital><recital leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_rec_d1e140_6fumxe\"><num xml:id=\"_recs_MAIeaf\">(4)</num><p xml:id=\"_recs_hWTdCU\">Directive 2006/48/EC of the European Parliament and of the Council of 14 June 2006 relating to the taking up and pursuit of the business of credit institutions<authorialNote marker=\"3\" placement=\"bottom\" xml:id=\"_recs_GxwEi4\"><p xml:id=\"_recs_47tCGA\">OJ L 177, 30.6.2006, p. 1.</p></authorialNote> and Directive 2006/49/EC of the European Parliament and of the Council of 14 June 2006 on the capital adequacy of investment firms and credit institutions<authorialNote marker=\"4\" placement=\"bottom\" xml:id=\"_recs_CKfi1V\"><p xml:id=\"_recs_hAHO4G\">OJ L 177, 30.6.2006, p. 201.</p></authorialNote> have been significantly amended on several occasions. Many provisions of Directives 2006/48/EC and 2006/49/EC are applicable to both credit institutions and investment firms. For the sake of clarity and in order to ensure a coherent application of those provisions, they should be merged into new legislative acts that are applicable to both credit institutions and investment firms, namely this Regulation and Directive 2013/36/EU of the European Parliament and of the Council<authorialNote marker=\"5\" placement=\"bottom\" xml:id=\"_recs_UA0WBT\"><p xml:id=\"_recs_vZjFbO\">See page 338 of this Official Journal.</p></authorialNote>. For greater accessibility, the provisions of the Annexes to Directives 2006/48/EC and 2006/49/EC should be integrated into the enacting terms of Directive 2013/36/EU and this Regulation.</p></recital><recital leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_rec_d1e171_Wh4gEw\"><num xml:id=\"_recs_98Inku\">(5)</num><p xml:id=\"_recs_obh6wx\">Together, this Regulation and Directive 2013/36/EU should form the legal framework governing the access to the activity, the supervisory framework and the prudential rules for credit institutions and investment firms (referred to collectively as \"institutions\"). This Regulation should therefore be read together with that Directive</p></recital><recital leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_rec_d1e181_U27toi\"><num xml:id=\"_recs_lkQnin\">(6)</num><p xml:id=\"_recs_hHh6R0\">Directive 2013/36/EU, based on Article 53(1) of the Treaty on the Functioning of the European Union (TFEU), should, inter alia, contain the provisions concerning the access to the activity of institutions, the modalities for their governance, and their supervisory framework, such as provisions governing the authorisation of the business, the acquisition of qualifying holdings, the exercise of the freedom of establishment and of the freedom to provide services, the powers of the competent authorities of the home and the host Member States in this regard and the provisions governing the initial capital and the supervisory review of institutions.</p></recital></recitals><formula name=\"enactingFormula\" xml:id=\"_preamble__formula_2\"><p xml:id=\"_preamble__formula_2__p\">HAVE ADOPTED THIS REGULATION:</p></formula></preamble>\n" +
                "        <body xml:id=\"_body\"><article leos:autonumbering=\"true\" leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_art_1\"><num leos:editable=\"false\" xml:id=\"_art_1__num\">Article 1</num><heading xml:id=\"_art_1__heading\">Scope</heading><paragraph xml:id=\"_art_1__para_1\"><num xml:id=\"_art_1__para_1__num\">1.</num><list xml:id=\"_art_1_geFV8v\"><subparagraph refersTo=\"~_INP\" xml:id=\"_art_1_9QazpL\"><content xml:id=\"_art_1__para_1__content\"><p xml:id=\"_art_1__para_1__content__p\">This a custom article.</p></content></subparagraph><point xml:id=\"_art_1_SHnaUi\"><num xml:id=\"_art_1_AXTACj\">(a)</num><content xml:id=\"_art_1_XN3rWq\"><p xml:id=\"_art_1_FPpGfE\">First point</p></content></point><point xml:id=\"_art_1_iTVvtl\"><num xml:id=\"_art_1_dRmzE0\">(b)</num><list xml:id=\"_art_1_kSgdA1\"><subparagraph refersTo=\"~_INP\" xml:id=\"_art_1_H6p1HX\"><content xml:id=\"_art_1_GS0DdI\"><p xml:id=\"_art_1_eXY3hF\">Second point</p></content></subparagraph><point xml:id=\"_art_1_F93I9z\"><num xml:id=\"_art_1_ZqC4os\">(i)</num><subparagraph xml:id=\"_art_1_Mh9DZe\"><content xml:id=\"_art_1_w1YbyI\"><p xml:id=\"_art_1_R8N7Td\">ThirdÂ point</p></content></subparagraph><list xml:id=\"_art_1_jI1hMO\"><subparagraph refersTo=\"~_INP\" xml:id=\"_art_1_sf68he\"><content xml:id=\"_art_1_8FSQqS\"><p xml:id=\"_art_1_EpY1x9\">This a subparagraph</p></content></subparagraph><point xml:id=\"_art_1_AW7mmk\"><num xml:id=\"_art_1_jwMvmL\">(1)</num><list xml:id=\"_art_1_muTM7F\"><subparagraph refersTo=\"~_INP\" xml:id=\"_art_1_QrNUIS\"><content xml:id=\"_art_1_HETZsY\"><p xml:id=\"_art_1_f4OEmt\">Fourth point</p></content></subparagraph><indent xml:id=\"_art_1_9s4ttT\"><num xml:id=\"_art_1_voHCfe\">-</num><content xml:id=\"_art_1_rCBV4d\"><p xml:id=\"_art_1_k4tadc\">Fifth point</p></content></indent><indent xml:id=\"_art_1_yaLnZJ\"><num xml:id=\"_art_1_s5BMgC\">-</num><content xml:id=\"_art_1_nULcgG\"><p xml:id=\"_art_1_ZQobfc\">Sixth point</p></content></indent></list></point><point xml:id=\"_art_1_eKKPn2\"><num xml:id=\"_art_1_FSGx3w\">(2)</num><content xml:id=\"_art_1_9fpI8j\"><p xml:id=\"_art_1_gOZi4q\">Seventh point</p></content></point></list></point><point xml:id=\"_art_1_HoMy6w\"><num xml:id=\"_art_1_FMxDhW\">(ii)</num><content xml:id=\"_art_1_QFdcr3\"><p xml:id=\"_art_1_EIYM9P\">Eighth point</p></content></point></list></point><point xml:id=\"_art_1_aIbX3e\"><num xml:id=\"_art_1_KYwp8p\">(c)</num><content xml:id=\"_art_1_Sz0b9M\"><p xml:id=\"_art_1_rhD89v\">Ninth point</p></content></point></list></paragraph></article><article xml:id=\"__akn_article_hzxjht\"><num leos:editable=\"false\" xml:id=\"__akn_article_hzxjht_hFjWXc\">Article 2</num><heading xml:id=\"__akn_article_hzxjht_fgAYSz\">This is another custom article</heading><paragraph xml:id=\"__akn_article_hzxjht-par1\"><num xml:id=\"__akn_article_hzxjht_aJZ16Y\">1.</num><list xml:id=\"__akn_article_hzxjht_OnUIxn\"><subparagraph refersTo=\"~_INP\" xml:id=\"__akn_article_hzxjht_rQlOr2\"><content xml:id=\"__akn_article_hzxjht_LRnBuU\"><p xml:id=\"__akn_article_hzxjht_7pjIlC\">This is a custom article</p></content></subparagraph><point xml:id=\"__akn_article_hzxjht_SX6Wnt\"><num xml:id=\"__akn_article_hzxjht_VRV5uJ\">(a)</num><content xml:id=\"__akn_article_hzxjht_QCnF8X\"><p xml:id=\"__akn_article_hzxjht_gXycDf\">First point</p></content></point><point xml:id=\"__akn_article_hzxjht_CsvjQW\"><num xml:id=\"__akn_article_hzxjht_wWtx4s\">(b)</num><subparagraph xml:id=\"__akn_article_hzxjht_Z28up8\"><content xml:id=\"__akn_article_hzxjht_PxB8cw\"><p xml:id=\"__akn_article_hzxjht_FYV82j\">Second point</p></content></subparagraph><subparagraph xml:id=\"__akn_article_hzxjht_uuUspu\"><content xml:id=\"__akn_article_hzxjht_St6ZDw\"><p xml:id=\"__akn_article_hzxjht_YHS3kS\">Subparagraph</p></content></subparagraph></point></list></paragraph></article><article leos:autonumbering=\"true\" leos:deletable=\"true\" leos:editable=\"true\" refersTo=\"~_ART_DEF\" xml:id=\"_art_definitions\"><num leos:editable=\"false\" xml:id=\"_art_definitions__num\">Article 3</num><heading xml:id=\"_art_definitions_heading\">This a custom definitions'article</heading><paragraph xml:id=\"_art_definitions__para_1\"><list xml:id=\"_art_definitions_LeuEaR\"><subparagraph refersTo=\"~_INP\" xml:id=\"_art_definitions_1W34RQ\"><content xml:id=\"_art_definitions__para_1__content\"><p xml:id=\"_art_definitions__para_1__content__p\">First Definition:</p></content></subparagraph><point xml:id=\"_art_definitions_nKs23b\"><num xml:id=\"_art_definitions_ni8c8y\">(1)</num><content xml:id=\"_art_definitions_fWqT0p\"><p xml:id=\"_art_definitions_04YNrk\">First point of first definition</p></content></point><point xml:id=\"_art_definitions_a4EgBD\"><num xml:id=\"_art_definitions_pfOZXa\">(2)</num><content xml:id=\"_art_definitions_rxFETG\"><p xml:id=\"_art_definitions_fXWjBW\">Second point of first definition</p></content></point><point xml:id=\"_art_definitions_BPcicX\"><num xml:id=\"_art_definitions_aYiudH\">(3)</num><content xml:id=\"_art_definitions_qBrHcK\"><p xml:id=\"_art_definitions_Jk3bog\">Third point of first definition</p></content></point></list></paragraph><paragraph xml:id=\"_art_definitions_VDNHWQ\"><content xml:id=\"_art_definitions_EEo5dt\"><p xml:id=\"_art_definitions_sePP8N\">Second definition</p></content></paragraph></article><article leos:autonumbering=\"true\" leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_art_3\"><num leos:editable=\"false\" xml:id=\"_art_3__num\">Article 4</num><heading xml:id=\"_art_3__heading\">Entry into force</heading><paragraph xml:id=\"_art_3__para_1\">\n" +
                "                    <content xml:id=\"_art_3__para_1__content\">\n" +
                "                        <p xml:id=\"_art_3__para_1__content__p\">This Regulation shall enter into force on the [...] day following that of its publication in the <i xml:id=\"_art_3__para_1__content__p__i\">Official Journal of the European Union</i>.</p>\n" +
                "                    </content>\n" +
                "                </paragraph></article><article leos:deletable=\"true\" leos:editable=\"true\" refersTo=\"~_ART_DEF\" xml:id=\"_imp_art_d1e2906_LwbJdq\"><num xml:id=\"_imp_art_d1e2906_LwbJdq_Yg3FEZ\">Article 5</num><heading xml:id=\"_imp_art_d1e2906_LwbJdq_IjvaEH\">Definitions specific to capital requirements for credit risk</heading><paragraph xml:id=\"_imp_art_d1e2906_LwbJdq_Md10Ef\"><list xml:id=\"_imp_art_d1e2906_LwbJdq_WcPVHw\"><subparagraph refersTo=\"~_INP\" xml:id=\"_imp_art_d1e2906_LwbJdq_4jgd6m\"><content xml:id=\"_imp_art_d1e2906_LwbJdq_bvn4xT\"><p xml:id=\"_imp_art_d1e2906_LwbJdq_Mbecjg\">For the purposes of Part Three, Title II, the following definitions shall apply:</p></content></subparagraph><point xml:id=\"_imp_art_d1e2906_LwbJdq_AzuKIe\"><num xml:id=\"_imp_art_d1e2906_LwbJdq_WZeZNA\">(1)</num><content xml:id=\"_imp_art_d1e2906_LwbJdq_qvtvkD\"><p xml:id=\"_imp_art_d1e2906_LwbJdq_2vFOU6\">'exposure' means an asset or off-balance sheet item;</p></content></point><point xml:id=\"_imp_art_d1e2906_LwbJdq_d9ZKDr\"><num xml:id=\"_imp_art_d1e2906_LwbJdq_G4AvCk\">(2)</num><content xml:id=\"_imp_art_d1e2906_LwbJdq_Jhe0Cy\"><p xml:id=\"_imp_art_d1e2906_LwbJdq_8wHnvT\">'loss' means economic loss, including material discount effects, and material direct and indirect costs associated with collecting on the instrument;</p></content></point><point xml:id=\"_imp_art_d1e2906_LwbJdq_Gwkf1R\"><num xml:id=\"_imp_art_d1e2906_LwbJdq_C2oju6\">(3)</num><content xml:id=\"_imp_art_d1e2906_LwbJdq_YpAXY7\"><p xml:id=\"_imp_art_d1e2906_LwbJdq_p2kYaw\">'expected loss' or 'EL' means the ratio of the amount expected to be lost on an exposure from a potential default of a counterparty or dilution over a one year period to the amount outstanding at default.</p></content></point></list></paragraph></article><article leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_art_d1e3059_Z7uv35\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_ies6QN\">Article 6</num><heading xml:id=\"_imp_art_d1e3059_Z7uv35_q8SPlv\">Derogation to the application of liquidity requirements on an individual basis</heading><paragraph xml:id=\"_imp_art_d1e3059_Z7uv35_MWSJ0w\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_hMtOUZ\">1.</num><list xml:id=\"_imp_art_d1e3059_Z7uv35_dtZk06\"><subparagraph refersTo=\"~_INP\" xml:id=\"_imp_art_d1e3059_Z7uv35_u3EJ2l\"><content xml:id=\"_imp_art_d1e3059_Z7uv35_0mJ4nP\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_BxqVm7\">The competent authorities may waive in full or in part the application of Part Six to an institution and to all or some of its subsidiaries in the Union and supervise them as a single liquidity sub-group so long as they fulfil all of the following conditions:</p></content></subparagraph><point xml:id=\"_imp_art_d1e3059_Z7uv35_9R39fK\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_BLioV7\">(a)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_IxKXGT\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_ll4LyA\">the parent institution on a consolidated basis or a subsidiary institution on a sub-consolidated basis complies with the obligations laid down in Part Six;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_CtMujS\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_Jska5n\">(b)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_mW1evj\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_y4a2Sd\">the parent institution on a consolidated basis or the subsidiary institution on a sub-consolidated basis monitors and has oversight at all times over the liquidity positions of all institutions within the group or sub-group, that are subject to the waiver and ensures a sufficient level of liquidity for all of these institutions;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_546qJM\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_SqQ8VU\">(c)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_N1AJS0\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_MdWlhP\">the institutions have entered into contracts that, to the satisfaction of the competent authorities, provide for the free movement of funds between them to enable them to meet their individual and joint obligations as they come due;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_S1rdZv\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_AIT4og\">(d)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_eA5knH\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_UAXgmj\">there is no current or foreseen material practical or legal impediment to the fulfilment of the contracts referred to in (c).</p></content></point><subparagraph refersTo=\"~_WRP\" xml:id=\"_imp_art_d1e3059_Z7uv35_ZAN3q8\"><content xml:id=\"_imp_art_d1e3059_Z7uv35_rSo5JT\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_GQ4IyZ\">By 1 January 2014 the Commission shall report to the European Parliament and the Council on any legal obstacles which are capable of rendering impossible the application of point (c) of the first subparagraph and is invited to make a legislative proposal, if appropriate, by 31 December 2015 on which of those obstacles should be removed.</p></content></subparagraph></list></paragraph><paragraph xml:id=\"_imp_art_d1e3059_Z7uv35_EzoMrm\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_AuFmw9\">2.</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_cH4ewI\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_Qpdpnq\">The competent authorities may waive in full or in part the application of Part Six to an institution and to all or some of its subsidiaries where all institutions of the single liquidity sub-group are authorised in the same Member State and provided that the conditions in paragraph 1 are fulfilled.</p></content></paragraph><paragraph xml:id=\"_imp_art_d1e3059_Z7uv35_jtezEw\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_y1k4AL\">3.</num><list xml:id=\"_imp_art_d1e3059_Z7uv35_KScj9w\"><subparagraph refersTo=\"~_INP\" xml:id=\"_imp_art_d1e3059_Z7uv35_XKNETv\"><content xml:id=\"_imp_art_d1e3059_Z7uv35_g3d4hy\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_QZ34tb\">Where institutions of the single liquidity sub-group are authorised in several Member States, paragraph 1 shall only be applied after following the procedure laid down in Article 21 and only to the institutions whose competent authorities agree about the following elements:</p></content></subparagraph><point xml:id=\"_imp_art_d1e3059_Z7uv35_B9LT9N\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_BDBgGS\">(a)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_Lnmmvo\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_vX1YKy\">their assessment of the compliance of the organisation and of the treatment of liquidity risk with the conditions set out in Article 86 of Directive 2013/36/EU across the single liquidity sub-group;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_ZA2kEN\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_NlU4Um\">(b)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_AzA3PH\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_1SgFmb\">the distribution of amounts, location and ownership of the required liquid assets to be held within the single liquidity sub-group;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_j62xFv\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_WOP7PF\">(c)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_ySMimG\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_h8HIAT\">the determination of minimum amounts of liquid assets to be held by institutions for which the application of Part Six will be waived;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_G2xok3\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_tiVheH\">(d)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_ZKsSOS\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_HhvqfH\">the need for stricter parameters than those set out in Part Six;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_jjPic6\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_vk9dH5\">(e)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_mi23EY\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_ca2g6j\">unrestricted sharing of complete information between the competent authorities;</p></content></point><point xml:id=\"_imp_art_d1e3059_Z7uv35_HyMmk0\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_ZdG8cD\">(f)</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_95Uu1Q\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_Q1rLLw\">a full understanding of the implications of such a waiver.</p></content></point></list></paragraph><paragraph xml:id=\"_imp_art_d1e3059_Z7uv35_5rOUce\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_KoKpox\">4.</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_fg09r0\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_wrcElq\">Competent authorities may also apply paragraphs 1, 2 and 3 to institutions which are members of the same institutional protection scheme referred to in Article 113(7)(b), provided that they meet all the conditions laid down in Article 113(7), and to other institutions linked by a relationship referred to in Article 113(6) provided that they meet all the conditions laid down therein. Competent authorities shall in that case determine one of the institutions subject to the waiver to meet Part Six on the basis of the consolidated situation of all institutions of the single liquidity sub-group.</p></content></paragraph><paragraph xml:id=\"_imp_art_d1e3059_Z7uv35_iDYEvF\"><num xml:id=\"_imp_art_d1e3059_Z7uv35_qGmvdk\">5.</num><content xml:id=\"_imp_art_d1e3059_Z7uv35_ZLQjNB\"><p xml:id=\"_imp_art_d1e3059_Z7uv35_3WLcVC\">Where a waiver has been granted under paragraph 1 or paragraph 2, the competent authorities may also apply Article 86 of Directive 2013/36/EU, or parts thereof, at the level of the single liquidity sub-group and waive the application of Article 86 of Directive 2013/36/EU, or parts thereof, on an individual basis.</p></content></paragraph></article><article leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_art_d1e3182_mIryFf\"><num xml:id=\"_imp_art_d1e3182_mIryFf_Gyc8Mr\">Article 7</num><heading xml:id=\"_imp_art_d1e3182_mIryFf_PNS8r9\">Waiver for credit institutions permanently affiliated to a central body</heading><paragraph xml:id=\"_imp_art_d1e3182_mIryFf_pukrNM\"><num xml:id=\"_imp_art_d1e3182_mIryFf_CdEbd3\">1.</num><list xml:id=\"_imp_art_d1e3182_mIryFf_gzYfkO\"><subparagraph refersTo=\"~_INP\" xml:id=\"_imp_art_d1e3182_mIryFf_jHtJmK\"><content xml:id=\"_imp_art_d1e3182_mIryFf_8tAhA2\"><p xml:id=\"_imp_art_d1e3182_mIryFf_94BE5x\">Competent authorities may, in accordance with national law, partially or fully waive the application of the requirements set out in Parts Two to Eight to one or more credit institutions situated in the same Member State and which are permanently affiliated to a central body which supervises them and which is established in the same Member State, if the following conditions are met:</p></content></subparagraph><point xml:id=\"_imp_art_d1e3182_mIryFf_dMxdMz\"><num xml:id=\"_imp_art_d1e3182_mIryFf_exQEDc\">(a)</num><content xml:id=\"_imp_art_d1e3182_mIryFf_7EcfQV\"><p xml:id=\"_imp_art_d1e3182_mIryFf_OLVwAp\">the commitments of the central body and affiliated institutions are joint and several liabilities or the commitments of its affiliated institutions are entirely guaranteed by the central body;</p></content></point><point xml:id=\"_imp_art_d1e3182_mIryFf_QIStxi\"><num xml:id=\"_imp_art_d1e3182_mIryFf_jhG7uM\">(b)</num><content xml:id=\"_imp_art_d1e3182_mIryFf_Gslcsd\"><p xml:id=\"_imp_art_d1e3182_mIryFf_lEUTha\">the solvency and liquidity of the central body and of all the affiliated institutions are monitored as a whole on the basis of consolidated accounts of these institutions;</p></content></point><point xml:id=\"_imp_art_d1e3182_mIryFf_wJOMCL\"><num xml:id=\"_imp_art_d1e3182_mIryFf_c60YFP\">(c)</num><content xml:id=\"_imp_art_d1e3182_mIryFf_4ocvUO\"><p xml:id=\"_imp_art_d1e3182_mIryFf_xw1gim\">the management of the central body is empowered to issue instructions to the management of the affiliated institutions.</p></content></point><subparagraph refersTo=\"~_WRP\" xml:id=\"_imp_art_d1e3182_mIryFf_Dc7U9J\"><content xml:id=\"_imp_art_d1e3182_mIryFf_vP5eJc\"><p xml:id=\"_imp_art_d1e3182_mIryFf_Wxzi7Y\">Member States may maintain and make use of existing national legislation regarding the application of the waiver referred to in the first subparagraph as long as it does not conflict with this Regulation and Directive 2013/36/EU.</p></content></subparagraph></list></paragraph><paragraph xml:id=\"_imp_art_d1e3182_mIryFf_A3K8qw\"><num xml:id=\"_imp_art_d1e3182_mIryFf_KAZuU2\">2.</num><content xml:id=\"_imp_art_d1e3182_mIryFf_DLf1TH\"><p xml:id=\"_imp_art_d1e3182_mIryFf_cTa9NN\">Where the competent authorities are satisfied that the conditions set out in paragraph 1 are met, and where the liabilities or commitments of the central body are entirely guaranteed by the affiliated institutions, the competent authorities may waive the application of Parts Two to Eight to the central body on an individual basis.</p></content></paragraph></article><article leos:deletable=\"true\" leos:editable=\"true\" xml:id=\"_imp_art_d1e3535_JiKGQm\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_NaiSCu\">Article 8</num><heading xml:id=\"_imp_art_d1e3535_JiKGQm_EomKhm\">Entities excluded from the scope of prudential consolidation</heading><paragraph xml:id=\"_imp_art_d1e3535_JiKGQm_ArHCGF\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_84uFHk\">1.</num><list xml:id=\"_imp_art_d1e3535_JiKGQm_JU9sTf\"><subparagraph refersTo=\"~_INP\" xml:id=\"_imp_art_d1e3535_JiKGQm_msRlUj\"><content xml:id=\"_imp_art_d1e3535_JiKGQm_KM7AUd\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_KMFAL3\">An institution, financial institution or an ancillary services undertaking which is a subsidiary or an undertaking in which a participation is held, need not to be included in the consolidation where the total amount of assets and off-balance sheet items of the undertaking concerned is less than the smaller of the following two amounts:</p></content></subparagraph><point xml:id=\"_imp_art_d1e3535_JiKGQm_dO8Wh6\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_KCEM13\">(a)</num><content xml:id=\"_imp_art_d1e3535_JiKGQm_qzLH8C\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_Nr7qxp\">EUR 10 million;</p></content></point><point xml:id=\"_imp_art_d1e3535_JiKGQm_p9N0yW\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_3coE5X\">(b)</num><content xml:id=\"_imp_art_d1e3535_JiKGQm_W6qM2g\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_Fd4Nwn\">1 % of the total amount of assets and off-balance sheet items of the parent undertaking or the undertaking that holds the participation.</p></content></point></list></paragraph><paragraph xml:id=\"_imp_art_d1e3535_JiKGQm_q4prPY\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_qhWEfN\">2.</num><list xml:id=\"_imp_art_d1e3535_JiKGQm_EVvucO\"><subparagraph refersTo=\"~_INP\" xml:id=\"_imp_art_d1e3535_JiKGQm_AP67uO\"><content xml:id=\"_imp_art_d1e3535_JiKGQm_q4equ8\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_VYxXhe\">The competent authorities responsible for exercising supervision on a consolidated basis pursuant to Article 111 of Directive 2013/36/EU may on a case-by-case basis decide in the following cases that an institution, financial institution or ancillary services undertaking which is a subsidiary or in which a participation is held need not be included in the consolidation:</p></content></subparagraph><point xml:id=\"_imp_art_d1e3535_JiKGQm_yhouV8\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_ulx7DF\">(a)</num><content xml:id=\"_imp_art_d1e3535_JiKGQm_E2xUGt\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_Gsm9U9\">where the undertaking concerned is situated in a third country where there are legal impediments to the transfer of the necessary information;</p></content></point><point xml:id=\"_imp_art_d1e3535_JiKGQm_DYEgPn\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_0al2Oc\">(b)</num><content xml:id=\"_imp_art_d1e3535_JiKGQm_FEvuVt\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_mPgJCc\">where the undertaking concerned is of negligible interest only with respect to the objectives of monitoring credit institutions;</p></content></point><point xml:id=\"_imp_art_d1e3535_JiKGQm_vgNJTn\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_ycG7G0\">(c)</num><content xml:id=\"_imp_art_d1e3535_JiKGQm_uxxrmF\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_zxylYR\">where, in the opinion of the competent authorities responsible for exercising supervision on a consolidated basis, the consolidation of the financial situation of the undertaking concerned would be inappropriate or misleading as far as the objectives of the supervision of credit institutions are concerned.</p></content></point></list></paragraph><paragraph xml:id=\"_imp_art_d1e3535_JiKGQm_fX0TNG\"><num xml:id=\"_imp_art_d1e3535_JiKGQm_fksg6I\">3.</num><content xml:id=\"_imp_art_d1e3535_JiKGQm_sjuNrS\"><p xml:id=\"_imp_art_d1e3535_JiKGQm_ZGBDba\">Where, in the cases referred to in paragraph 1 and point (b) of paragraph 2, several undertakings meet the criteria set out therein, they shall nevertheless be included in the consolidation where collectively they are of non-negligible interest with respect to the specified objectives.</p></content></paragraph></article><clause leos:alternative=\"true\" leos:deletable=\"true\" leos:editable=\"true\" leos:optionlist=\"listOption1\" leos:selectedoption=\"1\" xml:id=\"_clause_1\">\n" +
                "                <content xml:id=\"_clause_1__content\">\n" +
                "                    <p xml:id=\"_clause_1__content__p\">This Regulation shall be binding in its entirety and directly applicable in all Member States.</p>\n" +
                "                </content>\n" +
                "            </clause></body>\n" +
                "        <conclusions xml:id=\"_conclusions\"><p xml:id=\"_conclusions__p_1\">Done at <location refersTo=\"~_BEL_BRU\" xml:id=\"_conclusions__p__location_1\">Brussels</location>, <date date=\"9999-01-01\" xml:id=\"_akn_aviQud\"/></p><block name=\"signatory\" xml:id=\"_conclusions__block_1\">\n" +
                "                <signature xml:id=\"_conclusions__block_1__signature_1\">\n" +
                "                    <organization refersTo=\"~_EP\" xml:id=\"_conclusions__block_1__signature_1__organization\">For the European Parliament</organization>\n" +
                "                    <role refersTo=\"~_PRESID\" xml:id=\"_conclusions__block_1__signature_1__role\">The President</role>\n" +
                "                    <person refersTo=\"\" xml:id=\"_conclusions__block_1__signature_1__person\">[...]</person>\n" +
                "                </signature>\n" +
                "                <signature xml:id=\"_conclusions__block_1__signature_2\">\n" +
                "                    <organization refersTo=\"~_CONSIL\" xml:id=\"_conclusions__block_1__signature_2__organization\">For the Council</organization>\n" +
                "                    <role refersTo=\"~_PRESID\" xml:id=\"_conclusions__block_1__signature_2__role\">The President</role>\n" +
                "                    <person refersTo=\"\" xml:id=\"_conclusions__block_1__signature_2__person\">[...]</person>\n" +
                "                </signature>\n" +
                "            </block></conclusions>\n" +
                "    </bill>\n" +
                "</akomaNtoso>";
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.INTERMEDIATE,
                "BILL", content.getBytes(StandardCharsets.UTF_8), "Second Version", pkg.getName());

        assertNotNull(doc);
        List<LeosDocument> docVersions = documentService.findAllVersionsByRef("REG-clh5v2p720007ng28khrr03h7-en");
        assertEquals(2, docVersions.size());
        doc = documentService.findDocumentById(doc.getVersionId(), "BILL", true);
        assertEquals(pkg.getName(), doc.getUpdatedBy());
        assertEquals("0.2.0", doc.getVersionLabel());
        assertEquals("Second Version", doc.getComments());
        assertTrue(doc.getUpdatedOn().compareTo(doc.getCreatedOn()) >= 0);
        assertTrue(Arrays.equals(doc.getSource(),content.getBytes(StandardCharsets.UTF_8)));
        assertEquals(doc.getMetadata().get("title"), newTitle);
    }

    @Test
    public void test_updateDocumentMetadata() throws Exception {
        String newTitle = "New Title";
        LeosDocument doc = docCreation();
        LeosDocument docBeforeUpdate = documentService.findDocumentById(doc.getVersionId(), "BILL", true);
        Map<String, Object> properties = new HashMap();
        properties.putAll(doc.getMetadata());
        properties.put("title", newTitle);
        List<Collaborator> collaborators = (List<Collaborator>) doc.getMetadata().get("collaborators");
        collaborators.add(new Collaborator(pkg.getName(), "REVIEWER", "DIGIT"));
        properties.put("collaborators", ConversionUtils.getLeosCollaboratorsAsLinkedHashMap(collaborators));
        LeosDocument updatedDoc = documentService.updateDocument(doc.getRef(), doc.getVersionId(), properties, USER_ID, true);
        assertNotNull(updatedDoc);
        List<DocumentV> docV = documentVRepository.findAllVersionsByRef(doc.getRef());
        assertEquals(1, docV.size());
        updatedDoc = documentService.findDocumentById(doc.getVersionId(), "BILL", true);
        assertEquals(USER_ID, updatedDoc.getUpdatedBy());
        assertEquals(doc.getVersionLabel(), updatedDoc.getVersionLabel());
        assertEquals(doc.getComments(), updatedDoc.getComments());
        assertEquals(updatedDoc.getMetadata().get("title"), newTitle);
        assertNotNull(updatedDoc.getMetadata().get("collaborators"));
        collaborators = (List<Collaborator>) doc.getMetadata().get("collaborators");
        assertEquals(collaborators.size(), 2);
        assertTrue(updatedDoc.getUpdatedOn().compareTo(updatedDoc.getCreatedOn()) >= 0);
        assertTrue(new String(updatedDoc.getSource()).equals(new String(docBeforeUpdate.getSource())));
    }

    @Test
    public void test_deleteDocument() throws Exception {
        Map<String, ?> properties = new HashMap() {{
            put("ref", "REG-clh5v2p720007ng28khrr03h7-en");
            put("collaborators", ConversionUtils.getLeosCollaboratorsAsLinkedHashMap(Arrays.asList(new Collaborator("jane", "OWNER", "DGT.R.3"),
                    new Collaborator("demo", "REVIEWER", "CNECT"))));
            put("eeaRelevance", false);
            put ("docPurpose", "TEST ON SUBPARAGRAPHS AS INTRO");
            put("title", "Proposal for a REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL TEST ON SUBPARAGRAPHS AS INTRO");
            put("docType", "REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL");
            put("language", "EN");
            put("initialCreatedBy", "jane");
            put("docTemplate", "BL-023");
            put("initialCreationDate", ConversionUtils.getLeosDateAsString(new Date(), ConversionUtils.LEOS_REPO_DATE_FORMAT));
            put("template", "SJ-023");
            put("category", "BILL");
            put("docStage", "Proposal for a");
        }};
        LeosDocument doc = documentService.createDocumentFromSource("BL-023", pkg.getName(),
                "REG-clh5v2p720007ng28khrr03h7-en.xml", properties, "0.1.1", 3, "First version", USER_ID);

        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, "BILL", doc.getSource(),
                "Second Version", pkg.getName());
        assertNotNull(doc);
        List<DocumentV> docVersionsBeforeDelete =
                documentVRepository.findAllVersionsByRef(doc.getRef());
        documentService.deleteDocumentById(doc.getVersionId());

        List<DocumentV> docV = documentVRepository.findAllVersionsByRef(doc.getRef());
        assertEquals(0, docV.size());

        for (DocumentV v : docVersionsBeforeDelete) {
            Optional<DocumentContent> docC = documentContentRepository.findDocumentContentByVersionId(v.getVersionId());
            assertFalse(docC.isPresent());
        }
    }

    @Test
    public void test_findDocumentById() throws Exception {
        LeosDocument doc = docCreation();
        Map<String, Object> properties = new HashMap<>();
        properties.putAll(doc.getMetadata());
        List<Collaborator> collaborators = (List<Collaborator>) doc.getMetadata().get("collaborators");
        properties.put("collaborators", ConversionUtils.getLeosCollaboratorsAsLinkedHashMap(collaborators));

        LeosDocument updatedDoc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, "BILL", doc.getSource(),
                "Second Version", pkg.getName());
        assertNotNull(updatedDoc);
        assertFalse(doc.getVersionId().equals(updatedDoc.getVersionId()));
        LeosDocument oldVersion = documentService.findDocumentById(doc.getVersionId(), "BILL", false);
        assertTrue(doc.getVersionId().equals(oldVersion.getVersionId()));
        LeosDocument lastVersion = documentService.findDocumentById(doc.getVersionId(), "BILL", true);
        assertFalse(doc.getVersionId().equals(lastVersion.getVersionId()));
    }

    @Ignore
    @Test
    public void test_findDocumentsByRef() throws Exception {
        LeosDocument doc = docCreation();
        BigDecimal firstVersionId = doc.getVersionId();
        Map<String, Object> properties = new HashMap<>();
        properties.putAll(doc.getMetadata());
        List<Collaborator> collaborators = (List<Collaborator>) doc.getMetadata().get("collaborators");
        properties.put("collaborators", ConversionUtils.getLeosCollaboratorsAsLinkedHashMap(collaborators));
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, null, doc.getSource(),
                "Second Version", pkg.getName());
        assertNotNull(doc);
        List<LeosDocument> docs = documentService.findAllVersionsByRef(doc.getRef());
        assertEquals(docs.size(), 2);
        assertTrue(firstVersionId.equals(docs.get(1).getVersionId()));
        assertTrue(doc.getVersionId().equals(docs.get(0).getVersionId()));
    }

    @Test
    @Transactional
    public void test_findDocumentByUserId_1() throws RepositoryException {
        List<LeosDocument> docs = documentService.findDocumentsByUserId("demo", "OWNER", null);
        assertEquals(docs.size(), 0);
        docs = documentService.findDocumentsByUserId("demo", "REVIEWER", null);
        assertEquals(docs.size(), 0);
        docs = documentService.findDocumentsByUserId("jane", "OWNER", null);
        assertEquals(docs.size(), 0);
    }

    @Test
    @Transactional
    public void test_findLatestMajorVersionById() throws RepositoryException {
        LeosDocument doc = documentService.findLatestMajorVersionByRef("annex_1");
        assertEquals(doc.getVersionLabel(), "1.0.0");
        assertNotNull(doc);
        doc = documentService.findLatestMajorVersionByRef("dummy");
        assertNull(doc);
    }

    @Test
    @Transactional
    public void test_findFirstVersion() throws RepositoryException {
        LeosDocument doc = documentService.findFirstVersion("annex_1");
        assertEquals(doc.getVersionLabel(), "1.0.0");
        assertNotNull(doc);
    }

    @Test
    @Transactional
    public void test_findDocumentByVersion() throws RepositoryException {
        LeosDocument doc = documentService.findDocumentByVersion("annex_1","1.0.0");
        assertNotNull(doc);
        doc = documentService.findDocumentByVersion("annex_1","1.2.0");
        assertNull(doc);
    }

    @Test
   
    public void test_getNextVersionLabel() throws RepositoryException {
        String version = documentService.getNextVersionLabel(VersionType.MINOR,"1.0.0");
        assertEquals(version, "1.0.1");
        version = documentService.getNextVersionLabel(VersionType.MAJOR,"1.0.0");
        assertEquals(version, "2.0.0");
    }

    @Test
    public void test_findAllMinorsForIntermediate() throws Exception {
        LeosDocument doc = docCreation();
        Map<String, Object> properties = new HashMap<>();
        properties.putAll(doc.getMetadata());
        List<Collaborator> collaborators = (List<Collaborator>) doc.getMetadata().get("collaborators");
        properties.put("collaborators", ConversionUtils.getLeosCollaboratorsAsLinkedHashMap(collaborators));
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, "BILL", doc.getSource(),
                "Second Version", pkg.getName());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, "BILL", doc.getSource(),
                "Third Version", pkg.getName());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.INTERMEDIATE, "BILL", doc.getSource(),
                "Fourth Version", pkg.getName());
        List<LeosDocument> docs = documentService.findAllMinorsForIntermediate("REG-clh5v2p720007ng28khrr03h7-en", "0.2.0",0, 10);
        assertEquals(docs.size(), 2);
        assertEquals(docs.get(0).getVersionLabel(), "0.1.2");
        assertEquals(docs.get(1).getVersionLabel(), "0.1.1");
    }

    @Ignore
    @Test
    public void test_findAllMinorsForIntermediate_2() throws Exception {
        LeosDocument doc = docCreation();
        Map<String, Object> properties = new HashMap<>();
        properties.putAll(doc.getMetadata());
        List<Collaborator> collaborators = (List<Collaborator>) doc.getMetadata().get("collaborators");
        properties.put("collaborators", ConversionUtils.getLeosCollaboratorsAsLinkedHashMap(collaborators));
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, null, doc.getSource(),
                "Second Version", pkg.getName());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, null, doc.getSource(),
                "Third Version", pkg.getName());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MAJOR, null, doc.getSource(),
                "Major Version", pkg.getName());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, null, doc.getSource(),
                "Fifth Version", pkg.getName());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, null, doc.getSource(),
                "Sixth Version", pkg.getName());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, null, doc.getSource(),
                "Seventh Version", pkg.getName());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, null, doc.getSource(),
                "Eighth Version", pkg.getName());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, null, doc.getSource(),
                "Ninth Version", pkg.getName());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, null, doc.getSource(),
                "Tenth Version", pkg.getName());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, null, doc.getSource(),
                "Eleventh Version", pkg.getName());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, null, doc.getSource(),
                "Twelveth Version", pkg.getName());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, null, doc.getSource(),
                "Thirteenth Version", pkg.getName());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, null, doc.getSource(),
                "Fourteenth Version", pkg.getName());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, null, doc.getSource(),
                "Fifteenth Version", pkg.getName());
        List<LeosDocument> docs = documentService.findAllMinorsForIntermediate("REG-clh5v2p720007ng28khrr03h7-en", "1.0.0", 0, 10);
        assertEquals(docs.size(), 2);
        assertEquals(docs.get(0).getVersionLabel(), "0.1.2");
        assertEquals(docs.get(1).getVersionLabel(), "0.1.1");
        docs = documentService.findAllMinorsForIntermediate("REG-clh5v2p720007ng28khrr03h7-en", "1.1.0",0, 40);
        long count = documentService.getAllMinorsCountForIntermediate("REG-clh5v2p720007ng28khrr03h7-en", "1.1.0");
        assertEquals(docs.size(), 11);
        assertEquals(count, 11);
        assertEquals(docs.get(0).getVersionLabel(), "1.0.11");
        assertEquals(docs.get(1).getVersionLabel(), "1.0.10");
        assertEquals(docs.get(2).getVersionLabel(), "1.0.9");
        assertEquals(docs.get(3).getVersionLabel(), "1.0.8");
        assertEquals(docs.get(4).getVersionLabel(), "1.0.7");
        assertEquals(docs.get(5).getVersionLabel(), "1.0.6");
        assertEquals(docs.get(6).getVersionLabel(), "1.0.5");
        assertEquals(docs.get(7).getVersionLabel(), "1.0.4");
        assertEquals(docs.get(8).getVersionLabel(), "1.0.3");
        assertEquals(docs.get(9).getVersionLabel(), "1.0.2");
        assertEquals(docs.get(10).getVersionLabel(), "1.0.1");
    }

    @Test
    public void test_getAllMinorsCountForIntermediate() throws Exception {
        LeosDocument doc = docCreation();
        Map<String, Object> properties = new HashMap<>();
        properties.putAll(doc.getMetadata());
        List<Collaborator> collaborators = (List<Collaborator>) doc.getMetadata().get("collaborators");
        properties.put("collaborators", ConversionUtils.getLeosCollaboratorsAsLinkedHashMap(collaborators));
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, "BILL", doc.getSource(),
                "Second Version", pkg.getName());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, "BILL", doc.getSource(),
                "Third Version", pkg.getName());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.INTERMEDIATE, "BILL", doc.getSource(),
                "Fourth Version", pkg.getName());
        long minorsCount = documentService.getAllMinorsCountForIntermediate("REG-clh5v2p720007ng28khrr03h7-en", "0.2.0");
        assertEquals(minorsCount, 2);
    }

    @Test
    public void test_getAllMajorsCount() throws RepositoryException {
        long majorsCount = documentService.getAllMajorsCount("annex_1");
        assertEquals(majorsCount, 1);
    }

    @Test
    public void test_findRecentMinorVersions() throws Exception {
        LeosDocument doc = docCreation();
        Map<String, Object> properties = new HashMap<>();
        properties.putAll(doc.getMetadata());
        List<Collaborator> collaborators = (List<Collaborator>) doc.getMetadata().get("collaborators");
        properties.put("collaborators", ConversionUtils.getLeosCollaboratorsAsLinkedHashMap(collaborators));
        System.out.println("****************" + doc.getVersionId());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, "BILL", doc.getSource(),
                "Second Version", pkg.getName());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, "BILL", doc.getSource(),
                "Third Version", pkg.getName());
        List<LeosDocument> docs = documentService.findRecentMinorVersions("REG-clh5v2p720007ng28khrr03h7-en", "0.1.0",0, 10);
        assertEquals(docs.size(), 2);
        assertEquals(docs.get(0).getVersionLabel(), "0.1.2");
        assertEquals(docs.get(1).getVersionLabel(), "0.1.1");
        docs = documentService.findRecentMinorVersions("REG-clh5v2p720007ng28khrr03h7-en", "0.1.0",2, 10);
        assertEquals(docs.size(), 0);
        docs = documentService.findRecentMinorVersions("REG-clh5v2p720007ng28khrr03h7-en", "0.1.0",0, 1);
        assertEquals(docs.size(), 1);
    }

    @Test
    public void test_getRecentMinorVersionsCount() throws Exception {
        LeosDocument doc = docCreation();
        Map<String, Object> properties = new HashMap<>();
        properties.putAll(doc.getMetadata());
        List<Collaborator> collaborators = (List<Collaborator>) doc.getMetadata().get("collaborators");
        properties.put("collaborators", ConversionUtils.getLeosCollaboratorsAsLinkedHashMap(collaborators));
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, "BILL", doc.getSource(),
                "Second Version", pkg.getName());
        doc = documentService.updateDocument(doc.getVersionId(), properties, VersionType.MINOR, "BILL", doc.getSource(),
                "Third Version", pkg.getName());
        long recentMinorVersionCount = documentService.getRecentMinorVersionsCount("REG-clh5v2p720007ng28khrr03h7-en","0.1.0");
        assertEquals(recentMinorVersionCount, 2);
    }

    @Test
    @Transactional
    public void test_findAllMajors() throws RepositoryException {
        List<LeosDocument> docs = documentService.findAllMajors("annex_1",0,10);
        assertEquals(docs.size(), 1);
    }

    @Test
    public void findDocumentsWithFilter() {
        QueryFilter filter = new QueryFilter();
        filter.addFilter(new QueryFilter.Filter("procedureType", "IN", true, "ORDINARY_LEGISLATIVE_PROC"
                , "SPECIAL_LEGISLATIVE_ACTS", "COMMISSION_LEGAL_ACTS", "COUNCIL_LEGAL_ACTS", "COUNCIL_INTERNAL_DOCUMENT"));
        filter.addFilter(new QueryFilter.Filter("template", "IN", true, "SJ-017", "SJ-019"
                , "SJ-023"));
        filter.addFilter(new QueryFilter.Filter("role", "IN", false, "demo::OWNER::DGT.R.3"
                , "demo::CONTRIBUTOR::DGT.R.3", "demo::REVIEWER::DGT.R.3", "demo::OWNER"
                , "demo::CONTRIBUTOR", "demo::REVIEWER"));
        filter.addFilter(new QueryFilter.Filter("title", "LIKE", false, "TRACK"));
        filter.addSortOrder(new QueryFilter.SortOrder("lastModificationDate", "DESC"));
        Set<String> categories = Sets.set("PROPOSAL");
        int startIndex = 0;
        int maxResults = 5;

        List<LeosDocument> docs = documentService.findDocumentsUsingFilter("%",
                categories,
                filter, startIndex, maxResults, false);
        assertEquals(docs.size(), 1);
   }

    @Test
    public void countDocumentsWithFilter() {
        QueryFilter filter = new QueryFilter();
        filter.addFilter(new QueryFilter.Filter("procedureType", "IN", true, "ORDINARY_LEGISLATIVE_PROC"
                , "SPECIAL_LEGISLATIVE_ACTS", "COMMISSION_LEGAL_ACTS", "COUNCIL_LEGAL_ACTS", "COUNCIL_INTERNAL_DOCUMENT"));
        filter.addFilter(new QueryFilter.Filter("template", "IN", true, "SJ-017", "SJ-019"
                , "SJ-023"));
        filter.addFilter(new QueryFilter.Filter("role", "IN", false, "demo::OWNER::DGT.R.3"
                , "demo::CONTRIBUTOR::DGT.R.3", "demo::REVIEWER::DGT.R.3", "demo::OWNER"
                , "demo::CONTRIBUTOR", "demo::REVIEWER"));
        filter.addSortOrder(new QueryFilter.SortOrder("lastModificationDate", "DESC"));
        Set<String> categories = Sets.set("PROPOSAL");

        long count = documentService.countDocumentsUsingFilter("%",
                categories,
                filter);
        assertEquals(count, 1);
    }

    @Test
    public void test_findAllVersionsOfDocument() {
        List<DocumentV> docs = documentVRepository.findAllVersionsByDocumentId(new BigDecimal(1));
        assertEquals(docs.size(), 1);
    }

    @Test
    public void test_findProposalByDocumentId() {
        List<DocumentV> docs = documentVRepository.findDocumentsByPackageIdAndCategory(new BigDecimal(1), "PROPOSAL");
        assertEquals(docs.size(), 1);
        docs = documentVRepository.findDocumentsByPackageIdAndCategory(new BigDecimal(1), "BILL");
        assertEquals(docs.size(), 1);
        docs = documentVRepository.findDocumentsByPackageIdAndCategory(new BigDecimal(1), "ANNEX");
        assertEquals(docs.size(), 1);
        docs = documentVRepository.findDocumentsByPackageIdAndCategory(new BigDecimal(1), "MEMORANDUM");
        assertEquals(docs.size(), 1);
        Optional<Package> pkg = packageRepository.findPackageByName("package_leos");
        Assertions.assertTrue(pkg.isPresent());
        docs = documentVRepository.findAllVersionsByPackageIdAndCategoryCode(pkg.get().getId(), "MEMORANDUM");
        assertEquals(docs.size(), 1);
    }
}
