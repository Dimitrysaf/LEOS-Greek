package eu.europa.ec.leos.repository.util;

import javax.persistence.EntityManager;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.jpa.HibernateEntityManagerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * See HibernateDao bean declaration in cfc-dao.xml configuration file
 * 
 */
public abstract class AbstractHibernateDao {

	static final Logger LOGGER = LoggerFactory.getLogger(AbstractHibernateDao.class);
	
//	@Autowired
//	private SessionFactory sessionFactory;
//	
//	public SessionFactory getSessionFactory() {
//		return sessionFactory;
//	}
//
//	public void setSessionFactory(SessionFactory sessionFactory) {
//		this.sessionFactory = sessionFactory;
//		LOGGER.info("Session factory initialized in HibernateDao [{}]", (this.sessionFactory != null));
//	}

	@Autowired
	public EntityManager entityManager;
	
	public Session getCurrentSession() {
//		Session toReturn ;
//		try {
//			toReturn = sessionFactory.getCurrentSession();
//		} catch (HibernateException hEx) {
//			LOGGER.error("could not get current session ?", hEx);
//			toReturn = sessionFactory.openSession();
//		}
//		
//		return toReturn;
		
		return entityManager.unwrap(Session.class);
	}
}
