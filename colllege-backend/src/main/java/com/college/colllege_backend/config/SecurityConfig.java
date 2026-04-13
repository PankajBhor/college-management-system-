package com.college.colllege_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
                .csrf().disable()
                .authorizeHttpRequests(requests -> requests

                        // Public endpoints
                        .requestMatchers("/api/users/login").permitAll()
                        .requestMatchers("/api/users/register").permitAll()
                        .requestMatchers("/api/health").permitAll()

                        // Enquiry (public create/search)
                        .requestMatchers(HttpMethod.POST, "/api/enquiries").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/enquiries/by-seat/**").permitAll()

                        // Admissions (public submit)
                        .requestMatchers(HttpMethod.POST, "/api/admissions/fy").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/admissions/dsy").permitAll()

                        // Enquiry APIs (secured)
                        .requestMatchers("/api/enquiries/**")
                        .hasAnyAuthority("ENQUIRY_STAFF", "OFFICE_STAFF", "HOD", "PRINCIPAL")

                        // FY Admissions
                        .requestMatchers(HttpMethod.GET, "/api/fy-admissions/**")
                        .hasAnyAuthority("OFFICE_STAFF", "HOD", "PRINCIPAL")
                        .requestMatchers(HttpMethod.PUT, "/api/fy-admissions/**")
                        .hasAnyAuthority("OFFICE_STAFF", "HOD", "PRINCIPAL")
                        .requestMatchers(HttpMethod.DELETE, "/api/fy-admissions/**")
                        .hasAnyAuthority("OFFICE_STAFF", "HOD", "PRINCIPAL")

                        .requestMatchers(HttpMethod.GET, "/api/admissions/fy/**")
                        .hasAnyAuthority("OFFICE_STAFF", "HOD", "PRINCIPAL")
                        .requestMatchers(HttpMethod.PUT, "/api/admissions/fy/**")
                        .hasAnyAuthority("OFFICE_STAFF", "HOD", "PRINCIPAL")
                        .requestMatchers(HttpMethod.DELETE, "/api/admissions/fy/**")
                        .hasAnyAuthority("OFFICE_STAFF", "HOD", "PRINCIPAL")

                        // DSY Admissions
                        .requestMatchers(HttpMethod.GET, "/api/dsy-admissions/**")
                        .hasAnyAuthority("OFFICE_STAFF", "HOD", "PRINCIPAL")
                        .requestMatchers(HttpMethod.PUT, "/api/dsy-admissions/**")
                        .hasAnyAuthority("OFFICE_STAFF", "HOD", "PRINCIPAL")
                        .requestMatchers(HttpMethod.DELETE, "/api/dsy-admissions/**")
                        .hasAnyAuthority("OFFICE_STAFF", "HOD", "PRINCIPAL")

                        .requestMatchers(HttpMethod.GET, "/api/admissions/dsy/**")
                        .hasAnyAuthority("OFFICE_STAFF", "HOD", "PRINCIPAL")
                        .requestMatchers(HttpMethod.PUT, "/api/admissions/dsy/**")
                        .hasAnyAuthority("OFFICE_STAFF", "HOD", "PRINCIPAL")
                        .requestMatchers(HttpMethod.DELETE, "/api/admissions/dsy/**")
                        .hasAnyAuthority("OFFICE_STAFF", "HOD", "PRINCIPAL")

                        // Student APIs
                        .requestMatchers("/api/students/**").authenticated()

                        // Admin-only APIs
                        .requestMatchers("/api/users/**").hasAuthority("PRINCIPAL")
                        .requestMatchers("/api/faculty/**").hasAuthority("PRINCIPAL")
                        .requestMatchers("/api/courses/**").hasAuthority("PRINCIPAL")

                        .anyRequest().denyAll()
                );

        return http.build();
    }
}