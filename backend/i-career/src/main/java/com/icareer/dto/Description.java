package com.icareer.dto;

import java.io.Serializable;

public class Description implements Serializable {
	private static final long serialVersionUID = 7290140403500902812L;
	
	private String titleUrl;
    private String description;
    private String error;
    private String title;

    public Description() {}

    public String getTitleUrl() {
        return titleUrl;
    }

    public void setTitleUrl(String titleUrl) {
        this.titleUrl = titleUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String toString() {
        return "RawDescription{" +
                "titleUrl='" + titleUrl + '\'' +
                ", description='" + description + '\'' +
                ", error='" + error + '\'' +
                ", title='" + title + '\'' +
                '}';
    }
}
