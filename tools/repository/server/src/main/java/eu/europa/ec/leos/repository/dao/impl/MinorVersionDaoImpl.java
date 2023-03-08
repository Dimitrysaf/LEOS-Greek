package eu.europa.ec.leos.repository.dao.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.LockModeType;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.SetJoin;

import org.hibernate.Criteria;
import org.hibernate.Hibernate;
import org.hibernate.LockMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import eu.europa.ec.leos.repository.dao.MinorVersionDao;
import eu.europa.ec.leos.repository.dao.jdbc.JMinorVersionDTOMapper;
import eu.europa.ec.leos.repository.dao.jdbc.MetadataXmlRow;
import eu.europa.ec.leos.repository.dao.jdbc.MetadataXmlRowMapper;
import eu.europa.ec.leos.repository.dao.jdbc.MinorVersionJDTO;
import eu.europa.ec.leos.repository.dao.jdbc.MinorVersionJDTORow;
import eu.europa.ec.leos.repository.dao.jdbc.MinorVersionJDTORowMapper;
import eu.europa.ec.leos.repository.entity.MinorVersion;
import eu.europa.ec.leos.repository.entity.XmlContent;
import eu.europa.ec.leos.repository.util.AbstractHibernateDao;

@Repository("MinorVersionDao")
public class MinorVersionDaoImpl extends AbstractHibernateDao implements MinorVersionDao {

	@Autowired
	JdbcTemplate jdbcTemplate;
	 private EntityManagerFactory emf;
	
	
	public MinorVersion find(long id) {
		return (MinorVersion) this.getCurrentSession().find(MinorVersion.class, id);
	}
	
	
	
	public Long save(MinorVersion mv) {
		return (Long) this.getCurrentSession().save(mv);
	}

	/**
	 * cascade all works only with objects attached to the session I think
	 */
	public Long saveMinorVersionWithXml(String name,String xml) {
		MinorVersion mv = new MinorVersion();
		mv.setName(name);
		XmlContent xc= new XmlContent();
		xc.setXml(xml);
		mv.getXmls().add(xc);
		xc.setMinorVersion(mv);
		return (Long) this.getCurrentSession().save(mv);
		
	}
	
	
	/**
	 */
	@SuppressWarnings("unchecked")
	public List<MinorVersion> list() {
		Criteria crit = this.getCurrentSession().createCriteria(MinorVersion.class);
		List<MinorVersion> toReturn = crit.list();
		
		return toReturn;
		
	}

	@SuppressWarnings("unchecked")
	public List<MinorVersion> listWithXmls() {
		Criteria crit = this.getCurrentSession().createCriteria(MinorVersion.class);
		List<MinorVersion> toReturn = crit.list();
		
		for(MinorVersion mv : toReturn) {
			Hibernate.initialize(mv.getXmls());
		}
		
		return toReturn;
		
	}


	//NOT WORKING , sub criteria necessary
	@SuppressWarnings("unchecked")
	public List<MinorVersion> findVersionsWithDocumentId(long idDoc){
		List<MinorVersion> toReturn = this.getCurrentSession().createCriteria(MinorVersion.class).add(Restrictions.eq("document.id", new Long(idDoc))).list();
		return toReturn;
	}
/*
	@Override
	public MinorVersion getLatestMinorVersionFromMavId(long mavId) {
		Criteria myCrit = this.getCurrentSession().createCriteria(MinorVersion.class);
		myCrit.add(Restrictions.eq("majorVersion.id", new Long(mavId)));
		myCrit.add(Restrictions.eq("latestVersion", true));

		List<MinorVersion> toReturn = myCrit.list();
		return toReturn.get(0);
	}

*/
	
	//TODO not finished, JPA rewrite to get rid of warning
	public MinorVersion getLatestMinorVersionFromCuidJPA(String cuid) {
		CriteriaBuilder cb=entityManager.getCriteriaBuilder();
		CriteriaQuery<MinorVersion> myCrit=cb.createQuery(MinorVersion.class);

		Root<MinorVersion> root = myCrit.from(MinorVersion.class);
//		SetJoin<MinorVersion, MajorVersion> miv = root.join(Author_.books);
//		 
//		ParameterExpression<String> paramTitle = cb.parameter(String.class);
//		cq.where(cb.like(books.get(Book_.title), paramTitle));		
//		
//		
		List<MinorVersion> toReturn = entityManager.createQuery(myCrit).getResultList();
		return toReturn.get(0);
	
	}	
	
	@Override
	public MinorVersion  getLatestMinorVersionFromCuid(String cuid) {
		Criteria myCrit = this.getCurrentSession().createCriteria(MinorVersion.class);
		myCrit.add(Restrictions.eq("latestVersion", true));
		myCrit=myCrit.createCriteria("document");
		myCrit.add(Restrictions.eq("cuid", cuid));
		List list = myCrit.list();
		List<MinorVersion> toReturn = list;
		return toReturn.get(0);
	}	

	@Override
	public List<MinorVersionJDTORow>  getLatestMinorVersionFromCuidJpa(String cuid) {
		String sqlString = "SELECT ID, MNLATEST ,MNNUMBER , name, MNOLDEST , version, DOCUMENT_ID FROM MINOR_VERSION \r\n"
				+ "WHERE MNLATEST  = 1 AND DOCUMENT_ID IN (SELECT id FROM DOCUMENT WHERE cuid = '" + cuid + "' )";
		
		return jdbcTemplate.query(sqlString,new MinorVersionJDTORowMapper());
	}

	//TODO not tested , suggestion for now
	public MinorVersion getOldestMinorVersionFromCuid(String cuid) {
		Criteria myCrit = this.getCurrentSession().createCriteria(MinorVersion.class);
		myCrit.add(Restrictions.eq("oldestVersion", true));
		myCrit=myCrit.createCriteria("document");
		myCrit.add(Restrictions.eq("cuid", cuid));
		List<MinorVersion> toReturn = myCrit.list();
		return toReturn.get(0);
	}

	@Override
	public List<MinorVersionJDTO> jdGetLast100Versiont(String cuid, Long limit, String orderBy) {
		
		String realSql= "SELECT * FROM (	select this_.id as id1_3_5_," + 
				"	 this_.name as NAME, document1.id as DID" + 
				"	 from minor_version this_ inner join document document1 on this_.document_id=document1.id " +
				" AND document1.CUID = '" + cuid + "' " + 
                " ORDER BY this_.id " + orderBy + " ) " + 
				" WHERE ROWNUM <= " + limit;
		
		return jdbcTemplate.query(realSql ,new JMinorVersionDTOMapper());
	}

	@Override
	public List<MetadataXmlRow> jdGetFirstLast(String cuid, String position) {
		
		String realSql="SELECT d.name,xml\r\n"
				+ "FROM document doc, MINOR_VERSION mv, xml_content xml, DOCPACKAGE d\r\n"
				+ "WHERE doc.id = mv.DOCUMENT_ID \r\n"
				+ "AND mv.ID  = xml.MINOR_VERSION_ID \r\n"
				+ "AND doc.CUID = '" + cuid + "'\r\n"
				+ "AND doc.PACKAGE_ID = d.ID \r\n"
				+ "AND (mnlatest = decode('" + position + "','last',1) or mnoldest = decode('" + position + "','first',1))"; 
		
		return jdbcTemplate.query(realSql ,new MetadataXmlRowMapper());
	}

	@Override
	public List<MinorVersion> jpaGetLast100Version(String cuid) {
		Criteria crit = this.getCurrentSession().createCriteria(MinorVersion.class);
		crit=crit.createCriteria("document");
		crit=crit.add(Restrictions.eq("cuid", cuid));

		crit=crit.setMaxResults(100);
		List<MinorVersion> toReturn = crit.list();
		return toReturn;
	}	
}
