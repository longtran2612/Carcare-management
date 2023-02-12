package iuh.nhom7.khoa_luan_backend.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.StorageClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FirebaseImageService {
    @Value("${firebase.bucket-name}")
    private String bucketName;

    @Value("${firebase.image-url}")
    private String imageUrl;

    public FirebaseImageService() {
    }

    @EventListener
    public void init(ApplicationReadyEvent event) {
        // initialize Firebase
        try {
            ClassPathResource serviceAccount = new ClassPathResource("firebase-credential.json");
            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount.getInputStream()))
                    .setStorageBucket(bucketName)
                    .build();
            FirebaseApp.initializeApp(options);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public String getImageUrl(String name) {
        return String.format(imageUrl, name);
    }

    /**
     * tải các file được chọn lên firebase storage rồi trả về danh sach url
     * @param files
     * @return
     */
    public List<String> uploadFiles(List<MultipartFile> files) {
        List<String> filesUrl = new ArrayList<>();
        if (files.isEmpty()) {
            return new ArrayList<>();
        }
        for (MultipartFile file:files) {
            String fileUrl = null;
            try {
                fileUrl = save(file);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            filesUrl.add(fileUrl);
        }
        return filesUrl;
    }

    public String save(MultipartFile file) throws IOException {
        Bucket bucket = StorageClient.getInstance().bucket();
        String name = generateFileName(file.getOriginalFilename());
        bucket.create(name, file.getBytes(), file.getContentType());
        return getImageUrl(name);
    }

    public String save(BufferedImage bufferedImage, String originalFileName) throws IOException {
        byte[] bytes = getByteArrays(bufferedImage, getExtension(originalFileName));
        Bucket bucket = StorageClient.getInstance().bucket();
        String name = generateFileName(originalFileName);
        bucket.create(name, bytes);
        return name;
    }

    public void delete(String name) throws IOException {
        Bucket bucket = StorageClient.getInstance().bucket();
        if (StringUtils.isEmpty(name)) {
            throw new IOException("invalid file name");
        }
        Blob blob = bucket.get(name);
        if (blob == null) {
            throw new IOException("file not found");
        }
        blob.delete();
    }

    private String getExtension(String originalFileName) {
        return StringUtils.getFilenameExtension(originalFileName);
    }

    private String generateFileName(String originalFileName) {
        return UUID.randomUUID().toString() + getExtension(originalFileName);
    }

    private byte[] getByteArrays(BufferedImage bufferedImage, String format) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            ImageIO.write(bufferedImage, format, baos);
            baos.flush();
            return baos.toByteArray();
        } catch (IOException e) {
            throw e;
        } finally {
            baos.close();
        }
    }

}
