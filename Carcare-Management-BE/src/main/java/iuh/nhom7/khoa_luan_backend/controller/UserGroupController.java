package iuh.nhom7.khoa_luan_backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.nhom7.khoa_luan_backend.entity.UserGroup;
import iuh.nhom7.khoa_luan_backend.repository.UserGroupRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 1:09 PM 17-Sep-22
 * Long Tran
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/user-groups")
@Tag(name = "User group", description = "User group API")
public class UserGroupController {

    private final UserGroupRepository userGroupRepository;

    public UserGroupController(UserGroupRepository userGroupRepository) {
        this.userGroupRepository = userGroupRepository;
    }

    @PostMapping
    public UserGroup createUserGroup(UserGroup userGroup) {
        return userGroupRepository.save(userGroup);
    }

    @GetMapping
    public ResponseEntity<?> getAllUserGroup() {
        return ResponseEntity.ok().body(userGroupRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserGroupById(@PathVariable String id) {
        return ResponseEntity.ok().body(userGroupRepository.findById(id));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        userGroupRepository.deleteById(id);
    }

    @PutMapping
    public ResponseEntity<?> updateUserGroup(UserGroup userGroup) {
        return ResponseEntity.ok().body(userGroupRepository.save(userGroup));
    }


}
