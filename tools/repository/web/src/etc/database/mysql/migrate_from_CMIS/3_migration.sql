---
--- Instructions:
-----------------
--- 1. Run this script logged in LEOS_CMIS (which is the source schema for LEOS CMIS Repository)
--- 2. Find and replace inside the script all occurrences for:
------ - Target schema: leos_repository. (see schemas created on oracle database, leos_repository for EC, leos_repository for CN, etc.)
------ - Source repository '&&repository_name' (see in leos_cmis.repository all possible repo sources)
------       select * from repository;
------ - Find the workspace folder with below query then replace &&object_path variable.
            /*
            select substr(object_path,1,regexp_instr(object_path,'[^/]+',1,3)-2) workspace, count(1)
            from object_path_view
            group by substr(object_path,1,regexp_instr(object_path,'[^/]+',1,3)-2);
            */
-----------------

--drop table leos_cmis;
--1. transpose cmis columns to rows
PROMPT create table leos_cmis as
create table leos_cmis as
select repository_id, object_id,
       MAX(DECODE(cmis_id,'annex:clonedRef',value)) annex_clonedRef,
       MAX(DECODE(cmis_id,'annex:docIndex',value)) annex_docIndex,
       MAX(DECODE(cmis_id,'annex:docNumber',value)) annex_docNumber,
       MAX(DECODE(cmis_id,'annex:docTitle',value)) annex_docTitle,
       MAX(DECODE(cmis_id,'cmis:baseTypeId',value)) cmis_baseTypeId,
       MAX(DECODE(cmis_id,'cmis:changeToken',value)) cmis_changeToken,
       MAX(DECODE(cmis_id,'cmis:checkinComment',value)) cmis_checkinComment,
       MAX(DECODE(cmis_id,'cmis:contentStreamFileName',value)) cmis_contentStreamFileName,
       MAX(DECODE(cmis_id,'cmis:contentStreamId',value)) cmis_contentStreamId,
       MAX(DECODE(cmis_id,'cmis:contentStreamLength',value)) cmis_contentStreamLength,
       MAX(DECODE(cmis_id,'cmis:contentStreamMimeType',value)) cmis_contentStreamMimeType,
       MAX(DECODE(cmis_id,'cmis:createdBy',value)) cmis_createdBy,
       MAX(DECODE(cmis_id,'cmis:creationDate',value)) cmis_creationDate,
       MAX(DECODE(cmis_id,'cmis:isImmutable',value)) cmis_isImmutable,
       MAX(DECODE(cmis_id,'cmis:isLatestMajorVersion',value)) cmis_isLatestMajorVersion,
       MAX(DECODE(cmis_id,'cmis:isLatestVersion',value)) cmis_isLatestVersion,
       MAX(DECODE(cmis_id,'cmis:isMajorVersion',value)) cmis_isMajorVersion,
       MAX(DECODE(cmis_id,'cmis:isPrivateWorkingCopy',value)) cmis_isPrivateWorkingCopy,
       MAX(DECODE(cmis_id,'cmis:isVersionSeriesCheckedOut',value)) cmis_isVersionSeriesCheckedOut,
       MAX(DECODE(cmis_id,'cmis:lastModificationDate',value)) cmis_lastModificationDate,
       MAX(DECODE(cmis_id,'cmis:lastModifiedBy',value)) cmis_lastModifiedBy,
       MAX(DECODE(cmis_id,'cmis:name',value)) cmis_name,
       MAX(DECODE(cmis_id,'cmis:objectId',value)) cmis_objectId,
       MAX(DECODE(cmis_id,'cmis:objectTypeId',value)) cmis_objectTypeId,
       MAX(DECODE(cmis_id,'cmis:parentId',value)) cmis_parentId,
       MAX(DECODE(cmis_id,'cmis:path',value)) cmis_path,
       MAX(DECODE(cmis_id,'cmis:versionLabel',value)) cmis_versionLabel,
       MAX(DECODE(cmis_id,'cmis:versionSeriesId',value)) cmis_versionSeriesId,
       MAX(DECODE(cmis_id,'leos:baseRevisionId',value)) leos_baseRevisionId,
       MAX(DECODE(cmis_id,'leos:category',value)) leos_category,
       MAX(DECODE(cmis_id,'leos:clonedFrom',value)) leos_clonedFrom,
       MAX(DECODE(cmis_id,'leos:clonedMilestoneId',value)) leos_clonedMilestoneId,
       MAX(DECODE(cmis_id,'leos:clonedProposal',value)) leos_clonedProposal,
       MAX(DECODE(cmis_id,'leos:collaborators',value)) leos_collaborators,
       MAX(DECODE(cmis_id,'leos:comments',value)) leos_comments,
       MAX(DECODE(cmis_id,'leos:containedDocuments',value)) leos_containedDocuments,
       MAX(DECODE(cmis_id,'leos:contributionStatus',value)) leos_contributionStatus,
       MAX(DECODE(cmis_id,'leos:initialCreatedBy',value)) leos_initialCreatedBy,
       MAX(DECODE(cmis_id,'leos:initialCreationDate',value)) leos_initialCreationDate,
       MAX(DECODE(cmis_id,'leos:jobDate',value)) leos_jobDate,
       MAX(DECODE(cmis_id,'leos:jobId',value)) leos_jobId,
       MAX(DECODE(cmis_id,'leos:language',value)) leos_language,
       MAX(DECODE(cmis_id,'leos:liveDiffingRequired',value)) leos_liveDiffingRequired,
       MAX(DECODE(cmis_id,'leos:milestoneComments',value)) leos_milestoneComments,
       MAX(DECODE(cmis_id,'leos:originRef',value)) leos_originRef,
       MAX(DECODE(cmis_id,'leos:revisionStatus',value)) leos_revisionStatus,
       MAX(DECODE(cmis_id,'leos:status',value)) leos_status,
       MAX(DECODE(cmis_id,'leos:template',value)) leos_template,
       MAX(DECODE(cmis_id,'leos:title',value)) leos_title,
       MAX(DECODE(cmis_id,'leos:trackChangesEnabled',value)) leos_trackChangesEnabled,
       MAX(DECODE(cmis_id,'leos:versionLabel',value)) leos_versionLabel,
       MAX(DECODE(cmis_id,'leos:versionType',value)) leos_versionType,
       MAX(DECODE(cmis_id,'metadata:actType',value)) metadata_actType,
       MAX(DECODE(cmis_id,'metadata:docPurpose',value)) metadata_docPurpose,
       MAX(DECODE(cmis_id,'metadata:docStage',value)) metadata_docStage,
       MAX(DECODE(cmis_id,'metadata:docTemplate',value)) metadata_docTemplate,
       MAX(DECODE(cmis_id,'metadata:docType',value)) metadata_docType,
       MAX(DECODE(cmis_id,'metadata:eeaRelevance',value)) metadata_eeaRelevance,
       MAX(DECODE(cmis_id,'metadata:procedureType',value)) metadata_procedureType,
       MAX(DECODE(cmis_id,'metadata:ref',value)) metadata_ref
from (
         select objt.repository_id, objt.cmis_id obj_type, objt.local_namespace, objt.display_name obj_display_name, prop.id, prop.object_id, prop.object_type_property_id, objtyp.cmis_id, objtyp.display_name, objtyp.description, prop.value
              ,row_number() over (partition by prop.object_id, objtyp.cmis_id order by objtyp.id desc) rn
         from property prop, object_type_property objtyp, object obj, object_type objt
         where prop.object_type_property_id = objtyp.id
           AND prop.object_id = obj.id
           AND obj.object_type_id = objt.id
     ) where rn = 1
group by repository_id, object_id;

--1. Packages
PROMPT INSERT INTO leos_repository.package
INSERT INTO leos_repository.package (OBJECT_ID,NAME,AUDIT_C_BY,AUDIT_C_DATE, audit_last_m_by, audit_last_m_date)
select
    object_id, cmis_name,
    cmis_createdby,
    to_timestamp(cmis_creationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_c_date,
    cmis_lastmodifiedby,
    to_timestamp(cmis_lastmodificationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_last_m_date
from (
         select opv.parent_id, opv.repository_id repository_name, lc.*
         from leos_cmis lc, object_path_view opv
         where lc.object_id = opv.object_id
     ) where cmis_basetypeid = 'cmis:folder' and repository_name = '&&repository_name'
         and parent_id in (select object_id from object_path_view where object_path = '&&object_path' and repository_id = '&&repository_name')
;


--1. generate document categories
PROMPT INSERT INTO leos_repository.document_categories
INSERT INTO leos_repository.document_categories (category_code, category_desc, audit_c_by, audit_c_date)
SELECT category_code, category_desc, user, sysdate FROM (
                                                            SELECT 'ANNEX' CATEGORY_CODE,'Annex' CATEGORY_DESC from dual UNION
                                                            SELECT 'BILL','Bill or Legal Act' from dual UNION
                                                            SELECT 'COUNCIL_EXPLANATORY','For Council' from dual UNION
                                                            SELECT 'EXPORT','Export' from dual UNION
                                                            SELECT 'FINANCIAL_STATEMENT','Financial statement' from dual UNION
                                                            SELECT 'LEG','Leg file milestone' from dual UNION
                                                            SELECT 'MEMORANDUM','Memorandum' from dual UNION
                                                            SELECT 'PROPOSAL','Proposal' from dual UNION
                                                            SELECT 'STAT_FINANC_LEGIS','Financial statement' from dual
                                                        ) ORDER BY 1;

--2. Document
PROMPT INSERT INTO leos_repository.document
INSERT INTO leos_repository.document (PACKAGE_ID,CATEGORY_ID,NAME,REVISION_STATUS,CONTRIBUTION_STATUS,ORIGIN_REF,
                                         BASE_REVISION_ID,LIVE_DIFFING_REQUIRED,REF,PROCEDURE_TYPE,DOC_TEMPLATE,LANGUAGE,DOC_STAGE,IS_PRIVATE_WORKING_COPY,
                                         AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE)
select  package_id, category_id,
        cmis_name, leos_revisionStatus, leos_contributionStatus, leos_originRef, leos_baseRevisionId,
        livediffingrequired,
        case when metadata_ref is null then rtrim(cmis_name,'.leg') else metadata_ref end metadata_ref, metadata_procedureType, metadata_docTemplate, leos_language, metadata_docStage,
        isprivateworking,cmis_createdby, audit_c_date, cmis_lastmodifiedby, audit_last_m_date
from (
         select
             row_number() OVER (PARTITION BY ora_cn_pkg.id, CMIS_NAME ORDER BY to_timestamp(cmis_creationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') desc) rn,
             src.object_id,
             ora_cn_pkg.id package_id, doccat.id category_id,
             cmis_name, leos_revisionStatus, leos_contributionStatus, leos_originRef, leos_baseRevisionId,
             decode(lower(leos_liveDiffingRequired),'true',1,0) livediffingrequired,
             metadata_ref, metadata_procedureType, metadata_docTemplate, leos_language, metadata_docStage,
             decode(lower(cmis_isPrivateWorkingCopy),'true',1,0) isprivateworking,
             cmis_createdby, to_timestamp(cmis_creationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_c_date,
             cmis_lastmodifiedby, to_timestamp(cmis_lastmodificationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_last_m_date
         from (
                  select opv.parent_id, opv.repository_id repository_name, lc.*
                  from leos_cmis lc, object_path_view opv
                  where lc.object_id = opv.object_id
              ) src, (select id, object_id from leos_repository.package) ora_cn_pkg, leos_repository.document_categories doccat
         where src.cmis_basetypeid = 'cmis:document' and src.repository_name = '&&repository_name'
           and src.parent_id = ora_cn_pkg.object_id
           --and src.metadata_ref is null
           and src.leos_category = doccat.category_code
     ) where rn = 1;

--2.1. Archived Packages to DOCUMENT table
PROMPT INSERT INTO leos_repository.document ARCHIVED
INSERT INTO leos_repository.document (PACKAGE_ID,CATEGORY_ID,is_archived,NAME,REVISION_STATUS,CONTRIBUTION_STATUS,ORIGIN_REF,
                                         BASE_REVISION_ID,LIVE_DIFFING_REQUIRED,REF,PROCEDURE_TYPE,DOC_TEMPLATE,LANGUAGE,DOC_STAGE,IS_PRIVATE_WORKING_COPY,
                                         AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE)
select  package_id, category_id, 1,
        cmis_name, leos_revisionStatus, leos_contributionStatus, leos_originRef, leos_baseRevisionId,
        livediffingrequired,
        metadata_ref, metadata_procedureType, metadata_docTemplate, leos_language, metadata_docStage,
        isprivateworking,cmis_createdby, audit_c_date, cmis_lastmodifiedby, audit_last_m_date
from (
         select
             row_number() OVER (PARTITION BY ora_cn_pkg.id, CMIS_NAME ORDER BY to_timestamp(cmis_creationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') desc) rn,
             src.object_id,
             ora_cn_pkg.id package_id, doccat.id category_id,
             cmis_name, leos_revisionStatus, leos_contributionStatus, leos_originRef, leos_baseRevisionId,
             decode(lower(leos_liveDiffingRequired),'true',1,0) livediffingrequired,
             metadata_ref, metadata_procedureType, metadata_docTemplate, leos_language, metadata_docStage,
             decode(lower(cmis_isPrivateWorkingCopy),'true',1,0) isprivateworking,
             cmis_createdby, to_timestamp(cmis_creationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_c_date,
             cmis_lastmodifiedby, to_timestamp(cmis_lastmodificationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_last_m_date
         from (
                  select opv.parent_id, opv.repository_id repository_name, lc.*
                  from leos_cmis lc, object_path_view opv
                  where lc.object_id = opv.object_id
                    and opv.object_path like '%archive%' and opv.type_id = 'cmis:document' and opv.repository_id = '&&repository_name'
              ) src, (select id, object_id from leos_repository.package) ora_cn_pkg, leos_repository.document_categories doccat,
              (select object_id arch_pkg_id, parent_id actual_pkg_id from object_path_view  where type_id = 'cmis:folder' and object_path like '%archive%') get_pkg_for_archive
         where src.cmis_basetypeid = 'cmis:document' and src.repository_name = '&&repository_name'
           and src.metadata_ref is not null
           and src.leos_category = doccat.category_code
           and src.parent_id = get_pkg_for_archive.arch_pkg_id
           and ora_cn_pkg.object_id = get_pkg_for_archive.actual_pkg_id
     ) where rn = 1;

--3 Document_VERSION for all documents and for archived also
PROMPT INSERT INTO leos_repository.document_VERSION
INSERT INTO leos_repository.document_VERSION
(object_id,DOCUMENT_ID,VERSION_LABEL,VERSION_SERIES_ID,VERSION_TYPE,IS_LATEST_MAJOR_VERSION,IS_LATEST_VERSION,IS_MAJOR_VERSION,IS_VERSION_SERIES_CHECKED_OUT,IS_IMMUTABLE,COMMENTS,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE)
select
    OBJECT_ID,DOCUMENT_ID,LEOS_VERSIONLABEL,CMIS_VERSIONSERIESID,LEOS_VERSIONTYPE,CMIS_ISLATESTMAJORVERSION,CMIS_ISLATESTVERSION,CMIS_ISMAJORVERSION,CMIS_ISVERSIONSERIESCHECKEDOUT,CMIS_ISIMMUTABLE,LEOS_COMMENTS,CMIS_CREATEDBY,AUDIT_C_DATE,CMIS_LASTMODIFIEDBY,AUDIT_LAST_M_DATE
from (
         select row_number() over (partition by document_id, leos_versionlabel order by object_id desc) rn,
                z.* from (
                             select src.object_id, ora_cn_doc.id document_id, leos_versionlabel, cmis_versionseriesid, leos_versiontype,
                                    decode(lower(cmis_islatestmajorversion),'true',1,0) cmis_islatestmajorversion,
                                    decode(lower(cmis_ISLATESTVERSION),'true',1,0) cmis_ISLATESTVERSION,
                                    decode(lower(cmis_ISMAJORVERSION),'true',1,0) cmis_ISMAJORVERSION,
                                    decode(lower(cmis_ISVERSIONSERIESCHECKEDOUT),'true',1,0) cmis_ISVERSIONSERIESCHECKEDOUT,
                                    decode(lower(cmis_ISIMMUTABLE),'true',1,0) cmis_ISIMMUTABLE,
                                    leos_comments,
                                    cmis_createdby, to_timestamp(cmis_creationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_c_date,
                                    cmis_lastmodifiedby, to_timestamp(cmis_lastmodificationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_last_m_date
                             from (
                                      select opv.parent_id, opv.repository_id repository_name, lc.*
                                      from leos_cmis lc, object_path_view opv
                                      where lc.object_id = opv.object_id
                                  ) src, (select id, name from leos_repository.document
                                  ) ora_cn_doc
                             where src.cmis_basetypeid = 'cmis:document' and src.repository_name = '&&repository_name'
                               and src.cmis_name = ora_cn_doc.name
                         ) z
     ) where rn = 1
;

--3. document_content for all docs and archived also
PROMPT INSERT INTO leos_repository.DOCUMENT_CONTENT
DECLARE
    CURSOR crs_versions IS
SELECT
    src.object_id,
    ora_ver.id,
    leos_category,
    metadata_actType acttype,
    METADATA_DOCPURPOSE docpurpose,
    METADATA_DOCTYPE doctype,
    decode(lower(METADATA_EEARELEVANCE),'true',1,0) METADATA_EEARELEVANCE,leos_Template,LEOS_TITLE,
    cmis_createdby, to_timestamp(cmis_creationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_c_date,
    cmis_lastmodifiedby, to_timestamp(cmis_lastmodificationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_last_m_date
from (
         select opv.parent_id, opv.repository_id repository_name, lc.*
         from leos_cmis lc, object_path_view opv
         where lc.object_id = opv.object_id
     ) src, (select id, document_id, object_id from leos_repository.document_version) ora_ver
where src.cmis_basetypeid = 'cmis:document' and src.repository_name = '&&repository_name'
  and src.object_id = ora_ver.object_id
  and leos_Template is not null
order by ora_ver.document_id
;

v_clob clob;
cursor crs_get_clob (p_id integer) is
select to_clob(data) data from stream where id = p_id;

j_ite integer :=0 ;

BEGIN

    FOR j in crs_versions
        loop

            open crs_Get_clob (j.object_id);
            fetch crs_get_clob into v_clob;
            close crs_get_clob;

            INSERT INTO leos_repository.DOCUMENT_CONTENT
            (VERSION_ID,CATEGORY_CODE,CONTENT,ACT_TYPE,DOC_PURPOSE,DOC_TYPE,EEA_RELEVANCE,TEMPLATE,TITLE,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE)
            values
                (j.id, j.leos_category, v_clob, j.acttype, j.docpurpose, j.doctype, j.metadata_eearelevance, j.leos_template, j.leos_title, j.cmis_createdby,
                 j.audit_c_date, j.cmis_lastmodifiedby, j.audit_last_m_date);
            j_ite := j_ite + 1;

            IF mod(j_ite,100) = 0
            THEN COMMIT;
            END IF;

        end loop;
    COMMIT;
end;
/

--4. DOCUMENT_MILESTONE
DECLARE
    cursor crs_versions is
        SELECT
            src.object_id,
            ora_ver.id document_id,
            leos_jobId, to_timestamp(cmis_creationDate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') job_date,
            nvl(leos_status,'FILE_READY') leos_status, leos_milestonecomments,
            cmis_createdby, to_timestamp(cmis_creationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_c_date,
            cmis_lastmodifiedby, to_timestamp(cmis_lastmodificationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_last_m_date
        from (
                 select opv.parent_id, opv.repository_id repository_name, lc.*
                 from leos_cmis lc, object_path_view opv
                 where lc.object_id = opv.object_id
             ) src, (select id, name from leos_repository.document) ora_ver
        where src.cmis_basetypeid = 'cmis:document'
          and src.repository_name = '&&repository_name'
          and src.cmis_name = ora_ver.name
          AND leos_category in ('LEG','EXPORT')
          and ora_ver.id not in (select document_id from leos_repository.document_milestone)
        order by ora_ver.id, src.object_id;

    v_blob blob;
    cursor crs_get_clob (p_id integer) is
        select data from stream where id = p_id;

    j_ite integer :=0 ;

BEGIN

    FOR j in crs_versions
        loop

            open crs_Get_clob (j.object_id);
            fetch crs_get_clob into v_blob;
            close crs_get_clob;

            INSERT INTO leos_repository.DOCUMENT_MILESTONE
            (DOCUMENT_ID,JOB_ID,JOB_DATE,CONTENT,STATUS,MILESTONE_COMMENTS,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE)
            VALUES
                (j.document_id, j.leos_jobid, j.job_date,v_blob, j.leos_status, j.leos_milestonecomments, j.cmis_createdby, j.audit_c_Date, j.cmis_lastmodifiedby,
                 j.audit_last_m_date);

            j_ite := j_ite + 1;

            IF mod(j_ite,100) = 0
            THEN COMMIT;
            END IF;

        end loop;
    COMMIT;
end;
/


--5. DOCUMENT_MILESTONE_LIST
INSERT INTO leos_repository.DOCUMENT_MILESTONE_LIST(MILESTONE_ID,CONTAINED_DOCUMENTS,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE)
select milestone_id, leos_containeddocuments,
       cmis_createdby, to_timestamp(cmis_creationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_c_date,
       cmis_lastmodifiedby, to_timestamp(cmis_lastmodificationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_last_m_date
from (
         select repository_id, object_id,
                MAX(DECODE(cmis_id,'leos:containedDocuments',value)) leos_containedDocuments,
                MAX(DECODE(cmis_id,'cmis:name',value)) cmis_name,
                MAX(DECODE(cmis_id,'cmis:createdBy',value)) cmis_createdBy,
                MAX(DECODE(cmis_id,'cmis:creationDate',value)) cmis_creationDate,
                MAX(DECODE(cmis_id,'cmis:lastModificationDate',value)) cmis_lastModificationDate,
                MAX(DECODE(cmis_id,'cmis:lastModifiedBy',value)) cmis_lastModifiedBy
         from (
                  select objt.repository_id, objt.cmis_id obj_type, objt.local_namespace, objt.display_name obj_display_name, prop.id, prop.object_id, prop.object_type_property_id, objtyp.cmis_id, objtyp.display_name, objtyp.description, prop.value
                       ,row_number() over (partition by prop.object_id, objtyp.cmis_id order by objtyp.id desc) rn
                  from property prop, object_type_property objtyp, object obj, object_type objt
                  where prop.object_type_property_id = objtyp.id
                    AND prop.object_id = obj.id
                    AND obj.object_type_id = objt.id
              )
         where repository_id = (select id from repository where cmis_id = '&&repository_name')
         group by repository_id, object_id) src, (SELECT MILESTONE_ID, NAME FROM leos_repository.MILESTONE_V) ora
WHERE src.cmis_name = ora.name
  and leos_containeddocuments is not null
order by milestone_id, leos_containeddocuments
;

--6.0. config categories
INSERT INTO leos_repository.CONFIG_CATEGORIES (CATEGORY_CODE, CATEGORY_DESC, AUDIT_C_BY, AUDIT_C_DATE) VALUES ('CONFIG','Configuration', 'LEOS_CMIS', to_timestamp('06-APR-23 12:26:17','DD-MON-RR HH24:MI:SS'));
INSERT INTO leos_repository.CONFIG_CATEGORIES (CATEGORY_CODE, CATEGORY_DESC, AUDIT_C_BY, AUDIT_C_DATE) VALUES ('STRUCTURE','Structure', 'LEOS_CMIS', to_timestamp('06-APR-23 12:26:17','DD-MON-RR HH24:MI:SS'));
INSERT INTO leos_repository.CONFIG_CATEGORIES (CATEGORY_CODE, CATEGORY_DESC, AUDIT_C_BY, AUDIT_C_DATE) VALUES ('TEMPLATE_PROPOSAL','Template', 'LEOS_CMIS', to_timestamp('06-APR-23 12:26:17','DD-MON-RR HH24:MI:SS'));
INSERT INTO leos_repository.CONFIG_CATEGORIES (CATEGORY_CODE, CATEGORY_DESC, AUDIT_C_BY, AUDIT_C_DATE) VALUES ('TEMPLATE_BILL','Template', 'LEOS_CMIS', to_timestamp('06-APR-23 12:26:17','DD-MON-RR HH24:MI:SS'));
INSERT INTO leos_repository.CONFIG_CATEGORIES (CATEGORY_CODE, CATEGORY_DESC, AUDIT_C_BY, AUDIT_C_DATE) VALUES ('TEMPLATE_MEMORANDUM','Template', 'LEOS_CMIS', to_timestamp('06-APR-23 12:26:17','DD-MON-RR HH24:MI:SS'));
INSERT INTO leos_repository.CONFIG_CATEGORIES (CATEGORY_CODE, CATEGORY_DESC, AUDIT_C_BY, AUDIT_C_DATE) VALUES ('TEMPLATE_ANNEX','Template', 'LEOS_CMIS', to_timestamp('06-APR-23 12:26:17','DD-MON-RR HH24:MI:SS'));
INSERT INTO leos_repository.CONFIG_CATEGORIES (CATEGORY_CODE, CATEGORY_DESC, AUDIT_C_BY, AUDIT_C_DATE) VALUES ('TEMPLATE_COUNCIL_EXPLANATORY','Template', 'LEOS_CMIS', to_timestamp('06-APR-23 12:26:17','DD-MON-RR HH24:MI:SS'));
INSERT INTO leos_repository.CONFIG_CATEGORIES (CATEGORY_CODE, CATEGORY_DESC, AUDIT_C_BY, AUDIT_C_DATE) VALUES ('TEMPLATE_STAT_FINANC_LEGIS','Template', 'LEOS_CMIS', to_timestamp('06-APR-23 12:26:17','DD-MON-RR HH24:MI:SS'));
INSERT INTO leos_repository.CONFIG_CATEGORIES (CATEGORY_CODE, CATEGORY_DESC, AUDIT_C_BY, AUDIT_C_DATE) VALUES ('TEMPLATE','Template', 'LEOS_CMIS', to_timestamp('06-APR-23 12:26:17','DD-MON-RR HH24:MI:SS'));

--6. CONFIG
INSERT INTO leos_repository.CONFIG (NAME,OBJECT_ID,CATEGORY_ID,LANGUAGE,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE)
select
    cmis_name, OBJECT_ID, ID CATEGORY_ID, leos_language, cmis_createdby, audit_c_date, cmis_lastmodifiedby, audit_last_m_date
from (
         select
             src.object_id, CONFCAT.ID, leos_category,
             cmis_name, leos_revisionStatus, leos_contributionStatus, leos_originRef, leos_baseRevisionId,
             decode(lower(leos_liveDiffingRequired),'true',1,0) livediffingrequired,
             metadata_ref, metadata_procedureType, metadata_docTemplate, leos_language, metadata_docStage,
             decode(lower(cmis_isPrivateWorkingCopy),'true',1,0) isprivateworking,
             cmis_createdby, to_timestamp(cmis_creationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_c_date,
             cmis_lastmodifiedby, to_timestamp(cmis_lastmodificationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_last_m_date
         from (
                  select opv.parent_id, opv.repository_id repository_name, lc.*
                  from leos_cmis lc, object_path_view opv
                  where lc.object_id = opv.object_id
              ) src,
              leos_repository.config_categories confcat
         where src.cmis_basetypeid = 'cmis:document' and src.repository_name = '&&repository_name'
           and src.parent_id = (SELECT object_id FROM object_path_view WHERE OBJECT_PATH = '/leos/templates' and repository_id = '&&repository_name')
           and CASE WHEN leos_category not in ('CONFIG','STRUCTURE') THEN 'TEMPLATE_'||LEOS_CATEGORY ELSE LEOS_CATEGORY END = CONFCAT.CATEGORY_CODE
     );

--7. CONFIG_VERSION
INSERT INTO leos_repository.config_version
(CONFIG_ID,OBJECT_ID,VERSION_LABEL,VERSION_SERIES_ID,VERSION_TYPE,IS_LATEST_MAJOR_VERSION,IS_LATEST_VERSION,IS_MAJOR_VERSION,IS_VERSION_SERIES_CHECKED_OUT,
 IS_IMMUTABLE,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_DATE,AUDIT_LAST_M_BY)
SELECT cfg.id, SRC.OBJECT_ID,
       NVL(leos_versionlabel,'1.0'), cmis_versionseriesid, leos_versiontype,
       decode(lower(cmis_islatestmajorversion),'true',1,0) cmis_islatestmajorversion,
       decode(lower(cmis_ISLATESTVERSION),'true',1,0) cmis_ISLATESTVERSION,
       decode(lower(cmis_ISMAJORVERSION),'true',1,0) cmis_ISMAJORVERSION,
       decode(lower(cmis_ISVERSIONSERIESCHECKEDOUT),'true',1,0) cmis_ISVERSIONSERIESCHECKEDOUT,
       decode(lower(cmis_ISIMMUTABLE),'true',1,0) cmis_ISIMMUTABLE,
       cmis_createdby, to_timestamp(cmis_creationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_c_date,
       to_timestamp(cmis_lastmodificationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_last_m_date, cmis_lastmodifiedby
from (
         select opv.parent_id, opv.repository_id repository_name, lc.*
         from leos_cmis lc, object_path_view opv
         where lc.object_id = opv.object_id
     ) src, leos_repository.config cfg
where src.cmis_basetypeid = 'cmis:document' and src.repository_name = '&&repository_name'
  and src.parent_id = (SELECT object_id FROM object_path_view WHERE OBJECT_PATH = '/leos/templates' and repository_id = '&&repository_name')
  and src.object_id = cfg.object_id;


--8. CONFIG_CONTENT
INSERT INTO leos_repository.CONFIG_CONTENT (VERSION_ID,CONTENT,
                                               CONTENT_STREAM_MIME_TYPE,CONTENT_STREAM_FILENAME,CONTENT_STREAM_ID,CONTENT_STREAM_LENGTH,
                                               AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_DATE,AUDIT_LAST_M_BY)
SELECT cfg.id, to_clob(str.data) content,
       cmis_CONTENTSTREAMMIMETYPE,cmis_CONTENTSTREAMFILENAME,cmis_CONTENTSTREAMID,cmis_CONTENTSTREAMLENGTH,
       cmis_createdby, to_timestamp(cmis_creationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_c_date,
       to_timestamp(cmis_lastmodificationdate,'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') audit_last_m_date, cmis_lastmodifiedby
from (
         select opv.parent_id, opv.repository_id repository_name, lc.*
         from leos_cmis lc, object_path_view opv
         where lc.object_id = opv.object_id
     ) src, leos_repository.config_version cfg, STREAM str
where src.cmis_basetypeid = 'cmis:document' and src.repository_name = '&&repository_name'
  and src.parent_id = (SELECT object_id FROM object_path_view WHERE OBJECT_PATH = '/leos/templates' and repository_id = '&&repository_name')
  and src.object_id = str.id
  and src.object_id = cfg.object_id;



--9. COLLABORATORS
INSERT INTO leos_repository.COLLABORATORS(COLLABORATOR_NAME,ROLE_ID,ORGANIZATION,AUDIT_C_BY,AUDIT_C_DATE)
SELECT NAME, ROLE, ORG, USER, SYSDATE FROM (
                                               SELECT DISTINCT
                                                   REGEXP_SUBSTR(LEOS_COLLABORATORS,'[^::]+',1,1) NAME,
                                                   REGEXP_SUBSTR(LEOS_COLLABORATORS,'[^::]+',1,2) ROLE,
                                                   REGEXP_SUBSTR(LEOS_COLLABORATORS,'[^::]+',1,3) ORG
                                                       , USER, SYSDATE
                                               FROM (SELECT DISTINCT LEOS_COLLABORATORS FROM LEOS_CMIS)
                                               WHERE LEOS_COLLABORATORS IS NOT NULL
                                           )
ORDER BY 1, 2, 3
;

--10. PACKAGE_COLLABORATORS
INSERT INTO leos_repository.PACKAGE_COLLABORATORS (PACKAGE_ID,COLLABORATOR_ID,AUDIT_C_BY,AUDIT_C_DATE)
select PACKAGE_ID, ID, AUDIT_C_BY,AUDIT_C_DATE from (
                                                        select
                                                            distinct package_id, leos_collaborators
                                                        FROM LEOS_CMIS lc, leos_repository.document_version docver, leos_repository.document doc
                                                        WHERE leos_collaborators is not null and repository_id in (select id from repository where cmis_id = '&&repository_name')
                                                          AND lc.object_id = docver.object_id
                                                          and docver.document_id = doc.id) src, leos_repository.collaborators colb
WHERE src.leos_collaborators = colb.collaborator_name ||'::'||colb.role_id||'::'||colb.organization;

--11. DOCUMENT PROPERTIES FLAGS
--INSERT INTO leos_repository.DOCUMENT_PROPERTIES (PROPERTY_NAME,DOC_CATEGORY_ID,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE) VALUES ('clonedRef',(SELECT id FROM leos_repository.DOCUMENT_CATEGORIES WHERE CATEGORY_CODE='ANNEX'),'LEOS_CMIS',to_timestamp('14-APR-23 10:00:05.000000000','DD-MON-RR HH24:MI:SSXFF'),null,null);
INSERT INTO leos_repository.DOCUMENT_PROPERTIES (PROPERTY_NAME,DOC_CATEGORY_ID,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE) VALUES ('docIndex',(SELECT id FROM leos_repository.DOCUMENT_CATEGORIES WHERE CATEGORY_CODE='ANNEX'),'LEOS_CMIS',to_timestamp('14-APR-23 10:00:05','DD-MON-RR HH24:MI:SS'),null,null);
INSERT INTO leos_repository.DOCUMENT_PROPERTIES (PROPERTY_NAME,DOC_CATEGORY_ID,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE) VALUES ('docNumber',(SELECT id FROM leos_repository.DOCUMENT_CATEGORIES WHERE CATEGORY_CODE='ANNEX'),'LEOS_CMIS',to_timestamp('14-APR-23 10:00:05','DD-MON-RR HH24:MI:SS'),null,null);
INSERT INTO leos_repository.DOCUMENT_PROPERTIES (PROPERTY_NAME,DOC_CATEGORY_ID,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE) VALUES ('docTitle',(SELECT id FROM leos_repository.DOCUMENT_CATEGORIES WHERE CATEGORY_CODE='ANNEX'),'LEOS_CMIS',to_timestamp('14-APR-23 10:00:05','DD-MON-RR HH24:MI:SS'),null,null);
INSERT INTO leos_repository.document_properties (property_name, DOC_CATEGORY_ID, AUDIT_C_BY, AUDIT_C_DATE)
select property_name, id, 'LEOS_CMIS', to_timestamp('14-APR-23 10:00:05','DD-MON-RR HH24:MI:SS') from (
                                                                                                                       select 'clonedProposal' property_name, id from leos_repository.document_categories where CATEGORY_CODE in ('PROPOSAL') UNION
                                                                                                                       select 'clonedMilestoneId' property_name, id from leos_repository.document_categories where CATEGORY_CODE in ('PROPOSAL') UNION
                                                                                                                       select 'trackChangesEnabled' property_name, id from leos_repository.document_categories where CATEGORY_CODE not in ('EXPORT','LEG') UNION
                                                                                                                       select 'callbackAddress' property_name, id from leos_repository.document_categories where CATEGORY_CODE not in ('EXPORT','LEG') UNION
                                                                                                                       select 'milestoneComments' property_name, id from leos_repository.document_categories where CATEGORY_CODE not in ('EXPORT','LEG')
                                                                                                                   );

--12. DOCUMENT_PROPERTY_VALUES
/*
--12.1. clonedRef
INSERT INTO leos_repository.DOCUMENT_PROPERTY_VALUES
(DOCUMENT_ID,VERSION_ID,PROPERTY_ID,PROPERTY_VALUE,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE)
select ver.document_id, ver.id, docprop.property_id, prop_value, audit_c_by, audit_c_date, AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE
from (
    select object_id, annex_clonedref prop_value
    from leos_cmis where annex_clonedref is not null and object_id in (select object_id from object_path_view where repository_id = '&&repository_name')
) src, leos_repository.document_version ver
   ,(select id property_id from leos_repository.document_properties where property_name = 'clonedRef') docprop
where src.object_id = ver.object_id;
*/

--12.2. docIndex
INSERT INTO leos_repository.DOCUMENT_PROPERTY_VALUES
(DOCUMENT_ID,VERSION_ID,PROPERTY_ID,PROPERTY_VALUE,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE)
select ver.document_id, ver.id, docprop.property_id, prop_value, audit_c_by, audit_c_date, AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE
from (
    select object_id, annex_docIndex prop_value
    from leos_cmis where annex_docIndex is not null and object_id in (select object_id from object_path_view where repository_id = '&&repository_name')
) src, leos_repository.document_version ver
   ,(select id property_id from leos_repository.document_properties where property_name = 'docIndex') docprop
where src.object_id = ver.object_id;

--12.3. docNumber
INSERT INTO leos_repository.DOCUMENT_PROPERTY_VALUES
(DOCUMENT_ID,VERSION_ID,PROPERTY_ID,PROPERTY_VALUE,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE)
select ver.document_id, ver.id, docprop.property_id, prop_value, audit_c_by, audit_c_date, AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE
from (
    select object_id, annex_docNumber prop_value
    from leos_cmis where annex_docNumber is not null and object_id in (select object_id from object_path_view where repository_id = '&&repository_name')
) src, leos_repository.document_version ver
   ,(select id property_id from leos_repository.document_properties where property_name = 'docNumber') docprop
where src.object_id = ver.object_id;


--12.4. docTitle
INSERT INTO leos_repository.DOCUMENT_PROPERTY_VALUES
(DOCUMENT_ID,VERSION_ID,PROPERTY_ID,PROPERTY_VALUE,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE)
select ver.document_id, ver.id, docprop.property_id, prop_value, audit_c_by, audit_c_date, AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE
from (
    select object_id, annex_docTitle prop_value
    from leos_cmis where annex_docTitle is not null and object_id in (select object_id from object_path_view where repository_id = '&&repository_name')
) src, leos_repository.document_version ver
   ,(select id property_id from leos_repository.document_properties where property_name = 'docTitle') docprop
where src.object_id = ver.object_id;

--12.5. clonedMilestoneId
INSERT INTO leos_repository.DOCUMENT_PROPERTY_VALUES
(DOCUMENT_ID,VERSION_ID,PROPERTY_ID,PROPERTY_VALUE,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE)
select ver.document_id, ver.id, docprop.property_id, prop_value, audit_c_by, audit_c_date, AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE
from (
    select object_id, leos_clonedMilestoneId prop_value
    from leos_cmis where leos_clonedMilestoneId is not null and object_id in (select object_id from object_path_view where repository_id = '&&repository_name')
) src, leos_repository.document_version ver
   ,(select id property_id from leos_repository.document_properties where property_name = 'clonedMilestoneId') docprop
where src.object_id = ver.object_id;

--12.6. clonedProposal
INSERT INTO leos_repository.DOCUMENT_PROPERTY_VALUES
(DOCUMENT_ID,VERSION_ID,PROPERTY_ID,PROPERTY_VALUE,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE)
select ver.document_id, ver.id, docprop.property_id, prop_value, audit_c_by, audit_c_date, AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE
from (
    select object_id, leos_clonedProposal prop_value
    from leos_cmis where leos_clonedProposal is not null and object_id in (select object_id from object_path_view where repository_id = '&&repository_name')
) src, leos_repository.document_version ver
   ,(select id property_id from leos_repository.document_properties where property_name = 'clonedProposal') docprop
where src.object_id = ver.object_id;

--12.7. milestoneComments
INSERT INTO leos_repository.DOCUMENT_PROPERTY_VALUES
(DOCUMENT_ID,VERSION_ID,PROPERTY_ID,PROPERTY_VALUE,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE)
select
    ver.document_id, ver.id, docprop.property_id, comsrc.value,  audit_c_by, audit_c_date, AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE
from (
         select objt.repository_id, objt.cmis_id obj_type, objt.local_namespace, objt.display_name obj_display_name, prop.id, prop.object_id, prop.object_type_property_id, objtyp.cmis_id, objtyp.display_name, objtyp.description, prop.value
         from property prop, object_type_property objtyp, object obj, object_type objt
         where prop.object_type_property_id = objtyp.id
           AND prop.object_id = obj.id
           AND obj.object_type_id = objt.id
     ) comsrc, leos_repository.document_version ver, leos_repository.document_v docv,
     (select pro.id property_id, cat.category_code
      from leos_repository.document_properties pro, leos_repository.document_categories cat
      where pro.doc_category_id = cat.id
        and pro.property_name = 'milestoneComments') docprop
WHERE CMIS_ID = 'leos:milestoneComments'
  AND comsrc.REPOSITORY_ID IN (SELECT ID FROM REPOSITORY WHERE CMIS_Id = '&&repository_name')
  and comsrc.object_id = ver.object_id
  and ver.id = docv.version_id
  AND docv.category_code = docprop.category_code
order by 1, 2
;

--12.8. trackChangesEnabled
prompt --12.8. trackChangesEnabled
INSERT INTO leos_repository.DOCUMENT_PROPERTY_VALUES
(DOCUMENT_ID,VERSION_ID,PROPERTY_ID,PROPERTY_VALUE,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE)
select ver.document_id, ver.id, docprop.property_id, prop_value, audit_c_by, audit_c_date, AUDIT_LAST_M_BY,AUDIT_LAST_M_DATE
from (
    select object_id, leos_trackChangesEnabled prop_value
    from leos_cmis where leos_trackChangesEnabled is not null and object_id in (select object_id from object_path_view where repository_id = '&&repository_name')
) src, leos_repository.document_version ver
   ,(select id property_id from leos_repository.document_properties where property_name = 'trackChangesEnabled') docprop
where src.object_id = ver.object_id;

commit;