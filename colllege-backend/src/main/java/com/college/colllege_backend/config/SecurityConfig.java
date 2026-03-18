package com.college.colllege_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
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
                .cors()
                .and()
                .csrf()
                .disable() // Disable CSRF only for stateless API (token-based auth)
                .authorizeHttpRequests(requests -> requests
                // Public endpoints - NO authentication required
                .requestMatchers("/api/users/login").permitAll()
                .requestMatchers("/api/users/register").permitAll()
                .requestMatchers("/api/health").permitAll()
                // Enquiry creation - PUBLIC (students/parents can submit)
                .requestMatchers("POST", "/api/enquiries").permitAll()
                // Enquiry search by seat number - PUBLIC (for admission form pre-fill)
                .requestMatchers("GET", "/api/enquiries/by-seat/**").permitAll()
                // Admission form creation - PUBLIC (students can submit admissions)
                .requestMatchers("POST", "/api/admissions/fy").permitAll()
                .requestMatchers("POST", "/api/admissions/dsy").permitAll()
                // Enquiry list/view - Staff only
                .requestMatchers("/api/enquiries/**").hasAnyRole("ENQUIRY_STAFF", "ADMIN", "STAFF")
                // Admission Form endpoints - Allow staff only (list, view, update)
                .requestMatchers("GET", "/api/fy-admissions/**").hasAnyRole("STAFF", "ADMIN")
                .requestMatchers("PUT", "/api/fy-admissions/**").hasAnyRole("STAFF", "ADMIN")
                .requestMatchers("DELETE", "/api/fy-admissions/**").hasAnyRole("STAFF", "ADMIN")
                .requestMatchers("GET", "/api/admissions/fy/**").hasAnyRole("STAFF", "ADMIN")
                .requestMatchers("PUT", "/api/admissions/fy/**").hasAnyRole("STAFF", "ADMIN")
                .requestMatchers("DELETE", "/api/admissions/fy/**").hasAnyRole("STAFF", "ADMIN")
                .requestMatchers("GET", "/api/dsy-admissions/**").hasAnyRole("STAFF", "ADMIN")
                .requestMatchers("PUT", "/api/dsy-admissions/**").hasAnyRole("STAFF", "ADMIN")
                .requestMatchers("DELETE", "/api/dsy-admissions/**").hasAnyRole("STAFF", "ADMIN")
                .requestMatchers("GET", "/api/admissions/dsy/**").hasAnyRole("STAFF", "ADMIN")
                .requestMatchers("PUT", "/api/admissions/dsy/**").hasAnyRole("STAFF", "ADMIN")
                .requestMatchers("DELETE", "/api/admissions/dsy/**").hasAnyRole("STAFF", "ADMIN")
                // Student data - Allow authenticated users
                .requestMatchers("/api/students/**").authenticated()
                // Admin only
                .requestMatchers("/api/users/**").hasRole("ADMIN")
                .requestMatchers("/api/faculty/**").hasRole("ADMIN")
                .requestMatchers("/api/courses/**").hasRole("ADMIN")
                // All other requests denied
                .anyRequest().denyAll()
                );

        return http.build();
    }
}
