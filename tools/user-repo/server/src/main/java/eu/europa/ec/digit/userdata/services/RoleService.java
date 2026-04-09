package eu.europa.ec.digit.userdata.services;

import eu.europa.ec.digit.userdata.entities.Role;
import eu.europa.ec.digit.userdata.repositories.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class RoleService {
    private final RoleRepository roleRepository;

    public Map<String, Role> getRoles() {
        return roleRepository.findAll().stream().collect(Collectors.toMap(Role::getRole, role -> role));
    }
}
