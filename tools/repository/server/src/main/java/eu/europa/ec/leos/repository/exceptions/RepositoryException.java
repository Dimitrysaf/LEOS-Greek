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
package eu.europa.ec.leos.repository.exceptions;

public class RepositoryException extends Exception {

    public enum RepositoryExceptionCode {
        DB_NOT_FOUND("Object not found in db"),
        PARA_NOT_FOUND("Parameter not found"),
        ERROR_WHILE_CREATING("Error while creating"),
        ERROR_WHILE_DELETING("Error while deleting");;

        private String detail;

        private RepositoryExceptionCode(String detail) {
            this.detail = detail;
        }

        public String getDetail() {
            return this.detail;
        }
    }

    private RepositoryExceptionCode code;
    private String name;

    public RepositoryException(RepositoryExceptionCode code, String name) {
        this.code = code;
        this.name = name;
    }

    public RepositoryExceptionCode getCode() {
        return this.code;
    }

    public String getName() {
        return this.name;
    }
}
