package iuh.nhom7.khoa_luan_backend.service;

import iuh.nhom7.khoa_luan_backend.base.BaseService;
import iuh.nhom7.khoa_luan_backend.common.CustomerStatus;
import iuh.nhom7.khoa_luan_backend.entity.Account;
import iuh.nhom7.khoa_luan_backend.entity.Customer;
import iuh.nhom7.khoa_luan_backend.exception.ErrorCode;
import iuh.nhom7.khoa_luan_backend.exception.ServiceException;
import iuh.nhom7.khoa_luan_backend.repository.AccountRepository;
import iuh.nhom7.khoa_luan_backend.repository.CustomerRepository;
import iuh.nhom7.khoa_luan_backend.request.CreateCustomerRequest;
import iuh.nhom7.khoa_luan_backend.request.SignupRequest;
import iuh.nhom7.khoa_luan_backend.utils.MappingUtils;
import iuh.nhom7.khoa_luan_backend.utils.ServiceUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
public class CustomerService extends BaseService {
    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final ServiceUtils serviceUtils;

    @Value("${avatar.url}")
    private String avatarUrl;

    public CustomerService(CustomerRepository customerRepository,
                           AccountRepository accountRepository,
                           ServiceUtils serviceUtils) {
        this.customerRepository = customerRepository;
        this.accountRepository = accountRepository;
        this.serviceUtils = serviceUtils;
    }

    public Customer findCustomerById(String id) {
        Customer customer = customerRepository.findById(id).orElse(null);
        if (customer == null) {
            throw new ServiceException(ErrorCode.CUSTOMER_NOT_FOUND);
        }
        return customer;
    }

    public Customer findCustomerByCode(String code) {
        Customer customer = customerRepository.findByCustomerCode(code).orElse(null);
        if (customer == null) {
            throw new ServiceException(ErrorCode.CUSTOMER_NOT_FOUND);
        }
        return customer;
    }

    public Customer findCustomerByPhone(String phoneNumber) {
        Customer customer = customerRepository.findByPhoneNumber(phoneNumber).orElse(null);
        if (customer == null) {
            throw new ServiceException(ErrorCode.CUSTOMER_NOT_FOUND);
        }
        return customer;
    }

    @Transactional(rollbackFor = Exception.class)
    public Customer create(CreateCustomerRequest request, Account account) {
        serviceUtils.validateRequest(request);
        if(StringUtils.isNotEmpty(request.getIdentityNumber())){
            serviceUtils.checkCustomerExistence(request.getIdentityNumber());
        }
        if (!serviceUtils.isAccountExistence(request.getPhoneNumber())) {
            try {
                serviceUtils.saveCustomerAccount(SignupRequest.builder()
                        .username(request.getPhoneNumber())
                        .build());
            } catch (Exception e) {
                logger.info("============> create customer account error" + e);
            }
        }

        Customer customer = MappingUtils.mapObject(request, Customer.class);
        customer.setCustomerCode("CUSTOMER" + sequenceValueItemRepository.getSequence(Customer.class));
        customer.setStatus(CustomerStatus.NORMAL);
        customer.setStatusName(CustomerStatus.mapCustomerStatus.get(CustomerStatus.NORMAL));
        customer.setCreateDate(new Date());
        customer.setCreateBy(account.getUsername());
        customer.setUpdateDate(new Date());
        if (StringUtils.isEmpty(customer.getImage())) {
            customer.setImage(avatarUrl);
        }
        customerRepository.save(customer);
        return customer;
    }

    @Transactional(rollbackFor = Exception.class)
    public Customer update(String id, CreateCustomerRequest request) {
        Customer customer = findCustomerById(id);
        if (StringUtils.isNotEmpty(request.getName())) {
            customer.setName(request.getName());
        }
        if (request.getDateOfBirth() != null) {
            customer.setDateOfBirth(request.getDateOfBirth());
        }
        if (StringUtils.isNotEmpty(request.getGender())) {
            customer.setGender(request.getGender());
        }
        if (StringUtils.isNotEmpty(request.getNationality())) {
            customer.setNationality(request.getNationality());
        }
        if (StringUtils.isNotEmpty(request.getProvince())) {
            customer.setProvince(request.getProvince());
            if (StringUtils.isNotEmpty(request.getProvinceCode())) {
                customer.setProvinceCode(request.getProvinceCode());
            }
            if (StringUtils.isNotEmpty(request.getDistrict())) {
                customer.setDistrict(request.getDistrict());
                if (StringUtils.isNotEmpty(request.getDistrictCode())) {
                    customer.setDistrictCode(request.getDistrictCode());
                }
                if (StringUtils.isNotEmpty(request.getWard())) {
                    customer.setWard(request.getWard());
                    if (StringUtils.isNotEmpty(request.getWardCode())) {
                        customer.setWardCode(request.getWardCode());
                    }
                }
            }
        }
        if (StringUtils.isNotEmpty(request.getAddress())) {
            customer.setAddress(request.getAddress());
        }
        if (StringUtils.isNotEmpty(request.getIdentityNumber())) {
            if(!customer.getIdentityNumber().equals(request.getIdentityNumber())) {
                serviceUtils.checkCustomerExistence(request.getIdentityNumber());
                customer.setIdentityNumber(request.getIdentityNumber());
            }
        }
        if (request.getIdentityType() != null) {
            customer.setIdentityType(request.getIdentityType());
        }
        if (StringUtils.isNotEmpty(request.getPhoneNumber())) {
            if(!customer.getPhoneNumber().equals(request.getPhoneNumber())){
                serviceUtils.checkAccountExistence(request.getPhoneNumber());
                Account account = accountRepository.findByUsername(customer.getPhoneNumber()).orElse(null);
                if (account != null) {
                    account.setUsername(request.getPhoneNumber());
                    accountRepository.save(account);
                } else {
                    serviceUtils.saveCustomerAccount(SignupRequest.builder()
                            .username(request.getPhoneNumber())
                            .build());
                }
                customer.setPhoneNumber(request.getPhoneNumber());
            }
        }
        if (StringUtils.isNotEmpty(request.getEmail())) {
            customer.setEmail(request.getEmail());
        }
        if (StringUtils.isNotEmpty(request.getImage())) {
            customer.setImage(request.getImage());
        }
        if (request.getStatus() != null) {
            customer.setStatus(request.getStatus());
            customer.setStatusName(CustomerStatus.mapCustomerStatus.get(request.getStatus()));
        }
        customer.setUpdateDate(new Date());
        return customerRepository.save(customer);
    }

}
