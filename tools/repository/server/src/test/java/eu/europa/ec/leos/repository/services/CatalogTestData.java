package eu.europa.ec.leos.repository.services;

public class CatalogTestData {
    
    public static final String BASE_CATALOG_XML = 
        "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n" +
        "<catalog lang=\"EN\">\n" +
        "    <item enabled=\"true\" id=\"c1\" key=\"LAW_INITIATIVE\" type=\"CATEGORY\">\n" +
        "        <names>\n" +
        "            <name lang=\"EN\">Interinstitutional procedures - Law Initiative (COM/JOIN)</name>\n" +
        "            <name lang=\"FR\">Procédure interinstitutionnelles - Droit d'initiative (COM/JOIN)</name>\n" +
        "        </names>\n" +
        "        <descriptions>\n" +
        "            <description lang=\"EN\">Interinstitutional procedures - Law Initiative (COM/JOIN)</description>\n" +
        "            <description lang=\"FR\">Procédure interinstitutionnelles - Droit d'initiative (COM/JOIN)</description>\n" +
        "        </descriptions>\n" +
        "        <item enabled=\"true\" id=\"c1.1\" key=\"LEGISLATIVE_ACTS\" type=\"CATEGORY\">\n" +
        "            <names>\n" +
        "                <name lang=\"EN\">Legal acts</name>\n" +
        "                <name lang=\"FR\">Actes législatifs</name>\n" +
        "            </names>\n" +
        "            <descriptions>\n" +
        "                <description lang=\"EN\">Legal acts</description>\n" +
        "                <description lang=\"FR\">Actes législatifs</description>\n" +
        "            </descriptions>\n" +
        "            <item enabled=\"true\" id=\"c1.1.1\" key=\"ORDINARY_LEGISLATIVE_PROC\" type=\"CATEGORY\">\n" +
        "                <names>\n" +
        "                    <name lang=\"EN\">Ordinary legislative procedure</name>\n" +
        "                    <name lang=\"FR\">Procédure législative ordinaire</name>\n" +
        "                </names>\n" +
        "                <descriptions>\n" +
        "                    <description lang=\"EN\">Ordinary legislative procedure</description>\n" +
        "                    <description lang=\"FR\">Procédure législative ordinaire</description>\n" +
        "                </descriptions>\n" +
        "                <item enabled=\"true\" id=\"c1.1.1.1\" key=\"REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL\" type=\"CATEGORY\">\n" +
        "                    <names>\n" +
        "                        <name lang=\"EN\">Proposal for a regulation</name>\n" +
        "                        <name lang=\"FR\">Proposition de règlement</name>\n" +
        "                    </names>\n" +
        "                    <descriptions>\n" +
        "                        <description lang=\"EN\">Regulation to be adopted by the European Parliament and the Council</description>\n" +
        "                        <description lang=\"FR\">Règlement à adopter conjointement par le Parlement Européen et le Conseil</description>\n" +
        "                    </descriptions>\n" +
        "                </item>\n" +
        "                <item enabled=\"true\" id=\"c1.1.1.2\" key=\"DIRECTIVE OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL\" type=\"CATEGORY\">\n" +
        "                    <names>\n" +
        "                        <name lang=\"EN\">Proposal for a directive</name>\n" +
        "                        <name lang=\"FR\">Proposition de directive</name>\n" +
        "                    </names>\n" +
        "                    <descriptions>\n" +
        "                        <description lang=\"EN\">Directive to be adopted by the European Parliament and the Council</description>\n" +
        "                        <description lang=\"FR\">Directive à adopter conjointement par le Parlement Européen et le Conseil</description>\n" +
        "                    </descriptions>\n" +
        "                </item>\n" +
        "                <item enabled=\"true\" id=\"c1.1.1.3\" key=\"DECISION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL\" type=\"CATEGORY\">\n" +
        "                    <names>\n" +
        "                        <name lang=\"EN\">Proposal for a decision</name>\n" +
        "                        <name lang=\"FR\">Proposition de décision</name>\n" +
        "                    </names>\n" +
        "                    <descriptions>\n" +
        "                        <description lang=\"EN\">Decision to be adopted by the European Parliament and the Council</description>\n" +
        "                        <description lang=\"FR\">Décision à adopter conjointement par le Parlement Européen et le Conseil</description>\n" +
        "                    </descriptions>\n" +
        "                    <languages>\n" +
        "                        <language lang=\"EN\">English</language>\n" +
        "                        <language lang=\"FR\">Français</language>\n" +
        "                    </languages>\n" +
        "                </item>\n" +
        "            </item>\n" +
        "            <item enabled=\"false\" id=\"c1.1.2\" key=\"SPECIAL_LEGISLATIVE_ACTS\" type=\"CATEGORY\">\n" +
        "                <names>\n" +
        "                    <name lang=\"EN\">Special legislative procedure</name>\n" +
        "                    <name lang=\"FR\">Special legislative procedure</name>\n" +
        "                </names>\n" +
        "                <descriptions>\n" +
        "                    <description lang=\"EN\">Council legal acts</description>\n" +
        "                    <description lang=\"FR\">Procédures législatives spéciales</description>\n" +
        "                </descriptions>\n" +
        "            </item>\n" +
        "            <item enabled=\"false\" id=\"c1.1.3\" key=\"COMMISSION_LEGAL_ACTS\" type=\"CATEGORY\">\n" +
        "                <names>\n" +
        "                    <name lang=\"EN\">Commission legal acts</name>\n" +
        "                    <name lang=\"FR\">Commission actes législatifs</name>\n" +
        "                </names>\n" +
        "                <descriptions>\n" +
        "                    <description lang=\"EN\">Commission legal acts</description>\n" +
        "                    <description lang=\"FR\">Commission actes législatifs</description>\n" +
        "                </descriptions>\n" +
        "            </item>\n" +
        "            <item enabled=\"true\" id=\"c1.1.4\" key=\"COUNCIL_LEGAL_ACTS\" type=\"CATEGORY\">\n" +
        "                <names>\n" +
        "                    <name lang=\"EN\">Council legal acts</name>\n" +
        "                    <name lang=\"FR\">Council actes législatifs</name>\n" +
        "                </names>\n" +
        "                <descriptions>\n" +
        "                    <description lang=\"EN\">Council legal acts</description>\n" +
        "                    <description lang=\"FR\">Council actes législatifs</description>\n" +
        "                </descriptions>\n" +
        "                <item enabled=\"true\" id=\"c1.1.4.1\" key=\"COUNCIL DECISION\" type=\"CATEGORY\">\n" +
        "                    <names>\n" +
        "                        <name lang=\"EN\">Proposal for a Council decision</name>\n" +
        "                        <name lang=\"FR\">Proposition de décision du Conseil</name>\n" +
        "                    </names>\n" +
        "                    <descriptions>\n" +
        "                        <description lang=\"EN\">Decision to be adopted by the Council</description>\n" +
        "                        <description lang=\"FR\">Décision à adopter par le Conseil</description>\n" +
        "                    </descriptions>\n" +
        "                    <languages>\n" +
        "                        <language lang=\"EN\">English</language>\n" +
        "                        <language lang=\"FR\">Français</language>\n" +
        "                    </languages>\n" +
        "                </item>\n" +
        "            </item>\n" +
        "        </item>\n" +
        "    </item>\n" +
        "    <item enabled=\"true\" hidden=\"true\" id=\"c2\" key=\"SUPPORTING_DOCUMENTS\" type=\"CATEGORY\">\n" +
        "        <names>\n" +
        "            <name lang=\"EN\">Other supporting documents</name>\n" +
        "        </names>\n" +
        "        <descriptions>\n" +
        "            <description lang=\"EN\">Other supporting documents</description>\n" +
        "        </descriptions>\n" +
        "    </item>\n" +
        "</catalog>";

    public static final String CATALOG_WITH_TEMPLATES = 
        "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n" +
        "<catalog lang=\"EN\">\n" +
        "    <item enabled=\"true\" id=\"c1\" key=\"LAW_INITIATIVE\" type=\"CATEGORY\">\n" +
        "        <names>\n" +
        "            <name lang=\"EN\">Interinstitutional procedures - Law Initiative (COM/JOIN)</name>\n" +
        "        </names>\n" +
        "        <descriptions>\n" +
        "            <description lang=\"EN\">Interinstitutional procedures - Law Initiative (COM/JOIN)</description>\n" +
        "        </descriptions>\n" +
        "        <item enabled=\"true\" id=\"c1.1\" key=\"LEGISLATIVE_ACTS\" type=\"CATEGORY\">\n" +
        "            <names>\n" +
        "                <name lang=\"EN\">Legal acts</name>\n" +
        "            </names>\n" +
        "            <descriptions>\n" +
        "                <description lang=\"EN\">Legal acts</description>\n" +
        "            </descriptions>\n" +
        "            <item enabled=\"true\" id=\"c1.1.1\" key=\"ORDINARY_LEGISLATIVE_PROC\" type=\"CATEGORY\">\n" +
        "                <names>\n" +
        "                    <name lang=\"EN\">Ordinary legislative procedure</name>\n" +
        "                </names>\n" +
        "                <descriptions>\n" +
        "                    <description lang=\"EN\">Ordinary legislative procedure</description>\n" +
        "                </descriptions>\n" +
        "                <item enabled=\"true\" id=\"c1.1.1.1\" key=\"REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL\" type=\"CATEGORY\">\n" +
        "                    <names>\n" +
        "                        <name lang=\"EN\">Proposal for a regulation</name>\n" +
        "                    </names>\n" +
        "                    <descriptions>\n" +
        "                        <description lang=\"EN\">Regulation to be adopted by the European Parliament and the Council</description>\n" +
        "                    </descriptions>\n" +
        "                    <item enabled=\"true\" id=\"t1\" key=\"TEMPLATE_1\" type=\"TEMPLATE\">\n" +
        "                        <names>\n" +
        "                            <name lang=\"EN\">Template 1</name>\n" +
        "                        </names>\n" +
        "                        <descriptions>\n" +
        "                            <description lang=\"EN\">Test template 1</description>\n" +
        "                        </descriptions>\n" +
        "                    </item>\n" +
        "                </item>\n" +
        "            </item>\n" +
        "        </item>\n" +
        "    </item>\n" +
        "    <item enabled=\"true\" id=\"c2\" key=\"SUPPORTING_DOCUMENTS\" type=\"CATEGORY\">\n" +
        "        <names>\n" +
        "            <name lang=\"EN\">Other supporting documents</name>\n" +
        "        </names>\n" +
        "        <descriptions>\n" +
        "            <description lang=\"EN\">Other supporting documents</description>\n" +
        "        </descriptions>\n" +
        "        <item enabled=\"true\" id=\"t2\" key=\"TEMPLATE_2\" type=\"TEMPLATE\">\n" +
        "            <names>\n" +
        "                <name lang=\"EN\">Template 2</name>\n" +
        "            </names>\n" +
        "            <descriptions>\n" +
        "                <description lang=\"EN\">Test template 2</description>\n" +
        "            </descriptions>\n" +
        "        </item>\n" +
        "    </item>\n" +
        "</catalog>";

    public static final String TEMPLATE_XML = 
        "<item enabled=\"true\" id=\"new_template\" key=\"NEW_TEMPLATE\" type=\"TEMPLATE\">\n" +
        "    <names>\n" +
        "        <name lang=\"EN\">New Template</name>\n" +
        "    </names>\n" +
        "    <descriptions>\n" +
        "        <description lang=\"EN\">New test template</description>\n" +
        "    </descriptions>\n" +
        "</item>";

    public static final String EMPTY_CATALOG_XML = 
        "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n" +
        "<catalog lang=\"EN\">\n" +
        "</catalog>";

    public static final String MALFORMED_XML = 
        "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n" +
        "<catalog lang=\"EN\">\n" +
        "    <item enabled=\"true\" id=\"c1\" key=\"LAW_INITIATIVE\" type=\"CATEGORY\">\n" +
        "        <names>\n" +
        "            <name lang=\"EN\">Test</name>\n" +
        "        </names>\n" +
        "    <!-- Missing closing item tag -->\n" +
        "</catalog>";
}