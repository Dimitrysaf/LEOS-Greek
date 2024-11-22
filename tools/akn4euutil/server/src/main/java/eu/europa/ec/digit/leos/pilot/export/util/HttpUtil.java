package eu.europa.ec.digit.leos.pilot.export.util;

import org.springframework.http.HttpMethod;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Map;

public class HttpUtil {
    public static HttpClient createHttpClient() {
        return new HttpClient();
    }

    public static class HttpClientRequestException extends Exception {
        public final int statusCode;

        public HttpClientRequestException(String message, int statusCode) {
            super(String.format("%s [code %s]", message, statusCode));
            this.statusCode = statusCode;
        }
    }

    public static class HttpResponse {
        private final byte[] data;
        private final int statusCode;
        private final String statusText;

        public HttpResponse(int statusCode, String statusText) {
            this(statusCode, statusText , null);
        }

        public HttpResponse(int statusCode, String statusText, byte[] data) {
            this.statusCode = statusCode;
            this.statusText = statusText;
            this.data = data;
        }

        public byte[] getData() {
            return this.data;
        }

        public int getStatusCode() {
            return this.statusCode;
        }

        public String getStatusText() {
            return this.statusText;
        }
    }

    public static class HttpClient {
        public HttpClient() {}

        private HttpResponse doRequest(String method, String strUrl, Map<String, String> params, Map<String, String> headers, byte[] data) throws HttpClientRequestException {
            final boolean doOutput = HttpMethod.POST.matches(method) || HttpMethod.PUT.matches(method);
            HttpURLConnection connection = null;
            try {
                URL url = params.isEmpty() ? new URL(strUrl) : new URL(String.format("%s?%s", strUrl, getParamString(params)));
                connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod(method);
                connection.setInstanceFollowRedirects(false);
                connection.setDoOutput(doOutput);
                addHeaders(connection, headers);

                if (doOutput) {
                    writeRequestData(connection, data);
                }
                if (connection.getResponseCode() < 200 && connection.getResponseCode() > 299) {
                    connection.disconnect();
                    return new HttpResponse(connection.getResponseCode(), connection.getResponseMessage());
                }

                byte[] responseData = readResponseData(connection.getInputStream());
                return new HttpResponse(connection.getResponseCode(),
                        connection.getResponseMessage(),
                        responseData);
            } catch(IOException ex) {
                if (connection != null) {
                    connection.disconnect();
                }
                throw new HttpClientRequestException(ex.getMessage(), 0);
            }
        }

        private HttpResponse doRequest(String method, String url, Map<String, String> params, Map<String, String> headers) throws HttpClientRequestException  {
            return this.doRequest(method, url, params, headers, null);
        }

        public HttpResponse doGet(String url, Map<String, String> params, Map<String, String> headers) throws HttpClientRequestException  {
            return this.doRequest(HttpMethod.GET.name(), url, params, headers);
        }

        public HttpResponse doPut(String url, Map<String, String> params, Map<String, String> headers) throws HttpClientRequestException  {
            return this.doRequest(HttpMethod.DELETE.name(), url, params, headers);
        }

        public HttpResponse doPost(String url, Map<String, String> params, Map<String, String> headers, byte[] data) throws HttpClientRequestException {
            return this.doRequest(HttpMethod.POST.name(), url, params, headers, data);
        }

        public HttpResponse doPut(String url, Map<String, String> params, Map<String, String> headers, byte[] data) throws HttpClientRequestException {
            return this.doRequest(HttpMethod.PUT.name(), url, params, headers, data);
        }

        private String getParamString(Map<String, String> params) {
            StringBuilder result = new StringBuilder();

            for (Map.Entry<String, String> entry : params.entrySet()) {
                try {
                    String key = URLEncoder.encode(entry.getKey(), "UTF-8");
                    String value = URLEncoder.encode(entry.getValue(), "UTF-8");
                    result.append(String.format("%s=%s", key, value));
                    result.append("&");
                } catch(UnsupportedEncodingException ignored) {
                }
            }

            String resultString = result.toString();
            return !resultString.isEmpty()
                    ? resultString.substring(0, resultString.length() - 1)
                    : resultString;
        }

        private void addHeaders(HttpURLConnection connection, Map<String, String> headers) {
            if (headers.isEmpty()) {
                return;
            }

            for (Map.Entry<String, String> entry : headers.entrySet()) {
                connection.setRequestProperty(entry.getKey(), entry.getValue());
            }
        }

        private void writeRequestData(HttpURLConnection connection, byte[] data) throws IOException {
            OutputStream outStream = connection.getOutputStream();
            outStream.write(data);
            outStream.flush();
            outStream.close();
        }

        private byte[] readResponseData(InputStream inputStream) throws IOException {
            byte[] readBuffer = new byte[8192];
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            int read;

            while((read = inputStream.read(readBuffer)) != -1) {
                baos.write(readBuffer, 0, read);
            }
            return baos.toByteArray();
        }
    }
}
