package iuh.nhom7.khoa_luan_backend.config;

import iuh.nhom7.khoa_luan_backend.base.BaseObjectLoggable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

@Configuration
public class ThreadPoolConfig extends BaseObjectLoggable {
    @Bean(name = "executorService")
    public ExecutorService createExecutorService() {
        ExecutorService executorService = new ThreadPoolExecutor(10, 3000,
                60L, TimeUnit.SECONDS,
                new SynchronousQueue<Runnable>());
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            try {
                executorService.shutdown();
            } catch (Exception e) {

            }
        }));
        return executorService;
    }
}
