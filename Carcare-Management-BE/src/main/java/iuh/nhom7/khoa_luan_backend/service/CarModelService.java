package iuh.nhom7.khoa_luan_backend.service;

import iuh.nhom7.khoa_luan_backend.common.Extensions;
import iuh.nhom7.khoa_luan_backend.entity.CarModel;
import iuh.nhom7.khoa_luan_backend.exception.ErrorCode;
import iuh.nhom7.khoa_luan_backend.exception.ServiceException;
import iuh.nhom7.khoa_luan_backend.model.dto.CarModelCreateDTO;
import iuh.nhom7.khoa_luan_backend.repository.CarModelRepository;
import iuh.nhom7.khoa_luan_backend.base.BaseService;
import lombok.experimental.ExtensionMethod;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.util.Strings;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 8:22 PM 20-Sep-22
 * Long Tran
 */
@Service
@ExtensionMethod(Extensions.class)
public class CarModelService extends BaseService {

    private final CarModelRepository carModelRepository;

    public CarModelService(CarModelRepository carModelRepository) {
        this.carModelRepository = carModelRepository;
    }

    @Value("${car.url}")
    private String carUrl;

    public CarModel findCarModelById(String id) {
        CarModel carModel = carModelRepository.findById(id).orElse(null);
        if (carModel == null) {
            throw new ServiceException(ErrorCode.CAR_MODEL_NOT_FOUND);
        }
        return carModel;
    }

    public CarModel findCarModelByCode(String code) {
        CarModel carModel = carModelRepository.findByCarModelCode(code).orElse(null);
        if (carModel == null) {
            throw new ServiceException(ErrorCode.CAR_MODEL_NOT_FOUND);
        }
        return carModel;
    }

    @Transactional(rollbackFor = Exception.class)
    public CarModel create(CarModelCreateDTO carModelCreateDTO) {
        String carModelCode = "CAR_MODEL" + sequenceValueItemRepository.getSequence(CarModel.class);
        if (StringUtils.isNotEmpty(carModelCreateDTO.getCarModelNumber())) {
            if (carModelRepository.findByCarModelCode(carModelCreateDTO.getCarModelNumber()).orElse(null) == null) {
                carModelCode = carModelCreateDTO.getCarModelNumber();
            }
        }
        CarModel carModel = CarModel.builder()
                .carModelCode(carModelCode)
                .brand(carModelCreateDTO.getBrand())
                .model(carModelCreateDTO.getModel())
                .engine(carModelCreateDTO.getEngine())
                .transmission(carModelCreateDTO.getTransmission())
                .seats(carModelCreateDTO.getSeats())
                .fuel(carModelCreateDTO.getFuel())
                .year(carModelCreateDTO.getYear())
                .createDate(new Date())
                .updateDate(new Date())
                .build();

        return carModelRepository.save(carModel);
    }

    @Transactional(rollbackFor = Exception.class)
    public CarModel updateCarModel(String id, CarModelCreateDTO carModelCreateDTO) {
        CarModel carModel = carModelRepository.findById(id).orElse(null);
        if (carModel == null) {
            throw new ServiceException(ErrorCode.CAR_MODEL_NOT_FOUND);
        }
        if (StringUtils.isNotEmpty(carModelCreateDTO.getBrand())) {
            carModel.setBrand(carModelCreateDTO.getBrand());
        }
        if (StringUtils.isNotEmpty(carModelCreateDTO.getModel())) {
            carModel.setModel(carModelCreateDTO.getModel());
        }
        if (StringUtils.isNotEmpty(carModelCreateDTO.getEngine())) {
            carModel.setEngine(carModelCreateDTO.getEngine());
        }
        if (StringUtils.isNotEmpty(carModelCreateDTO.getTransmission())) {
            carModel.setTransmission(carModelCreateDTO.getTransmission());
        }
        if (ObjectUtils.isNotEmpty(carModelCreateDTO.getSeats())) {
            carModel.setSeats(carModelCreateDTO.getSeats());
        }
        if (StringUtils.isNotEmpty(carModelCreateDTO.getFuel())) {
            carModel.setFuel(carModelCreateDTO.getFuel());
        }
        if (ObjectUtils.isNotEmpty(carModelCreateDTO.getYear())) {
            carModel.setYear(carModelCreateDTO.getYear());
        }
        return carModelRepository.save(carModel);
    }

    public List<CarModel> importModels(byte[] bytes) {
        ByteArrayInputStream ips = new ByteArrayInputStream(bytes);
        XSSFWorkbook workbook = null;
        try {
            workbook = new XSSFWorkbook(ips);
        } catch (Exception e) {
            logger.error("Error on import {}", e.getMessage());
            throw new ServiceException(ErrorCode.UPLOAD_ERROR);
        }
        if (workbook.getNumberOfSheets() == 0) {
            throw new ServiceException(ErrorCode.UPLOAD_ERROR);
        }
        XSSFSheet worksheet1 = workbook.getSheetAt(0);
        int rowCount = worksheet1.getLastRowNum() + 1;
        rowCount = Math.min(rowCount, worksheet1.getPhysicalNumberOfRows());
        int colCount = 0;
        if (rowCount > 0) {
            colCount = worksheet1.getRow(0).getPhysicalNumberOfCells();
        }
        if (rowCount == 0 || colCount == 0) {
            throw new ServiceException(ErrorCode.UPLOAD_ERROR);
        }

        List<CarModelCreateDTO> createList = new ArrayList<>();
        try {
            for (int i = 1; i < rowCount; i++) {
                XSSFRow row = worksheet1.getRow(i);
                if (row == null || isRowEmpty(row, colCount))
                    continue;
                int code = i + 1000;
                String carModelNumber = "CAR_MODEL" + code;
                String brand = getValue(row.getCell(0));
                String model = getValue(row.getCell(1));
                String engine = getValue(row.getCell(2));
                String transmission = getValue(row.getCell(3));
                Long seats = null;
                String seatsStr = getValue(row.getCell(4));
                if (StringUtils.isNotEmpty(seatsStr)) {
                    seats = Long.parseLong(seatsStr);
                }
                String fuel = getValue(row.getCell(5));
                Long year = null;
                String yearStr = getValue(row.getCell(6));
                if (StringUtils.isNotEmpty(yearStr)) {
                    year = Long.parseLong(yearStr);
                }

                createList.add(CarModelCreateDTO.builder()
                        .carModelNumber(carModelNumber)
                        .brand(brand)
                        .model(model)
                        .engine(engine)
                        .transmission(transmission)
                        .seats(seats)
                        .fuel(fuel)
                        .year(year)
                        .build());
            }
        } catch (Exception e) {
            logger.error("Error on import {}", e.getMessage());
            e.printStackTrace();
            throw new ServiceException(ErrorCode.UPLOAD_ERROR);
        }
        if (CollectionUtils.isEmpty(createList)) {
            return new ArrayList<>();
        }

        carModelRepository.deleteAll();
        List<CarModel> returnValue = new ArrayList<>();
        createList.forEach(createDTO -> returnValue.add(create(createDTO)));
        if (CollectionUtils.isEmpty(returnValue)) {
            return new ArrayList<>();
        }
        return returnValue;
    }

    public void exportToExcel(HttpServletResponse response) {
        try {
            response.setContentType("application/octet-stream");
            String headerKey = "Content-Disposition";
            String headerValue = "attachment; filename=car_models.xlsx";
            response.setHeader(headerKey, headerValue);

            XSSFWorkbook workbook = new XSSFWorkbook();
            XSSFSheet sheet = workbook.createSheet("Car Models");
            List<CarModel> carModelList = carModelRepository.findAll();
            writeHeaderLine(workbook, sheet);
            writeDataLines(workbook, sheet, carModelList);

            ServletOutputStream outputStream = response.getOutputStream();
            workbook.write(outputStream);
            workbook.close();
            outputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
            throw new ServiceException(ErrorCode.EXPORT_ERROR);
        }
    }

    private void writeHeaderLine(XSSFWorkbook workbook, XSSFSheet sheet) {
        Row row = sheet.createRow(0);

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setBold(true);
        font.setFontHeight(16);
        style.setFont(font);

        createCell(sheet, row, 0, "Brand", style);
        createCell(sheet, row, 1, "Model", style);
        createCell(sheet, row, 2, "Engine", style);
        createCell(sheet, row, 3, "Transmission", style);
        createCell(sheet, row, 4, "Seats", style);
        createCell(sheet, row, 5, "Fuel", style);
        createCell(sheet, row, 6, "Year", style);
    }

    private void createCell(XSSFSheet sheet, Row row, int columnCount, Object value, CellStyle style) {
        sheet.autoSizeColumn(columnCount);
        Cell cell = row.createCell(columnCount);
        if (value instanceof Long) {
            cell.setCellValue((Long) value);
        } else if (value instanceof Boolean) {
            cell.setCellValue((Boolean) value);
        } else {
            cell.setCellValue((String) value);
        }
        cell.setCellStyle(style);
    }

    private void writeDataLines(XSSFWorkbook workbook, XSSFSheet sheet, List<CarModel> carModelList) {
        int rowCount = 1;

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setFontHeight(14);
        style.setFont(font);

        for (CarModel carModel : carModelList) {
            Row row = sheet.createRow(rowCount++);
            int columnCount = 0;

            createCell(sheet, row, columnCount++, carModel.getBrand(), style);
            createCell(sheet, row, columnCount++, carModel.getModel(), style);
            createCell(sheet, row, columnCount++, carModel.getEngine(), style);
            createCell(sheet, row, columnCount++, carModel.getTransmission(), style);
            createCell(sheet, row, columnCount++, carModel.getSeats(), style);
            createCell(sheet, row, columnCount++, carModel.getFuel(), style);
            createCell(sheet, row, columnCount++, carModel.getYear(), style);
        }
    }

    private boolean isRowEmpty(Row row, int length) {
        for (int c = row.getFirstCellNum(); c < length; c++) {
            Cell cell = row.getCell(c);
            if (cell != null && cell.getCellType() != CellType.BLANK && cell.getCellType() != CellType._NONE)
                return false;
        }
        return true;
    }

    private String getValue(XSSFCell inputCell) {
        String input = inputCell == null || inputCell.getCellType() == CellType.BLANK ? null : getValueCell(inputCell);
        return input == null ? Strings.EMPTY : input.trim();
    }

    private String getValueCell(XSSFCell inputCell) {
        if (inputCell.getCellType() != CellType.STRING
                && inputCell.getCellType() != CellType.FORMULA
                && DateUtil.isCellDateFormatted(inputCell)) {
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
            return sdf.format(inputCell.getDateCellValue());
        } else if (inputCell.getCellType() == CellType.NUMERIC) {
            DecimalFormat df = new DecimalFormat();
            df.setGroupingUsed(false);
            return df.format(inputCell.getNumericCellValue());
        }
        return inputCell.getStringCellValue();
    }
}
