package com.college.colllege_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

import com.college.colllege_backend.repository.UserRepository;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return email -> userRepository.findByEmail(email)
                .map(user -> org.springframework.security.core.userdetails.User
                        .withUsername(user.getEmail())
                        .password(user.getPassword())
                        .roles(user.getRole())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:8080",
                "http://127.0.0.1:3000"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        // Only allow specific headers instead of wildcard
        configuration.setAllowedHeaders(Arrays.asList(
                "Content-Type",
                "Authorization",
                "X-Requested-With",
                "Accept"
        ));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .httpBasic(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable()) // Disable CSRF only for stateless API (token-based auth)
                .authorizeHttpRequests(requests -> requests
                // Public endpoints - NO authentication required
                .requestMatchers("/api/users/login").permitAll()
                .requestMatchers("/api/users/register").permitAll()
                .requestMatchers("/api/health").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/lookups/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/courses/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/faculty/**").permitAll()
                // Enquiry creation - PUBLIC (students/parents can submit)
                .requestMatchers(HttpMethod.POST, "/api/enquiries").permitAll()
                // Enquiry search by seat number - PUBLIC (for admission form pre-fill)
                .requestMatchers(HttpMethod.GET, "/api/enquiries/by-seat/**").permitAll()
                // Admission form creation - PUBLIC (students can submit admissions)
                .requestMatchers(HttpMethod.POST, "/api/admissions/fy").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/admissions/dsy").permitAll()
                // Enquiry list/view - Staff only
                .requestMatchers("/api/enquiries/**").hasAnyRole("ENQUIRY_STAFF", "PRINCIPAL", "OFFICE_STAFF")
                // Admission Form endpoints - Allow staff only (list, view, update)
                .requestMatchers(HttpMethod.GET, "/api/fy-admissions/**").hasAnyRole("OFFICE_STAFF", "PRINCIPAL")
                .requestMatchers(HttpMethod.PUT, "/api/fy-admissions/**").hasAnyRole("OFFICE_STAFF", "PRINCIPAL")
                .requestMatchers(HttpMethod.DELETE, "/api/fy-admissions/**").hasAnyRole("OFFICE_STAFF", "PRINCIPAL")
                .requestMatchers(HttpMethod.GET, "/api/admissions/fy").hasAnyRole("OFFICE_STAFF", "PRINCIPAL")
                .requestMatchers(HttpMethod.GET, "/api/admissions/fy/**").hasAnyRole("OFFICE_STAFF", "PRINCIPAL")
                .requestMatchers(HttpMethod.PUT, "/api/admissions/fy/**").hasAnyRole("OFFICE_STAFF", "PRINCIPAL")
                .requestMatchers(HttpMethod.DELETE, "/api/admissions/fy/**").hasAnyRole("OFFICE_STAFF", "PRINCIPAL")
                .requestMatchers(HttpMethod.GET, "/api/dsy-admissions/**").hasAnyRole("OFFICE_STAFF", "PRINCIPAL")
                .requestMatchers(HttpMethod.PUT, "/api/dsy-admissions/**").hasAnyRole("OFFICE_STAFF", "PRINCIPAL")
                .requestMatchers(HttpMethod.DELETE, "/api/dsy-admissions/**").hasAnyRole("OFFICE_STAFF", "PRINCIPAL")
                .requestMatchers(HttpMethod.GET, "/api/admissions/dsy").hasAnyRole("OFFICE_STAFF", "PRINCIPAL")
                .requestMatchers(HttpMethod.GET, "/api/admissions/dsy/**").hasAnyRole("OFFICE_STAFF", "PRINCIPAL")
                .requestMatchers(HttpMethod.PUT, "/api/admissions/dsy/**").hasAnyRole("OFFICE_STAFF", "PRINCIPAL")
                .requestMatchers(HttpMethod.DELETE, "/api/admissions/dsy/**").hasAnyRole("OFFICE_STAFF", "PRINCIPAL")
                // Student data - Allow authenticated users
                .requestMatchers("/api/students/**").authenticated()
                // Management endpoints
                .requestMatchers("/api/users/**").hasAnyRole("PRINCIPAL", "OFFICE_STAFF")
                .requestMatchers("/api/faculty/**").hasAnyRole("PRINCIPAL", "HOD", "OFFICE_STAFF")
                .requestMatchers("/api/courses/**").hasAnyRole("PRINCIPAL", "HOD", "OFFICE_STAFF")
                .requestMatchers("/api/lookups/**").hasAnyRole("PRINCIPAL", "OFFICE_STAFF")
                // All other requests denied
                .anyRequest().denyAll()
                );

        return http.build();
    }
}
