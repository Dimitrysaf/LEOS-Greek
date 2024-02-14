USE leos_repository;

CREATE TABLE PERMISSION
( ID INT NOT NULL AUTO_INCREMENT,
  NAME VARCHAR(100) NOT NULL COMMENT "Name of the permission",
  DESCRIPTION VARCHAR(100) NOT NULL COMMENT "Description for permission",
  AUDIT_C_BY VARCHAR(30) NOT NULL COMMENT "Audit column holding the user that created this record",
  AUDIT_C_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT "Audit column holding the date at which this record was created",
  AUDIT_LAST_M_DATE TIMESTAMP COMMENT "Audit column holding the date of the last update on this record",
  AUDIT_LAST_M_BY VARCHAR(30) COMMENT "Audit column holding the user of the last update on this record",
  CONSTRAINT PERMISSION_PK PRIMARY KEY (ID)
) COMMENT "Table for permissions in LEOS" TABLESPACE leos_repository;

CREATE TABLE ACL
( ID INT NOT NULL AUTO_INCREMENT,
  IS_DIRECT DECIMAL(1,0) NOT NULL COMMENT "Is a direct acl",
  OBJECT_ID DECIMAL NOT NULL COMMENT "object id internal",
  PERMISSION_ID DECIMAL NOT NULL COMMENT "Permission for ACL",
  PRINCIPAL_ID VARCHAR(100) NOT NULL COMMENT "Principal id",
  AUDIT_C_BY VARCHAR(30) NOT NULL COMMENT "Audit column holding the user that created this record",
  AUDIT_C_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT "Audit column holding the date at which this record was created",
  AUDIT_LAST_M_DATE TIMESTAMP COMMENT "Audit column holding the date of the last update on this record",
  AUDIT_LAST_M_BY VARCHAR(30) COMMENT "Audit column holding the user of the last update on this record",
  CONSTRAINT ACL_PK PRIMARY KEY (ID)
) COMMENT "table for access control list" TABLESPACE leos_repository;

CREATE TABLE CHANGE_EVENT
( ID INT NOT NULL AUTO_INCREMENT,
  DOCUMENT_ID DECIMAL NOT NULL COMMENT "The document id for which we are logging data",
  CHANGE_TYPE VARCHAR(100) NOT NULL COMMENT "Type of change logged",
  CHANGE_LOG_TOKEN VARCHAR(100) NOT NULL COMMENT "Token of the change",
  CHANGE_TIME TIMESTAMP NOT NULL COMMENT "Time of the change",
  USERNAME VARCHAR(100) NOT NULL COMMENT "User did the change",
  AUDIT_C_BY VARCHAR(30) NOT NULL COMMENT "Audit column holding the user that created this record",
  AUDIT_C_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT "Audit column holding the date at which this record was created",
  AUDIT_LAST_M_DATE TIMESTAMP COMMENT "Audit column holding the date of the last update on this record",
  AUDIT_LAST_M_BY VARCHAR(30) COMMENT "Audit column holding the user of the last update on this record",
  CONSTRAINT CHANGE_EVENT_PK PRIMARY KEY (ID)
) COMMENT "Journaling tables for actions in LEOS" TABLESPACE leos_repository;

CREATE TABLE PACKAGE
( ID INT NOT NULL AUTO_INCREMENT,
  OBJECT_ID DECIMAL COMMENT "Object id from CMIS in case of migration",
  NAME VARCHAR(400) NOT NULL COMMENT "Name of the package",
  AUDIT_C_BY VARCHAR(30) NOT NULL COMMENT "Audit column holding the user that created this record",
  AUDIT_C_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT "Audit column holding the date at which this record was created",
  AUDIT_LAST_M_BY VARCHAR(30) COMMENT "Audit column holding the user of the last update on this record",
  AUDIT_LAST_M_DATE TIMESTAMP COMMENT "Audit column holding the date of the last update on this record",
  CONSTRAINT PACKAGE_PK PRIMARY KEY (ID),
  CONSTRAINT PACKAGE_UQ UNIQUE (NAME)
) COMMENT "Package table" TABLESPACE leos_repository;

CREATE TABLE DOCUMENT_CATEGORIES
( ID INT NOT NULL AUTO_INCREMENT COMMENT "Technical ID for a document category",
  CATEGORY_CODE VARCHAR(30) NOT NULL COMMENT "Code for a document category",
  CATEGORY_DESC VARCHAR(100) NOT NULL COMMENT "Description for the category code",
  AUDIT_C_BY VARCHAR(30) NOT NULL COMMENT "Audit column holding the user that created this record",
  AUDIT_C_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT "Audit column holding the date at which this record was created",
  AUDIT_LAST_M_BY VARCHAR(30) COMMENT "Audit column holding the user of the last update on this record",
  AUDIT_LAST_M_DATE TIMESTAMP COMMENT "Audit column holding the date of the last update on this record",
  CONSTRAINT DOCUMENT_CATEGORIES_PK PRIMARY KEY (ID),
  CONSTRAINT DOCUMENT_CATEGORIES_UQ UNIQUE (CATEGORY_CODE)
) COMMENT "Table for all categories for a document" TABLESPACE leos_repository;

CREATE TABLE DOCUMENT_VERSION
( ID INT NOT NULL AUTO_INCREMENT,
  DOCUMENT_ID DECIMAL NOT NULL COMMENT "Document ID for which this versions belongs to",
  VERSION_LABEL VARCHAR(100) NOT NULL COMMENT "Version label",
  VERSION_SERIES_ID VARCHAR(400) NOT NULL COMMENT "Version series ID",
  VERSION_TYPE VARCHAR(100) COMMENT "Version type",
  IS_LATEST_MAJOR_VERSION DECIMAL NOT NULL COMMENT "Is latest major version flag",
  IS_LATEST_VERSION DECIMAL NOT NULL COMMENT "Is latest version flag",
  IS_MAJOR_VERSION DECIMAL NOT NULL COMMENT "Is Major Version flag",
  IS_VERSION_SERIES_CHECKED_OUT DECIMAL NOT NULL COMMENT "Is version series checked out flag",
  IS_IMMUTABLE DECIMAL,
  COMMENTS VARCHAR(4000),
  AUDIT_C_BY VARCHAR(30) NOT NULL COMMENT "Audit column holding the user that created this record",
  AUDIT_C_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT "Audit column holding the date at which this record was created",
  AUDIT_LAST_M_BY VARCHAR(30) COMMENT "Audit column holding the user of the last update on this record",
  AUDIT_LAST_M_DATE TIMESTAMP COMMENT "Audit column holding the date of the last update on this record",
  CONSTRAINT DOCUMENT_VERSION_PK PRIMARY KEY (ID),
  CONSTRAINT DOCUMENT_VERSION_UQ UNIQUE (DOCUMENT_ID, VERSION_LABEL)
) COMMENT "Table of all versions for a document" TABLESPACE leos_repository;

CREATE TABLE DOCUMENT_PROPERTIES
( ID INT NOT NULL AUTO_INCREMENT,
  PROPERTY_NAME VARCHAR(30) NOT NULL COMMENT "Name of a property",
  DOC_CATEGORY_ID INT NOT NULL COMMENT "Document category for which this property is applicable",
  AUDIT_C_BY VARCHAR(30) NOT NULL COMMENT "Audit column holding the user that created this record",
  AUDIT_C_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT "Audit column holding the date at which this record was created",
  AUDIT_LAST_M_BY VARCHAR(30) COMMENT "Audit column holding the user of the last update on this record",
  AUDIT_LAST_M_DATE TIMESTAMP COMMENT "Audit column holding the date of the last update on this record",
  CONSTRAINT DOCUMENT_PROP_PK PRIMARY KEY (ID),
  CONSTRAINT DOCUMENT_PROP_FK FOREIGN KEY (DOC_CATEGORY_ID) REFERENCES DOCUMENT_CATEGORIES (ID),
  CONSTRAINT DOCUMENT_PROP_UQ UNIQUE (PROPERTY_NAME, DOC_CATEGORY_ID)
) COMMENT "Mapping of properties for categories of documents" TABLESPACE leos_repository;

CREATE TABLE DOCUMENT_PROPERTY_VALUES
( ID INT NOT NULL AUTO_INCREMENT,
  DOCUMENT_ID INT NOT NULL COMMENT "Document ID for which this property ID is applicable",
  VERSION_ID INT NOT NULL COMMENT "The version ID for which this document belongs to",
  PROPERTY_ID INT NOT NULL COMMENT "The property id applicable to this document and version id",
  PROPERTY_VALUE VARCHAR(4000) NOT NULL COMMENT "The value of the property",
  AUDIT_C_BY VARCHAR(30) NOT NULL COMMENT "Audit column holding the user that created this record",
  AUDIT_C_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT "Audit column holding the date at which this record was created",
  AUDIT_LAST_M_BY VARCHAR(30) COMMENT "Audit column holding the user of the last update on this record",
  AUDIT_LAST_M_DATE TIMESTAMP COMMENT "Audit column holding the date of the last update on this record",
  CONSTRAINT DOCUMENT_PROP_VAL_PK PRIMARY KEY (ID),
  CONSTRAINT DOCUMENT_PROP_VAL_FK FOREIGN KEY (PROPERTY_ID) REFERENCES DOCUMENT_PROPERTIES (ID),
  CONSTRAINT DOCUMENT_PROP_VAL_FK2 FOREIGN KEY (VERSION_ID) REFERENCES DOCUMENT_VERSION (ID)
) COMMENT "Actual values of properties for certain documents" TABLESPACE leos_repository;

CREATE TABLE DOCUMENT
( ID INT NOT NULL AUTO_INCREMENT,
  PACKAGE_ID INT NOT NULL COMMENT "The package id that document id belongs to",
  CATEGORY_ID INT NOT NULL COMMENT "Category ID for this document",
  NAME VARCHAR(100) NOT NULL COMMENT "Name of the document",
  CLONED_FROM VARCHAR(400) COMMENT "Cloned from this source",
  REVISION_STATUS VARCHAR(30) COMMENT "Revision status",
  CONTRIBUTION_STATUS VARCHAR(30) COMMENT "Contribution status",
  ORIGIN_REF VARCHAR(30) COMMENT "Origin REF",
  BASE_REVISION_ID VARCHAR(400) COMMENT "Base Revision ID",
  LIVE_DIFFING_REQUIRED DECIMAL COMMENT "Live diffing required flag",
  REF VARCHAR(100) NOT NULL COMMENT "REF string to identify the document",
  PROCEDURE_TYPE VARCHAR(100) COMMENT "Type of procedure",
  DOC_TEMPLATE VARCHAR(400) COMMENT "Document template",
  LANGUAGE VARCHAR(10) COMMENT "Language of the document",
  DOC_STAGE VARCHAR(400) COMMENT "Document stage",
  IS_PRIVATE_WORKING_COPY DECIMAL COMMENT "Is this a private working copy flag",
  IS_ARCHIVED DECIMAL COMMENT "Is this document archived",  
  AUDIT_C_BY VARCHAR(30) NOT NULL COMMENT "Audit column holding the user that created this record",
  AUDIT_C_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT "Audit column holding the date at which this record was created",
  AUDIT_LAST_M_DATE TIMESTAMP COMMENT "Audit column holding the date of the last update on this record",
  AUDIT_LAST_M_BY VARCHAR(30) COMMENT "Audit column holding the user of the last update on this record",
  CONSTRAINT DOCUMENT_PK PRIMARY KEY (ID),
  CONSTRAINT DOCUMENT_FK FOREIGN KEY (PACKAGE_ID) REFERENCES PACKAGE (ID),
  CONSTRAINT DOCUMENT_FK2 FOREIGN KEY (CATEGORY_ID) REFERENCES DOCUMENT_CATEGORIES (ID),
  CONSTRAINT DOCUMENT_UQ UNIQUE (REF, NAME)
) COMMENT "Table holding all metadata for documents" TABLESPACE leos_repository;

CREATE TABLE DOCUMENT_CONTENT
(	ID INT NOT NULL AUTO_INCREMENT,
     VERSION_ID INT NOT NULL COMMENT "Version id for the content",
     CATEGORY_CODE VARCHAR(100) NOT NULL COMMENT "Category code of the document",
     CONTENT LONGTEXT NOT NULL COMMENT "The content of the document",
     ACT_TYPE VARCHAR(100) NOT NULL COMMENT "",
     DOC_PURPOSE VARCHAR(400) NOT NULL COMMENT "Document purpose",
     DOC_TYPE VARCHAR(400) NOT NULL COMMENT "Document type",
     EEA_RELEVANCE DECIMAL COMMENT "Flag if it is EEA relevant or not",
     TEMPLATE VARCHAR(400) NOT NULL COMMENT "Template",
     TITLE VARCHAR(400) NOT NULL COMMENT "Title",
     AUDIT_C_BY VARCHAR(30) NOT NULL COMMENT "Audit column holding the user that created this record",
     AUDIT_C_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT "Audit column holding the date at which this record was created",
     AUDIT_LAST_M_BY VARCHAR(30) COMMENT "Audit column holding the user of the last update on this record",
     AUDIT_LAST_M_DATE TIMESTAMP COMMENT "Audit column holding the date of the last update on this record",
     CONSTRAINT DOCUMENT_CONTENT_PK PRIMARY KEY (ID),
     CONSTRAINT DOCUMENT_CONTENT_FK FOREIGN KEY (CATEGORY_CODE) REFERENCES DOCUMENT_CATEGORIES (CATEGORY_CODE),
     CONSTRAINT DOCUMENT_CONTENT_FK2 FOREIGN KEY (VERSION_ID) REFERENCES DOCUMENT_VERSION (ID),
     CONSTRAINT DOCUMENT_CONTENT_UQ UNIQUE (VERSION_ID)
) COMMENT "Table holding the actual document contents" TABLESPACE leos_repository;

CREATE TABLE DOCUMENT_MILESTONE
( ID INT NOT NULL AUTO_INCREMENT,
  DOCUMENT_ID INT NOT NULL COMMENT "This milestone ID is for this document id",
  JOB_ID VARCHAR(100) NOT NULL COMMENT "Job ID",
  JOB_DATE DATE NOT NULL COMMENT "Date of the job when milestone was created",
  STATUS VARCHAR(30) NOT NULL COMMENT "Status for milestone",  
  CONTENT BLOB NOT NULL COMMENT "The content of the milestone zip file",
  MILESTONE_COMMENTS VARCHAR(4000) COMMENT "Comments for this milestone",  
  AUDIT_C_BY VARCHAR(30) NOT NULL COMMENT "Audit column holding the user that created this record",
  AUDIT_C_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT "Audit column holding the date at which this record was created",
  AUDIT_LAST_M_BY VARCHAR(30) COMMENT "Audit column holding the user of the last update on this record",
  AUDIT_LAST_M_DATE TIMESTAMP COMMENT "Audit column holding the date of the last update on this record",
  CONSTRAINT DOCUMENT_MILESTONE_PK PRIMARY KEY (ID),
  CONSTRAINT DOCUMENT_MILESTONE_FK FOREIGN KEY (DOCUMENT_ID) REFERENCES DOCUMENT (ID)
) COMMENT "Table for all milestones" TABLESPACE leos_repository;

CREATE TABLE DOCUMENT_MILESTONE_LIST
(	ID INT NOT NULL AUTO_INCREMENT,
     MILESTONE_ID INT NOT NULL COMMENT "ID of the milestone",
     CONTAINED_DOCUMENTS VARCHAR(4000) NOT NULL COMMENT "List of containted documents",
     AUDIT_C_BY VARCHAR(30) NOT NULL COMMENT "Audit column holding the user that created this record",
     AUDIT_C_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT "Audit column holding the date at which this record was created",
     AUDIT_LAST_M_BY VARCHAR(30) COMMENT "Audit column holding the user of the last update on this record",
     AUDIT_LAST_M_DATE TIMESTAMP COMMENT "Audit column holding the date of the last update on this record",
     CONSTRAINT DOCUMENT_MIL_LIST_PK PRIMARY KEY (ID),
     CONSTRAINT DOCUMENT_MIL_LIST_FK FOREIGN KEY (MILESTONE_ID) REFERENCES DOCUMENT_MILESTONE (ID)
) COMMENT "List of all documents contained in a milestone" TABLESPACE leos_repository;

CREATE TABLE CONFIG_CATEGORIES
( ID INT NOT NULL AUTO_INCREMENT,
  CATEGORY_CODE VARCHAR(30) NOT NULL COMMENT "Code of the category for configuration file",
  CATEGORY_DESC VARCHAR(100) NOT NULL COMMENT "Description of the category code",
  AUDIT_C_BY VARCHAR(30) NOT NULL COMMENT "Audit column holding the user that created this record",
  AUDIT_C_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT "Audit column holding the date at which this record was created",
  AUDIT_LAST_M_BY VARCHAR(30) COMMENT "Audit column holding the user of the last update on this record",
  AUDIT_LAST_M_DATE TIMESTAMP COMMENT "Audit column holding the date of the last update on this record",
  CONSTRAINT CONFIG_CATEGORIES_PK PRIMARY KEY (ID),
  CONSTRAINT CONFIG_CATEGORIES_UQ UNIQUE (CATEGORY_CODE)
) COMMENT "Table of all categories for configuration files" TABLESPACE leos_repository;

CREATE TABLE CONFIG_VERSION
( ID INT NOT NULL AUTO_INCREMENT,
  CONFIG_ID INT NOT NULL COMMENT "ID configuration for this version id",
  VERSION_LABEL VARCHAR(100) NOT NULL COMMENT "Version Label",
  VERSION_SERIES_ID VARCHAR(400) NOT NULL COMMENT "version series id",
  VERSION_TYPE VARCHAR(100) NOT NULL COMMENT "version type",
  IS_LATEST_MAJOR_VERSION DECIMAL NOT NULL COMMENT "Is latest major version",
  IS_LATEST_VERSION DECIMAL NOT NULL COMMENT "is latest version",
  IS_MAJOR_VERSION DECIMAL NOT NULL COMMENT "is major version",
  IS_VERSION_SERIES_CHECKED_OUT DECIMAL NOT NULL COMMENT "is version series checked out",
  IS_IMMUTABLE DECIMAL(1,0) COMMENT "Is immutable",
  AUDIT_C_BY VARCHAR(30) NOT NULL COMMENT "Audit column holding the user that created this record",
  AUDIT_C_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT "Audit column holding the date at which this record was created",
  AUDIT_LAST_M_DATE TIMESTAMP COMMENT "Audit column holding the date of the last update on this record",
  AUDIT_LAST_M_BY VARCHAR(30) COMMENT "Audit column holding the user of the last update on this record",
  CONSTRAINT CONFIG_VERSION_PK PRIMARY KEY (ID),
  CONSTRAINT CONFIG_VERSION_UQ UNIQUE (CONFIG_ID, VERSION_LABEL)
) COMMENT "Versions for a configuration file" TABLESPACE leos_repository;

CREATE TABLE CONFIG_CONTENT
(	 ID INT NOT NULL AUTO_INCREMENT,
      VERSION_ID INT NOT NULL COMMENT "Version id of the configuration file that the content is stored",
      CONTENT LONGTEXT NOT NULL COMMENT "The actual content of the configuration file",
      CONTENT_STREAM_MIME_TYPE VARCHAR(100) COMMENT "Mime type",
      CONTENT_STREAM_FILENAME VARCHAR(4000) COMMENT "Filename",
      CONTENT_STREAM_ID VARCHAR(400) COMMENT "Stream id",
      CONTENT_STREAM_LENGTH VARCHAR(100) COMMENT "Stream length",
      AUDIT_C_BY VARCHAR(4000) NOT NULL,
      AUDIT_C_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT "Audit column holding the date at which this record was created",
      AUDIT_LAST_M_DATE TIMESTAMP COMMENT "Audit column holding the date of the last update on this record",
      AUDIT_LAST_M_BY VARCHAR(4000),
      CONSTRAINT CONFIG_CONTENT_PK PRIMARY KEY (ID),
      CONSTRAINT CONFIG_CONTENT_FK FOREIGN KEY (VERSION_ID) REFERENCES CONFIG_VERSION (ID),
      CONSTRAINT CONFIG_CONTENT_UQ UNIQUE (VERSION_ID)
) COMMENT "The content of configuration files" TABLESPACE leos_repository;

CREATE TABLE CONFIG
( ID INT NOT NULL AUTO_INCREMENT,
  NAME VARCHAR(100) NOT NULL COMMENT "Name of the configuration file",
  CATEGORY_ID INT NOT NULL COMMENT "Category ID for the configuration",
  LANGUAGE VARCHAR(10),  
  AUDIT_C_BY VARCHAR(30) NOT NULL COMMENT "Audit column holding the user that created this record",
  AUDIT_C_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT "Audit column holding the date at which this record was created",
  AUDIT_LAST_M_BY VARCHAR(30) COMMENT "Audit column holding the user of the last update on this record",
  AUDIT_LAST_M_DATE TIMESTAMP COMMENT "Audit column holding the date of the last update on this record",
  CONSTRAINT CONFIG_PK PRIMARY KEY (ID),
  CONSTRAINT CONFIG_FK FOREIGN KEY (CATEGORY_ID) REFERENCES CONFIG_CATEGORIES (ID),
  CONSTRAINT CONFIG_UQ UNIQUE (NAME)
) COMMENT "The configuration table for files such as config, templates, structure" TABLESPACE leos_repository;

CREATE TABLE COLLABORATORS
(
    ID INT NOT NULL AUTO_INCREMENT,
    COLLABORATOR_NAME VARCHAR(100) NOT NULL COMMENT "Name of the collaborator",
    ROLE_ID VARCHAR(100) NOT NULL COMMENT "The role id that it has inside organization",
    ORGANIZATION VARCHAR(100) NOT NULL COMMENT "Organization in which this collaborator works",
    AUDIT_C_BY VARCHAR(30) NOT NULL COMMENT "Audit column holding the user that created this record",
    AUDIT_C_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT "Audit column holding the date at which this record was created",
    AUDIT_LAST_M_DATE TIMESTAMP COMMENT "Audit column holding the date of the last update on this record",
    AUDIT_LAST_M_BY VARCHAR(30) COMMENT "Audit column holding the user of the last update on this record",
    CONSTRAINT COLLABORATORS_PK PRIMARY KEY (ID),
    CONSTRAINT COLLABORATORS_UQ UNIQUE (COLLABORATOR_NAME, ROLE_ID, ORGANIZATION)
) COMMENT "Collaborators table is a catalog of all collaborators in LEOS" TABLESPACE leos_repository;

CREATE TABLE PACKAGE_COLLABORATORS
(
    ID INT NOT NULL AUTO_INCREMENT,
    PACKAGE_ID INT NOT NULL COMMENT "Package id that the collaborator is assigned to",
    COLLABORATOR_ID INT NOT NULL COMMENT "Collaborator assigned to",
    IS_FAVORITE INT DEFAULT 0 NOT NULL COMMENT "Flag to mention if this package is set as favorite for the user",
    AUDIT_C_BY VARCHAR(30) NOT NULL COMMENT "Audit column holding the user that created this record",
    AUDIT_C_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT "Audit column holding the date at which this record was created",
    AUDIT_LAST_M_DATE TIMESTAMP COMMENT "Audit column holding the date of the last update on this record",
    AUDIT_LAST_M_BY VARCHAR(30) COMMENT "Audit column holding the user of the last update on this record",
    CONSTRAINT PACKAGE_COLLABORATORS_PK PRIMARY KEY (ID),
    CONSTRAINT PACKAGE_COLLABORATORS_FK FOREIGN KEY (PACKAGE_ID) REFERENCES PACKAGE (ID),
    CONSTRAINT PACKAGE_COLLABORATORS_FK2 FOREIGN KEY (COLLABORATOR_ID) REFERENCES COLLABORATORS (ID)
) COMMENT "Mapping between collaborators and the packages that they work on" TABLESPACE leos_repository;

CREATE INDEX DOC_MILESTONE_DOC_IDX ON DOCUMENT_MILESTONE (DOCUMENT_ID);

CREATE INDEX DOC_MIL_LIST_MIL_IDX ON DOCUMENT_MILESTONE_LIST (MILESTONE_ID);

CREATE INDEX DOC_VERSIONS_LMV_IDX ON DOCUMENT_VERSION (IS_LATEST_MAJOR_VERSION);

CREATE INDEX DOC_VERSIONS_LAV_IDX ON DOCUMENT_VERSION (IS_LATEST_VERSION);

CREATE INDEX DOC_VERSIONS_MAV_IDX ON DOCUMENT_VERSION (IS_MAJOR_VERSION);

CREATE INDEX DOC_VERSIONS_VCO_IDX ON DOCUMENT_VERSION (IS_VERSION_SERIES_CHECKED_OUT);

CREATE INDEX DOC_PRO_CAT_IDX ON DOCUMENT_PROPERTIES (DOC_CATEGORY_ID);

CREATE INDEX DOC_PROVAL_DOC_IDX ON DOCUMENT_PROPERTY_VALUES (DOCUMENT_ID);

CREATE INDEX DOC_PROVAL_PRO_IDX ON DOCUMENT_PROPERTY_VALUES (PROPERTY_ID);

CREATE INDEX PACKAGE_COLLABORATORS_IDX ON PACKAGE_COLLABORATORS (PACKAGE_ID);

CREATE INDEX PACKAGE_COLLABORATORS_IDX2 ON PACKAGE_COLLABORATORS (COLLABORATOR_ID);


CREATE OR REPLACE VIEW DOCUMENT_CATEGORIES_V (ID, CATEGORY_CODE, CATEGORY_DESC, AUDIT_C_BY, AUDIT_C_DATE, AUDIT_LAST_M_BY, AUDIT_LAST_M_DATE) AS
SELECT ID,CATEGORY_CODE,CATEGORY_DESC,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE FROM DOCUMENT_CATEGORIES;

CREATE OR REPLACE VIEW DOCUMENT_V  AS
SELECT doc.id||'_'||docver.id||'_'||doccat.id unique_id
     , doc.id document_id,0 doc_object_id,doc.category_id
     , doc.package_id, pkg.name package_name, docxml.version_id
     , doccat.category_code, doccat.category_desc
     , doc.name, doc.cloned_from,doc.revision_status,doc.contribution_status,doc.origin_ref,doc.base_revision_id,doc.live_diffing_required,doc.ref,doc.procedure_type,doc.doc_template,doc.language,doc.doc_stage,doc.is_private_working_copy
     , docver.audit_c_by doc_audit_c_by,docver.audit_c_date doc_audit_c_date,docver.audit_last_m_date doc_audit_last_m_date,docver.audit_last_m_by doc_audit_last_m_by
     , docver.version_label, docver.version_series_id, docver.version_type, docver.is_latest_major_version, docver.is_latest_version, docver.is_major_version, docver.is_version_series_checked_out
     , docxml.act_type, docxml.doc_purpose, docxml.doc_type, docxml.eea_relevance, docxml.template, docxml.title, docver.comments, doc.is_archived, (SELECT count(*) FROM document_property_values dpv WHERE dpv.version_id = docver.id) AS num_props
FROM document doc, document_version docver, document_content docxml, document_categories_v doccat, PACKAGE pkg
WHERE doc.id = docver.document_id
  AND docver.id = docxml.version_id
  AND doc.category_id = doccat.id AND doc.package_id = pkg.id;

CREATE OR REPLACE VIEW MILESTONE_V AS
SELECT doc.id||'_'||docmil.id unique_id, doc.id document_id,doc.package_id,pkg.name package_name,0 doc_object_id,doc.category_id,doccat.category_code,doc.name,doc.cloned_from,doc.revision_status,doc.contribution_status,doc.origin_ref,doc.base_revision_id,doc.live_diffing_required,doc.ref,doc.procedure_type,
       doc.doc_template,doc.language,doc.doc_stage,doc.is_private_working_copy,doc.audit_c_by doc_audit_c_by,doc.audit_c_date doc_audit_c_date,doc.audit_last_m_date doc_audit_last_m_date,doc.audit_last_m_by doc_audit_last_m_by, docmil.id milestone_id, docmil.job_id, docmil.job_date, docmil.milestone_comments,
       docmil.status, docmil.audit_c_by,docmil.audit_c_date, docmil.audit_last_m_date, docmil.audit_last_m_by
FROM document doc, document_milestone docmil, PACKAGE pkg, document_categories doccat
WHERE doc.id = docmil.document_id AND doc.category_id = doccat.id AND doc.package_id = pkg.id;

CREATE OR REPLACE VIEW MILESTONE_LIST_V as
SELECT milv.milestone_id||'_'||millis.id unique_id, milv.package_id, milv.document_id, milv.milestone_id
     , millis.contained_documents, millis.audit_c_by, millis.audit_c_date, millis.audit_last_m_date, millis.audit_last_m_by
FROM milestone_v milv, document_milestone_list millis
WHERE milv.milestone_id = millis.milestone_id;

CREATE OR REPLACE VIEW CONFIGURATION_V as
SELECT conf.id||'_'||ver.id||'_'||con.id||'_'||cat.id unique_id, conf.ID, CONF.NAME, 0 OBJECT_ID,
       ver.config_id,cat.category_code, cat.category_desc, ver.version_label,ver.version_series_id,ver.version_type,ver.is_latest_major_version,ver.is_latest_version,ver.is_major_version,ver.is_version_series_checked_out,ver.audit_c_by,ver.audit_c_date,ver.audit_last_m_by,ver.audit_last_m_date,ver.is_immutable
        , con.content,con.content_stream_mime_type,con.content_stream_filename,con.content_stream_id,con.content_stream_length
FROM config conf, config_version ver, config_content con, config_categories cat
WHERE
        conf.id = ver.config_id
  and ver.id = con.version_id
  AND conf.CATEGORY_ID = cat.ID;