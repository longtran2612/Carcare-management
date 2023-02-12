package iuh.nhom7.khoa_luan_backend.repository;

import iuh.nhom7.khoa_luan_backend.entity.UserGroup;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * 1:07 PM 17-Sep-22
 * Long Tran
 */

public interface UserGroupRepository extends MongoRepository<UserGroup, String> {

}
