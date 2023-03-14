package eu.europa.ec.leos.repository.dao.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.jdbc.core.RowMapper;

public class JMinorVersionDTOMapper  implements RowMapper<MinorVersionJDTO> {

	@Override
	public MinorVersionJDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
		System.out.println("from rowmapper");
		MinorVersionJDTO ret = new MinorVersionJDTO();
		System.out.println(rs.getLong("DID"));
		ret.name=rs.getString("NAME");
		return ret;
	}

}
