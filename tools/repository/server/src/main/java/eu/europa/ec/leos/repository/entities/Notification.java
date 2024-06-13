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
package eu.europa.ec.leos.repository.entities;

public class Notification {
    private String start;
    private String end;
    private String newsTimestamp;
    private String title;
    private String body;

    // Getter and Setter for start
    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    // Getter and Setter for end
    public String getEnd() {
        return end;
    }

    public void setEnd(String end) {
        this.end = end;
    }

    // Getter and Setter for newsTimestamp
    public String getNewsTimestamp() {
        return newsTimestamp;
    }

    public void setNewsTimestamp(String newsTimestamp) {
        this.newsTimestamp = newsTimestamp;
    }

    // Getter and Setter for title
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    // Getter and Setter for body
    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }
}
