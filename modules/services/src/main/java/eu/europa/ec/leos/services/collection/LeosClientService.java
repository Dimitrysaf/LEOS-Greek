package eu.europa.ec.leos.services.collection;

import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.vo.response.LeosClientResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class LeosClientService {

    private final LeosRepository leosRepository;

    public Optional<LeosClientResponse> getLeosClient (String systemClientId) {
        return leosRepository.getLeosClient(systemClientId);
    }
}
