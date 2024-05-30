package eu.europa.ec.leos.domain.repository;

import java.util.Objects;

public class LeosPackage {
    private final String id;
    private final String name;
    private final String path;
    private String language;
    private Boolean isTranslated;

    public LeosPackage(String id, String name, String path) {
        this.id = id;
        this.name = name;
        this.path = path;
    }

    public LeosPackage(String id, String name, String path, String language, Boolean isTranslated) {
        this.id = id;
        this.name = name;
        this.path = path;
        this.language = language;
        this.isTranslated = isTranslated;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPath() {
        return path;
    }

    public String getLanguage() {
        return language;
    }

    public Boolean getTranslated() {
        return isTranslated;
    }

    @Override
    public String toString() {
        return "LeosPackage{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", path='" + path + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LeosPackage that = (LeosPackage) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(name, that.name) &&
                Objects.equals(path, that.path);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, path);
    }
}
