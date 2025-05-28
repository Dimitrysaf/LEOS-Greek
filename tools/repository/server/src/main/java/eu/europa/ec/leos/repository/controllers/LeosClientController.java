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

import java.util.Objects;
import java.util.Optional;

@RestController
@Tag(name = "Leos client API", description = "Leos client API")
@Slf4j
@AllArgsConstructor
public class LeosClientController {
    private final LeosClientsRepository leosClientsRepository;

    @GetMapping(path = "/leos-client")
    @Operation(summary = "Get LEOS client info")
    public ResponseEntity<Object> getLeosClient(
            @RequestParam(value = "clientName", required = true) String clientName,
            @RequestParam(value = "technicalUser", required = false) String technicalUser
            ) {
        final Optional<LeosClients> leosClient = Objects.isNull(technicalUser)?
                leosClientsRepository.findByName(clientName) :
                leosClientsRepository.findByNameAndTechnicalUser(clientName, technicalUser);
        return leosClient.<ResponseEntity<Object>>map(leosClients -> ResponseEntity.ok(convert(leosClients)))
                .orElseGet(() -> ResponseEntity.ok().build());
    }

    private LeosClient convert(LeosClients leosClients) {
        return LeosClient.builder()
                .name(leosClients.getName())
                .displayName(leosClients.getDisplayName())
                .technicalUser(leosClients.getTechnicalUser())
                .build();
    }

}
