package eu.europa.ec.leos.repository.dao.impl;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import eu.europa.ec.leos.repository.dao.DocPackageDao;
import eu.europa.ec.leos.repository.entity.DocPackage;
import eu.europa.ec.leos.repository.util.AbstractHibernateDao;

@Repository("docPackageDao")
@Transactional
public class DocPackageDaoImpl extends AbstractHibernateDao implements DocPackageDao {

	
	public Long save(DocPackage pkg) {
		return (Long)this.getCurrentSession().save(pkg);
	}

	public DocPackage findById(Long id) {
		Session session = this.getCurrentSession();
		Criteria crit = session.createCriteria(DocPackage.class);
		crit.add(Restrictions.eq("id", id));
		
		return (DocPackage) crit.uniqueResult();
	}

	public DocPackage findByName(String name) {
		Session session = this.getCurrentSession();
		Criteria crit = session.createCriteria(DocPackage.class);
		crit.add(Restrictions.eq("name", name));
		
		return (DocPackage) crit.uniqueResult();
	}


}
