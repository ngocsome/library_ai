package com.example.backend_spring.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 250)
    private String title;

    @Column(length = 500)
    private String author;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String fileUrl;

    private String coverUrl;

    private String fileType;

    private Long fileSize;

    private Integer viewCount;

    private Integer downloadCount;

    private Boolean approved;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();

        if (this.viewCount == null) {
            this.viewCount = 0;
        }

        if (this.downloadCount == null) {
            this.downloadCount = 0;
        }

        if (this.approved == null) {
            this.approved = true;
        }
    }
}