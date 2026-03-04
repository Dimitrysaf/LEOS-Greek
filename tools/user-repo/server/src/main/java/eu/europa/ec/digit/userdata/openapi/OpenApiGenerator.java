package eu.europa.ec.digit.userdata.openapi;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.parameters.RequestBody;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.InputStream;
import java.lang.reflect.Method;
import java.net.URL;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class OpenApiGenerator {

    public static void main(String[] args) throws Exception {
        System.out.println("Open API Json Generating on build...");
        String outputPath = args.length > 0 ? args[0] : "target/openapi/openapi.json";

        OpenAPI openAPI = new OpenAPI()
                .info(new Info().title("LEOS USER REPO API").version(readVersion()).description("API documentation for LEOS User Repo"))
                .paths(new Paths());

        for (Class<?> controller : findControllers(readProperty("app.controllers.package", "eu.europa.ec.leos.services.controllers"))) {
            String classPath = getPath(controller.isAnnotationPresent(RequestMapping.class)
                    ? controller.getAnnotation(RequestMapping.class).value() : new String[0]);

            for (Method method : controller.getDeclaredMethods()) {
                String[] methodPaths;
                String[] httpMethods;

                if (method.isAnnotationPresent(RequestMapping.class)) {
                    RequestMapping rm = method.getAnnotation(RequestMapping.class);
                    methodPaths = rm.value().length > 0 ? rm.value() : (rm.path().length > 0 ? rm.path() : new String[]{""});
                    httpMethods = rm.method().length > 0 ? toStrings(rm.method()) : new String[]{"get"};
                } else if (method.isAnnotationPresent(GetMapping.class)) {
                    GetMapping gm = method.getAnnotation(GetMapping.class);
                    methodPaths = gm.value().length > 0 ? gm.value() : (gm.path().length > 0 ? gm.path() : new String[]{""});
                    httpMethods = new String[]{"get"};
                } else if (method.isAnnotationPresent(PostMapping.class)) {
                    PostMapping pm = method.getAnnotation(PostMapping.class);
                    methodPaths = pm.value().length > 0 ? pm.value() : (pm.path().length > 0 ? pm.path() : new String[]{""});
                    httpMethods = new String[]{"post"};
                } else if (method.isAnnotationPresent(PutMapping.class)) {
                    PutMapping pm = method.getAnnotation(PutMapping.class);
                    methodPaths = pm.value().length > 0 ? pm.value() : (pm.path().length > 0 ? pm.path() : new String[]{""});
                    httpMethods = new String[]{"put"};
                } else if (method.isAnnotationPresent(DeleteMapping.class)) {
                    DeleteMapping dm = method.getAnnotation(DeleteMapping.class);
                    methodPaths = dm.value().length > 0 ? dm.value() : (dm.path().length > 0 ? dm.path() : new String[]{""});
                    httpMethods = new String[]{"delete"};
                } else if (method.isAnnotationPresent(PatchMapping.class)) {
                    PatchMapping pm = method.getAnnotation(PatchMapping.class);
                    methodPaths = pm.value().length > 0 ? pm.value() : (pm.path().length > 0 ? pm.path() : new String[]{""});
                    httpMethods = new String[]{"patch"};
                } else {
                    continue;
                }

                for (String mp : methodPaths) {
                    String fullPath = (classPath + mp).replaceAll("//", "/");
                    if (fullPath.isEmpty()) fullPath = "/";

                    PathItem pathItem = openAPI.getPaths().getOrDefault(fullPath, new PathItem());

                    for (String httpMethod : httpMethods) {
                        Operation operation = new Operation()
                                .addTagsItem(controller.getSimpleName())
                                .operationId(method.getName())
                                .responses(buildResponses(method));

                        for (java.lang.reflect.Parameter param : method.getParameters()) {
                            if (param.isAnnotationPresent(PathVariable.class)) {
                                PathVariable pv = param.getAnnotation(PathVariable.class);
                                operation.addParametersItem(new Parameter()
                                        .name(pv.value().isEmpty() ? param.getName() : pv.value())
                                        .in("path").required(true)
                                        .schema(new Schema<>().type(toType(param.getType()))));
                            } else if (param.isAnnotationPresent(RequestParam.class)) {
                                RequestParam rp = param.getAnnotation(RequestParam.class);
                                operation.addParametersItem(new Parameter()
                                        .name(rp.value().isEmpty() ? param.getName() : rp.value())
                                        .in("query").required(rp.required())
                                        .schema(new Schema<>().type(toType(param.getType()))));
                            } else if (param.isAnnotationPresent(RequestHeader.class)) {
                                RequestHeader rh = param.getAnnotation(RequestHeader.class);
                                operation.addParametersItem(new Parameter()
                                        .name(rh.value().isEmpty() ? param.getName() : rh.value())
                                        .in("header").required(rh.required())
                                        .schema(new Schema<>().type("string")));
                            } else if (param.isAnnotationPresent(org.springframework.web.bind.annotation.RequestBody.class)) {
                                operation.requestBody(new RequestBody()
                                        .required(param.getAnnotation(org.springframework.web.bind.annotation.RequestBody.class).required())
                                        .content(new Content().addMediaType("application/json",
                                                new MediaType().schema(new Schema<>().type("object")))));
                            }
                        }

                        switch (httpMethod) {
                            case "get" -> pathItem.get(operation);
                            case "post" -> pathItem.post(operation);
                            case "put" -> pathItem.put(operation);
                            case "delete" -> pathItem.delete(operation);
                            case "patch" -> pathItem.patch(operation);
                        }
                    }
                    openAPI.getPaths().addPathItem(fullPath, pathItem);
                }
            }
        }

        java.nio.file.Path outPath = java.nio.file.Paths.get(outputPath);
        Files.createDirectories(outPath.getParent());
        new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT)
                .setSerializationInclusion(JsonInclude.Include.NON_NULL)
                .writeValue(outPath.toFile(), openAPI);
        System.out.println("API Json Generated : " + outputPath);
    }

    private static String readVersion() throws Exception {
        return readProperty("app.version", "unknown");
    }

    private static String readProperty(String key, String defaultValue) throws Exception {
        Properties props = new Properties();
        try (InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream("app-info.properties")) {
            if (is != null) props.load(is);
        }
        return props.getProperty(key, defaultValue);
    }

    private static List<Class<?>> findControllers(String packageName) throws Exception {
        List<Class<?>> result = new ArrayList<>();
        String path = packageName.replace('.', '/');
        URL resource = Thread.currentThread().getContextClassLoader().getResource(path);
        if (resource == null) return result;
        for (File file : new File(resource.toURI()).listFiles()) {
            if (!file.getName().endsWith(".class")) continue;
            Class<?> cls = Class.forName(packageName + "." + file.getName().replace(".class", ""));
            if (cls.isAnnotationPresent(RestController.class))
                result.add(cls);
        }
        return result;
    }

    private static String getPath(String[] values) {
        return values.length > 0 ? values[0] : "";
    }

    private static String[] nvl(String[] values) {
        return values.length > 0 ? values : new String[]{""};
    }

    private static String[] toStrings(RequestMethod[] methods) {
        String[] r = new String[methods.length];
        for (int i = 0; i < methods.length; i++) r[i] = methods[i].name().toLowerCase();
        return r;
    }

    private static String toType(Class<?> c) {
        if (c == String.class) return "string";
        if (c == Integer.class || c == int.class || c == Long.class || c == long.class) return "integer";
        if (c == Boolean.class || c == boolean.class) return "boolean";
        return c.getSimpleName();
    }

    private static ApiResponses buildResponses(Method method) {
        ApiResponses responses = new ApiResponses();
        Class<?> returnType = method.getReturnType();
        boolean isArray = false;
        Class<?> actualType = returnType;
        
        // Extract actual type from ResponseEntity<T>
        if (returnType.getName().contains("ResponseEntity")) {
            java.lang.reflect.Type genericReturnType = method.getGenericReturnType();
            if (genericReturnType instanceof java.lang.reflect.ParameterizedType) {
                java.lang.reflect.ParameterizedType paramType = (java.lang.reflect.ParameterizedType) genericReturnType;
                if (paramType.getActualTypeArguments().length > 0) {
                    java.lang.reflect.Type actualTypeArg = paramType.getActualTypeArguments()[0];
                    if (actualTypeArg instanceof Class) {
                        actualType = (Class<?>) actualTypeArg;
                    } else if (actualTypeArg instanceof java.lang.reflect.ParameterizedType) {
                        java.lang.reflect.ParameterizedType innerParamType = (java.lang.reflect.ParameterizedType) actualTypeArg;
                        actualType = (Class<?>) innerParamType.getRawType();
                        if (java.util.Collection.class.isAssignableFrom(actualType) && innerParamType.getActualTypeArguments().length > 0) {
                            isArray = true;
                            actualType = (Class<?>) innerParamType.getActualTypeArguments()[0];
                        }
                    }
                }
            }
        } else if (java.util.Collection.class.isAssignableFrom(returnType)) {
            // Handle Collection<T> return types
            java.lang.reflect.Type genericReturnType = method.getGenericReturnType();
            if (genericReturnType instanceof java.lang.reflect.ParameterizedType) {
                java.lang.reflect.ParameterizedType paramType = (java.lang.reflect.ParameterizedType) genericReturnType;
                if (paramType.getActualTypeArguments().length > 0) {
                    isArray = true;
                    actualType = (Class<?>) paramType.getActualTypeArguments()[0];
                }
            }
        }
        
        // Build response schema
        Schema<?> schema;
        if (isArray) {
            schema = new Schema<>().type("array")
                    .description("List<" + actualType.getSimpleName() + ">")
                    .items(new Schema<>().$ref("#/components/schemas/" + actualType.getSimpleName()));
        } else {
            schema = new Schema<>().type(toType(actualType));
        }
        Content content = new Content().addMediaType("application/json", new MediaType().schema(schema));
        
        // Check for @ResponseStatus annotation
        if (method.isAnnotationPresent(ResponseStatus.class)) {
            ResponseStatus rs = method.getAnnotation(ResponseStatus.class);
            String code = String.valueOf(rs.value().value());
            responses.addApiResponse(code, new ApiResponse().description(rs.reason().isEmpty() ? rs.value().getReasonPhrase() : rs.reason()).content(content));
        } else {
            responses.addApiResponse("200", new ApiResponse().description("Success").content(content));
        }
        
        // Add common error responses
        responses.addApiResponse("400", new ApiResponse().description("Bad Request"));
        responses.addApiResponse("401", new ApiResponse().description("Unauthorized"));
        responses.addApiResponse("404", new ApiResponse().description("Not Found"));
        responses.addApiResponse("500", new ApiResponse().description("Internal Server Error"));
        
        return responses;
    }
}
