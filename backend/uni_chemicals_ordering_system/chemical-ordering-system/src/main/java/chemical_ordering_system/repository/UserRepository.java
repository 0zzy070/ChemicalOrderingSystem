package chemical_ordering_system.repository;

import chemical_ordering_system.dto.User.UserDTO;
import chemical_ordering_system.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<Users, String> {

    List<Users> findByUsername(String username);

    @Query("SELECT COALESCE(MAX(u.employeeNumber), 'empyNo000') FROM Users u")
    String findMaxEmployeeNumber();

    boolean existsByUsername(String username);

    // 查询所有用户及其关联的权限
    @Query("SELECT u.id, u.username, u.password, u.email, a.authority FROM Users u LEFT JOIN Authority a ON u.id = a.id")
    List<Object[]> findAllUsersWithAuthority();

    // 根据用户ID查询用户及其关联的权限
    @Query("SELECT u.id, u.username, u.password, u.email, a.authority FROM Users u LEFT JOIN Authority a ON u.id = a.id WHERE u.id = :id")
    List<Object[]> findUserByIdWithAuthority(@Param("id") String id);
}
