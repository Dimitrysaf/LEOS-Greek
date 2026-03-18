package eu.europa.ec.digit.leos.pilot.export.openapi;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.parameters.RequestBody;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
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
                .info(new Info().title("LEOS AKN4EU UTIL API").version(readVersion()).description("API documentation for LEOS akn4eu util service"))
                .paths(new Paths()).components(new Components()
                                .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT Bearer token authentication"))
                                .addSecuritySchemes("basicAuth", new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("basic")
                                        .description("Basic HTTP authentication")))
                        .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));

        for (Class<?> controller : findControllers(readProperty("app.controllers.package", "eu.europa.ec.digit.leos.pilot.export.controller"))) {
            String classPath = getPath(controller.isAnnotationPresent(RequestMapping.class)
                    ? controller.getAnnotation(RequestMapping.class).value() : new String[0]);
            // Get tag name from @Tag annotation if present
            String tagName = controller.getSimpleName();
            if (controller.isAnnotationPresent(io.swagger.v3.oas.annotations.tags.Tag.class)) {
                io.swagger.v3.oas.annotations.tags.Tag tag = controller.getAnnotation(io.swagger.v3.oas.annotations.tags.Tag.class);
                tagName = tag.name().isEmpty() ? controller.getSimpleName() : tag.name();
            }

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
                                .addTagsItem(tagName)
                                .operationId(method.getName())
                                .responses(buildResponses(method))
                                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));

                        // Read summary and description from @Operation annotation
                        if (method.isAnnotationPresent(io.swagger.v3.oas.annotations.Operation.class)) {
                            io.swagger.v3.oas.annotations.Operation op = method.getAnnotation(io.swagger.v3.oas.annotations.Operation.class);
                            if (!op.summary().isEmpty()) operation.summary(op.summary());
                            if (!op.description().isEmpty()) operation.description(op.description());
                        }

                        for (java.lang.reflect.Parameter param : method.getParameters()) {
                            if (param.isAnnotationPresent(PathVariable.class)) {
                                PathVariable pv = param.getAnnotation(PathVariable.class);
                                String paramName = pv.value().isEmpty() ? (pv.name().isEmpty() ? param.getName() : pv.name()) : pv.value();
                                Parameter parameter = new Parameter()
                                        .name(paramName)
                                        .in("path").required(true)
                                        .schema(new Schema<>().type(toType(param.getType())));
                                // Read description from @Parameter annotation
                                if (param.isAnnotationPresent(io.swagger.v3.oas.annotations.Parameter.class)) {
                                    io.swagger.v3.oas.annotations.Parameter p = param.getAnnotation(io.swagger.v3.oas.annotations.Parameter.class);
                                    if (!p.description().isEmpty()) parameter.description(p.description());
                                }
                                operation.addParametersItem(parameter);
                            } else if (param.isAnnotationPresent(RequestParam.class)) {
                                RequestParam rp = param.getAnnotation(RequestParam.class);
                                String paramName = rp.value().isEmpty() ? (rp.name().isEmpty() ? param.getName() : rp.name()) : rp.value();
                                Parameter parameter = new Parameter()
                                        .name(paramName)
                                        .in("query").required(rp.required())
                                        .schema(new Schema<>().type(toType(param.getType())));
                                // Read description from @Parameter annotation
                                if (param.isAnnotationPresent(io.swagger.v3.oas.annotations.Parameter.class)) {
                                    io.swagger.v3.oas.annotations.Parameter p = param.getAnnotation(io.swagger.v3.oas.annotations.Parameter.class);
                                    if (!p.description().isEmpty()) parameter.description(p.description());
                                }
                                operation.addParametersItem(parameter);
                            } else if (param.isAnnotationPresent(RequestHeader.class)) {
                                RequestHeader rh = param.getAnnotation(RequestHeader.class);
                                String paramName = rh.value().isEmpty() ? (rh.name().isEmpty() ? param.getName() : rh.name()) : rh.value();
                                Parameter parameter = new Parameter()
                                        .name(paramName)
                                        .in("header").required(rh.required())
                                        .schema(new Schema<>().type("string"));
                                // Read description from @Parameter annotation
                                if (param.isAnnotationPresent(io.swagger.v3.oas.annotations.Parameter.class)) {
                                    io.swagger.v3.oas.annotations.Parameter p = param.getAnnotation(io.swagger.v3.oas.annotations.Parameter.class);
                                    if (!p.description().isEmpty()) parameter.description(p.description());
                                }
                                operation.addParametersItem(parameter);
                            } else if (param.isAnnotationPresent(org.springframework.web.bind.annotation.RequestBody.class)) {
                                Schema<?> bodySchema;
                                if (param.getType() == Object.class) {
                                    bodySchema = new Schema<>().type("object");
                                } else {
                                    bodySchema = new Schema<>().$ref("#/components/schemas/" + param.getType().getSimpleName());
                                }
                                operation.requestBody(new RequestBody()
                                        .required(param.getAnnotation(org.springframework.web.bind.annotation.RequestBody.class).required())
                                        .content(new Content().addMediaType("application/json",
                                                new MediaType().schema(bodySchema))));
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
            // Scan @RestController, @Controller classes and interfaces with @Tag annotation
            if (cls.isAnnotationPresent(RestController.class) ||
                    cls.isAnnotationPresent(org.springframework.stereotype.Controller.class) ||
                    (cls.isInterface() && cls.isAnnotationPresent(io.swagger.v3.oas.annotations.tags.Tag.class))) {
                result.add(cls);
            }
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

        // Check for @ApiResponses annotation from Swagger
        if (method.isAnnotationPresent(io.swagger.v3.oas.annotations.responses.ApiResponses.class)) {
            io.swagger.v3.oas.annotations.responses.ApiResponses apiResponses =
                    method.getAnnotation(io.swagger.v3.oas.annotations.responses.ApiResponses.class);

            for (io.swagger.v3.oas.annotations.responses.ApiResponse apiResponse : apiResponses.value()) {
                String code = apiResponse.responseCode();
                String description = apiResponse.description();
                ApiResponse response = new ApiResponse().description(description);

                // Add content if specified in annotation
                if (apiResponse.content().length > 0) {
                    Content content = new Content();
                    for (io.swagger.v3.oas.annotations.media.Content c : apiResponse.content()) {
                        MediaType mediaType = new MediaType();
                        if (c.schema().implementation() != Void.class) {
                            Schema<?> schema = new Schema<>().$ref("#/components/schemas/" + c.schema().implementation().getSimpleName());
                            mediaType.schema(schema);
                        }
                        content.addMediaType("application/json", mediaType);
                    }
                    response.content(content);
                } else if (code.equals("200") || code.equals("201")) {
                    // For success responses without explicit content, extract from method return type
                    Class<?> responseType = extractResponseType(method);
                    if (responseType != null && responseType != Void.class) {
                        Content content = new Content();
                        MediaType mediaType = new MediaType();
                        Schema<?> schema;
                        if (isPrimitiveOrWrapper(responseType)) {
                            schema = new Schema<>().type(toType(responseType));
                        } else {
                            schema = new Schema<>().$ref("#/components/schemas/" + responseType.getSimpleName());
                        }
                        mediaType.schema(schema);
                        content.addMediaType("application/json", mediaType);
                        response.content(content);
                    }
                }

                responses.addApiResponse(code, response);
            }
            return responses;
        }

        // Fallback: build default responses
        Class<?> returnType = method.getReturnType();
        boolean isArray = false;
        Class<?> actualType = returnType;

        if (returnType.getName().contains("ResponseEntity") || returnType.getSimpleName().equals("ResponseEntity")) {
            // Handle ResponseEntity<T>
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
            // Handle List<T>, Set<T>, etc.
            java.lang.reflect.Type genericReturnType = method.getGenericReturnType();
            if (genericReturnType instanceof java.lang.reflect.ParameterizedType) {
                java.lang.reflect.ParameterizedType paramType = (java.lang.reflect.ParameterizedType) genericReturnType;
                if (paramType.getActualTypeArguments().length > 0) {
                    isArray = true;
                    actualType = (Class<?>) paramType.getActualTypeArguments()[0];
                }
            }
        }
        // else: actualType is already set to returnType (plain Java object)

        Schema<?> schema;
        if (isArray) {
            schema = new Schema<>().type("array")
                    .description("List<" + actualType.getSimpleName() + ">")
                    .items(new Schema<>().$ref("#/components/schemas/" + actualType.getSimpleName()));
        } else if (isPrimitiveOrWrapper(actualType)) {
            // For primitives and wrappers, use simple type
            schema = new Schema<>().type(toType(actualType));
        } else {
            // For custom objects, use schema reference
            schema = new Schema<>().$ref("#/components/schemas/" + actualType.getSimpleName());
        }
        Content content = new Content().addMediaType("application/json", new MediaType().schema(schema));

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

    private static Class<?> extractResponseType(Method method) {
        Class<?> returnType = method.getReturnType();

        // Check if return type is ResponseEntity
        if (returnType.getName().contains("ResponseEntity") || returnType.getSimpleName().equals("ResponseEntity")) {
            java.lang.reflect.Type genericReturnType = method.getGenericReturnType();
            if (genericReturnType instanceof java.lang.reflect.ParameterizedType) {
                java.lang.reflect.ParameterizedType paramType = (java.lang.reflect.ParameterizedType) genericReturnType;
                if (paramType.getActualTypeArguments().length > 0) {
                    java.lang.reflect.Type actualTypeArg = paramType.getActualTypeArguments()[0];
                    if (actualTypeArg instanceof Class) {
                        return (Class<?>) actualTypeArg;
                    } else if (actualTypeArg instanceof java.lang.reflect.ParameterizedType) {
                        java.lang.reflect.ParameterizedType innerParamType = (java.lang.reflect.ParameterizedType) actualTypeArg;
                        return (Class<?>) innerParamType.getRawType();
                    }
                }
            }
        } else if (returnType != void.class && returnType != Void.class) {
            // For plain Java objects (not wrapped in ResponseEntity)
            return returnType;
        }
        return null;
    }

    private static boolean isPrimitiveOrWrapper(Class<?> type) {
        return type.isPrimitive() ||
                type == String.class ||
                type == Integer.class ||
                type == Long.class ||
                type == Double.class ||
                type == Float.class ||
                type == Boolean.class ||
                type == Character.class ||
                type == Byte.class ||
                type == Short.class ||
                type == Void.class;
    }
}
