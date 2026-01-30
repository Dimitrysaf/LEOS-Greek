package eu.europa.ec.leos.repository.security.config;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.CachingUserDetailsService;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserCache;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.cache.SpringCacheBasedUserCache;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.web.client.RestTemplate;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

import eu.europa.ec.leos.repository.security.service.JwtUserDetailsService;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@ImportResource("classpath:eu/europa/ec/leos/repository/configContext.xml")
public class WebSecurityConfig {

	@Value("${repository.jwt.auth.enabled}")
	private boolean jwtAuthEnabled;

	@Value("${repository.jwt.auth.user.details.cache.expiration.min}")
	private int userDetailsCacheExpirationInMin;

	@Bean
	public JwtAuthenticationEntryPoint JwtAuthenticationEntryPoint() {
		return new JwtAuthenticationEntryPoint();
	}

//	@Bean
//	public UserDetailsService JwtUserDetailsService() {
//		return new JwtUserDetailsService();
//	}

	@Bean
	UserCache JwtUserCache() {
		Cache<Object, Object> userCache = Caffeine.newBuilder()
				.expireAfterWrite(userDetailsCacheExpirationInMin, TimeUnit.MINUTES)
				.maximumSize(100)
				.build();
		return new SpringCacheBasedUserCache(new CaffeineCache("userCache", userCache));
	}

	@Bean
	public UserDetailsService CachingUserDetailsService(JwtUserDetailsService userDetailsService) {
		CachingUserDetailsService cachingUserDetailsService = new CachingUserDetailsService(userDetailsService);
		cachingUserDetailsService.setUserCache(JwtUserCache());
		return cachingUserDetailsService;
	}

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		// Replace with a real encoder for production!
		return new PasswordEncoder() {
			@Override
			public String encode(CharSequence charSequence) {
				return charSequence.toString();
			}
			@Override
			public boolean matches(CharSequence charSequence, String s) {
				return true;
			}
		};
	}

	@Bean
	public StrictHttpFirewall httpFirewall() {
		return new StrictHttpFirewall();
	}

	// AuthenticationManager bean for use elsewhere (if needed)
//	@Bean
//	public AuthenticationManager authenticationManager(HttpSecurity http, UserDetailsService userDetailsService, PasswordEncoder passwordEncoder)
//			throws Exception {
//		return http
//				.getSharedObject(AuthenticationManager.class);
//	}
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}

	// New way: Use SecurityFilterChain bean
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable());
		http.headers(headers -> headers
				.frameOptions(frame -> frame.deny())
				.xssProtection(xss -> xss.disable())
				.contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'none';"))
		);

		if (jwtAuthEnabled) {
			http.authorizeHttpRequests(authz -> authz
					.requestMatchers("/token").permitAll()
					.anyRequest().authenticated()
			);
		} else {
			http.anonymous(anon -> anon.disable())
					.authorizeHttpRequests(authz -> authz
							.requestMatchers("/**").permitAll()
					);
		}

//		http
//				.exceptionHandling(exception -> exception
//						.authenticationEntryPoint(JwtAuthenticationEntryPoint()))
//				.sessionManagement(session -> session
//						.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//				.addFilterBefore(new JwtRequestFilter(), UsernamePasswordAuthenticationFilter.class)
//				.addFilterAfter(new XSSFilter(), UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}
