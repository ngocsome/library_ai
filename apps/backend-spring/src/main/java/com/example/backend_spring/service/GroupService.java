package com.example.backend_spring.service;

import com.example.backend_spring.dto.group.CreateGroupRequest;
import com.example.backend_spring.dto.group.GroupChatResponse;
import com.example.backend_spring.dto.group.GroupJoinRequestResponse;
import com.example.backend_spring.dto.group.GroupResponse;
import com.example.backend_spring.dto.group.SendMessageRequest;
import com.example.backend_spring.entity.GroupChat;
import com.example.backend_spring.entity.GroupMember;
import com.example.backend_spring.entity.StudyGroup;
import com.example.backend_spring.entity.User;
import com.example.backend_spring.enums.Role;
import com.example.backend_spring.repository.GroupChatRepository;
import com.example.backend_spring.repository.GroupMemberRepository;
import com.example.backend_spring.repository.StudyGroupRepository;
import com.example.backend_spring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final StudyGroupRepository studyGroupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final GroupChatRepository groupChatRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public List<GroupResponse> getGroups(String username) {
        User currentUser = null;

        if (username != null && !username.isBlank()) {
            currentUser = userRepository.findByUsername(username).orElse(null);
        }

        User finalCurrentUser = currentUser;

        return studyGroupRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(group -> toGroupResponse(group, finalCurrentUser))
                .toList();
    }

    public GroupResponse createGroup(CreateGroupRequest request, String username) {
        User user = getUserByUsername(username);

        String visibility = normalizeVisibility(request.getVisibility());

        StudyGroup group = StudyGroup.builder()
                .name(normalizeRequiredText(request.getName(), "Tên nhóm không được để trống"))
                .description(normalizeOptionalText(request.getDescription()))
                .subject(normalizeOptionalText(request.getSubject()))
                .visibility(visibility)
                .createdBy(user)
                .memberCount(1)
                .build();

        StudyGroup savedGroup = studyGroupRepository.save(group);

        GroupMember member = GroupMember.builder()
                .group(savedGroup)
                .user(user)
                .status(GroupMember.STATUS_APPROVED)
                .build();

        groupMemberRepository.save(member);

        return toGroupResponse(savedGroup, user);
    }

    public Map<String, Object> joinGroup(Long groupId, String username) {
        User user = getUserByUsername(username);

        StudyGroup group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        GroupMember existingMember = groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElse(null);

        if (existingMember != null) {
            String status = existingMember.getStatus();

            if (GroupMember.STATUS_APPROVED.equalsIgnoreCase(status)) {
                return Map.of(
                        "message", "Bạn đã tham gia nhóm này rồi",
                        "status", GroupMember.STATUS_APPROVED
                );
            }

            if (GroupMember.STATUS_PENDING.equalsIgnoreCase(status)) {
                return Map.of(
                        "message", "Yêu cầu tham gia của bạn đang chờ duyệt",
                        "status", GroupMember.STATUS_PENDING
                );
            }

            if (GroupMember.STATUS_REJECTED.equalsIgnoreCase(status)) {
                existingMember.setStatus(getDefaultJoinStatus(group));
                groupMemberRepository.save(existingMember);

                if (GroupMember.STATUS_APPROVED.equalsIgnoreCase(existingMember.getStatus())) {
                    increaseMemberCount(group);

                    return Map.of(
                            "message", "Tham gia nhóm thành công",
                            "status", GroupMember.STATUS_APPROVED
                    );
                }

                notifyJoinRequestToManagers(group, user);

                return Map.of(
                        "message", "Đã gửi yêu cầu tham gia, vui lòng chờ duyệt",
                        "status", GroupMember.STATUS_PENDING
                );
            }
        }

        String status = getDefaultJoinStatus(group);

        GroupMember member = GroupMember.builder()
                .group(group)
                .user(user)
                .status(status)
                .build();

        groupMemberRepository.save(member);

        if (GroupMember.STATUS_APPROVED.equals(status)) {
            increaseMemberCount(group);

            return Map.of(
                    "message", "Tham gia nhóm thành công",
                    "status", GroupMember.STATUS_APPROVED
            );
        }

        notifyJoinRequestToManagers(group, user);

        return Map.of(
                "message", "Đã gửi yêu cầu tham gia, vui lòng chờ duyệt",
                "status", GroupMember.STATUS_PENDING
        );
    }

    public Map<String, Object> leaveGroup(Long groupId, String username) {
        User user = getUserByUsername(username);

        StudyGroup group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        if (isOwner(group, user)) {
            throw new RuntimeException("Chủ nhóm không thể rời nhóm. Hãy chuyển quyền hoặc xóa nhóm.");
        }

        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, user.getId())
                .orElseThrow(() -> new RuntimeException("Bạn chưa tham gia nhóm này"));

        String status = member.getStatus();

        groupMemberRepository.delete(member);

        if (GroupMember.STATUS_APPROVED.equalsIgnoreCase(status)) {
            int currentMemberCount = group.getMemberCount() == null ? 0 : group.getMemberCount();
            group.setMemberCount(Math.max(1, currentMemberCount - 1));
            studyGroupRepository.save(group);

            return Map.of(
                    "message", "Bạn đã rời nhóm thành công",
                    "status", "LEFT"
            );
        }

        if (GroupMember.STATUS_PENDING.equalsIgnoreCase(status)) {
            return Map.of(
                    "message", "Đã hủy yêu cầu tham gia nhóm",
                    "status", "LEFT"
            );
        }

        return Map.of(
                "message", "Bạn đã rời nhóm",
                "status", "LEFT"
        );
    }

    public List<GroupChatResponse> getChats(Long groupId, String channel, String username) {
        User user = getUserByUsername(username);
        StudyGroup group = getGroupById(groupId);

        ensureApprovedMemberOrOwnerOrAdmin(group, user);

        String normalizedChannel = normalizeChannel(channel);

        return groupChatRepository.findByGroupIdAndChannelOrderByCreatedAtAsc(groupId, normalizedChannel)
                .stream()
                .map(this::toChatResponse)
                .toList();
    }

    public GroupChatResponse sendMessage(Long groupId, SendMessageRequest request, String username) {
        User user = getUserByUsername(username);
        StudyGroup group = getGroupById(groupId);

        ensureApprovedMemberOrOwnerOrAdmin(group, user);

        String channel = normalizeChannel(request.getChannel());

        GroupChat chat = GroupChat.builder()
                .content(request.getContent())
                .channel(channel)
                .group(group)
                .user(user)
                .build();

        GroupChat savedChat = groupChatRepository.save(chat);

        return toChatResponse(savedChat);
    }

    public List<GroupJoinRequestResponse> getJoinRequests(Long groupId, String username) {
        User currentUser = getUserByUsername(username);
        StudyGroup group = getGroupById(groupId);

        ensureOwnerOrAdmin(group, currentUser);

        return groupMemberRepository
                .findByGroupIdAndStatusOrderByJoinedAtDesc(groupId, GroupMember.STATUS_PENDING)
                .stream()
                .map(this::toJoinRequestResponse)
                .toList();
    }

    public Map<String, Object> approveJoinRequest(Long groupId, Long memberId, String username) {
        User currentUser = getUserByUsername(username);
        StudyGroup group = getGroupById(groupId);

        ensureOwnerOrAdmin(group, currentUser);

        GroupMember member = groupMemberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu tham gia"));

        if (member.getGroup() == null || !member.getGroup().getId().equals(groupId)) {
            throw new RuntimeException("Yêu cầu tham gia không thuộc nhóm này");
        }

        if (GroupMember.STATUS_APPROVED.equalsIgnoreCase(member.getStatus())) {
            return Map.of(
                    "message", "Thành viên này đã được duyệt trước đó",
                    "status", GroupMember.STATUS_APPROVED
            );
        }

        member.setStatus(GroupMember.STATUS_APPROVED);
        groupMemberRepository.save(member);

        increaseMemberCount(group);

        notificationService.createNotification(
                member.getUser(),
                "Yêu cầu tham gia đã được duyệt",
                "Bạn đã được duyệt vào nhóm " + group.getName(),
                "GROUP_JOIN_APPROVED"
        );

        return Map.of(
                "message", "Đã duyệt yêu cầu tham gia",
                "status", GroupMember.STATUS_APPROVED,
                "memberId", member.getId()
        );
    }

    public Map<String, Object> rejectJoinRequest(Long groupId, Long memberId, String username) {
        User currentUser = getUserByUsername(username);
        StudyGroup group = getGroupById(groupId);

        ensureOwnerOrAdmin(group, currentUser);

        GroupMember member = groupMemberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu tham gia"));

        if (member.getGroup() == null || !member.getGroup().getId().equals(groupId)) {
            throw new RuntimeException("Yêu cầu tham gia không thuộc nhóm này");
        }

        if (GroupMember.STATUS_APPROVED.equalsIgnoreCase(member.getStatus())) {
            throw new RuntimeException("Không thể từ chối thành viên đã được duyệt");
        }

        member.setStatus(GroupMember.STATUS_REJECTED);
        groupMemberRepository.save(member);

        notificationService.createNotification(
                member.getUser(),
                "Yêu cầu tham gia bị từ chối",
                "Yêu cầu tham gia nhóm " + group.getName() + " của bạn đã bị từ chối",
                "GROUP_JOIN_REJECTED"
        );

        return Map.of(
                "message", "Đã từ chối yêu cầu tham gia",
                "status", GroupMember.STATUS_REJECTED,
                "memberId", member.getId()
        );
    }

    @Transactional
    public GroupResponse updateGroup(Long groupId, CreateGroupRequest request, String username) {
        User currentUser = getUserByUsername(username);
        StudyGroup group = getGroupById(groupId);

        ensureOwnerOrAdmin(group, currentUser);

        String name = normalizeRequiredText(request.getName(), "Tên nhóm không được để trống");
        String visibility = normalizeVisibility(request.getVisibility());

        group.setName(name);
        group.setSubject(normalizeOptionalText(request.getSubject()));
        group.setDescription(normalizeOptionalText(request.getDescription()));
        group.setVisibility(visibility);

        StudyGroup savedGroup = studyGroupRepository.save(group);
        return toGroupResponse(savedGroup, currentUser);
    }

    @Transactional
    public Map<String, Object> deleteGroup(Long groupId, String username) {
        User currentUser = getUserByUsername(username);
        StudyGroup group = getGroupById(groupId);

        ensureOwnerOrAdmin(group, currentUser);

        groupChatRepository.deleteByGroupId(groupId);
        groupMemberRepository.deleteByGroupId(groupId);
        studyGroupRepository.delete(group);

        return Map.of(
                "message", "Xóa nhóm thành công",
                "groupId", groupId
        );
    }

    private void notifyJoinRequestToManagers(StudyGroup group, User requester) {
        String requesterName = getDisplayName(requester);
        String groupName = group.getName();

        notificationService.createNotificationForAdminsAndOwner(
                group.getCreatedBy(),
                "Yêu cầu tham gia nhóm",
                requesterName + " đã gửi yêu cầu tham gia nhóm " + groupName,
                "GROUP_JOIN_REQUEST"
        );
    }

    private StudyGroup getGroupById(Long groupId) {
        return studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }

    private String getDefaultJoinStatus(StudyGroup group) {
        String visibility = group.getVisibility();

        if (StudyGroup.VISIBILITY_PRIVATE.equalsIgnoreCase(visibility)) {
            return GroupMember.STATUS_PENDING;
        }

        return GroupMember.STATUS_APPROVED;
    }

    private void increaseMemberCount(StudyGroup group) {
        group.setMemberCount(group.getMemberCount() == null ? 1 : group.getMemberCount() + 1);
        studyGroupRepository.save(group);
    }

    private void ensureApprovedMemberOrOwnerOrAdmin(StudyGroup group, User user) {
        if (isOwner(group, user) || isAdmin(user)) {
            return;
        }

        boolean approved = groupMemberRepository.existsByGroupIdAndUserIdAndStatus(
                group.getId(),
                user.getId(),
                GroupMember.STATUS_APPROVED
        );

        if (!approved) {
            throw new RuntimeException("Bạn cần được duyệt để xem nội dung nhóm");
        }
    }

    private void ensureOwnerOrAdmin(StudyGroup group, User user) {
        if (isOwner(group, user) || isAdmin(user)) {
            return;
        }

        throw new RuntimeException("Bạn không có quyền quản lý yêu cầu tham gia nhóm này");
    }

    private boolean isOwner(StudyGroup group, User user) {
        return group.getCreatedBy() != null
                && user != null
                && group.getCreatedBy().getId().equals(user.getId());
    }

    private boolean isAdmin(User user) {
        return user != null && Role.ADMIN.equals(user.getRole());
    }

    private String normalizeRequiredText(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new RuntimeException(message);
        }

        return value.trim();
    }

    private String normalizeOptionalText(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String normalizeVisibility(String visibility) {
        if (visibility == null || visibility.isBlank()) {
            return StudyGroup.VISIBILITY_PUBLIC;
        }

        String value = visibility.trim().toUpperCase();

        return switch (value) {
            case StudyGroup.VISIBILITY_PUBLIC, StudyGroup.VISIBILITY_PRIVATE -> value;
            default -> StudyGroup.VISIBILITY_PUBLIC;
        };
    }

    private String normalizeChannel(String channel) {
        if (channel == null || channel.isBlank()) {
            return "general";
        }

        String value = channel.trim().toLowerCase();

        return switch (value) {
            case "general", "qa", "docs" -> value;
            default -> "general";
        };
    }

    private String getDisplayName(User user) {
        if (user == null) {
            return "Người dùng";
        }

        if (user.getFullName() != null && !user.getFullName().isBlank()) {
            return user.getFullName();
        }

        if (user.getUsername() != null && !user.getUsername().isBlank()) {
            return user.getUsername();
        }

        return "Người dùng";
    }

    private GroupResponse toGroupResponse(StudyGroup group, User currentUser) {
        Long createdById = group.getCreatedBy() != null ? group.getCreatedBy().getId() : null;
        String createdByName = group.getCreatedBy() != null ? group.getCreatedBy().getFullName() : "Ẩn danh";

        String visibility = group.getVisibility() == null || group.getVisibility().isBlank()
                ? StudyGroup.VISIBILITY_PUBLIC
                : group.getVisibility();

        Boolean joined = false;
        Boolean owner = false;
        String joinStatus = null;

        if (currentUser != null) {
            owner = isOwner(group, currentUser);

            GroupMember member = groupMemberRepository
                    .findByGroupIdAndUserId(group.getId(), currentUser.getId())
                    .orElse(null);

            if (member != null) {
                joinStatus = member.getStatus();
                joined = GroupMember.STATUS_APPROVED.equalsIgnoreCase(member.getStatus());
            }

            if (owner || isAdmin(currentUser)) {
                joined = true;
                joinStatus = GroupMember.STATUS_APPROVED;
            }
        }

        return GroupResponse.builder()
                .id(group.getId())
                .GroupID(group.getId())

                .name(group.getName())
                .Name(group.getName())

                .description(group.getDescription())
                .Description(group.getDescription())

                .subject(group.getSubject())
                .Subject(group.getSubject())

                .visibility(visibility)
                .Visibility(visibility)

                .memberCount(group.getMemberCount())
                .MemberCount(group.getMemberCount())

                .createdById(createdById)
                .CreatedBy(createdById)

                .createdByName(createdByName)
                .CreatedByName(createdByName)

                .joined(joined)
                .Joined(joined)

                .joinStatus(joinStatus)
                .JoinStatus(joinStatus)

                .owner(owner)
                .Owner(owner)

                .createdAt(group.getCreatedAt())
                .CreatedAt(group.getCreatedAt())

                .build();
    }

    private GroupChatResponse toChatResponse(GroupChat chat) {
        Long userId = chat.getUser() != null ? chat.getUser().getId() : null;
        String authorName = chat.getUser() != null ? chat.getUser().getFullName() : "Ẩn danh";
        Long groupId = chat.getGroup() != null ? chat.getGroup().getId() : null;
        String channel = chat.getChannel() == null || chat.getChannel().isBlank()
                ? "general"
                : chat.getChannel();

        return GroupChatResponse.builder()
                .id(chat.getId())
                .ChatID(chat.getId())

                .content(chat.getContent())
                .Content(chat.getContent())

                .channel(channel)
                .Channel(channel)

                .groupId(groupId)
                .GroupID(groupId)

                .userId(userId)
                .UserID(userId)

                .authorName(authorName)
                .AuthorName(authorName)

                .createdAt(chat.getCreatedAt())
                .CreatedAt(chat.getCreatedAt())
                .build();
    }

    private GroupJoinRequestResponse toJoinRequestResponse(GroupMember member) {
        StudyGroup group = member.getGroup();
        User user = member.getUser();

        return GroupJoinRequestResponse.builder()
                .id(member.getId())
                .MemberID(member.getId())

                .groupId(group != null ? group.getId() : null)
                .GroupID(group != null ? group.getId() : null)

                .groupName(group != null ? group.getName() : null)
                .GroupName(group != null ? group.getName() : null)

                .userId(user != null ? user.getId() : null)
                .UserID(user != null ? user.getId() : null)

                .username(user != null ? user.getUsername() : null)
                .Username(user != null ? user.getUsername() : null)

                .fullName(user != null ? user.getFullName() : null)
                .FullName(user != null ? user.getFullName() : null)

                .email(user != null ? user.getEmail() : null)
                .Email(user != null ? user.getEmail() : null)

                .status(member.getStatus())
                .Status(member.getStatus())

                .joinedAt(member.getJoinedAt())
                .JoinedAt(member.getJoinedAt())

                .build();
    }
}