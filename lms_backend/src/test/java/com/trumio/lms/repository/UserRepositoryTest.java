// package com.trumio.lms.repository;

// import com.trumio.lms.entity.Role;
// import com.trumio.lms.entity.User;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

// import java.util.Optional;

// import static org.assertj.core.api.Assertions.assertThat;

// @DataJpaTest
// public class UserRepositoryTest {

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private RoleRepository roleRepository;

//     @Test
//     void testSaveAndFindByEmail() {
//         // Create and save a role
//         Role userRole = new Role();
//         userRole.setName("USER");
//         roleRepository.save(userRole);

//         // Create and save a user
//         User user = new User();
//         user.setName("Demo User");
//         user.setEmail("demo@example.com");
//         user.setPassword("pass");
//         user.setMobileNumber("1234567890");
//         user.setAddress("Test Address");
//         user.setRole(userRole);
//         userRepository.save(user);

//         // Find by email
//         Optional<User> found = userRepository.findByEmail("demo@example.com");
//         assertThat(found).isPresent();
//         assertThat(found.get().getName()).isEqualTo("Demo User");
//     }
// }
