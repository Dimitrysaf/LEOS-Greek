package eu.europa.ec.leos.services.dto.request;

import eu.europa.ec.leos.model.annex.AnnexStructureType;

public class SwitchAnnexStructureTypeRequest {
    private AnnexStructureType annexStructureType;

    public AnnexStructureType getAnnexStructureType() {
        return annexStructureType;
    }

    public void setAnnexStructureType(AnnexStructureType annexStructureType) {
        this.annexStructureType = annexStructureType;
    }
}
