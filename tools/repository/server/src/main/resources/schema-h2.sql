--------------------------------------------------------
--  DDL for Table CONFIG
--------------------------------------------------------

CREATE TABLE CONFIG
(	ID NUMBER(22,0) NOT NULL AUTO_INCREMENT,
     NAME VARCHAR2(100),
     OBJECT_ID NUMBER(22,0),
     AUDIT_C_BY VARCHAR2(30),
     AUDIT_C_DATE TIMESTAMP (6),
     AUDIT_LAST_M_BY VARCHAR2(30),
     AUDIT_LAST_M_DATE TIMESTAMP (6),
     ORIGINAL_ID NUMBER(22,0),
     REPOSITORY_ID NUMBER(22,0),
     LANGUAGE VARCHAR2(10)
) ;
--------------------------------------------------------
--  DDL for Table CONFIG_CATEGORIES
--------------------------------------------------------

CREATE TABLE CONFIG_CATEGORIES
(	ID NUMBER(22,0) NOT NULL AUTO_INCREMENT,
     CATEGORY_CODE VARCHAR2(30),
     CATEGORY_DESC VARCHAR2(100),
     AUDIT_C_BY VARCHAR2(30),
     AUDIT_C_DATE TIMESTAMP (6),
     AUDIT_LAST_M_BY VARCHAR2(30),
     AUDIT_LAST_M_DATE TIMESTAMP (6),
     CATEGORY_TYPE VARCHAR2(40)
) ;
--------------------------------------------------------
--  DDL for Table CONFIG_CONTENT
--------------------------------------------------------

CREATE TABLE CONFIG_CONTENT
(	VERSION_ID NUMBER(22,0),
     CONTENT BLOB,
     CONTENT_STREAM_MIME_TYPE VARCHAR2(4000),
     CONTENT_STREAM_FILENAME VARCHAR2(4000),
     CONTENT_STREAM_ID VARCHAR2(4000),
     CONTENT_STREAM_LENGTH VARCHAR2(4000),
     AUDIT_C_BY VARCHAR2(4000),
     AUDIT_C_DATE TIMESTAMP (9),
     AUDIT_LAST_M_DATE TIMESTAMP (9),
     AUDIT_LAST_M_BY VARCHAR2(4000),
     ID NUMBER(22,0) NOT NULL AUTO_INCREMENT
) ;
--------------------------------------------------------
--  DDL for Table CONFIG_VERSION
--------------------------------------------------------

CREATE TABLE CONFIG_VERSION
(	ID NUMBER(22,0) NOT NULL AUTO_INCREMENT,
     CONFIG_ID NUMBER(22,0),
     CONFIG_TYPE NUMBER(22,0),
     VERSION_LABEL VARCHAR2(100),
     VERSION_SERIES_ID VARCHAR2(400),
     VERSION_TYPE VARCHAR2(100),
     IS_LATEST_MAJOR_VERSION NUMBER(1,0),
     IS_LATEST_VERSION NUMBER(1,0),
     IS_MAJOR_VERSION NUMBER(1,0),
     IS_VERSION_SERIES_CHECKED_OUT NUMBER(1,0),
     AUDIT_C_BY VARCHAR2(30),
     AUDIT_C_DATE TIMESTAMP (6) DEFAULT SYSDATE,
     AUDIT_LAST_M_DATE TIMESTAMP (6),
     AUDIT_LAST_M_BY VARCHAR2(30),
     IS_IMMUTABLE NUMBER(1,0)
) ;
--------------------------------------------------------
--  DDL for Table DOCUMENT
--------------------------------------------------------

CREATE TABLE DOCUMENT
(	ID NUMBER(22,0),
     OBJECT_ID NUMBER(22,0),
     PACKAGE_ID NUMBER(22,0),
     DOC_TYPE_ID NUMBER(22,0),
     CATEGORY_ID NUMBER(22,0),
     NAME VARCHAR2(400),
     CLONED_FROM NUMBER(22,0),
     COLLABORATORS VARCHAR2(400),
     REVISION_STATUS VARCHAR2(30),
     CONTRIBUTION_STATUS VARCHAR2(30),
     ORIGINAL_REF NUMBER(22,0),
     BASE_REVISION_ID NUMBER(22,0),
     LIVE_DIFFING_REQUIRED NUMBER(1,0),
     REF VARCHAR2(400),
     PROCEDURE_TYPE VARCHAR2(100),
     DOC_TEMPLATE VARCHAR2(400),
     LANGUAGE VARCHAR2(10),
     DOC_STAGE VARCHAR2(400),
     IS_PRIVATE_WORKING_COPY NUMBER(1,0),
     AUDIT_C_BY VARCHAR2(30),
     AUDIT_C_DATE TIMESTAMP (6) DEFAULT SYSTIMESTAMP,
     AUDIT_LAST_M_DATE TIMESTAMP (6),
     AUDIT_LAST_M_BY VARCHAR2(30)
) ;
--------------------------------------------------------
--  DDL for Table DOCUMENT_CATEGORIES
--------------------------------------------------------

CREATE TABLE DOCUMENT_CATEGORIES
(	ID NUMBER(22,0) NOT NULL AUTO_INCREMENT,
     CATEGORY_CODE VARCHAR2(30),
     CATEGORY_DESC VARCHAR2(100),
     AUDIT_C_BY VARCHAR2(30),
     AUDIT_C_DATE TIMESTAMP (6) DEFAULT SYSDATE,
     AUDIT_LAST_M_BY VARCHAR2(30),
     AUDIT_LAST_M_DATE TIMESTAMP (6)
) ;

--------------------------------------------------------
--  DDL for Table DOCUMENT_CONTENT
--------------------------------------------------------

CREATE TABLE DOCUMENT_CONTENT
(	ID NUMBER(22,0) NOT NULL AUTO_INCREMENT,
     VERSION_ID NUMBER(22,0),
     CATEGORY_CODE VARCHAR2(100),
     CONTENT BLOB,
     ACT_TYPE VARCHAR2(100),
     DOC_PURPOSE VARCHAR2(400),
     DOC_TYPE VARCHAR2(400),
     EEA_RELEVANCE NUMBER(1,0),
     TEMPLATE VARCHAR2(400),
     TITLE VARCHAR2(400),
     AUDIT_C_BY VARCHAR2(30),
     AUDIT_C_DATE TIMESTAMP (6) DEFAULT SYSTIMESTAMP,
     AUDIT_LAST_M_BY VARCHAR2(30),
     AUDIT_LAST_M_DATE TIMESTAMP (6)
) ;
--------------------------------------------------------
--  DDL for Table DOCUMENT_MILESTONE
--------------------------------------------------------

CREATE TABLE DOCUMENT_MILESTONE
(	ID NUMBER(22,0) NOT NULL AUTO_INCREMENT,
     DOCUMENT_ID NUMBER(22,0),
     JOB_DATE DATE,
     CLONED_MILESTONE_ID NUMBER(22,0),
     MILESTONE_COMMENTS VARCHAR2(4000),
     CONTENT BLOB,
     STATUS VARCHAR2(30),
     AUDIT_C_BY VARCHAR2(30),
     AUDIT_C_DATE TIMESTAMP (6) DEFAULT SYSDATE,
     AUDIT_LAST_M_BY VARCHAR2(30),
     AUDIT_LAST_M_DATE TIMESTAMP (6),
     MILESTONE_ID NUMBER(22,0),
     EXPORT_STATUS VARCHAR2(30),
     EXPORT_DATE TIMESTAMP (6)
) ;
--------------------------------------------------------
--  DDL for Table DOCUMENT_MILESTONE_COMMENTS
--------------------------------------------------------

CREATE TABLE DOCUMENT_MILESTONE_COMMENTS
(	ID NUMBER(22,0) NOT NULL AUTO_INCREMENT,
     MILESTONE_ID NUMBER(22,0),
     COMMENTS VARCHAR2(4000),
     AUDIT_C_BY VARCHAR2(30),
     AUDIT_C_DATE TIMESTAMP (6) DEFAULT SYSDATE,
     AUDIT_LAST_M_BY VARCHAR2(30),
     AUDIT_LAST_M_DATE TIMESTAMP (6)
) ;
--------------------------------------------------------
--  DDL for Table DOCUMENT_MILESTONE_LIST
--------------------------------------------------------

CREATE TABLE DOCUMENT_MILESTONE_LIST
(	ID NUMBER(22,0) NOT NULL AUTO_INCREMENT,
     MILESTONE_ID NUMBER(22,0),
     CONTAINED_DOCUMENTS VARCHAR2(4000),
     AUDIT_C_BY VARCHAR2(30),
     AUDIT_C_DATE TIMESTAMP (6) DEFAULT SYSDATE,
     AUDIT_LAST_M_BY VARCHAR2(30),
     AUDIT_LAST_M_DATE TIMESTAMP (6)
) ;
--------------------------------------------------------
--  DDL for Table DOCUMENT_PROPERTIES
--------------------------------------------------------

CREATE TABLE DOCUMENT_PROPERTIES
(	ID NUMBER(22,0) NOT NULL AUTO_INCREMENT,
     PROPERTY_NAME VARCHAR2(30),
     DOC_CATEGORY_ID NUMBER(22,0),
     AUDIT_C_BY VARCHAR2(30),
     AUDIT_C_DATE TIMESTAMP (6) DEFAULT SYSDATE,
     AUDIT_LAST_M_BY VARCHAR2(30),
     AUDIT_LAST_M_DATE TIMESTAMP (6)
) ;
--------------------------------------------------------
--  DDL for Table DOCUMENT_PROPERTY_VALUES
--------------------------------------------------------

CREATE TABLE DOCUMENT_PROPERTY_VALUES
(	ID NUMBER(22,0) NOT NULL AUTO_INCREMENT,
     DOCUMENT_ID NUMBER(22,0),
     PROPERTY_ID NUMBER(22,0),
     PROPERTY_VALUE VARCHAR2(4000),
     AUDIT_C_BY VARCHAR2(30),
     AUDIT_C_DATE TIMESTAMP (6) DEFAULT SYSDATE,
     AUDIT_LAST_M_BY VARCHAR2(30),
     AUDIT_LAST_M_DATE TIMESTAMP (6),
     VERSION_ID NUMBER(22,0)
) ;
--------------------------------------------------------
--  DDL for Table DOCUMENT_VERSION
--------------------------------------------------------

CREATE TABLE DOCUMENT_VERSION
(	ID NUMBER(22,0) NOT NULL AUTO_INCREMENT,
     VERSION_LABEL VARCHAR2(100),
     VERSION_SERIES_ID VARCHAR2(400),
     VERSION_TYPE VARCHAR2(100),
     IS_LATEST_MAJOR_VERSION NUMBER(1,0),
     IS_LATEST_VERSION NUMBER(1,0),
     IS_MAJOR_VERSION NUMBER(1,0),
     IS_VERSION_SERIES_CHECKED_OUT NUMBER(1,0),
     AUDIT_C_BY VARCHAR2(30),
     AUDIT_C_DATE TIMESTAMP (6) DEFAULT SYSDATE,
     AUDIT_LAST_M_BY VARCHAR2(30),
     AUDIT_LAST_M_DATE TIMESTAMP (6),
     IS_IMMUTABLE NUMBER(1,0),
     DOCUMENT_ID NUMBER(22,0)
) ;
--------------------------------------------------------
--  DDL for Table PACKAGE
--------------------------------------------------------

CREATE TABLE PACKAGE
(	ID NUMBER(22,0) NOT NULL AUTO_INCREMENT,
     OBJECT_ID NUMBER(22,0),
     NAME VARCHAR2(400),
     REPOSITORY_ID NUMBER(22,0),
     AUDIT_C_BY VARCHAR2(30),
     AUDIT_C_DATE TIMESTAMP (6) DEFAULT SYSDATE,
     AUDIT_LAST_M_BY VARCHAR2(30),
     AUDIT_LAST_M_DATE TIMESTAMP (6),
     ORIGINAL_ID NUMBER(22,0),
     IS_CLONED NUMBER(1,0) DEFAULT 0,
     CLONED_PACKAGE_NAME VARCHAR2(100),
     CLONED_PACKAGE_ID NUMBER(22,0)
) ;
--------------------------------------------------------
--  DDL for Table PERMISSION
--------------------------------------------------------

CREATE TABLE PERMISSION
(	ID NUMBER(22,0),
     REPOSITORY_ID NUMBER(22,0),
     NAME VARCHAR2(100),
     DESCRIPTION VARCHAR2(100),
     AUDIT_C_BY VARCHAR2(30),
     AUDIT_C_DATE TIMESTAMP (6) DEFAULT SYSTIMESTAMP,
     AUDIT_LAST_M_DATE TIMESTAMP (6),
     AUDIT_LAST_M_BY VARCHAR2(30)
) ;
--------------------------------------------------------
--  DDL for Table REPOSITORY
--------------------------------------------------------

CREATE TABLE REPOSITORY
(	ID NUMBER(22,0),
     CMIS_ID VARCHAR2(100),
     NAME VARCHAR2(100),
     DESCRIPTION VARCHAR2(100),
     ALL_VERSIONS_SEARCHABLE NUMBER(1,0),
     AUDIT_C_BY VARCHAR2(30),
     AUDIT_C_DATE TIMESTAMP (6) DEFAULT SYSTIMESTAMP,
     AUDIT_LAST_M_DATE TIMESTAMP (6),
     AUDIT_LAST_M_BY VARCHAR2(30)
) ;
--------------------------------------------------------
--  DDL for View CONFIGURATION_V
--------------------------------------------------------

CREATE VIEW CONFIGURATION_V (ID, NAME, OBJECT_ID, CONFIG_ID, CONFIG_TYPE, CATEGORY_CODE, CATEGORY_DESC, VERSION_LABEL, VERSION_SERIES_ID, VERSION_TYPE, IS_LATEST_MAJOR_VERSION, IS_LATEST_VERSION, IS_MAJOR_VERSION, IS_VERSION_SERIES_CHECKED_OUT, AUDIT_C_BY, AUDIT_C_DATE, AUDIT_LAST_M_BY, AUDIT_LAST_M_DATE, IS_IMMUTABLE, CONTENT, CONTENT_STREAM_MIME_TYPE, CONTENT_STREAM_FILENAME, CONTENT_STREAM_ID, CONTENT_STREAM_LENGTH) AS
SELECT conf.ID, CONF.NAME, CONF.OBJECT_ID,
       ver.config_id,ver.config_type,cat.category_code, cat.category_desc, ver.version_label,ver.version_series_id,ver.version_type,ver.is_latest_major_version,ver.is_latest_version,ver.is_major_version,ver.is_version_series_checked_out,ver.audit_c_by,ver.audit_c_date,ver.audit_last_m_by,ver.audit_last_m_date,ver.is_immutable
        , con.content,con.content_stream_mime_type,con.content_stream_filename,con.content_stream_id,con.content_stream_length
FROM config conf, config_version ver, config_content con, config_categories cat
WHERE
        conf.id = ver.config_id
  and ver.id = con.version_id
  and ver.config_type = cat.id
;
--------------------------------------------------------
--  DDL for View DOCUMENT_CATEGORIES_V
--------------------------------------------------------

CREATE VIEW DOCUMENT_CATEGORIES_V (ID, CATEGORY_CODE, CATEGORY_DESC, AUDIT_C_BY, AUDIT_C_DATE, AUDIT_LAST_M_BY, AUDIT_LAST_M_DATE) AS
SELECT ID,CATEGORY_CODE,CATEGORY_DESC,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE FROM DOCUMENT_CATEGORIES
;
--------------------------------------------------------
--  DDL for View DOCUMENT_PROPERTIES_V
--------------------------------------------------------

CREATE VIEW DOCUMENT_PROPERTIES_V (ID, OBJECT_ID, PACKAGE_ID, DOC_TYPE_ID, CATEGORY_ID, CATEGORY_CODE, CATEGORY_DESC, NAME, VERSION_ID, VERSION_LABEL, VERSION_SERIES_ID, VERSION_TYPE, PROP_ID, PROPERTY_NAME, PROP_VALUE_ID, PROPERTY_VALUE, AUDIT_C_BY, AUDIT_C_DATE, AUDIT_LAST_M_BY, AUDIT_LAST_M_DATE) AS
SELECT doc.id,doc.object_id,doc.package_id,doc.doc_type_id,doc.category_id,cat.category_code,cat.category_desc,doc.name
     , proval.version_id, docver.version_label,docver.version_series_id,docver.version_type
     , pro.id prop_id,pro.property_name
     , proval.id prop_value_id,proval.property_value,proval.audit_c_by,proval.audit_c_date,proval.audit_last_m_by,proval.audit_last_m_date
FROM document doc, document_categories cat, document_version docver, document_properties pro, document_property_values proval
WHERE doc.category_id = cat.id
  AND cat.id = pro.doc_category_id
  AND doc.id = proval.document_id
  AND pro.id = proval.property_id
  AND proval.version_id = docver.id
  AND doc.id = docver.document_id
;
--------------------------------------------------------
--  DDL for View DOCUMENT_V
--------------------------------------------------------

CREATE VIEW DOCUMENT_V (DOCUMENT_ID, DOC_OBJECT_ID, DOC_TYPE_ID, CATEGORY_ID, CATEGORY_CODE, CATEGORY_DESC, NAME, CLONED_FROM, COLLABORATORS, REVISION_STATUS, CONTRIBUTION_STATUS, ORIGINAL_REF, BASE_REVISION_ID, LIVE_DIFFING_REQUIRED, REF, PROCEDURE_TYPE, DOC_TEMPLATE, LANGUAGE, DOC_STAGE, IS_PRIVATE_WORKING_COPY, DOC_AUDIT_C_BY, DOC_AUDIT_C_DATE, DOC_AUDIT_LAST_M_DATE, DOC_AUDIT_LAST_M_BY, VERSION_LABEL, VERSION_SERIES_ID, VERSION_TYPE, IS_LATEST_MAJOR_VERSION, IS_LATEST_VERSION, IS_MAJOR_VERSION, IS_VERSION_SERIES_CHECKED_OUT, CONTENT, ACT_TYPE, DOC_PURPOSE, DOC_TYPE, EEA_RELEVANCE, TEMPLATE, TITLE) AS
SELECT doc.id document_id,doc.object_id doc_object_id,doc.doc_type_id,doc.category_id
     , doccat.category_code, doccat.category_desc
     , doc.name,doc.cloned_from,doc.collaborators,doc.revision_status,doc.contribution_status,doc.original_ref,doc.base_revision_id,doc.live_diffing_required,doc.ref,doc.procedure_type,doc.doc_template,doc.language,doc.doc_stage,doc.is_private_working_copy,doc.audit_c_by doc_audit_c_by,doc.audit_c_date doc_audit_c_date,doc.audit_last_m_date doc_audit_last_m_date,doc.audit_last_m_by doc_audit_last_m_by
     , docver.version_label, docver.version_series_id, docver.version_type, docver.is_latest_major_version, docver.is_latest_version, docver.is_major_version, docver.is_version_series_checked_out
     , docxml.content, docxml.act_type, docxml.doc_purpose, docxml.doc_type, docxml.eea_relevance, docxml.template, docxml.title
FROM document doc, document_version docver, document_content docxml, document_categories_v doccat
WHERE doc.id = docver.document_id
  AND docver.id = docxml.version_id
  AND doc.category_id = doccat.id
;
--------------------------------------------------------
--  DDL for View MILESTONE_V
--------------------------------------------------------

CREATE VIEW MILESTONE_V (DOCUMENT_ID, PACKAGE_ID, DOC_OBJECT_ID, DOC_TYPE_ID, CATEGORY_ID, NAME, CLONED_FROM, COLLABORATORS, REVISION_STATUS, CONTRIBUTION_STATUS, ORIGINAL_REF, BASE_REVISION_ID, LIVE_DIFFING_REQUIRED, REF, PROCEDURE_TYPE, DOC_TEMPLATE, LANGUAGE, DOC_STAGE, IS_PRIVATE_WORKING_COPY, DOC_AUDIT_C_BY, DOC_AUDIT_C_DATE, DOC_AUDIT_LAST_M_DATE, DOC_AUDIT_LAST_M_BY, MILESTONE_ID, JOB_DATE, CLONED_MILESTONE_ID, MILESTONE_COMMENTS, CONTENT, STATUS, AUDIT_C_BY, AUDIT_C_DATE, AUDIT_LAST_M_DATE, AUDIT_LAST_M_BY) AS
SELECT doc.id document_id, doc.package_id, doc.object_id doc_object_id,doc.doc_type_id,doc.category_id,doc.name,doc.cloned_from,doc.collaborators,doc.revision_status,doc.contribution_status,doc.original_ref,doc.base_revision_id,doc.live_diffing_required,doc.ref,doc.procedure_type,doc.doc_template,doc.language,doc.doc_stage,doc.is_private_working_copy,doc.audit_c_by doc_audit_c_by,doc.audit_c_date doc_audit_c_date,doc.audit_last_m_date doc_audit_last_m_date,doc.audit_last_m_by doc_audit_last_m_by
     , docmil.id milestone_id, docmil.job_date, docmil.cloned_milestone_id, docmil.milestone_comments, docmil.content, docmil.status, docmil.audit_c_by, docmil.audit_c_date, docmil.audit_last_m_date, docmil.audit_last_m_by
FROM document doc, document_milestone docmil
WHERE doc.id = docmil.document_id
;
--------------------------------------------------------
--  DDL for View MILESTONE_LIST_V
--------------------------------------------------------

CREATE VIEW MILESTONE_LIST_V (PACKAGE_ID, DOCUMENT_ID, MILESTONE_ID, CONTAINED_DOCUMENTS, AUDIT_C_BY, AUDIT_C_DATE, AUDIT_LAST_M_DATE, AUDIT_LAST_M_BY) AS
SELECT milv.package_id, milv.document_id, milv.milestone_id
     , millis.contained_documents, millis.audit_c_by, millis.audit_c_date, millis.audit_last_m_date, millis.audit_last_m_by
FROM milestone_v milv, document_milestone_list millis
WHERE milv.milestone_id = millis.milestone_id
;
--------------------------------------------------------
--  DDL for View MILESTONE_COMMENTS_V
--------------------------------------------------------

CREATE VIEW MILESTONE_COMMENTS_V (PACKAGE_ID, DOCUMENT_ID, MILESTONE_ID, COMMENTS, AUDIT_C_BY, AUDIT_C_DATE, AUDIT_LAST_M_DATE, AUDIT_LAST_M_BY) AS
SELECT milv.package_id, milv.document_id, milv.milestone_id
     , milcom.comments, milcom.audit_c_by, milcom.audit_c_date, milcom.audit_last_m_date, milcom.audit_last_m_by
FROM milestone_v milv, document_milestone_comments milcom
WHERE milv.milestone_id = milcom.milestone_id
;
--------------------------------------------------------
--  DDL for View PACKAGE_V
--------------------------------------------------------

CREATE VIEW PACKAGE_V (PACKAGE_ID, PKG_OBJECT_ID, PACKAGE_NAME, REPOSITORY_ID, AUDIT_C_DATE, AUDIT_C_BY, AUDIT_LAST_M_DATE, AUDIT_LAST_M_BY, DOCUMENT_ID, DOC_OBJECT_ID, DOC_TYPE_ID, CATEGORY_ID, NAME, CLONED_FROM, COLLABORATORS, REVISION_STATUS, CONTRIBUTION_STATUS, ORIGINAL_REF, BASE_REVISION_ID, LIVE_DIFFING_REQUIRED, REF, PROCEDURE_TYPE, DOC_TEMPLATE, LANGUAGE, DOC_STAGE, IS_PRIVATE_WORKING_COPY, DOC_AUDIT_C_BY, DOC_AUDIT_C_DATE, DOC_AUDIT_LAST_M_DATE, DOC_AUDIT_LAST_M_BY, VERSION_LABEL, VERSION_SERIES_ID, VERSION_TYPE, IS_LATEST_MAJOR_VERSION, IS_LATEST_VERSION, IS_MAJOR_VERSION, IS_VERSION_SERIES_CHECKED_OUT, CONTENT, ACT_TYPE, DOC_PURPOSE, DOC_TYPE, EEA_RELEVANCE, TEMPLATE, TITLE) AS
SELECT pkg.id package_id, pkg.object_id pkg_object_id, pkg.name package_name, pkg.repository_id, pkg.audit_c_date, pkg.audit_c_by, pkg.audit_last_m_date, pkg.audit_last_m_by
     , doc.id document_id,doc.object_id doc_object_id,doc.doc_type_id,doc.category_id,doc.name,doc.cloned_from,doc.collaborators,doc.revision_status,doc.contribution_status,doc.original_ref,doc.base_revision_id,doc.live_diffing_required,doc.ref,doc.procedure_type,doc.doc_template,doc.language,doc.doc_stage,doc.is_private_working_copy,doc.audit_c_by doc_audit_c_by,doc.audit_c_date doc_audit_c_date,doc.audit_last_m_date doc_audit_last_m_date,doc.audit_last_m_by doc_audit_last_m_by
     , docver.version_label, docver.version_series_id, docver.version_type, docver.is_latest_major_version, docver.is_latest_version, docver.is_major_version, docver.is_version_series_checked_out
     , docxml.content, docxml.act_type, docxml.doc_purpose, docxml.doc_type, docxml.eea_relevance, docxml.template, docxml.title
FROM package pkg, document doc, document_version docver, document_content docxml
WHERE pkg.id = doc.package_id
  and doc.id = docver.document_id
  AND docver.id = docxml.version_id
;
--------------------------------------------------------
--  Constraints for Table CONFIG
--------------------------------------------------------

ALTER TABLE CONFIG MODIFY (ID NOT NULL ENABLE);
ALTER TABLE CONFIG MODIFY (NAME NOT NULL ENABLE);
ALTER TABLE CONFIG MODIFY (OBJECT_ID NOT NULL ENABLE);
ALTER TABLE CONFIG MODIFY (AUDIT_C_BY NOT NULL ENABLE);
ALTER TABLE CONFIG MODIFY (AUDIT_C_DATE NOT NULL ENABLE);
ALTER TABLE CONFIG ADD CONSTRAINT CONFIGURATION_PK PRIMARY KEY (ID);
--------------------------------------------------------
--  Constraints for Table CONFIG_CATEGORIES
--------------------------------------------------------

ALTER TABLE CONFIG_CATEGORIES MODIFY (ID NOT NULL ENABLE);
ALTER TABLE CONFIG_CATEGORIES MODIFY (CATEGORY_CODE NOT NULL ENABLE);
ALTER TABLE CONFIG_CATEGORIES MODIFY (CATEGORY_DESC NOT NULL ENABLE);
ALTER TABLE CONFIG_CATEGORIES MODIFY (AUDIT_C_BY NOT NULL ENABLE);
ALTER TABLE CONFIG_CATEGORIES MODIFY (AUDIT_C_DATE NOT NULL ENABLE);
ALTER TABLE CONFIG_CATEGORIES ADD CONSTRAINT CONFIGURATION_CATEGORIES_PK PRIMARY KEY (ID);
--------------------------------------------------------
--  Constraints for Table CONFIG_CONTENT
--------------------------------------------------------

ALTER TABLE CONFIG_CONTENT MODIFY (VERSION_ID NOT NULL ENABLE);
ALTER TABLE CONFIG_CONTENT ADD CONSTRAINT CONTENT_PK PRIMARY KEY (ID);
--------------------------------------------------------
--  Constraints for Table CONFIG_VERSION
--------------------------------------------------------

ALTER TABLE CONFIG_VERSION MODIFY (ID NOT NULL ENABLE);
ALTER TABLE CONFIG_VERSION MODIFY (CONFIG_ID NOT NULL ENABLE);
ALTER TABLE CONFIG_VERSION MODIFY (VERSION_SERIES_ID NOT NULL ENABLE);
ALTER TABLE CONFIG_VERSION MODIFY (IS_LATEST_MAJOR_VERSION NOT NULL ENABLE);
ALTER TABLE CONFIG_VERSION MODIFY (IS_LATEST_VERSION NOT NULL ENABLE);
ALTER TABLE CONFIG_VERSION MODIFY (IS_MAJOR_VERSION NOT NULL ENABLE);
ALTER TABLE CONFIG_VERSION MODIFY (IS_VERSION_SERIES_CHECKED_OUT NOT NULL ENABLE);
ALTER TABLE CONFIG_VERSION MODIFY (AUDIT_C_BY NOT NULL ENABLE);
ALTER TABLE CONFIG_VERSION MODIFY (AUDIT_C_DATE NOT NULL ENABLE);
ALTER TABLE CONFIG_VERSION ADD CONSTRAINT CONFIG_VERSIONS_PK PRIMARY KEY (ID);
--------------------------------------------------------
--  Constraints for Table DOCUMENT
--------------------------------------------------------

ALTER TABLE DOCUMENT MODIFY (ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT MODIFY (PACKAGE_ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT MODIFY (DOC_TYPE_ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT MODIFY (CATEGORY_ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT MODIFY (NAME NOT NULL ENABLE);
ALTER TABLE DOCUMENT MODIFY (COLLABORATORS NOT NULL ENABLE);
ALTER TABLE DOCUMENT MODIFY (REF NOT NULL ENABLE);
ALTER TABLE DOCUMENT MODIFY (DOC_TEMPLATE NOT NULL ENABLE);
ALTER TABLE DOCUMENT MODIFY (LANGUAGE NOT NULL ENABLE);
ALTER TABLE DOCUMENT MODIFY (DOC_STAGE NOT NULL ENABLE);
ALTER TABLE DOCUMENT MODIFY (AUDIT_C_BY NOT NULL ENABLE);
ALTER TABLE DOCUMENT MODIFY (AUDIT_C_DATE NOT NULL ENABLE);
ALTER TABLE DOCUMENT ADD CONSTRAINT DOCUMENT_METADATA_PK PRIMARY KEY (ID);
--------------------------------------------------------
--  Constraints for Table DOCUMENT_CATEGORIES
--------------------------------------------------------

ALTER TABLE DOCUMENT_CATEGORIES MODIFY (ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT_CATEGORIES MODIFY (CATEGORY_CODE NOT NULL ENABLE);
ALTER TABLE DOCUMENT_CATEGORIES MODIFY (CATEGORY_DESC NOT NULL ENABLE);
ALTER TABLE DOCUMENT_CATEGORIES MODIFY (AUDIT_C_BY NOT NULL ENABLE);
ALTER TABLE DOCUMENT_CATEGORIES MODIFY (AUDIT_C_DATE NOT NULL ENABLE);
ALTER TABLE DOCUMENT_CATEGORIES ADD CONSTRAINT DOCUMENT_CATEGORIES_PK PRIMARY KEY (ID);
ALTER TABLE DOCUMENT_CATEGORIES ADD CONSTRAINT DOCUMENT_CATEGORIES_CHK_UQ UNIQUE (CATEGORY_CODE);
--------------------------------------------------------
--  Constraints for Table DOCUMENT_CONTENT
--------------------------------------------------------

ALTER TABLE DOCUMENT_CONTENT MODIFY (DOC_PURPOSE NOT NULL ENABLE);
ALTER TABLE DOCUMENT_CONTENT MODIFY (DOC_TYPE NOT NULL ENABLE);
ALTER TABLE DOCUMENT_CONTENT MODIFY (TEMPLATE NOT NULL ENABLE);
ALTER TABLE DOCUMENT_CONTENT MODIFY (TITLE NOT NULL ENABLE);
ALTER TABLE DOCUMENT_CONTENT MODIFY (AUDIT_C_BY NOT NULL ENABLE);
ALTER TABLE DOCUMENT_CONTENT MODIFY (AUDIT_C_DATE NOT NULL ENABLE);
ALTER TABLE DOCUMENT_CONTENT MODIFY (CONTENT NOT NULL ENABLE);
ALTER TABLE DOCUMENT_CONTENT ADD CONSTRAINT DOCUMENT_CONTENT_PK PRIMARY KEY (ID);
ALTER TABLE DOCUMENT_CONTENT MODIFY (ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT_CONTENT MODIFY (VERSION_ID NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table DOCUMENT_MILESTONE
--------------------------------------------------------

ALTER TABLE DOCUMENT_MILESTONE MODIFY (MILESTONE_ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT_MILESTONE MODIFY (ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT_MILESTONE MODIFY (DOCUMENT_ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT_MILESTONE MODIFY (JOB_DATE NOT NULL ENABLE);
ALTER TABLE DOCUMENT_MILESTONE MODIFY (STATUS NOT NULL ENABLE);
ALTER TABLE DOCUMENT_MILESTONE MODIFY (AUDIT_C_BY NOT NULL ENABLE);
ALTER TABLE DOCUMENT_MILESTONE MODIFY (AUDIT_C_DATE NOT NULL ENABLE);
ALTER TABLE DOCUMENT_MILESTONE ADD CONSTRAINT DOCUMENT_MILESTONE_PK PRIMARY KEY (ID);
--------------------------------------------------------
--  Constraints for Table DOCUMENT_MILESTONE_COMMENTS
--------------------------------------------------------

ALTER TABLE DOCUMENT_MILESTONE_COMMENTS MODIFY (ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT_MILESTONE_COMMENTS MODIFY (MILESTONE_ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT_MILESTONE_COMMENTS MODIFY (AUDIT_C_BY NOT NULL ENABLE);
ALTER TABLE DOCUMENT_MILESTONE_COMMENTS MODIFY (AUDIT_C_DATE NOT NULL ENABLE);
ALTER TABLE DOCUMENT_MILESTONE_COMMENTS ADD CONSTRAINT DOCUMENT_MILESTONE_COMMENTS_PK PRIMARY KEY (ID);
--------------------------------------------------------
--  Constraints for Table DOCUMENT_MILESTONE_LIST
--------------------------------------------------------

ALTER TABLE DOCUMENT_MILESTONE_LIST MODIFY (AUDIT_C_DATE NOT NULL ENABLE);
ALTER TABLE DOCUMENT_MILESTONE_LIST ADD CONSTRAINT DOCUMENT_MILESTONE_LIST_PK PRIMARY KEY (ID);
ALTER TABLE DOCUMENT_MILESTONE_LIST MODIFY (ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT_MILESTONE_LIST MODIFY (MILESTONE_ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT_MILESTONE_LIST MODIFY (CONTAINED_DOCUMENTS NOT NULL ENABLE);
ALTER TABLE DOCUMENT_MILESTONE_LIST MODIFY (AUDIT_C_BY NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table DOCUMENT_PROPERTIES
--------------------------------------------------------

ALTER TABLE DOCUMENT_PROPERTIES MODIFY (ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT_PROPERTIES MODIFY (PROPERTY_NAME NOT NULL ENABLE);
ALTER TABLE DOCUMENT_PROPERTIES MODIFY (DOC_CATEGORY_ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT_PROPERTIES MODIFY (AUDIT_C_BY NOT NULL ENABLE);
ALTER TABLE DOCUMENT_PROPERTIES MODIFY (AUDIT_C_DATE NOT NULL ENABLE);
ALTER TABLE DOCUMENT_PROPERTIES ADD CONSTRAINT DOCUMENT_PROPERTIES_PK PRIMARY KEY (ID);
--------------------------------------------------------
--  Constraints for Table DOCUMENT_PROPERTY_VALUES
--------------------------------------------------------

ALTER TABLE DOCUMENT_PROPERTY_VALUES MODIFY (ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT_PROPERTY_VALUES MODIFY (DOCUMENT_ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT_PROPERTY_VALUES MODIFY (PROPERTY_ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT_PROPERTY_VALUES MODIFY (AUDIT_C_BY NOT NULL ENABLE);
ALTER TABLE DOCUMENT_PROPERTY_VALUES MODIFY (AUDIT_C_DATE NOT NULL ENABLE);
ALTER TABLE DOCUMENT_PROPERTY_VALUES ADD CONSTRAINT DOCUMENT_PROPERTY_VALUES_PK PRIMARY KEY (ID);
--------------------------------------------------------
--  Constraints for Table DOCUMENT_VERSION
--------------------------------------------------------

ALTER TABLE DOCUMENT_VERSION MODIFY (ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT_VERSION MODIFY (VERSION_SERIES_ID NOT NULL ENABLE);
ALTER TABLE DOCUMENT_VERSION MODIFY (IS_LATEST_MAJOR_VERSION NOT NULL ENABLE);
ALTER TABLE DOCUMENT_VERSION MODIFY (IS_LATEST_VERSION NOT NULL ENABLE);
ALTER TABLE DOCUMENT_VERSION MODIFY (IS_MAJOR_VERSION NOT NULL ENABLE);
ALTER TABLE DOCUMENT_VERSION MODIFY (IS_VERSION_SERIES_CHECKED_OUT NOT NULL ENABLE);
ALTER TABLE DOCUMENT_VERSION MODIFY (AUDIT_C_BY NOT NULL ENABLE);
ALTER TABLE DOCUMENT_VERSION MODIFY (AUDIT_C_DATE NOT NULL ENABLE);
ALTER TABLE DOCUMENT_VERSION ADD CONSTRAINT DOCUMENT_VERSIONS_PK PRIMARY KEY (ID);
--------------------------------------------------------
--  Constraints for Table PACKAGE
--------------------------------------------------------

ALTER TABLE PACKAGE MODIFY (ID NOT NULL ENABLE);
ALTER TABLE PACKAGE MODIFY (OBJECT_ID NOT NULL ENABLE);
ALTER TABLE PACKAGE MODIFY (NAME NOT NULL ENABLE);
ALTER TABLE PACKAGE MODIFY (REPOSITORY_ID NOT NULL ENABLE);
ALTER TABLE PACKAGE MODIFY (AUDIT_C_BY NOT NULL ENABLE);
ALTER TABLE PACKAGE MODIFY (AUDIT_C_DATE NOT NULL ENABLE);
ALTER TABLE PACKAGE ADD CONSTRAINT PROPOSAL_PK PRIMARY KEY (ID);
--------------------------------------------------------
--  Constraints for Table PERMISSION
--------------------------------------------------------

ALTER TABLE PERMISSION MODIFY (ID NOT NULL ENABLE);
ALTER TABLE PERMISSION MODIFY (REPOSITORY_ID NOT NULL ENABLE);
ALTER TABLE PERMISSION MODIFY (NAME NOT NULL ENABLE);
ALTER TABLE PERMISSION MODIFY (DESCRIPTION NOT NULL ENABLE);
ALTER TABLE PERMISSION ADD CONSTRAINT PERMISSION_PK PRIMARY KEY (ID);
ALTER TABLE PERMISSION MODIFY (AUDIT_C_BY NOT NULL ENABLE);
ALTER TABLE PERMISSION MODIFY (AUDIT_C_DATE NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table REPOSITORY
--------------------------------------------------------

ALTER TABLE REPOSITORY MODIFY (ID NOT NULL ENABLE);
ALTER TABLE REPOSITORY MODIFY (CMIS_ID NOT NULL ENABLE);
ALTER TABLE REPOSITORY MODIFY (NAME NOT NULL ENABLE);
ALTER TABLE REPOSITORY MODIFY (DESCRIPTION NOT NULL ENABLE);
ALTER TABLE REPOSITORY ADD CONSTRAINT REPOSITORY_PK PRIMARY KEY (ID);
--------------------------------------------------------
--  Ref Constraints for Table CONFIG_CONTENT
--------------------------------------------------------

ALTER TABLE CONFIG_CONTENT ADD FOREIGN KEY (VERSION_ID)
    REFERENCES CONFIG_VERSION(ID);

--------------------------------------------------------
--  Ref Constraints for Table CONFIG_VERSION
--------------------------------------------------------

ALTER TABLE CONFIG_VERSION ADD FOREIGN KEY (CONFIG_TYPE)
    REFERENCES CONFIG_CATEGORIES(ID);
--------------------------------------------------------
--  Ref Constraints for Table DOCUMENT
--------------------------------------------------------

ALTER TABLE DOCUMENT ADD FOREIGN KEY (PACKAGE_ID)
    REFERENCES PACKAGE(ID);
ALTER TABLE DOCUMENT ADD FOREIGN KEY (CATEGORY_ID)
    REFERENCES DOCUMENT_CATEGORIES(ID);
--------------------------------------------------------
--  Ref Constraints for Table DOCUMENT_CONTENT
--------------------------------------------------------

ALTER TABLE DOCUMENT_CONTENT ADD FOREIGN KEY (VERSION_ID)
    REFERENCES DOCUMENT_VERSION(ID);
ALTER TABLE DOCUMENT_CONTENT ADD FOREIGN KEY (CATEGORY_CODE)
    REFERENCES DOCUMENT_CATEGORIES(CATEGORY_CODE);
--------------------------------------------------------
--  Ref Constraints for Table DOCUMENT_MILESTONE_COMMENTS
--------------------------------------------------------

ALTER TABLE DOCUMENT_MILESTONE_COMMENTS ADD FOREIGN KEY (MILESTONE_ID)
    REFERENCES DOCUMENT_MILESTONE(ID);
--------------------------------------------------------
--  Ref Constraints for Table DOCUMENT_MILESTONE_LIST
--------------------------------------------------------

ALTER TABLE DOCUMENT_MILESTONE_LIST ADD FOREIGN KEY (MILESTONE_ID)
    REFERENCES DOCUMENT_MILESTONE(ID);
--------------------------------------------------------
--  Ref Constraints for Table DOCUMENT_PROPERTIES
--------------------------------------------------------

ALTER TABLE DOCUMENT_PROPERTIES ADD FOREIGN KEY (DOC_CATEGORY_ID)
    REFERENCES DOCUMENT_CATEGORIES(ID);
--------------------------------------------------------
--  Ref Constraints for Table DOCUMENT_PROPERTY_VALUES
--------------------------------------------------------

ALTER TABLE DOCUMENT_PROPERTY_VALUES ADD FOREIGN KEY (VERSION_ID)
    REFERENCES CONFIG_VERSION(ID);
ALTER TABLE DOCUMENT_PROPERTY_VALUES ADD FOREIGN KEY (PROPERTY_ID)
    REFERENCES DOCUMENT_PROPERTIES(ID);
--------------------------------------------------------
--  Ref Constraints for Table PACKAGE
--------------------------------------------------------

ALTER TABLE PACKAGE ADD FOREIGN KEY (CLONED_PACKAGE_ID)
    REFERENCES PACKAGE(ID);
--------------------------------------------------------
--  Ref Constraints for Table PERMISSION
--------------------------------------------------------

ALTER TABLE PERMISSION ADD FOREIGN KEY (REPOSITORY_ID)
    REFERENCES REPOSITORY(ID);
