package com.example.backend_spring.service;

import com.example.backend_spring.dto.document.DocumentResponse;
import com.example.backend_spring.entity.Category;
import com.example.backend_spring.entity.Document;
import com.example.backend_spring.entity.DocumentFavorite;
import com.example.backend_spring.entity.User;
import com.example.backend_spring.repository.CategoryRepository;
import com.example.backend_spring.repository.DocumentFavoriteRepository;
import com.example.backend_spring.repository.DocumentRepository;
import com.example.backend_spring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentFavoriteRepository documentFavoriteRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public List<DocumentResponse> getAllDocuments(Long categoryId) {
        List<Document> documents;

        if (categoryId != null) {
            documents = documentRepository.findByCategoryIdAndApprovedTrueOrderByCreatedAtDesc(categoryId);
        } else {
            documents = documentRepository.findByApprovedTrueOrderByCreatedAtDesc();
        }

        return documents.stream()
                .map(this::toResponse)
                .toList();
    }

    public DocumentResponse getDocumentById(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài liệu"));

        document.setViewCount(document.getViewCount() == null ? 1 : document.getViewCount() + 1);
        documentRepository.save(document);

        return toResponse(document);
    }

    public DocumentResponse createDocument(
            String title,
            String description,
            String author,
            Long categoryId,
            MultipartFile documentFile,
            MultipartFile thumbnailFile,
            String username
    ) {
        if (documentFile == null || documentFile.isEmpty()) {
            throw new RuntimeException("Vui lòng chọn tệp tài liệu");
        }

        User user = getUserByUsername(username);

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));

        String documentUrl = saveFile(documentFile, "documents");
        String thumbnailUrl = null;

        if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
            thumbnailUrl = saveFile(thumbnailFile, "thumbnails");
        }

        String originalName = documentFile.getOriginalFilename();
        String fileType = getFileExtension(originalName);

        Document document = Document.builder()
                .title(title)
                .description(description)
                .author(author)
                .category(category)
                .uploadedBy(user)
                .fileUrl(documentUrl)
                .coverUrl(thumbnailUrl)
                .fileType(fileType)
                .fileSize(documentFile.getSize())
                .viewCount(0)
                .downloadCount(0)
                .approved(true)
                .build();

        Document savedDocument = documentRepository.save(document);

        return toResponse(savedDocument);
    }

    public DocumentResponse updateDocument(
            Long documentId,
            String title,
            String description,
            String author,
            Long categoryId,
            MultipartFile documentFile,
            MultipartFile thumbnailFile,
            String username
    ) {
        getUserByUsername(username);

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài liệu"));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));

        document.setTitle(title);
        document.setDescription(description);
        document.setAuthor(author);
        document.setCategory(category);

        if (documentFile != null && !documentFile.isEmpty()) {
            deleteLocalFile(document.getFileUrl());

            String documentUrl = saveFile(documentFile, "documents");
            String originalName = documentFile.getOriginalFilename();
            String fileType = getFileExtension(originalName);

            document.setFileUrl(documentUrl);
            document.setFileType(fileType);
            document.setFileSize(documentFile.getSize());
        }

        if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
            deleteLocalFile(document.getCoverUrl());

            String thumbnailUrl = saveFile(thumbnailFile, "thumbnails");
            document.setCoverUrl(thumbnailUrl);
        }

        Document updatedDocument = documentRepository.save(document);

        return toResponse(updatedDocument);
    }

    public List<DocumentResponse> getFavorites(String username) {
        User user = getUserByUsername(username);

        return documentFavoriteRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(DocumentFavorite::getDocument)
                .map(this::toResponse)
                .toList();
    }

    public Map<String, Object> addFavorite(Long documentId, String username) {
        User user = getUserByUsername(username);

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài liệu"));

        boolean existed = documentFavoriteRepository.existsByUserIdAndDocumentId(user.getId(), documentId);

        if (existed) {
            return Map.of("message", "Tài liệu đã có trong danh sách yêu thích");
        }

        DocumentFavorite favorite = DocumentFavorite.builder()
                .user(user)
                .document(document)
                .build();

        documentFavoriteRepository.save(favorite);

        return Map.of("message", "Đã thêm vào yêu thích");
    }

    public Map<String, Object> removeFavorite(Long documentId, String username) {
        User user = getUserByUsername(username);

        DocumentFavorite favorite = documentFavoriteRepository
                .findByUserIdAndDocumentId(user.getId(), documentId)
                .orElseThrow(() -> new RuntimeException("Tài liệu chưa có trong yêu thích"));

        documentFavoriteRepository.delete(favorite);

        return Map.of("message", "Đã xóa khỏi yêu thích");
    }

    public Map<String, Object> deleteDocument(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài liệu"));

        List<DocumentFavorite> favorites = documentFavoriteRepository.findByDocumentId(documentId);
        documentFavoriteRepository.deleteAll(favorites);

        deleteLocalFile(document.getFileUrl());
        deleteLocalFile(document.getCoverUrl());

        documentRepository.delete(document);

        return Map.of("message", "Đã xóa tài liệu thành công");
    }

    private String saveFile(MultipartFile file, String folderName) {
        try {
            Path uploadDir = Path.of("uploads", folderName);

            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String originalName = file.getOriginalFilename();
            String extension = getFileExtension(originalName);
            String fileName = UUID.randomUUID() + (extension.isBlank() ? "" : "." + extension);

            Path targetPath = uploadDir.resolve(fileName);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + folderName + "/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Không thể lưu file: " + e.getMessage());
        }
    }

    private void deleteLocalFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            return;
        }

        if (!fileUrl.startsWith("/uploads/")) {
            return;
        }

        try {
            String relativePath = fileUrl.replaceFirst("^/uploads/", "");
            Path filePath = Path.of("uploads").resolve(relativePath);

            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Không thể xóa file local: " + fileUrl + " - " + e.getMessage());
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }

        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }

    private DocumentResponse toResponse(Document document) {
        Long categoryId = document.getCategory() != null ? document.getCategory().getId() : null;
        String categoryName = document.getCategory() != null ? document.getCategory().getName() : null;
        String uploadedByName = document.getUploadedBy() != null ? document.getUploadedBy().getFullName() : null;

        return DocumentResponse.builder()
                .id(document.getId())
                .DocumentID(document.getId())

                .title(document.getTitle())
                .Title(document.getTitle())

                .author(document.getAuthor())
                .Author(document.getAuthor())

                .description(document.getDescription())
                .Description(document.getDescription())

                .fileUrl(document.getFileUrl())
                .FileUrl(document.getFileUrl())

                .coverUrl(document.getCoverUrl())
                .CoverUrl(document.getCoverUrl())

                .fileType(document.getFileType())
                .FileType(document.getFileType())

                .fileSize(document.getFileSize())
                .FileSize(document.getFileSize())

                .viewCount(document.getViewCount())
                .ViewCount(document.getViewCount())

                .downloadCount(document.getDownloadCount())
                .DownloadCount(document.getDownloadCount())

                .categoryId(categoryId)
                .CategoryID(categoryId)

                .categoryName(categoryName)
                .CategoryName(categoryName)

                .uploadedByName(uploadedByName)
                .UploadedByName(uploadedByName)

                .createdAt(document.getCreatedAt())
                .CreatedAt(document.getCreatedAt())
                .build();
    }
}