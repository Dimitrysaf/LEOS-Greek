package eu.europa.ec.digit.userdata.services;

import eu.europa.ec.digit.userdata.entities.User;
import eu.europa.ec.digit.userdata.mappers.PageMapper;
import eu.europa.ec.digit.userdata.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceUTest {

    @Mock
    UserRepository userRepository;

    @Mock
    PageMapper pageMapper;

    @InjectMocks
    UserService userService;

    @Test
    void GIVEN_simpleSearchKey_WHEN_search_THEN_searchTermIsWrappedWithPercent() {
        Pageable pageable = PageRequest.of(0, 10);
        when(pageMapper.map(any(), any(), any())).thenReturn(pageable);

        Page<User> page = mock(Page.class);
        when(userRepository.findByKey(eq("%john%"), eq(pageable))).thenReturn(page);

        Page<User> result = userService.search("john", pageable);
        assertSame(page, result);
    }

    @Test
    void GIVEN_searchKeyWithSpaces_WHEN_search_THEN_spacesReplacedWithPercentSpacePercent() {
        Pageable pageable = PageRequest.of(0, 10);
        when(pageMapper.map(any(), any(), any())).thenReturn(pageable);

        Page<User> page = mock(Page.class);
        when(userRepository.findByKey(eq("%john% %doe%"), eq(pageable))).thenReturn(page);

        Page<User> result = userService.search("john doe", pageable);
        assertSame(page, result);
    }

    @Test
    void GIVEN_urlEncodedSearchKey_WHEN_search_THEN_decodedAndWrappedWithPercent() {
        Pageable pageable = PageRequest.of(0, 10);
        when(pageMapper.map(any(), any(), any())).thenReturn(pageable);

        Page<User> page = mock(Page.class);
        when(userRepository.findByKey(eq("%john% %doe%"), eq(pageable))).thenReturn(page);

        Page<User> result = userService.search("john%20doe", pageable);
        assertSame(page, result);
    }

    @Test
    void GIVEN_nullSearchKey_WHEN_search_THEN_searchTermIsPercent() {
        Pageable pageable = PageRequest.of(0, 10);
        when(pageMapper.map(any(), any(), any())).thenReturn(pageable);

        Page<User> page = mock(Page.class);
        when(userRepository.findByKey(eq("%"), eq(pageable))).thenReturn(page);

        Page<User> result = userService.search(null, pageable);
        assertSame(page, result);
    }

    @Test
    void GIVEN_emptySearchKey_WHEN_search_THEN_searchTermIsPercent() {
        Pageable pageable = PageRequest.of(0, 10);
        when(pageMapper.map(any(), any(), any())).thenReturn(pageable);

        Page<User> page = mock(Page.class);
        when(userRepository.findByKey(eq("%"), eq(pageable))).thenReturn(page);

        Page<User> result = userService.search("", pageable);
        assertSame(page, result);
    }

    @Test
    void GIVEN_searchKeyWithAccentedCharacters_WHEN_search_THEN_accentsPreserved() {
        Pageable pageable = PageRequest.of(0, 10);
        when(pageMapper.map(any(), any(), any())).thenReturn(pageable);

        Page<User> page = mock(Page.class);
        when(userRepository.findByKey(eq("%José%"), eq(pageable))).thenReturn(page);

        Page<User> result = userService.search("José", pageable);
        assertSame(page, result);
    }

    @Test
    void GIVEN_urlEncodedAccentedCharacters_WHEN_search_THEN_decodedWithAccents() {
        Pageable pageable = PageRequest.of(0, 10);
        when(pageMapper.map(any(), any(), any())).thenReturn(pageable);

        Page<User> page = mock(Page.class);
        when(userRepository.findByKey(eq("%José%"), eq(pageable))).thenReturn(page);

        Page<User> result = userService.search("Jos%C3%A9", pageable);
        assertSame(page, result);
    }

    @Test
    void GIVEN_searchKeyWithSpecialCharacters_WHEN_search_THEN_specialCharsPreserved() {
        Pageable pageable = PageRequest.of(0, 10);
        when(pageMapper.map(any(), any(), any())).thenReturn(pageable);

        Page<User> page = mock(Page.class);
        when(userRepository.findByKey(eq("%O'Brien%"), eq(pageable))).thenReturn(page);

        Page<User> result = userService.search("O'Brien", pageable);
        assertSame(page, result);
    }

    @Test
    void GIVEN_urlEncodedSpecialCharacters_WHEN_search_THEN_decodedWithSpecialChars() {
        Pageable pageable = PageRequest.of(0, 10);
        when(pageMapper.map(any(), any(), any())).thenReturn(pageable);

        Page<User> page = mock(Page.class);
        when(userRepository.findByKey(eq("%O'Brien%"), eq(pageable))).thenReturn(page);

        Page<User> result = userService.search("O%27Brien", pageable);
        assertSame(page, result);
    }
}
