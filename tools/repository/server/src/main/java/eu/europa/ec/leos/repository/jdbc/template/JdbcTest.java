package eu.europa.ec.leos.repository.jdbc.template;

import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCallback;
import org.springframework.stereotype.Component;
import eu.europa.ec.leos.repository.entity.DocPackage;

@Component
public class JdbcTest {
	private final JdbcTemplate jdbcTemplate;

	
    public JdbcTest(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    //continue to see if actual data is returned
    
    public void doSomething() {
    		this.jdbcTemplate.execute("select * from "+DocPackage.DOCPACKAGE);
//        this.jdbcTemplate.execute("select * from "+DocPackage.DOCPACKAGE,new PreparedStatementCallback<T>() {
//
//			@Override
//			public T doInPreparedStatement(PreparedStatement ps) throws SQLException, DataAccessException {
//				// TODO Auto-generated method stub
//				return null;
//			}
//		} );
    }

}

