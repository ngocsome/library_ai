package com.example.backend_spring.controller;

import com.example.backend_spring.service.DocumentService;
import com.example.backend_spring.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    private final JwtService jwtService;

    @GetMapping
    public ResponseEntity<?> getAllDocuments(
            @RequestParam(required = false) Long categoryId
    ) {
        return ResponseEntity.ok(documentService.getAllDocuments(categoryId));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createDocument(
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "author", required = false) String author,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("document") MultipartFile document,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            HttpServletRequest request
    ) {
        try {
            String username = getUsernameFromRequest(request);

            return ResponseEntity.ok(
                    documentService.createDocument(
                            title,
                            description,
                            author,
                            categoryId,
                            document,
                            thumbnail,
                            username
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateDocument(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "author", required = false) String author,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "document", required = false) MultipartFile document,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            HttpServletRequest request
    ) {
        try {
            String username = getUsernameFromRequest(request);

            return ResponseEntity.ok(
                    documentService.updateDocument(
                            id,
                            title,
                            description,
                            author,
                            categoryId,
                            document,
                            thumbnail,
                            username
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDocumentById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(documentService.getDocumentById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        try {
            getUsernameFromRequest(request);
            return ResponseEntity.ok(documentService.deleteDocument(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/favorites")
    public ResponseEntity<?> getFavorites(HttpServletRequest request) {
        try {
            String username = getUsernameFromRequest(request);
            return ResponseEntity.ok(documentService.getFavorites(username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<?> addFavorite(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        try {
            String username = getUsernameFromRequest(request);
            return ResponseEntity.ok(documentService.addFavorite(id, username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/favorite")
    public ResponseEntity<?> removeFavorite(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        try {
            String username = getUsernameFromRequest(request);
            return ResponseEntity.ok(documentService.removeFavorite(id, username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private String getUsernameFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Thiếu token đăng nhập");
        }

        String token = authHeader.substring(7);
        return jwtService.extractUsername(token);
    }
}