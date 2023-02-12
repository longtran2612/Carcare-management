package iuh.nhom7.khoa_luan_backend.controller;

import iuh.nhom7.khoa_luan_backend.entity.wrapper.ObjectResponseWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping
public class InitAPI   {
    @GetMapping()
    public ObjectResponseWrapper checkAPI() {

        return ObjectResponseWrapper.builder().status(1).message("API IS RUNNING").build();


    }
}
