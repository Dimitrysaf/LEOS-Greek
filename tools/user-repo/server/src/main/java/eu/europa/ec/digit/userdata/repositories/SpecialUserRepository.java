/*
 * Copyright 2024 European Union
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
package eu.europa.ec.digit.userdata.repositories;

import eu.europa.ec.digit.userdata.entities.SpecialUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SpecialUserRepository extends JpaRepository<SpecialUser, Long> {

    /**
     * search for a user given its login
     *
     * @param login the user's login
     * @return the found {@link SpecialUser} object, or {@literal null}
     */
    SpecialUser getByLogin(String login);

    Optional<SpecialUser> findByLogin(String login);

    /**
     * Search for users in the LEOS_SPECIAL_USER table, matching the given searchKey on the
     * USER_LASTNAME, USER_FIRSTNAME, USER_EMAIL, USER_LOGIN columns.
     * @param searchKey the search term
     * @param pageable pagination parameters
     * @return Page of {@link SpecialUser} objects
     */
    @Query(value = "SELECT * FROM LEOS_SPECIAL_USER " + " WHERE "
                    + " deAccent(USER_LASTNAME || ' ' || USER_FIRSTNAME) LIKE deAccent(:searchKey) "
                    + " OR "
                    + " deAccent(USER_FIRSTNAME || ' ' || USER_LASTNAME) LIKE deAccent(:searchKey) "
                    + " OR "
                    + " deAccent(USER_EMAIL) LIKE deAccent(:searchKey) "
                    + " OR "
                    + " deAccent(USER_LOGIN) LIKE deAccent(:searchKey) ",
            countQuery =  "SELECT count(*) FROM LEOS_SPECIAL_USER " + " WHERE "
                    + " deAccent(USER_LASTNAME || ' ' || USER_FIRSTNAME) LIKE deAccent(:searchKey) "
                    + " OR "
                    + " deAccent(USER_FIRSTNAME || ' ' || USER_LASTNAME) LIKE deAccent(:searchKey) "
                    + " OR "
                    + " deAccent(USER_EMAIL) LIKE deAccent(:searchKey) "
                    + " OR "
                    + " deAccent(USER_LOGIN) LIKE deAccent(:searchKey) ",
            nativeQuery = true)
    Page<SpecialUser> findByKey(@Param("searchKey") String searchKey, Pageable pageable);
}
