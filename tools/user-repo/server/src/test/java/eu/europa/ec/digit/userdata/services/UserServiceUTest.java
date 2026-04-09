package eu.europa.ec.digit.userdata.services;

import eu.europa.ec.digit.userdata.mappers.PageMapper;
import eu.europa.ec.digit.userdata.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
        
        userService.search("john", pageable);
        
        verify(userRepository).findNonEntityUsersByKey(eq("%john%"), eq(pageable));
    }

    @Test
    void GIVEN_searchKeyWithSpaces_WHEN_search_THEN_spacesReplacedWithPercentSpacePercent() {
        Pageable pageable = PageRequest.of(0, 10);
        when(pageMapper.map(any(), any(), any())).thenReturn(pageable);
        
        userService.search("john doe", pageable);
        
        verify(userRepository).findNonEntityUsersByKey(eq("%john% %doe%"), eq(pageable));
    }

    @Test
    void GIVEN_urlEncodedSearchKey_WHEN_search_THEN_decodedAndWrappedWithPercent() {
        Pageable pageable = PageRequest.of(0, 10);
        when(pageMapper.map(any(), any(), any())).thenReturn(pageable);
        
        userService.search("john%20doe", pageable);
        
        verify(userRepository).findNonEntityUsersByKey(eq("%john% %doe%"), eq(pageable));
    }

    @Test
    void GIVEN_nullSearchKey_WHEN_search_THEN_searchTermIsPercent() {
        Pageable pageable = PageRequest.of(0, 10);
        when(pageMapper.map(any(), any(), any())).thenReturn(pageable);
        
        userService.search(null, pageable);
        
        verify(userRepository).findNonEntityUsersByKey(eq("%"), eq(pageable));
    }

    @Test
    void GIVEN_emptySearchKey_WHEN_search_THEN_searchTermIsPercent() {
        Pageable pageable = PageRequest.of(0, 10);
        when(pageMapper.map(any(), any(), any())).thenReturn(pageable);
        
        userService.search("", pageable);
        
        verify(userRepository).findNonEntityUsersByKey(eq("%"), eq(pageable));
    }

    @Test
    void GIVEN_searchKeyWithAccentedCharacters_WHEN_search_THEN_accentsPreserved() {
        Pageable pageable = PageRequest.of(0, 10);
        when(pageMapper.map(any(), any(), any())).thenReturn(pageable);
        
        userService.search("José", pageable);
        
        verify(userRepository).findNonEntityUsersByKey(eq("%José%"), eq(pageable));
    }

    @Test
    void GIVEN_urlEncodedAccentedCharacters_WHEN_search_THEN_decodedWithAccents() {
        Pageable pageable = PageRequest.of(0, 10);
        when(pageMapper.map(any(), any(), any())).thenReturn(pageable);
        
        userService.search("Jos%C3%A9", pageable);
        
        verify(userRepository).findNonEntityUsersByKey(eq("%José%"), eq(pageable));
    }

    @Test
    void GIVEN_searchKeyWithSpecialCharacters_WHEN_search_THEN_specialCharsPreserved() {
        Pageable pageable = PageRequest.of(0, 10);
        when(pageMapper.map(any(), any(), any())).thenReturn(pageable);
        
        userService.search("O'Brien", pageable);
        
        verify(userRepository).findNonEntityUsersByKey(eq("%O'Brien%"), eq(pageable));
    }

    @Test
    void GIVEN_urlEncodedSpecialCharacters_WHEN_search_THEN_decodedWithSpecialChars() {
        Pageable pageable = PageRequest.of(0, 10);
        when(pageMapper.map(any(), any(), any())).thenReturn(pageable);
        
        userService.search("O%27Brien", pageable);
        
        verify(userRepository).findNonEntityUsersByKey(eq("%O'Brien%"), eq(pageable));
    }
}
