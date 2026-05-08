/*
 * Copyright 2026 European Union
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

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "DOCUMENT_PREVIEW", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"DOCUMENT_REF", "VERSION_LABEL"})
})
@Getter
@Setter
@NoArgsConstructor
public class DocumentPreview implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private BigDecimal id;

    @Column(name = "DOCUMENT_VERSION_ID", nullable = false, precision = 22, scale = 0)
    private BigDecimal documentVersionId;

    @Column(name = "DOCUMENT_REF", nullable = false, length = 400)
    private String documentRef;

    @Column(name = "VERSION_LABEL", nullable = false, length = 100)
    private String versionLabel;

    @Lob
    @Column(name = "CONTENT")
    private byte[] content;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", length = 30)
    private DocumentPreviewStatus status;

    @Column(name = "AUDIT_C_DATE", nullable = false)
    private LocalDateTime auditCDate;

    @Column(name = "AUDIT_M_DATE")
    private LocalDateTime auditMDate;

    public DocumentPreview(BigDecimal documentVersionId, String documentRef, String versionLabel, byte[] content, DocumentPreviewStatus status) {
        this.documentVersionId = documentVersionId;
        this.documentRef = documentRef;
        this.versionLabel = versionLabel;
        this.content = content;
        this.status = status;
        this.auditCDate = LocalDateTime.now();
    }
}
