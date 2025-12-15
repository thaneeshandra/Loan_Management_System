package com.trumio.lms.service.impl;
 
import com.trumio.lms.dto.LoginRequestDTO;
import com.trumio.lms.dto.LoginResponseDTO;
import com.trumio.lms.dto.UserRegistrationDTO;
import com.trumio.lms.entity.Role;
import com.trumio.lms.entity.User;
import com.trumio.lms.exception.InvalidCredentialsException;
import com.trumio.lms.exception.RoleNotFoundException;
import com.trumio.lms.exception.UserAlreadyExistsException;
import com.trumio.lms.repository.RoleRepository;
import com.trumio.lms.repository.UserRepository;
import com.trumio.lms.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
 
import java.util.Optional;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
 
public class AuthServiceImplTest {
 
    @Mock
    private UserRepository userRepository;
 
    @Mock
    private RoleRepository roleRepository;
 
    @Mock
    private PasswordEncoder passwordEncoder;
 
    @Mock
    private AuthenticationManager authenticationManager;
 
    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private AuditLogServiceImpl auditLogServiceImpl;

    @Mock
    private NotificationServiceImpl notificationServiceImpl;
 
    @InjectMocks
    private AuthServiceImpl authService;
 
    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }
 
    @Test
    public void testRegister_Success() {
        UserRegistrationDTO registrationDTO = new UserRegistrationDTO();
        registrationDTO.setName("Test User");
        registrationDTO.setEmail("test@example.com");
        registrationDTO.setPassword("password123");
 
        Role role = new Role();
        role.setName("USER"); // Use setName, not setRoleName
 
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(roleRepository.findByName("USER")).thenReturn(Optional.of(role));
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
 
        authService.register(registrationDTO);
 
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertEquals("Test User", savedUser.getName());
        assertEquals("test@example.com", savedUser.getEmail());
        assertEquals("encodedPassword", savedUser.getPassword());
        assertNotNull(savedUser.getRole());
        assertEquals("USER", savedUser.getRole().getName()); // Use getName
    }

    @Test
    void register_userAlreadyExists_throwsException() {
        User existingUser = new User();
        existingUser.setEmail("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(existingUser));

        UserRegistrationDTO dto = new UserRegistrationDTO();
        dto.setEmail("test@example.com");

        assertThrows(UserAlreadyExistsException.class, () -> authService.register(dto));
    }

    @Test
    void register_invalidRole_throwsException() {
        UserRegistrationDTO dto = new UserRegistrationDTO();
        dto.setEmail("new@example.com");
        dto.setRole("INVALID_ROLE");

        when(userRepository.findByEmail(dto.getEmail())).thenReturn(Optional.empty());
        when(roleRepository.findByName("INVALID_ROLE")).thenReturn(Optional.empty());

        assertThrows(RoleNotFoundException.class, () -> authService.register(dto));
    }



    @Test
    public void testLogin_Success() {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO();
        loginRequestDTO.setEmail("test@example.com");
        loginRequestDTO.setPassword("password123");
 
        Role role = new Role();
        role.setName("USER");
 
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setName("Test User");
        user.setPassword("encodedPassword");
        user.setRole(role);
 
        Authentication authentication = mock(Authentication.class);
 
        // Mock authentication manager and passwordEncoder.matches if your service uses it
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(jwtTokenProvider.generateToken("test@example.com", "USER")).thenReturn("fake-jwt-token");
 
        LoginResponseDTO response = authService.login(loginRequestDTO);
 
        assertNotNull(response);
        assertEquals("fake-jwt-token", response.getToken());
        assertEquals(1L, response.getUserId());
        assertEquals("Test User", response.getName());
        assertEquals("test@example.com", response.getEmail());
        assertEquals("USER", response.getRole());
    }

    @Test
    void login_validCredentials_returnsToken() {
        LoginRequestDTO dto = new LoginRequestDTO();
        dto.setEmail("test@example.com");
        dto.setPassword("secret");

        Role role = new Role();
        role.setName("USER");

        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setPassword("encodedPass");
        user.setRole(role);

        when(userRepository.findByEmail(dto.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(dto.getPassword(), user.getPassword())).thenReturn(true);
        when(jwtTokenProvider.generateToken(user.getEmail(), user.getRole().getName())).thenReturn("jwt-token");

        when(userRepository.findByEmail(dto.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret", "encodedPass")).thenReturn(true);
        when(jwtTokenProvider.generateToken(user.getEmail(), "USER")).thenReturn("jwt-token");

        LoginResponseDTO response = authService.login(dto);

        assertEquals("jwt-token", response.getToken());
        assertEquals(1L, response.getUserId());
        verify(auditLogServiceImpl).logAction("LOGIN_SUCCESS", "Auth", 1L, "test@example.com");
    }

 
    @Test
    public void testRegister_ThrowsException_WhenEmailExists() {
        UserRegistrationDTO registrationDTO = new UserRegistrationDTO();
        registrationDTO.setName("Test User");
        registrationDTO.setEmail("test@example.com");
        registrationDTO.setPassword("password123");
 
        User existingUser = new User();
        existingUser.setEmail("test@example.com");
 
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(existingUser));
 
        assertThrows(RuntimeException.class, () -> authService.register(registrationDTO));
        verify(userRepository, never()).save(any(User.class));
    }
 
    @Test
    public void testLogin_ThrowsException_WhenUserNotFound() {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO();
        loginRequestDTO.setEmail("notfound@example.com");
        loginRequestDTO.setPassword("password123");
 
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());
 
        assertThrows(RuntimeException.class, () -> authService.login(loginRequestDTO));
    }

    @Test
    void login_passwordMismatch_throwsExceptionAndLogs() {
        LoginRequestDTO dto = new LoginRequestDTO();
        dto.setEmail("test@example.com");
        dto.setPassword("wrongpass");

        Role role = new Role();
        role.setName("USER");

        User user = new User();
        user.setId(1L);    
        user.setEmail("test@example.com");
        user.setPassword("encodedPass");
        user.setRole(role);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpass", "encodedPass")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> authService.login(dto));
        verify(auditLogServiceImpl).logAction("LOGIN_FAILED", "Auth", 1L, "test@example.com");
    }
    

}