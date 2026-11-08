package com.mapvibe.MapVibe.controller;

import com.mapvibe.MapVibe.dto.response.ApiResponse;
import com.mapvibe.MapVibe.service.MediaService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MediaController {

    MediaService mediaService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<String> uploadImage(@RequestParam("file") MultipartFile file) {
        String imageUrl = mediaService.uploadImage(file);

        return ApiResponse.<String>builder()
                .result(imageUrl)
                .message("Upload image successfully!")
                .build();
    }

    @DeleteMapping
    public ApiResponse<Void> deleteImage(@RequestParam("imageUrl") String imageUrl) {
        mediaService.deleteImageFromCloudinary(imageUrl);

        return ApiResponse.<Void>builder()
                .message("Delete image successfully!")
                .build();
    }
}
