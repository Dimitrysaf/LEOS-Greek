package eu.europa.ec.leos.services.controllers;

import com.github.jsonldjava.utils.Obj;
import eu.europa.ec.leos.services.dto.request.HelloMessage;
import eu.europa.ec.leos.services.dto.response.Greeting;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class CoEditionController {

    private static final Logger LOG = LoggerFactory.getLogger(CoEditionController.class);

    //this is a small demo with the only purpose is to test if there is extra needed for configuration on the tomcat production server
    @MessageMapping("/hello")
    @SendTo("/topic/greeting")
    public Greeting greeting(HelloMessage message) {
        return new Greeting("Hello, " + HtmlUtils.htmlEscape(message.getName()) + "!");
    }
}
