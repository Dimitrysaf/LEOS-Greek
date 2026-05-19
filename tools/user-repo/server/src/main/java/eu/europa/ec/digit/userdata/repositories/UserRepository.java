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
import eu.europa.ec.digit.userdata.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.stream.Stream;

public interface UserRepository extends JpaRepository<User, User.UserId> {

    // language=SQL
    String SEARCH_BY_KEY_AND_ENTITY = """
            SELECT u.USER_LOGIN, u.USER_EMAIL, u.USER_PER_ID, u.USER_LASTNAME, u.USER_FIRSTNAME, u.JOB_TITLE, u.DATE_CREATED, u.SPECIAL
            FROM (
                SELECT u.*,
                       ROW_NUMBER() OVER (PARTITION BY u.USER_LOGIN ORDER BY u.SPECIAL DESC) AS rn
                FROM LEOS_USER u
                INNER JOIN LEOS_USER_ENTITY ue ON u.USER_LOGIN = ue.USER_LOGIN
                INNER JOIN LEOS_ENTITY e ON e.ENTITY_ID = ue.ENTITY_ID
                WHERE (
                    deAccent(USER_LASTNAME || ' ' || USER_FIRSTNAME) LIKE deAccent(:searchKey)
                 OR
                    deAccent(USER_FIRSTNAME || ' ' || USER_LASTNAME) LIKE deAccent(:searchKey)
                 OR
                    deAccent(USER_EMAIL) LIKE deAccent(:searchKey)
                 OR
                    deAccent(u.USER_LOGIN) LIKE deAccent(:searchKey))
                AND e.ENTITY_ID = :entityId
                AND USER_PER_ID != -1
                AND USER_EMAIL != 'entity@mail.com'
            ) u
            WHERE rn = 1""";

    // language=SQL
    String COUNT_SEARCH_BY_KEY_AND_ENTITY = """
            SELECT COUNT(*) FROM (
                SELECT ROW_NUMBER() OVER (PARTITION BY u.USER_LOGIN ORDER BY u.SPECIAL DESC) AS rn
                FROM LEOS_USER u
                INNER JOIN LEOS_USER_ENTITY ue ON u.USER_LOGIN = ue.USER_LOGIN
                INNER JOIN LEOS_ENTITY e ON e.ENTITY_ID = ue.ENTITY_ID
                WHERE (
                    deAccent(USER_LASTNAME || ' ' || USER_FIRSTNAME) LIKE deAccent(:searchKey)
                 OR
                    deAccent(USER_FIRSTNAME || ' ' || USER_LASTNAME) LIKE deAccent(:searchKey)
                 OR
                    deAccent(USER_EMAIL) LIKE deAccent(:searchKey)
                 OR
                    deAccent(u.USER_LOGIN) LIKE deAccent(:searchKey))
                AND e.ENTITY_ID = :entityId
                AND USER_PER_ID != -1
                AND USER_EMAIL != 'entity@mail.com'
            ) WHERE rn = 1""";

    // language=SQL
    String SEARCH_BY_KEY_DEDUPED = """
            SELECT u.USER_LOGIN, u.USER_EMAIL, u.USER_PER_ID, u.USER_LASTNAME, u.USER_FIRSTNAME, u.JOB_TITLE, u.DATE_CREATED, u.SPECIAL
            FROM (
                SELECT u.*,
                       ROW_NUMBER() OVER (PARTITION BY USER_LOGIN ORDER BY SPECIAL DESC) AS rn
                FROM LEOS_USER u
                WHERE (
                    deAccent(USER_LASTNAME || ' ' || USER_FIRSTNAME) LIKE deAccent(:searchKey)
                 OR
                    deAccent(USER_FIRSTNAME || ' ' || USER_LASTNAME) LIKE deAccent(:searchKey)
                 OR
                    deAccent(USER_EMAIL) LIKE deAccent(:searchKey)
                 OR
                    deAccent(USER_LOGIN) LIKE deAccent(:searchKey))
                AND USER_PER_ID != -1
                AND USER_EMAIL != 'entity@mail.com'
            ) u
            WHERE rn = 1""";

    // language=SQL
    String COUNT_SEARCH_BY_KEY_DEDUPED = """
            SELECT COUNT(*) FROM (
                SELECT ROW_NUMBER() OVER (PARTITION BY USER_LOGIN ORDER BY SPECIAL DESC) AS rn
                FROM LEOS_USER u
                WHERE (
                    deAccent(USER_LASTNAME || ' ' || USER_FIRSTNAME) LIKE deAccent(:searchKey)
                 OR
                    deAccent(USER_FIRSTNAME || ' ' || USER_LASTNAME) LIKE deAccent(:searchKey)
                 OR
                    deAccent(USER_EMAIL) LIKE deAccent(:searchKey)
                 OR
                    deAccent(USER_LOGIN) LIKE deAccent(:searchKey))
                AND USER_PER_ID != -1
                AND USER_EMAIL != 'entity@mail.com'
            ) WHERE rn = 1""";

    User findFirstByLogin(String login);

    List<User> findByLogin(String login);

    @Query(value = "SELECT * FROM LEOS_USER " + " WHERE "
            + " JOB_TITLE LIKE ?1% "
            + " ORDER BY USER_LASTNAME, USER_FIRSTNAME ", nativeQuery = true)
    Stream<User> findByJobTitle(String jobTitle);

    // FIXME: shift functions to DB later
    @Query(value = "SELECT * FROM LEOS_USER " + " WHERE "
            + " deAccent(USER_LASTNAME || ' ' || USER_FIRSTNAME) LIKE deAccent(?1) "
            + " OR "
            + " deAccent(USER_FIRSTNAME || ' ' || USER_LASTNAME) LIKE deAccent(?1) "
            + " ORDER BY USER_LASTNAME, USER_FIRSTNAME ", nativeQuery = true)
    Stream<User> findUsersByKey(String key);

    // FIXME: shift functions to DB later
    @Query(value = "SELECT DISTINCT LEOS_USER.* FROM LEOS_USER"
            + " INNER JOIN LEOS_USER_ENTITY"
            + "   ON LEOS_USER.USER_LOGIN = LEOS_USER_ENTITY.USER_LOGIN "
            + " INNER JOIN LEOS_ENTITY"
            + "   ON LEOS_USER_ENTITY.ENTITY_ID = LEOS_ENTITY.ENTITY_ID "
            + " WHERE "
            + "   (deAccent(USER_LASTNAME || ' ' || USER_FIRSTNAME) LIKE deAccent(?1) "
            + " OR "
            + "   deAccent(USER_FIRSTNAME || ' ' || USER_LASTNAME) LIKE deAccent(?1)) "
            + " AND "
            + "   deAccent(LEOS_ENTITY.ENTITY_ORG_NAME) LIKE deAccent(?2) "
            + " ORDER BY USER_LASTNAME, USER_FIRSTNAME ", nativeQuery = true)
    Stream<User> findUsersByKeyAndOrganization(String key, String organization);

    Long countByEntitiesIdAndPerIdNotAndEmailNot(String entityId, Long perId, String email);

    /**
     * Search for users in the LEOS_USER view, matching the given searchKey, deduplicating by USER_LOGIN
     * and preferring the SPECIAL=TRUE record when both a special and a non-special user share the same login.
     * @param searchKey the search term
     * @param pageable pagination parameters
     * @return Page of {@link User} objects
     */
    @Query(value = SEARCH_BY_KEY_DEDUPED, countQuery = COUNT_SEARCH_BY_KEY_DEDUPED, nativeQuery = true)
    Page<User> findByKey(@Param("searchKey") String searchKey, Pageable pageable);

    /**
     * Search for users in the LEOS_USER view, matching the given searchKey on the
     * USER_LASTNAME, USER_FIRSTNAME, USER_EMAIL, USER_LOGIN columns.
     * @param searchKey the search term
     * @param entityId entity ID
     * @param pageable pagination parameters
     * @return Page of {@link SpecialUser} objects
     */
    @Query(value = SEARCH_BY_KEY_AND_ENTITY, countQuery = COUNT_SEARCH_BY_KEY_AND_ENTITY, nativeQuery = true)
    Page<User> findByKeyAndEntity(@Param("searchKey") String searchKey, @Param("entityId") String entityId, Pageable pageable);

    User findFirstByLoginAndSpecialIsTrue(String login);

    @Query("SELECT COUNT(u) FROM User u JOIN u.entities e WHERE u.login = :login")
    long countByLoginWithEntities(@Param("login") String login);
}
