/*
 * Copyright 2023 European Commission
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
package eu.europa.ec.leos.repository.security.config;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.CachingUserDetailsService;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserCache;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.cache.SpringCacheBasedUserCache;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

import eu.europa.ec.leos.repository.security.service.JwtUserDetailsService;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@ImportResource("classpath:eu/europa/ec/leos/repository/configContext.xml")
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Value("${repository.jwt.auth.enabled}")
	private boolean jwtAuthEnabled;

	@Value("${repository.jwt.auth.user.details.cache.expiration.min}")
	private int userDetailsCacheExpirationInMin;

	@Bean
	public JwtAuthenticationEntryPoint JwtAuthenticationEntryPoint() {
		return new JwtAuthenticationEntryPoint();
	}

	@Bean
	public JwtRequestFilter JwtRequestFilter() {
		return new JwtRequestFilter();
	}

	@Bean
	public UserDetailsService JwtUserDetailsService() {
		return new JwtUserDetailsService();
	}

	@Bean
	UserCache JwtUserCache() {
		Cache<Object, Object> userCache = Caffeine.newBuilder()
			.expireAfterWrite(userDetailsCacheExpirationInMin, TimeUnit.MINUTES)
			.maximumSize(100)
			.build();
		return new SpringCacheBasedUserCache(new CaffeineCache("userCache", userCache));
	}

	@Bean
	public UserDetailsService CachingUserDetailsService() {
		CachingUserDetailsService cachingUserDetailsService = new CachingUserDetailsService(JwtUserDetailsService());
		cachingUserDetailsService.setUserCache(JwtUserCache());
		return cachingUserDetailsService;
	}

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}

	@Override
	public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(CachingUserDetailsService()).passwordEncoder(getPasswordEncoder());
	}

	private PasswordEncoder getPasswordEncoder() {
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
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Override
	protected void configure(HttpSecurity httpSecurity) throws Exception {
		// Not needed CSRF
		httpSecurity.csrf().disable();

		if (jwtAuthEnabled) {
			// Not authenticate this particular request
			httpSecurity.authorizeRequests().antMatchers("/token").permitAll().
				// All other requests need to be authenticated
				anyRequest().authenticated();
		} else {
			// Disable anonymous and not authenticate requests if auth disabled
			httpSecurity.anonymous().disable().authorizeRequests().antMatchers("*").permitAll();
		}

		// Make sure we use stateless session; session won't be used to store user's state
		httpSecurity.exceptionHandling().authenticationEntryPoint(JwtAuthenticationEntryPoint()).and().
				sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().
				// Add a filter to validate the tokens with every request
		        addFilterBefore(JwtRequestFilter(), UsernamePasswordAuthenticationFilter.class);
	}
}
