package com.sritanavi.placement.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sritanavi.placement.dto.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    // ─────────────────────────────────────────────────────────────
    // Core beans
    // ─────────────────────────────────────────────────────────────

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Wires Spring Security's authentication system to our database-backed UserDetailsService
     * and BCrypt password encoder. Spring Security uses this automatically when we call
     * authenticationManager.authenticate() inside the login controller.
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * Exposes AuthenticationManager as a Spring bean so AuthController can inject it
     * and programmatically authenticate a user when they POST to /api/auth/login.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Used by AuthController to save the authenticated SecurityContext into the HTTP session
     * so the browser's JSESSIONID cookie carries the authentication on future requests.
     */
    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    // ─────────────────────────────────────────────────────────────
    // CORS — allow same-origin requests and the public tunnel domain.
    // allowCredentials(true) is required for session cookies.
    // We cannot use "*" with allowCredentials — must list specific patterns.
    // ─────────────────────────────────────────────────────────────
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allows: http://localhost:8080, Railway HTTPS domain, and the localtunnel domain
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "https://*.up.railway.app",
                "https://*.loca.lt",
                "https://*.onrender.com"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);  // required so session cookie is sent
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // ─────────────────────────────────────────────────────────────
    // Security filter chain — the main authorization rules
    // ─────────────────────────────────────────────────────────────
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF is disabled because:
            // 1. Our session cookie is SameSite=Strict (set in application.properties)
            //    which stops cross-site requests from carrying the cookie.
            // 2. Our API only accepts Content-Type: application/json — browsers cannot
            //    set this header in a cross-origin form post without a preflight, which
            //    our CORS policy blocks.
            .csrf(AbstractHttpConfigurer::disable)

            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Prevent browser from caching authenticated responses; allow iframes from same origin
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.sameOrigin())
                .cacheControl(cache -> {})
            )

            // Session-based authentication: Spring creates a session on login and
            // validates the JSESSIONID cookie on every subsequent request.
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .maximumSessions(5) // allow up to 5 concurrent sessions per user
            )

            .authenticationProvider(authenticationProvider())

            .authorizeHttpRequests(auth -> auth

                // ── Public static assets and pages ──────────────────────────────────
                .requestMatchers(
                    "/",
                    "/index.html",
                    "/login.html",
                    "/register.html",
                    "/student-dashboard.html",
                    "/admin-dashboard.html",
                    "/recruiter-dashboard.html",
                    "/css/**",
                    "/js/**",
                    "/images/**",
                    "/favicon.ico",
                    "/error"
                ).permitAll()

                // ── Authentication endpoints (login, register) — must be public ───
                .requestMatchers("/api/auth/**").permitAll()

                // ── H2 console — blocked in production; application-h2.properties ─
                // enables the console itself but we block it at the security layer
                // unless the h2 profile is active (handled by not listing it here)
                .requestMatchers("/h2-console/**").denyAll()

                // ── ADMIN-ONLY: reading all applications, updating statuses ────────
                // Any authenticated non-admin trying these gets 403 Forbidden
                .requestMatchers(HttpMethod.GET,  "/api/applications").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,  "/api/applications/*/status").hasRole("ADMIN")

                // ── ADMIN-ONLY: full admin stats dashboard ──────────────────────────
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // ── ADMIN or RECRUITER: create/update/delete jobs and internships ──
                .requestMatchers(HttpMethod.POST,   "/api/jobs").hasAnyRole("ADMIN", "RECRUITER")
                .requestMatchers(HttpMethod.PUT,    "/api/jobs/**").hasAnyRole("ADMIN", "RECRUITER")
                .requestMatchers(HttpMethod.DELETE, "/api/jobs/**").hasAnyRole("ADMIN", "RECRUITER")
                .requestMatchers(HttpMethod.POST,   "/api/internships").hasAnyRole("ADMIN", "RECRUITER")
                .requestMatchers(HttpMethod.PUT,    "/api/internships/**").hasAnyRole("ADMIN", "RECRUITER")
                .requestMatchers(HttpMethod.DELETE, "/api/internships/**").hasAnyRole("ADMIN", "RECRUITER")

                // ── All remaining API calls require an authenticated session ────────
                // Students browsing jobs/internships, applying, checking notifications, etc.
                .requestMatchers("/api/**").authenticated()

                // ── Everything else (future static pages, etc.) ──────────────────
                .anyRequest().permitAll()
            )

            // Return 401 JSON (not a redirect to /login) when an unauthenticated user
            // tries to call a protected API endpoint. Without this, Spring would send an
            // HTML redirect which the frontend's fetch() cannot handle.
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.setCharacterEncoding("UTF-8");
                    ApiResponse<Object> body = ApiResponse.error("Authentication required. Please log in.");
                    new ObjectMapper().writeValue(response.getOutputStream(), body);
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.setCharacterEncoding("UTF-8");
                    ApiResponse<Object> body = ApiResponse.error("Access denied: you do not have permission to perform this action.");
                    new ObjectMapper().writeValue(response.getOutputStream(), body);
                })
            );

        return http.build();
    }
}
