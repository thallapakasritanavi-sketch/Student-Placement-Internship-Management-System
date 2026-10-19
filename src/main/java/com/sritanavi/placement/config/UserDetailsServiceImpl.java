package com.sritanavi.placement.config;

import com.sritanavi.placement.entity.User;
import com.sritanavi.placement.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Bridges Spring Security's authentication system with our User entity stored in the database.
 *
 * Spring Security calls loadUserByUsername(email) whenever a session needs to be validated.
 * It compares the BCrypt hash from the database with the submitted password automatically.
 * We never see the plain-text password here — Spring Security handles the comparison.
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("No account found for: " + email));

        // Map our Role enum (ADMIN, STUDENT, RECRUITER) to Spring Security's GrantedAuthority.
        // Spring Security expects "ROLE_" prefix — hasRole("ADMIN") checks for "ROLE_ADMIN".
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
