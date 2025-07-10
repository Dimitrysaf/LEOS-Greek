/*
 * Copyright 2025 European Union
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
package eu.europa.ec.digit.leos.pilot.export.exception.metadata;

/**
 * General exception class for processing metadata fields
 * */
public abstract class MetadataFieldException extends Exception {
    protected String fieldName;

    protected MetadataFieldException(final String message, final String fieldName) {
        super(message);
        this.fieldName = fieldName;
    }

    protected MetadataFieldException setFieldName(String fieldName) {
        this.fieldName = fieldName;
        return this;
    }

    public String getFieldName() {
        return this.fieldName;
    }

    @Override
    public String toString() {
        return "MetadataFieldException{" +
                "fieldName='" + fieldName + '\'' +
                '}';
    }
}
