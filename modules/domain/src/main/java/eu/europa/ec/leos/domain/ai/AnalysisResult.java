package eu.europa.ec.leos.domain.ai;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnalysisResult {
    public int id;
    public String legal_resource_celex;
    public Boolean validated;
    public String updated_at;
    public String created_at;
    public String analysis_type;
}
