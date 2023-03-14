
package eu.europa.ec.leos.repository.controller;

import java.io.IOException;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

//necessary to get your multipart text / json as string
@Component
public class SimpleConverter implements Converter<MultipartFile, String> {

	@Override
	public String convert(MultipartFile source) {
		// TODO Auto-generated method stub
		try {
			return new String(source.getBytes());
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

//    public String convert(StandardMultipartFile source) {
//    	return source;
//    }
}