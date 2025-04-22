/*
 * Copyright 2021-2025 European Commission
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
package eu.europa.ec.digit.leos.pilot.export.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class ResourcesUtil {
    public static byte[] readResourceFile(final String path) {
        return readResourceFile(path, ResourcesUtil.class);
    }

    public static byte[] readResourceFile(final String path, final Class<?> clazz) {
        final InputStream resourceStream = clazz.getClassLoader().getResourceAsStream(path);
        try {
            return ResourcesUtil.inputStreamToBytes(resourceStream);
        } catch(IOException ex) {
            return new byte[0];
        }
    }

    public static byte[] inputStreamToBytes(InputStream inputStream) throws IOException {
        if (inputStream == null) {
            return new byte[0];
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        int read = -1;

        while((read = inputStream.read()) > -1) {
            outputStream.write(read);
        }
        return outputStream.toByteArray();
    }
}
