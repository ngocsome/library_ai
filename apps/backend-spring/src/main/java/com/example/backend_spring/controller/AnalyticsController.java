package com.example.backend_spring.controller;

import com.example.backend_spring.entity.Document;
import com.example.backend_spring.repository.DocumentRepository;
import com.example.backend_spring.repository.ForumPostRepository;
import com.example.backend_spring.repository.StudyGroupRepository;
import com.example.backend_spring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final ForumPostRepository forumPostRepository;
    private final StudyGroupRepository studyGroupRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalDocuments = documentRepository.count();
        long totalForumPosts = forumPostRepository.count();
        long totalGroups = studyGroupRepository.count();

        List<Map<String, Object>> trendingDocuments = documentRepository.findAll()
                .stream()
                .sorted((d1, d2) -> Integer.compare(
                        safeInt(d2.getViewCount()),
                        safeInt(d1.getViewCount())
                ))
                .limit(5)
                .map(this::toDocumentMap)
                .toList();

        long totalViews = documentRepository.findAll()
                .stream()
                .mapToLong(document -> safeInt(document.getViewCount()))
                .sum();

        Map<String, Object> counts = new HashMap<>();
        counts.put("users", totalUsers);
        counts.put("documents", totalDocuments);
        counts.put("posts", totalForumPosts);
        counts.put("groups", totalGroups);

        Map<String, Object> response = new HashMap<>();
        response.put("counts", counts);
        response.put("totalUsers", totalUsers);
        response.put("totalDocuments", totalDocuments);
        response.put("totalForumPosts", totalForumPosts);
        response.put("totalGroups", totalGroups);
        response.put("totalViews", totalViews);
        response.put("recentDocuments", trendingDocuments);
        response.put("trendingDocuments", trendingDocuments);

        return ResponseEntity.ok(response);
    }

    private Map<String, Object> toDocumentMap(Document document) {
        Map<String, Object> item = new HashMap<>();

        item.put("id", document.getId());
        item.put("DocID", document.getId());
        item.put("title", document.getTitle());
        item.put("Title", document.getTitle());
        item.put("author", document.getAuthor());
        item.put("Author", document.getAuthor());
        item.put("fileType", document.getFileType());
        item.put("FileType", document.getFileType());
        item.put("viewCount", safeInt(document.getViewCount()));
        item.put("ViewCount", safeInt(document.getViewCount()));
        item.put("downloadCount", safeInt(document.getDownloadCount()));
        item.put("DownloadCount", safeInt(document.getDownloadCount()));
        item.put("createdAt", document.getCreatedAt());
        item.put("CreatedAt", document.getCreatedAt());

        if (document.getCategory() != null) {
            item.put("categoryId", document.getCategory().getId());
            item.put("CategoryID", document.getCategory().getId());
            item.put("categoryName", document.getCategory().getName());
            item.put("CategoryName", document.getCategory().getName());
        }

        return item;
    }

    private int safeInt(Integer value) {
        return value == null ? 0 : value;
    }
}
