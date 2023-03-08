package eu.europa.ec.leos.repository.dao.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.jdbc.core.RowMapper;

public class MetadataXmlRowMapper  implements RowMapper<MetadataXmlRow> {

	@Override
	public MetadataXmlRow mapRow(ResultSet rs, int rowNum) throws SQLException {
		MetadataXmlRow ret = new MetadataXmlRow();
		ret.name=rs.getString("NAME");
		ret.xml=rs.getString("XML");
		return ret;
	}

}
