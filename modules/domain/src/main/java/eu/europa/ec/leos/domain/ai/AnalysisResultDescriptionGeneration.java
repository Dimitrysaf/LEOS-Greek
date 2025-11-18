package eu.europa.ec.leos.domain.ai;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonSetter;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
public class AnalysisResultDescriptionGeneration extends AnalysisResult {
    private String article_heading;
    private String explanation;
    private List<String> eId;
    private String text;
    private List<String> categories;
    private String description;
    private List<String> high_level_process;
    private List<String> actors;
    private int provision_count;

    @JsonSetter("categories")
    public void setCategories(Object category) {
        if (category instanceof String) {
            this.categories = new ArrayList();
            this.categories.add((String)category);
        } else {
            this.categories = (List)category;
        }
    }

    @JsonSetter("high_level_process")
    public void setHighLevelProcess(Object high_level_process) {
        if (high_level_process instanceof String) {
            this.high_level_process = new ArrayList();
            this.high_level_process.add((String)high_level_process);
        } else {
            this.high_level_process = (List)high_level_process;
        }
    }

    @JsonSetter("actors")
    public void setActors(Object actors) {
        if (actors instanceof String) {
            this.actors = new ArrayList();
            this.actors.add((String)actors);
        } else {
            this.actors = (List)actors;
        }
    }

    @JsonSetter("eId")
    public void setEId(Object eId) {
        if (eId instanceof String) {
            this.eId = new ArrayList();
            this.eId.add((String)eId);
        } else {
            this.eId = (List)eId;
        }
    }

    @JsonGetter("eId")
    public List<String> getEId() {
        return this.eId;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof AnalysisResultDescriptionGeneration)) return false;
        AnalysisResultDescriptionGeneration that = (AnalysisResultDescriptionGeneration) o;
        return provision_count == that.provision_count && Objects.equals(article_heading, that.article_heading) && Objects.equals(explanation, that.explanation) && Objects.equals(eId, that.eId) && Objects.equals(text, that.text) && Objects.equals(categories, that.categories) && Objects.equals(description, that.description) && Objects.equals(high_level_process, that.high_level_process) && Objects.equals(actors, that.actors);
    }

    @Override
    public int hashCode() {
        return Objects.hash(article_heading, explanation, eId, text, categories, description, high_level_process, actors, provision_count);
    }
}
