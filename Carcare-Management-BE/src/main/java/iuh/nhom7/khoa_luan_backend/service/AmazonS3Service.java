package iuh.nhom7.khoa_luan_backend.service;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class AmazonS3Service {
    private AmazonS3 s3client;

    @Value("${amazonProperties.bucketName}")
    private String bucketName;

    @Value("${amazonProperties.accessKey}")
    private String accessKey;

    @Value("${amazonProperties.secretKey}")
    private String secretKey;

    private static final Logger logger = Logger.getLogger(AmazonS3Service.class.getName());

    @PostConstruct
    private void initializeAmazon() {
        logger.log(Level.INFO, "initial amazon s3 service");

        AWSCredentials credentials = new BasicAWSCredentials(this.accessKey, this.secretKey);
        this.s3client = AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(Regions.AP_SOUTHEAST_1)
                .build();
    }
    /**
     * chuyển từ multipart file sang file
     */
    private File convertMultiPartToFile(MultipartFile file) throws IOException {
        Objects.requireNonNull(file.getOriginalFilename());
        File convFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }
        return convFile;
    }

    /**
     * đặt tên file ngẫu nhiêu
     */
    private String generateFileName(MultipartFile multiPart) {
        String originalFilename = multiPart.getOriginalFilename();
        if (originalFilename != null)
            return new Date().getTime() + "_" + originalFilename.replace(" ", "_");
        return new Date().getTime() + "_" + UUID.randomUUID().toString().replace("-", "_");
    }

    /**
     * upload file lên S3
     */
    private void uploadFileTos3bucket(String fileName, File file) {
        logger.log(Level.INFO, "uploading to s3 filename = {0}", fileName);
        logger.log(Level.INFO, "uploading to s3 file = {0}", file);

        s3client.putObject(new PutObjectRequest(bucketName, fileName, file)
                .withCannedAcl(CannedAccessControlList.PublicRead));
    }

    /**
     * gọi hàm upload và trả về link của file
     */
    public String uploadFile(MultipartFile multipartFile) {
        String fileUrl = "";
        try {
            File file = convertMultiPartToFile(multipartFile);
            String fileName = generateFileName(multipartFile);
            uploadFileTos3bucket(fileName, file);
            fileUrl = s3client.getUrl(bucketName, fileName).toString();
            file.delete();
        } catch (Exception e) {
            e.printStackTrace();
        }
        logger.log(Level.INFO, "upload finish, fileUrl = {0}", fileUrl);
        return fileUrl;
    }

    /**
     * tải các file được chọn lên s3 rồi trả về danh sach url
     * @param files
     * @return
     */
    public List<String> uploadFiles(List<MultipartFile> files) {
        List<String> filesUrl = new ArrayList<>();
        if (files.isEmpty()) {
            return new ArrayList<>();
        }
        for (MultipartFile file:files) {
            String fileUrl = uploadFile(file);
            filesUrl.add(fileUrl);
        }
        return filesUrl;
    }
}
