package iuh.nhom7.khoa_luan_backend.service;

import iuh.nhom7.khoa_luan_backend.base.BaseService;
import iuh.nhom7.khoa_luan_backend.common.EnumConst;
import iuh.nhom7.khoa_luan_backend.entity.Account;
import iuh.nhom7.khoa_luan_backend.entity.User;
import iuh.nhom7.khoa_luan_backend.exception.ErrorCode;
import iuh.nhom7.khoa_luan_backend.exception.ServiceException;
import iuh.nhom7.khoa_luan_backend.model.dto.UserCreateDTO;
import iuh.nhom7.khoa_luan_backend.model.dto.UserUpdateDTO;
import iuh.nhom7.khoa_luan_backend.repository.AccountRepository;
import iuh.nhom7.khoa_luan_backend.repository.SequenceValueItemRepository;
import iuh.nhom7.khoa_luan_backend.repository.UserRepository;
import iuh.nhom7.khoa_luan_backend.request.UpdateUserRequest;
import iuh.nhom7.khoa_luan_backend.utils.MappingUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.BasicUpdate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
public class UserService extends BaseService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final SequenceValueItemRepository sequenceValueItemRepository;
    private final MongoTemplate mongoTemplate;
    @Value("${avatar.url}")
    private String avatarUrl;

    public UserService(UserRepository userRepository,
                       AccountRepository accountRepository,
                       PasswordEncoder passwordEncoder,
                       SequenceValueItemRepository sequenceValueItemRepository,
                       MongoTemplate mongoTemplate) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.sequenceValueItemRepository = sequenceValueItemRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public User findUserById(String id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new ServiceException(ErrorCode.USER_NOT_FOUND);
        }
        return user;
    }

    public User findUserByPhone(String phone) {
        User user = userRepository.findByPhone(phone).orElse(null);
        if (user == null) {
            throw new ServiceException(ErrorCode.USER_NOT_FOUND);
        }
        return user;
    }

    public List<User> getAllExecuteAvailableUser() {
        try {
            Criteria criteria = Criteria.where("executing").ne(Boolean.TRUE).and("status").is(EnumConst.Status.ACTIVE);
            Query query = new Query();
            query.addCriteria(criteria);
            return mongoTemplate.find(query, User.class);
        } catch (Exception e) {
            logger.info("==========> error getAllExecuteAvailableUser: " + e);
            return new ArrayList<>();
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public User partialUpdateUser(Account account, UserUpdateDTO user) {
        User userFromData = findUserByPhone(account.getUsername());
        try {
            for (Field field : User.class.getDeclaredFields()) {
                String fieldName = field.getName();
                if (fieldName.equals("id")) {
                    continue;
                }
                Method getter = User.class.getDeclaredMethod("get" + StringUtils.capitalize(fieldName));
                Object fieldValue = getter.invoke(user);

                if (Objects.nonNull(fieldValue)) {
                    partialUpdate(userFromData.getId(), fieldName, fieldValue);
                }
            }
        } catch (Exception e) {
            logger.info("============> error partialUpdateUser: " + e.getMessage());
        }
        return findUserById(userFromData.getId());
    }

    @Transactional(rollbackFor = Exception.class)
    public User updateUser(String userPhone, UpdateUserRequest updateUser) {
        User user = findUserByPhone(userPhone);
        updateUserInfo(user, updateUser);
        user.setUpdateDate(new Date());
        return userRepository.save(user);
    }

    @Transactional(rollbackFor = Exception.class)
    public User updateUserById(String id, UpdateUserRequest updateUser) {
        User user = findUserById(id);
        updateUserInfo(user, updateUser);
        user.setUpdateDate(new Date());
        return userRepository.save(user);
    }

    @Transactional(rollbackFor = Exception.class)
    public String deleteUser(String userPhone) {
        User user = findUserByPhone(userPhone);
        userRepository.delete(user);
        return "Xóa thành công";
    }

    @Transactional(rollbackFor = Exception.class)
    public User createUser(UserCreateDTO userCreateDTO, Account creator) {
        // nếu tài khoản tồn tại
        if (accountRepository.existsByUsername(userCreateDTO.getPhone())) {
            throw new ServiceException(ErrorCode.ACCOUNT_EXISTED);
        }

        // đăng ký
        Account account = new Account();
        account.setUsername(userCreateDTO.getPhone());
        account.setPassword(passwordEncoder.encode("123456"));
        account.setRoles(EnumConst.Role.ROLE_USER.toString());
        account.setLoginBefore(false);
        account.setStatus(EnumConst.Status.ACTIVE.toString());
        accountRepository.save(account);

        Date now = new Date();

        // tạo user sau khi đăng ký
        User user = MappingUtils.mapObject(userCreateDTO, User.class);
        user.setName(userCreateDTO.getFullname());
        user.setUserCode("USER" + sequenceValueItemRepository.getSequence(User.class));
        user.setImage(avatarUrl);
        user.setExecuting(false);
        user.setCreateDate(now);
        user.setCreateBy(creator.getUsername());
        user.setUpdateDate(now);
        user.setStatus(EnumConst.Status.ACTIVE.toString());

//        // tạo user sau khi đăng ký
//        User newUser = User.builder()
//                .userCode("USER" + sequenceValueItemRepository.getSequence(User.class))
//                .name(userCreateDTO.getFullname())
//                .phone(userCreateDTO.getPhone())
//                .email(userCreateDTO.getEmail())
//                .birthDay(userCreateDTO.getBirthDay())
//                .address(userCreateDTO.getAddress())
//                .province(userCreateDTO.getProvince())
//                .provinceCode(userCreateDTO.getProvinceCode())
//                .district(userCreateDTO.getDistrict())
//                .districtCode(userCreateDTO.getDistrictCode())
//                .ward(userCreateDTO.getWard())
//                .wardCode(userCreateDTO.getWardCode())
//                .image(avatarUrl)
//                .executing(false)
//                .createDate(new Date())
//                .createBy(creator.getUsername())
//                .updateDate(new Date())
//                .status(EnumConst.Status.ACTIVE.toString())
//                .build();
        return userRepository.save(user);
    }

    private void partialUpdate(String userId, String fieldName, Object fieldValue) {
        mongoTemplate.findAndModify(BasicQuery.query(Criteria.where("id").is(userId)),
                BasicUpdate.update(fieldName, fieldValue), FindAndModifyOptions.none(), User.class);
    }

    private User updateUserInfo(User user, UpdateUserRequest updateUser) {
        if (StringUtils.isNotEmpty(updateUser.getName())) {
            user.setName(updateUser.getName());
        }
        if (StringUtils.isNotEmpty(updateUser.getImage())) {
            user.setImage(updateUser.getImage());
        }
        if (StringUtils.isNotEmpty(updateUser.getEmail())) {
            user.setEmail(updateUser.getEmail());
        }
        if (updateUser.getBirthDay() != null) {
            user.setBirthDay(updateUser.getBirthDay());
        }
        if (StringUtils.isNotEmpty(updateUser.getGender())) {
            user.setGender(updateUser.getGender());
        }
        if (StringUtils.isNotEmpty(updateUser.getIdentityNumber())) {
            user.setIdentityNumber(updateUser.getIdentityNumber());
        }
        if (updateUser.getIdentityType() != null) {
            user.setIdentityType(updateUser.getIdentityType());
        }
        if (StringUtils.isNotEmpty(updateUser.getStatus())) {
            user.setStatus(updateUser.getStatus());
        }
        if (StringUtils.isNotEmpty(updateUser.getNationality())) {
            user.setNationality(updateUser.getNationality());
        }
        if (StringUtils.isNotEmpty(updateUser.getAddress())) {
            user.setAddress(updateUser.getAddress());
        }
        if (StringUtils.isNotEmpty(updateUser.getProvince())) {
            user.setProvince(updateUser.getProvince());
            if (StringUtils.isNotEmpty(updateUser.getProvinceCode())) {
                user.setProvinceCode(updateUser.getProvinceCode());
            }
            if (StringUtils.isNotEmpty(updateUser.getDistrict())) {
                user.setDistrict(updateUser.getDistrict());
                if (StringUtils.isNotEmpty(updateUser.getDistrictCode())) {
                    user.setDistrictCode(updateUser.getDistrictCode());
                }
                if (StringUtils.isNotEmpty(updateUser.getWard())) {
                    user.setWard(updateUser.getWard());
                    if (StringUtils.isNotEmpty(updateUser.getWardCode())) {
                        user.setWardCode(updateUser.getWardCode());
                    }
                }
            }
        }

        return user;
    }


    public User activeUser(String id) {
        User user = findUserById(id);
        Account account = findByUsername(user.getPhone());
        user.setStatus(EnumConst.Status.ACTIVE.toString());
        userRepository.save(user);
        account.setStatus(EnumConst.Status.ACTIVE.toString());
        accountRepository.save(account);
        return user;
    }

    public User inactiveUser(String id) {
        User user = findUserById(id);
        Account account = findByUsername(user.getPhone());
        if (account.getRoles().contains(EnumConst.Role.ROLE_ADMIN.toString())) {
            throw new ServiceException("Không thể khóa tài khoản admin");
        }
        user.setStatus(EnumConst.Status.INACTIVE.toString());
        userRepository.save(user);
        account.setStatus(EnumConst.Status.INACTIVE.toString());
        accountRepository.save(account);
        return user;
    }


    public Account findByUsername(String username) {
        Account account = accountRepository.findByUsername(username).orElse(null);
        if (account == null) {
            throw new ServiceException(ErrorCode.ACCOUNT_NOT_FOUND);
        }
        return account;
    }
}
