package com.example.backend_spring.service;

import com.example.backend_spring.dto.forum.CreateCommentRequest;
import com.example.backend_spring.dto.forum.CreatePostRequest;
import com.example.backend_spring.dto.forum.ForumCategoryResponse;
import com.example.backend_spring.dto.forum.ForumCommentResponse;
import com.example.backend_spring.dto.forum.ForumPostResponse;
import com.example.backend_spring.entity.ForumCategory;
import com.example.backend_spring.entity.ForumComment;
import com.example.backend_spring.entity.ForumCommentLike;
import com.example.backend_spring.entity.ForumPost;
import com.example.backend_spring.entity.ForumPostLike;
import com.example.backend_spring.entity.ForumReport;
import com.example.backend_spring.entity.User;
import com.example.backend_spring.enums.ReportStatus;
import com.example.backend_spring.repository.ForumCategoryRepository;
import com.example.backend_spring.repository.ForumCommentLikeRepository;
import com.example.backend_spring.repository.ForumCommentRepository;
import com.example.backend_spring.repository.ForumPostLikeRepository;
import com.example.backend_spring.repository.ForumPostRepository;
import com.example.backend_spring.repository.ForumReportRepository;
import com.example.backend_spring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ForumService {

    private final ForumCategoryRepository forumCategoryRepository;
    private final ForumPostRepository forumPostRepository;
    private final ForumCommentRepository forumCommentRepository;
    private final ForumPostLikeRepository forumPostLikeRepository;
    private final ForumCommentLikeRepository forumCommentLikeRepository;
    private final ForumReportRepository forumReportRepository;
    private final UserRepository userRepository;

    public List<ForumCategoryResponse> getCategories() {
        return forumCategoryRepository.findAll()
                .stream()
                .map(this::toCategoryResponse)
                .toList();
    }

    public List<ForumPostResponse> getPosts(Long categoryId) {
        List<ForumPost> posts;

        if (categoryId != null) {
            posts = forumPostRepository.findByCategoryIdOrderByCreatedAtDesc(categoryId);
        } else {
            posts = forumPostRepository.findAllByOrderByCreatedAtDesc();
        }

        return posts.stream()
                .map(post -> toPostResponse(post, false, false, null))
                .toList();
    }

    public ForumPostResponse getPostById(Long id, String username) {
        ForumPost post = forumPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        post.setViewCount(post.getViewCount() == null ? 1 : post.getViewCount() + 1);
        forumPostRepository.save(post);

        boolean liked = false;
        Long currentUserId = null;

        if (username != null && !username.isBlank()) {
            User user = getUserByUsername(username);
            currentUserId = user.getId();
            liked = forumPostLikeRepository.existsByPostIdAndUserId(id, user.getId());
        }

        return toPostResponse(post, true, liked, currentUserId);
    }

    public ForumPostResponse createPost(CreatePostRequest request, String username) {
        User user = getUserByUsername(username);

        ForumCategory category = null;

        if (request.getCategoryId() != null) {
            category = forumCategoryRepository.findById(request.getCategoryId())
                    .orElse(null);
        }

        ForumPost post = ForumPost.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .category(category)
                .user(user)
                .viewCount(0)
                .likeCount(0)
                .build();

        ForumPost savedPost = forumPostRepository.save(post);

        return toPostResponse(savedPost, true, false, user.getId());
    }

    public ForumCommentResponse addComment(Long postId, CreateCommentRequest request, String username) {
        User user = getUserByUsername(username);

        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        ForumComment comment = ForumComment.builder()
                .content(request.getContent())
                .parentId(request.getParentId())
                .post(post)
                .user(user)
                .likeCount(0)
                .build();

        ForumComment savedComment = forumCommentRepository.save(comment);

        return toCommentResponse(savedComment, user.getId());
    }

    public Map<String, Object> likePost(Long postId, String username) {
        User user = getUserByUsername(username);

        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        boolean liked = forumPostLikeRepository.existsByPostIdAndUserId(postId, user.getId());

        if (liked) {
            return Map.of(
                    "message", "Bạn đã thích bài viết này rồi",
                    "liked", true,
                    "likeCount", post.getLikeCount() == null ? 0 : post.getLikeCount()
            );
        }

        ForumPostLike like = ForumPostLike.builder()
                .post(post)
                .user(user)
                .build();

        forumPostLikeRepository.save(like);

        post.setLikeCount(post.getLikeCount() == null ? 1 : post.getLikeCount() + 1);
        forumPostRepository.save(post);

        return Map.of(
                "message", "Đã thích bài viết",
                "liked", true,
                "likeCount", post.getLikeCount()
        );
    }

    public Map<String, Object> unlikePost(Long postId, String username) {
        User user = getUserByUsername(username);

        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        ForumPostLike like = forumPostLikeRepository.findByPostIdAndUserId(postId, user.getId())
                .orElseThrow(() -> new RuntimeException("Bạn chưa thích bài viết này"));

        forumPostLikeRepository.delete(like);

        int currentLikeCount = post.getLikeCount() == null ? 0 : post.getLikeCount();
        post.setLikeCount(Math.max(0, currentLikeCount - 1));
        forumPostRepository.save(post);

        return Map.of(
                "message", "Đã bỏ thích bài viết",
                "liked", false,
                "likeCount", post.getLikeCount()
        );
    }

    public Map<String, Object> likeComment(Long commentId, String username) {
        User user = getUserByUsername(username);

        ForumComment comment = forumCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bình luận"));

        boolean liked = forumCommentLikeRepository.existsByCommentIdAndUserId(commentId, user.getId());

        if (liked) {
            return Map.of(
                    "message", "Bạn đã thích bình luận này rồi",
                    "liked", true,
                    "likeCount", comment.getLikeCount() == null ? 0 : comment.getLikeCount()
            );
        }

        ForumCommentLike like = ForumCommentLike.builder()
                .comment(comment)
                .user(user)
                .build();

        forumCommentLikeRepository.save(like);

        comment.setLikeCount(comment.getLikeCount() == null ? 1 : comment.getLikeCount() + 1);
        forumCommentRepository.save(comment);

        return Map.of(
                "message", "Đã thích bình luận",
                "liked", true,
                "likeCount", comment.getLikeCount()
        );
    }

    public Map<String, Object> unlikeComment(Long commentId, String username) {
        User user = getUserByUsername(username);

        ForumComment comment = forumCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bình luận"));

        ForumCommentLike like = forumCommentLikeRepository.findByCommentIdAndUserId(commentId, user.getId())
                .orElseThrow(() -> new RuntimeException("Bạn chưa thích bình luận này"));

        forumCommentLikeRepository.delete(like);

        int currentLikeCount = comment.getLikeCount() == null ? 0 : comment.getLikeCount();
        comment.setLikeCount(Math.max(0, currentLikeCount - 1));
        forumCommentRepository.save(comment);

        return Map.of(
                "message", "Đã bỏ thích bình luận",
                "liked", false,
                "likeCount", comment.getLikeCount()
        );
    }

    public Map<String, Object> reportPost(Long postId, Map<String, Object> request, String username) {
        User reporter = getUserByUsername(username);

        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        String reason = getString(request, "reason");
        String description = getString(request, "description");

        if (reason.isBlank()) {
            throw new RuntimeException("Vui lòng chọn lý do báo cáo");
        }

        boolean alreadyReported = forumReportRepository.existsByPostIdAndReporterIdAndStatus(
                postId,
                reporter.getId(),
                ReportStatus.PENDING
        );

        if (alreadyReported) {
            throw new RuntimeException("Bạn đã báo cáo bài viết này và đang chờ xử lý");
        }

        String contentPreview = buildContentPreview(post.getContent());
        String reporterName = reporter.getUsername();

        ForumReport report = ForumReport.builder()
                .postId(post.getId())
                .postTitle(post.getTitle())
                .postContentPreview(contentPreview)
                .reporterId(reporter.getId())
                .reporterUsername(reporterName)
                .reason(reason)
                .description(description)
                .status(ReportStatus.PENDING)
                .build();

        ForumReport savedReport = forumReportRepository.save(report);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Đã gửi báo cáo vi phạm. Quản trị viên sẽ xem xét sớm.");
        response.put("reportId", savedReport.getId());
        response.put("postId", savedReport.getPostId());
        response.put("status", savedReport.getStatus().name());

        return response;
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }

    private ForumCategoryResponse toCategoryResponse(ForumCategory category) {
        return ForumCategoryResponse.builder()
                .id(category.getId())
                .CategoryID(category.getId())

                .name(category.getName())
                .Name(category.getName())

                .description(category.getDescription())
                .Description(category.getDescription())

                .color(category.getColor())
                .Color(category.getColor())

                .build();
    }

    private ForumPostResponse toPostResponse(
            ForumPost post,
            boolean includeComments,
            boolean liked,
            Long currentUserId
    ) {
        Long categoryId = post.getCategory() != null ? post.getCategory().getId() : null;
        String categoryName = post.getCategory() != null ? post.getCategory().getName() : "Chung";

        Long userId = post.getUser() != null ? post.getUser().getId() : null;
        String authorName = post.getUser() != null ? post.getUser().getFullName() : "Ẩn danh";

        List<ForumComment> rawComments = forumCommentRepository.findByPostIdOrderByCreatedAtAsc(post.getId());
        int commentCount = rawComments == null ? 0 : rawComments.size();

        List<ForumCommentResponse> comments = List.of();

        if (includeComments && rawComments != null) {
            comments = rawComments.stream()
                    .map(comment -> toCommentResponse(comment, currentUserId))
                    .toList();
        }

        return ForumPostResponse.builder()
                .id(post.getId())
                .PostID(post.getId())

                .title(post.getTitle())
                .Title(post.getTitle())

                .content(post.getContent())
                .Content(post.getContent())

                .viewCount(post.getViewCount())
                .ViewCount(post.getViewCount())

                .likeCount(post.getLikeCount())
                .LikeCount(post.getLikeCount())

                .commentCount(commentCount)
                .CommentCount(commentCount)

                .liked(liked)
                .Liked(liked)

                .categoryId(categoryId)
                .CategoryID(categoryId)

                .categoryName(categoryName)
                .CategoryName(categoryName)

                .userId(userId)
                .UserID(userId)

                .authorName(authorName)
                .AuthorName(authorName)

                .createdAt(post.getCreatedAt())
                .CreatedAt(post.getCreatedAt())

                .comments(comments)
                .Comments(comments)

                .build();
    }

    private ForumCommentResponse toCommentResponse(ForumComment comment) {
        return toCommentResponse(comment, null);
    }

    private ForumCommentResponse toCommentResponse(ForumComment comment, Long currentUserId) {
        Long userId = comment.getUser() != null ? comment.getUser().getId() : null;
        String authorName = comment.getUser() != null ? comment.getUser().getFullName() : "Ẩn danh";

        boolean liked = false;

        if (currentUserId != null) {
            liked = forumCommentLikeRepository.existsByCommentIdAndUserId(
                    comment.getId(),
                    currentUserId
            );
        }

        Integer likeCount = comment.getLikeCount() == null ? 0 : comment.getLikeCount();

        return ForumCommentResponse.builder()
                .id(comment.getId())
                .CommentID(comment.getId())

                .content(comment.getContent())
                .Content(comment.getContent())

                .userId(userId)
                .UserID(userId)

                .authorName(authorName)
                .AuthorName(authorName)

                .parentId(comment.getParentId())
                .ParentID(comment.getParentId())

                .likeCount(likeCount)
                .LikeCount(likeCount)

                .liked(liked)
                .Liked(liked)

                .createdAt(comment.getCreatedAt())
                .CreatedAt(comment.getCreatedAt())

                .build();
    }

    private String getString(Map<String, Object> request, String key) {
        if (request == null) {
            return "";
        }

        Object value = request.get(key);
        return value == null ? "" : String.valueOf(value).trim();
    }

    private String buildContentPreview(String content) {
        if (content == null || content.isBlank()) {
            return "";
        }

        String normalized = content.replaceAll("\\s+", " ").trim();
        return normalized.length() <= 250 ? normalized : normalized.substring(0, 250) + "...";
    }
}