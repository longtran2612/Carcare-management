package iuh.nhom7.khoa_luan_backend.repository;

import iuh.nhom7.khoa_luan_backend.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    @Override
    boolean existsById(String s);

    Optional<User> findByPhone(String s);

    Optional<User> findDistinctByEmail(String s);
}
