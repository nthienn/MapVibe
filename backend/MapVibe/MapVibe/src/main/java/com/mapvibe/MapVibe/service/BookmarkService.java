package com.mapvibe.MapVibe.service;

import com.mapvibe.MapVibe.dto.response.BookmarkResponse;
import com.mapvibe.MapVibe.dto.response.LocationMinResponse;
import com.mapvibe.MapVibe.dto.response.PageResponse;
import com.mapvibe.MapVibe.entity.Bookmark;
import com.mapvibe.MapVibe.entity.Location;
import com.mapvibe.MapVibe.entity.User;
import com.mapvibe.MapVibe.exception.AppException;
import com.mapvibe.MapVibe.exception.ErrorCode;
import com.mapvibe.MapVibe.mapper.LocationMapper;
import com.mapvibe.MapVibe.repository.BookmarkRepository;
import com.mapvibe.MapVibe.repository.LocationRepository;
import com.mapvibe.MapVibe.repository.UserRepository;
import com.mapvibe.MapVibe.security.CurrentUserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookmarkService {

    BookmarkRepository bookmarkRepository;
    LocationRepository locationRepository;
    UserRepository userRepository;
    LocationMapper locationMapper;
    CurrentUserService currentUserService;


    @PreAuthorize("hasRole('USER')")
    public BookmarkResponse toggleBookmark(Long locationId) {
        User user = currentUserService.getUser();

        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new AppException(ErrorCode.LOCATION_NOT_FOUND));

        Optional<Bookmark> existingBookmark = bookmarkRepository.findByUserIdAndLocationId(user.getId(), locationId);

        boolean bookmarked;

        if (existingBookmark.isPresent()) {
            bookmarkRepository.delete(existingBookmark.get());
            bookmarked = false;
        } else {
            Bookmark bookmark = Bookmark.builder()
                    .user(user)
                    .location(location)
                    .build();

            bookmarkRepository.save(bookmark);
            bookmarked = true;
        }

        long bookmarkCount = bookmarkRepository.countByLocationId(locationId);

        return BookmarkResponse.builder()
                .bookmarked(bookmarked)
                .bookmarkCount(bookmarkCount)
                .build();
    }

    @PreAuthorize("hasRole('USER')")
    public PageResponse<LocationMinResponse> getMyBookmarkedLocations(int page, int size) {
        Pageable pageable = PageRequest.of(
                page - 1,
                size,
                Sort.by("createdAt").descending()
        );

        Page<Bookmark> bookmarkPage = bookmarkRepository.findByUserId(currentUserService.getUserId(), pageable);

        List<LocationMinResponse> data = bookmarkPage.getContent()
                .stream()
                .map(bookmark -> {
                    LocationMinResponse response = locationMapper.toLocationMinResponse(bookmark.getLocation());
                    response.setBookmarked(true);
                    return response;
                })
                .toList();

        return PageResponse.<LocationMinResponse>builder()
                .currentPage(page)
                .totalPages(bookmarkPage.getTotalPages())
                .totalElements(bookmarkPage.getTotalElements())
                .pageSize(bookmarkPage.getSize())
                .data(data)
                .build();
    }

    public void enrichBookmarkStatus(List<LocationMinResponse> locations) {
        if (locations == null || locations.isEmpty()) return;

        String userEmail = currentUserService.getEmail();

        if (userEmail != null && !userEmail.equals("anonymousUser")) {
            userRepository.findByEmail(userEmail).ifPresent(user -> {
                List<Long> locationIds = locations.stream()
                        .map(LocationMinResponse::getId)
                        .toList();

                Set<Long> bookmarkedLocationIds = bookmarkRepository.findBookmarkedLocationIds(user.getId(), locationIds);

                locations.forEach(res -> res.setBookmarked(bookmarkedLocationIds.contains(res.getId())));
            });
        } else {
            locations.forEach(res -> res.setBookmarked(false));
        }
    }
}
