package com.college.colllege_backend.config;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.security.web.util.matcher.RegexRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.college.colllege_backend.repository.UserRepository;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${app.cors.allowed-origin-patterns:http://localhost:3000,http://localhost:8080}")
    private String allowedOriginPatterns;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return email -> userRepository.findByEmail(email)
                .map(user -> {
                    Collection<GrantedAuthority> authorities = new ArrayList<>();
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
                    parseAccessPages(user.getAccessPages()).forEach(page -> {
                        authorities.add(new SimpleGrantedAuthority("PAGE_" + page));
                        if ("analysis".equals(page)) {
                            authorities.add(new SimpleGrantedAuthority("PAGE_admissions"));
                            authorities.add(new SimpleGrantedAuthority("PAGE_enquiries"));
                        }
                        if ("update-enquiry".equals(page)) {
                            authorities.add(new SimpleGrantedAuthority("PAGE_enquiries"));
                        }
                        if ("email-enquiry".equals(page)) {
                            authorities.add(new SimpleGrantedAuthority("PAGE_enquiries"));
                        }
                        if ("email-admission".equals(page)) {
                            authorities.add(new SimpleGrantedAuthority("PAGE_admissions"));
                        }
                    });
                    return org.springframework.security.core.userdetails.User
                            .withUsername(user.getEmail())
                            .password(user.getPassword())
                            .authorities(authorities)
                            .build();
                })
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        List<String> origins = Arrays.stream(allowedOriginPatterns.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toList();
        configuration.setAllowedOriginPatterns(origins);
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
                .requestMatchers("/api/health").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/lookups/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/courses/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/faculty/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/reference-faculty/**").permitAll()
                // Enquiry creation - PUBLIC (students/parents can submit)
                .requestMatchers(HttpMethod.POST, "/api/enquiries").permitAll()
                // Enquiry search by seat number - PUBLIC (for admission form pre-fill)
                .requestMatchers(HttpMethod.GET, "/api/enquiries/by-seat/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/email-presets").authenticated()
                // Admission form creation - PUBLIC (students can submit admissions)
                .requestMatchers(HttpMethod.POST, "/api/admissions/fy").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/admissions/dsy").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/admissions/fy/*/admission-form.pdf").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/admissions/dsy/*/admission-form.pdf").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/hod/**").hasAnyRole("HOD", "ADMIN")
                // Enquiry list/view - Staff only
                .requestMatchers(HttpMethod.POST, "/api/enquiries/bulk-upload").access(hasRoleOrPage("bulk-enquiry-upload", "ADMIN", "PRINCIPAL"))
                .requestMatchers(HttpMethod.GET, "/api/enquiries/bulk-upload/template").access(hasRoleOrPage("bulk-enquiry-upload", "ADMIN", "PRINCIPAL"))
                .requestMatchers(HttpMethod.GET, "/api/enquiries/**").access(hasRoleOrPage("enquiries", "ADMIN", "ENQUIRY_STAFF", "PRINCIPAL", "OFFICE_STAFF", "ACADEMIC_COORDINATOR"))
                .requestMatchers("/api/enquiries/**").access(hasRoleOrPage("enquiries", "ADMIN", "ENQUIRY_STAFF", "PRINCIPAL", "OFFICE_STAFF"))
                .requestMatchers("/api/email-presets/**").authenticated()
                // Admission Form endpoints - Allow staff only (list, view, update)
                .requestMatchers(HttpMethod.GET, "/api/fy-admissions/**").access(hasRoleOrPage("admissions", "ADMIN", "OFFICE_STAFF", "PRINCIPAL", "ACADEMIC_COORDINATOR"))
                .requestMatchers(HttpMethod.PUT, "/api/fy-admissions/**").access(hasRoleOrPage("admissions", "ADMIN", "OFFICE_STAFF", "PRINCIPAL"))
                .requestMatchers(HttpMethod.DELETE, "/api/fy-admissions/**").access(hasRoleOrPage("admissions", "ADMIN", "OFFICE_STAFF", "PRINCIPAL"))
                .requestMatchers(HttpMethod.GET, "/api/admissions/fy").access(hasRoleOrPage("admissions", "ADMIN", "OFFICE_STAFF", "PRINCIPAL", "ACADEMIC_COORDINATOR"))
                .requestMatchers(HttpMethod.GET, "/api/admissions/fy/bulk-upload/template").access(hasRoleOrPage("bulk-fy-admission-upload", "ADMIN", "PRINCIPAL"))
                .requestMatchers(HttpMethod.GET, "/api/admissions/fy/**").access(hasRoleOrPage("admissions", "ADMIN", "OFFICE_STAFF", "PRINCIPAL", "ACADEMIC_COORDINATOR"))
                .requestMatchers(HttpMethod.POST, "/api/admissions/fy/bulk-upload").access(hasRoleOrPage("bulk-fy-admission-upload", "ADMIN", "PRINCIPAL"))
                .requestMatchers(HttpMethod.PUT, "/api/admissions/fy/**").access(hasRoleOrPage("admissions", "ADMIN", "OFFICE_STAFF", "PRINCIPAL"))
                .requestMatchers(HttpMethod.DELETE, "/api/admissions/fy/**").access(hasRoleOrPage("admissions", "ADMIN", "OFFICE_STAFF", "PRINCIPAL"))
                .requestMatchers(HttpMethod.GET, "/api/dsy-admissions/**").access(hasRoleOrPage("admissions", "ADMIN", "OFFICE_STAFF", "PRINCIPAL", "ACADEMIC_COORDINATOR"))
                .requestMatchers(HttpMethod.PUT, "/api/dsy-admissions/**").access(hasRoleOrPage("admissions", "ADMIN", "OFFICE_STAFF", "PRINCIPAL"))
                .requestMatchers(HttpMethod.DELETE, "/api/dsy-admissions/**").access(hasRoleOrPage("admissions", "ADMIN", "OFFICE_STAFF", "PRINCIPAL"))
                .requestMatchers(HttpMethod.GET, "/api/admissions/dsy").access(hasRoleOrPage("admissions", "ADMIN", "OFFICE_STAFF", "PRINCIPAL", "ACADEMIC_COORDINATOR"))
                .requestMatchers(HttpMethod.GET, "/api/admissions/dsy/bulk-upload/template").access(hasRoleOrPage("bulk-dsy-admission-upload", "ADMIN", "PRINCIPAL"))
                .requestMatchers(HttpMethod.GET, "/api/admissions/dsy/**").access(hasRoleOrPage("admissions", "ADMIN", "OFFICE_STAFF", "PRINCIPAL", "ACADEMIC_COORDINATOR"))
                .requestMatchers(HttpMethod.POST, "/api/admissions/dsy/bulk-upload").access(hasRoleOrPage("bulk-dsy-admission-upload", "ADMIN", "PRINCIPAL"))
                .requestMatchers(HttpMethod.PUT, "/api/admissions/dsy/**").access(hasRoleOrPage("admissions", "ADMIN", "OFFICE_STAFF", "PRINCIPAL"))
                .requestMatchers(HttpMethod.DELETE, "/api/admissions/dsy/**").access(hasRoleOrPage("admissions", "ADMIN", "OFFICE_STAFF", "PRINCIPAL"))
                // Student data - Allow authenticated users
                .requestMatchers("/api/students/**").authenticated()
                // Management endpoints
                .requestMatchers("/api/users/**").access(hasRoleOrPage("staff", "ADMIN", "PRINCIPAL"))
                .requestMatchers("/api/faculty/**").access(hasRoleOrPage("staff", "ADMIN", "PRINCIPAL", "HOD", "OFFICE_STAFF"))
                .requestMatchers("/api/reference-faculty/**").access(hasRoleOrPage("enquiries", "ADMIN", "PRINCIPAL", "HOD", "OFFICE_STAFF", "ENQUIRY_STAFF"))
                .requestMatchers(HttpMethod.GET, "/api/courses/**").access(hasRoleOrPage("courses", "ADMIN", "PRINCIPAL", "HOD", "OFFICE_STAFF", "ACADEMIC_COORDINATOR"))
                .requestMatchers("/api/courses/**").access(hasRoleOrPage("staff", "ADMIN", "PRINCIPAL"))
                .requestMatchers("/api/lookups/**").access(hasRoleOrPage("staff", "ADMIN", "PRINCIPAL", "OFFICE_STAFF"))
                // Public frontend assets and client-side routes served from the same Spring Boot app
                .requestMatchers(RegexRequestMatcher.regexMatcher(HttpMethod.GET, "^(?!/api(?:/|$)|/actuator(?:/|$)).*$")).permitAll()
                // All other requests denied
                .anyRequest().denyAll()
                );

        return http.build();
    }

    private AuthorizationManager<RequestAuthorizationContext> hasRoleOrPage(String page, String... roles) {
        Set<String> roleAuthorities = Arrays.stream(roles)
                .map(role -> "ROLE_" + role)
                .collect(Collectors.toSet());
        String pageAuthority = "PAGE_" + page;
        return (Supplier<org.springframework.security.core.Authentication> authentication, RequestAuthorizationContext context) -> {
            org.springframework.security.core.Authentication auth = authentication.get();
            boolean granted = auth != null && auth.isAuthenticated() && auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .anyMatch(authority -> roleAuthorities.contains(authority) || pageAuthority.equals(authority));
            return new AuthorizationDecision(granted);
        };
    }

    private Set<String> parseAccessPages(String accessPages) {
        if (accessPages == null || accessPages.isBlank()) {
            return Set.of();
        }
        return Arrays.stream(accessPages.split(","))
                .map(String::trim)
                .filter(page -> !page.isBlank())
                .collect(Collectors.toSet());
    }
}
