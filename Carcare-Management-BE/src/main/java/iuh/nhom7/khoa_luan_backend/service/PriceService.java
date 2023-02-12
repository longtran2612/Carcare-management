package iuh.nhom7.khoa_luan_backend.service;

import iuh.nhom7.khoa_luan_backend.common.CarCareServiceStatus;
import iuh.nhom7.khoa_luan_backend.common.EnumConst;
import iuh.nhom7.khoa_luan_backend.common.PriceStatus;
import iuh.nhom7.khoa_luan_backend.entity.CarCareService;
import iuh.nhom7.khoa_luan_backend.entity.Price;
import iuh.nhom7.khoa_luan_backend.entity.PriceHeader;
import iuh.nhom7.khoa_luan_backend.exception.ErrorCode;
import iuh.nhom7.khoa_luan_backend.exception.ServiceException;
import iuh.nhom7.khoa_luan_backend.model.PriceModel;
import iuh.nhom7.khoa_luan_backend.model.dto.PriceCreateDTO;
import iuh.nhom7.khoa_luan_backend.repository.CarCareServiceRepository;
import iuh.nhom7.khoa_luan_backend.repository.PriceHeaderRepository;
import iuh.nhom7.khoa_luan_backend.repository.PriceRepository;
import iuh.nhom7.khoa_luan_backend.base.BaseService;
import iuh.nhom7.khoa_luan_backend.request.price.UpdatePriceRequest;
import iuh.nhom7.khoa_luan_backend.utils.FinderUtils;
import iuh.nhom7.khoa_luan_backend.utils.MappingUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * 8:51 PM 15-Sep-22
 * Long Tran
 */
@Service
public class PriceService extends BaseService {
    private final PriceRepository priceRepository;
    private final PriceHeaderRepository priceHeaderRepository;
    private final PriceHeaderService priceHeaderService;
    private final CarCareServiceRepository carCareServiceRepository;
    private final FinderUtils finderUtils;

    public PriceService(PriceRepository priceRepository,
                        PriceHeaderRepository priceHeaderRepository,
                        PriceHeaderService priceHeaderService,
                        CarCareServiceRepository carCareServiceRepository,
                        FinderUtils finderUtils) {
        this.priceRepository = priceRepository;
        this.priceHeaderRepository = priceHeaderRepository;
        this.priceHeaderService = priceHeaderService;
        this.carCareServiceRepository = carCareServiceRepository;
        this.finderUtils = finderUtils;
    }

    public Price findPriceById(String priceId) {
        Price price = priceRepository.findById(priceId).orElse(null);
        if (price == null) {
            throw new ServiceException(ErrorCode.SERVICE_PRICE_NOT_FOUND);
        }
        return price;
    }

    public Price findPriceByCode(String priceCode) {
        Price price = priceRepository.findByPriceCode(priceCode).orElse(null);
        if (price == null) {
            throw new ServiceException(ErrorCode.SERVICE_PRICE_NOT_FOUND);
        }
        return price;
    }

    @Transactional(rollbackFor = Exception.class)
    public Price create(PriceCreateDTO priceCreateDTO) {
        Date now = new Date();
        CarCareService service = finderUtils.findCarCareServiceById(priceCreateDTO.getServiceId());
        PriceHeader priceHeader = finderUtils.findPriceHeaderById(priceCreateDTO.getPriceHeaderId());

        List<PriceHeader> priceHeaderList = priceHeaderRepository.findAllByStatus(EnumConst.Status.ACTIVE.name());
        for (PriceHeader activePriceHeader : priceHeaderList) {
            activePriceHeader.getServiceIds().forEach(serviceId -> {
                if (priceCreateDTO.getServiceId().contains(serviceId)) {
                    if(activePriceHeader.getToDate().after(priceHeader.getFromDate())) {
                        if(priceHeader.getStatus().equals("ACTIVE")) {
                            throw new ServiceException(ErrorCode.PRICE_HEADER_CONTAINS_DUPLICATE_SERVICE_PRICE_ACTIVE, service.getServiceCode(), activePriceHeader.getPriceHeaderCode());
                        }

                    }
                }
            });

        }

        Price price = MappingUtils.mapObject(priceCreateDTO, Price.class);
        price.setPriceCode("PRICE" + sequenceValueItemRepository.getSequence(Price.class));
        price.setPriceHeaderId(priceHeader.getId());
        price.setPriceHeaderCode(priceHeader.getPriceHeaderCode());
        price.setServiceId(service.getId());
        price.setServiceCode(service.getServiceCode());
        price.setCreateDate(now);
        price.setUpdateDate(now);
        saveServiceIdToPriceHeader(priceHeader, service.getId());




        if (EnumConst.Status.ACTIVE.toString().equals(priceHeader.getStatus())) {
            price.setStatus(PriceStatus.ACTIVE);
            price.setStatusName(PriceStatus.mapPriceStatus.get(PriceStatus.ACTIVE));

            // update car care service price
            PriceModel priceModel = new PriceModel();
            priceModel.setPrice(price.getPrice());
            priceModel.setEffectiveDate(priceHeader.getFromDate());
            priceModel.setExpirationDate(priceHeader.getToDate());
            service.setServicePrice(priceModel);
//            service.getServicePrice().setPriceCode(price.getPriceCode());
//            service.getServicePrice().setEffectiveDate(priceHeader.getFromDate());
//            service.getServicePrice().setExpirationDate(priceHeader.getToDate());

            service.setStatus(CarCareServiceStatus.ACTIVE);
            service.setStatusName(CarCareServiceStatus.mapCarCareServiceStatus.get(CarCareServiceStatus.ACTIVE));
            service.setUpdateDate(now);
            carCareServiceRepository.save(service);
        } else {
            price.setStatus(PriceStatus.INACTIVE);
            price.setStatusName(PriceStatus.mapPriceStatus.get(PriceStatus.INACTIVE));
        }
        return priceRepository.save(price);
    }

    @Transactional(rollbackFor = Exception.class)
    public void createPrice(CarCareService service) {
        if (service.getServicePrice() == null) {
            throw new ServiceException(ErrorCode.SERVICE_PRICE_NULL);
        }
        PriceHeader priceHeader = priceHeaderService.getActivePriceHeader();
        Price price = Price.builder()
                .priceCode("PRICE" + sequenceValueItemRepository.getSequence(Price.class))
                .name(service.getName())
                .type(service.getType())
                .price(service.getServicePrice().getPrice())
                .currency(service.getServicePrice().getCurrency())
                .serviceId(service.getId())
                .serviceCode(service.getServiceCode())
                .priceHeaderId(priceHeader.getId())
                .priceHeaderCode(priceHeader.getPriceHeaderCode())
                .status(PriceStatus.ACTIVE)
                .statusName(PriceStatus.mapPriceStatus.get(PriceStatus.ACTIVE))
                .createDate(new Date())
                .updateDate(new Date())
                .build();
        priceRepository.save(price);

        service.getServicePrice().setPriceCode(price.getPriceCode());
        service.getServicePrice().setEffectiveDate(priceHeader.getFromDate());
        service.getServicePrice().setExpirationDate(priceHeader.getToDate());
        carCareServiceRepository.save(service);

        saveServiceIdToPriceHeader(priceHeader, service.getId());
    }

    @Transactional(rollbackFor = Exception.class)
    public Price updateServicePrice(PriceModel priceModel) {
        Price price = priceRepository.findByPriceCode(priceModel.getPriceCode()).orElse(null);
        if (price == null) {
            throw new ServiceException(ErrorCode.SERVICE_PRICE_NOT_FOUND);
        }
        price.setPrice(priceModel.getPrice());
        price.setCurrency(priceModel.getCurrency());
        price.setUpdateDate(new Date());
        return priceRepository.save(price);
    }

    @Transactional(rollbackFor = Exception.class)
    public Price updatePriceById(String id, UpdatePriceRequest request) {
        Price price = findPriceById(id);
//        PriceHeader priceHeader = finderUtils.findPriceHeaderById(price.getPriceHeaderId());
        if (StringUtils.isNotEmpty(request.getName())) {
            price.setName(request.getName());
        }
        if (StringUtils.isNotEmpty(request.getType())) {
            price.setType(request.getType());
        }
        if (ObjectUtils.isNotEmpty(request.getPrice()) && request.getPrice().compareTo(BigDecimal.ZERO) > 0) {
            price.setPrice(request.getPrice());
        }
        if (StringUtils.isNotEmpty(request.getCurrency())) {
            price.setCurrency(request.getCurrency());
        }
//        List<PriceHeader> priceHeaderList = priceHeaderRepository.findAllByStatus(EnumConst.Status.ACTIVE.name());
//        if (request.getStatus() == PriceStatus.ACTIVE) {
//            if (EnumConst.Status.ACTIVE.toString().equals(priceHeader.getStatus())) {
//                for (PriceHeader activePriceHeader : priceHeaderList) {
//                    if (activePriceHeader.getId().equals(priceHeader.getId())) {
//                        continue;
//                    }
//                    Price duplicatePrice = priceRepository.findByServiceIdAndPriceHeaderId(price.getServiceId(), activePriceHeader.getId()).orElse(null);
//                    if (duplicatePrice != null || duplicatePrice.getStatus() == PriceStatus.ACTIVE) {
//                        throw new ServiceException(ErrorCode.PRICE_HEADER_CONTAINS_DUPLICATE_SERVICE_PRICE_ACTIVE, duplicatePrice.getServiceCode(), activePriceHeader.getPriceHeaderCode());
//                    }
//                }
//                price.setStatus(PriceStatus.ACTIVE);
//                price.setStatusName(PriceStatus.mapPriceStatus.get(PriceStatus.ACTIVE));
//            }
//        } else {
//            price.setStatus(PriceStatus.INACTIVE);
//            price.setStatusName(PriceStatus.mapPriceStatus.get(PriceStatus.INACTIVE));
//        }

//        if (EnumConst.Status.ACTIVE.toString().equals(priceHeader.getStatus())) {
//            if (price.getStatus() == PriceStatus.ACTIVE) {
//                CarCareService carCareService = finderUtils.findCarCareServiceById(price.getServiceId());
//                PriceModel servicePrice = carCareService.getServicePrice();
//                servicePrice.setPriceCode(price.getPriceCode());
//                servicePrice.setPrice(price.getPrice());
//                servicePrice.setCurrency(price.getCurrency());
//                servicePrice.setEffectiveDate(priceHeader.getFromDate());
//                servicePrice.setExpirationDate(priceHeader.getToDate());
//                carCareService.setServicePrice(servicePrice);
//                carCareService.setStatus(CarCareServiceStatus.ACTIVE);
//                carCareService.setStatusName(CarCareServiceStatus.mapCarCareServiceStatus.get(CarCareServiceStatus.ACTIVE));
//                carCareServiceRepository.save(carCareService);
//            } else {
//                logger.info("======> priceHeader active, price not active");
//                boolean existedActivePrice = false;
//                for (PriceHeader activePriceHeader : priceHeaderList) {
//                    if (activePriceHeader.getServiceIds().contains(price.getServiceId())) {
//                        Price duplicatePrice = priceRepository.findByServiceIdAndPriceHeaderId(price.getServiceId(), activePriceHeader.getId()).orElse(null);
//                        if (duplicatePrice.getId().equals(price.getId())) {
//                            continue;
//                        }
//                        if (duplicatePrice != null || duplicatePrice.getStatus() == PriceStatus.ACTIVE) {
//                            logger.info("======> priceHeader active, price not active, duplicate active");
//                            existedActivePrice = true;
//                        }
//                    }
//                }
//                if (!existedActivePrice) {
//                    logger.info("======> set service inactive");
//                    CarCareService carCareService = finderUtils.findCarCareServiceById(price.getServiceId());
//                    carCareService.setStatus(CarCareServiceStatus.INACTIVE);
//                    carCareService.setStatusName(CarCareServiceStatus.mapCarCareServiceStatus.get(CarCareServiceStatus.INACTIVE));
//                    carCareServiceRepository.save(carCareService);
//                }
//            }
//        }
        return priceRepository.save(price);
    }

    private void saveServiceIdToPriceHeader(PriceHeader priceHeader, String serviceId) {
//        List<PriceHeader> priceHeaderList = priceHeaderRepository.findAllByStatus(EnumConst.Status.ACTIVE.name());
//        for (PriceHeader activePriceHeader : priceHeaderList) {
//            activePriceHeader.getServiceIds().forEach(id -> {
//                if (serviceId.contains(id)) {
//                    throw new ServiceException(ErrorCode.PRICE_CONTAINS_DUPLICATE_SERVICE_PRICE_ACTIVE, activePriceHeader.getPriceHeaderCode());
//                }
//            });
//        }
        if (CollectionUtils.isEmpty(priceHeader.getServiceIds())) {
            Set<String> serviceIds = new HashSet<>();
            serviceIds.add(serviceId);
            priceHeader.setServiceIds(serviceIds);
            priceHeaderRepository.save(priceHeader);
        } else {
            Set<String> serviceIds = priceHeader.getServiceIds();
            if (serviceIds.contains(serviceId)) {
                throw new ServiceException(ErrorCode.PRICE_HEADER_CONTAINS_SERVICE_PRICE);
            }
            serviceIds.add(serviceId);
            priceHeader.setServiceIds(serviceIds);
            priceHeaderRepository.save(priceHeader);
        }
    }
}
