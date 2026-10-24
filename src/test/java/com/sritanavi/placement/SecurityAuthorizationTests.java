package com.sritanavi.placement;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sritanavi.placement.dto.ApplicationStatusRequest;
import com.sritanavi.placement.dto.AuthDto;
import com.sritanavi.placement.entity.ApplicationStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
@Transactional
public class SecurityAuthorizationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${app.admin.email:sri}")
    private String adminEmail;

    @Value("${app.admin.password:admin123}")
    private String adminPassword;

    @Test
    void testUnauthenticatedUserCannotAccessProtectedEndpoints() throws Exception {
        // Without session or login, admin endpoints and all-applications must return 401 Unauthorized
        mockMvc.perform(get("/api/admin/stats"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));

        mockMvc.perform(get("/api/applications"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @WithMockUser(username = "student@placement.com", roles = {"STUDENT"})
    void testStudentCannotAccessAdminEndpointsOrUpdateStatus() throws Exception {
        // A user with role STUDENT must get 403 Forbidden when calling admin endpoints
        mockMvc.perform(get("/api/admin/stats"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false));

        mockMvc.perform(get("/api/applications"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false));

        ApplicationStatusRequest statusReq = new ApplicationStatusRequest(ApplicationStatus.SELECTED, "Hacked status");
        mockMvc.perform(put("/api/applications/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusReq)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @WithMockUser(username = "admin@placement.com", roles = {"ADMIN"})
    void testAdminCanAccessAdminEndpoints() throws Exception {
        mockMvc.perform(get("/api/admin/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/api/applications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testSessionLoginAndAccessFlow() throws Exception {
        // 1. Post login with valid credentials (from DataInitializer demo admin)
        AuthDto.LoginRequest loginReq = new AuthDto.LoginRequest(adminEmail, adminPassword);
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);
        org.junit.jupiter.api.Assertions.assertNotNull(session, "HTTP session must be established upon login");

        // 2. Perform protected request using the established session
        mockMvc.perform(get("/api/admin/stats").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // 3. Logout invalidates session
        mockMvc.perform(post("/api/auth/logout").session(session))
                .andExpect(status().isOk());

        // 4. Invalidate verified
        org.junit.jupiter.api.Assertions.assertTrue(session.isInvalid());
    }

    @Test
    void testH2ConsoleIsBlockedInSecurity() throws Exception {
        // Unauthenticated access to /h2-console is rejected by security entry point
        mockMvc.perform(get("/h2-console/"))
                .andExpect(status().isUnauthorized());
    }
}
