package eu.europa.ec.leos.repository.dao.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.jdbc.core.RowMapper;

public class MinorVersionJDTORowMapper implements RowMapper<MinorVersionJDTORow> {

	@Override
	public MinorVersionJDTORow mapRow(ResultSet rs, int rowNum) throws SQLException {
		System.out.println("from rowmapper");
		MinorVersionJDTORow ret=new MinorVersionJDTORow();
		System.out.println(rs.getLong("ID"));
		ret.id=rs.getLong("ID");
		ret.latestVersion = rs.getLong("MNLATEST");
	    ret.minorVersionNumber = rs.getLong("MNNUMBER");
	    ret.name = rs.getString("NAME");
	    ret.oldestVersion = rs.getLong("MNOLDEST");
	    ret.version = rs.getLong("VERSION");
	    ret.document = 	rs.getLong("DOCUMENT_ID");				
		return ret;
			
	}

}
