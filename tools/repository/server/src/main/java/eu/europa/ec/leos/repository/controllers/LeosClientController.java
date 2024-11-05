package eu.europa.ec.leos.repository.controllers;

import eu.europa.ec.leos.repository.entities.LeosClients;
import eu.europa.ec.leos.repository.model.LeosClient;
import eu.europa.ec.leos.repository.repositories.LeosClientsRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@Tag(name = "Leos client API", description = "Leos client API")
@Slf4j
@AllArgsConstructor
public class LeosClientController {
    private final LeosClientsRepository leosClientsRepository;

    @GetMapping(path = "/leos-client")
    @Operation(summary = "Get LEOS client info")
    public ResponseEntity<Object> getLeosClient(@RequestParam("clientName") String clientName) {
        final Optional<LeosClients> leosClient = leosClientsRepository.findByName(clientName);
        if (leosClient.isPresent()) {
            return ResponseEntity.ok(convert(leosClient.get()));
        }
        //HTTP.NOT_FOUND is not correctly handled so return empty instead
        //return ResponseEntity.ok(new Object());
        return ResponseEntity.ok(LeosClient.builder().build());
    }

    private LeosClient convert(LeosClients leosClients) {
        return LeosClient.builder().name(leosClients.getName()).displayName(leosClients.getDisplayName()).build();
    }

}
