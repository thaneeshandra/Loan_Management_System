// package com.trumio.lms.repository;

// import com.trumio.lms.entity.Role;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

// import java.util.Optional;

// import static org.assertj.core.api.Assertions.assertThat;

// @DataJpaTest
// public class RoleRepositoryTest {

//     @Autowired
//     private RoleRepository roleRepository;

//     @Test
//     void testSaveAndFindByName() {
//         Role role = new Role();
//         role.setName("ADMIN");
//         roleRepository.save(role);

//         Optional<Role> found = roleRepository.findByName("ADMIN");
//         assertThat(found).isPresent();
//         assertThat(found.get().getName()).isEqualTo("ADMIN");
//     }
// }