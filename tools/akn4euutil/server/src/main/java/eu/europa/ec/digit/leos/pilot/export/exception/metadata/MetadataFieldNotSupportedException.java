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
 * Exception is thrown for field keys that are not a part of {@link eu.europa.ec.digit.leos.pilot.export.model.metadata.MetadataFieldType}
 * */
public class MetadataFieldNotSupportedException extends MetadataFieldException {
    private MetadataFieldNotSupportedException(final String fieldName) {
        super("Field with name '" + fieldName + "' is not supported!", fieldName);
    }

    public static MetadataFieldNotSupportedException newException(final String fieldName) {
        return new MetadataFieldNotSupportedException(fieldName);
    }
}
