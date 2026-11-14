package com.mapvibe.MapVibe.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {

    // ==========================================================
    // System
    // ==========================================================

    UNCATEGORIZED_EXCEPTION(
            1000,
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Đã xảy ra lỗi hệ thống."
    ),

    INVALID_KEY(
            1001,
            HttpStatus.BAD_REQUEST,
            "Mã lỗi không hợp lệ."
    ),

    // ==========================================================
    // Authentication
    // ==========================================================

    UNAUTHENTICATED(
            2000,
            HttpStatus.UNAUTHORIZED,
            "Vui lòng đăng nhập."
    ),

    UNAUTHORIZED(
            2001,
            HttpStatus.FORBIDDEN,
            "Bạn không có quyền thực hiện chức năng này."
    ),

    INVALID_CREDENTIALS(
            2002,
            HttpStatus.UNAUTHORIZED,
            "Email hoặc mật khẩu không chính xác."
    ),

    // ==========================================================
    // User
    // ==========================================================

    USER_NOT_FOUND(
            3000,
            HttpStatus.NOT_FOUND,
            "Không tìm thấy người dùng."
    ),

    EMAIL_ALREADY_EXISTS(
            3001,
            HttpStatus.BAD_REQUEST,
            "Email đã được sử dụng."
    ),

    USER_ACCOUNT_SUSPENDED(
            3002,
            HttpStatus.FORBIDDEN,
            "Your account has been suspended."
    ),

    CANNOT_SUSPEND_SELF(
            3003,
            HttpStatus.FORBIDDEN,
            "CANNOT SUSPEND SELF."
    ),

    // ==========================================================
    // Validation
    // ==========================================================

    VALIDATION_FAILED(
            4000,
            HttpStatus.BAD_REQUEST,
            "Please double-check the information."
    ),

    FIELD_REQUIRED(
            4001,
            HttpStatus.BAD_REQUEST,
            "This field is required."
    ),

    NAME_REQUIRED(
            4002,
            HttpStatus.BAD_REQUEST,
            "Vui lòng nhập họ tên."
    ),

    EMAIL_REQUIRED(
            4003,
            HttpStatus.BAD_REQUEST,
            "Vui lòng nhập email."
    ),

    EMAIL_INVALID(
            4004,
            HttpStatus.BAD_REQUEST,
            "Email không hợp lệ."
    ),

    PASSWORD_REQUIRED(
            4005,
            HttpStatus.BAD_REQUEST,
            "Vui lòng nhập mật khẩu."
    ),

    PASSWORD_TOO_SHORT(
            4006,
            HttpStatus.BAD_REQUEST,
            "Mật khẩu phải có ít nhất 8 ký tự."
    ),

    CURRENT_PASSWORD_REQUIRED(
            4007,
            HttpStatus.BAD_REQUEST,
            "Vui lòng nhập mật khẩu hiện tại."
    ),

    CURRENT_PASSWORD_INCORRECT(
            4008,
            HttpStatus.BAD_REQUEST,
            "Mật khẩu hiện tại không chính xác."
    ),

    NEW_PASSWORD_MUST_BE_DIFFERENT(
            4009,
            HttpStatus.BAD_REQUEST,
            "New password must be different from the current password."
    ),

    // ==========================================================
    // Cloudinary
    // ==========================================================

    UPLOAD_FILE_FAILED(
            5000,
            HttpStatus.BAD_REQUEST,
            "Không thể tải ảnh lên."
    ),

    DELETE_FILE_FAILED(
            5001,
            HttpStatus.BAD_REQUEST,
            "Không thể xóa ảnh."
    ),

    // ==========================================================
    // Role
    // ==========================================================

    ROLE_NOT_FOUND(
            6000,
            HttpStatus.NOT_FOUND,
            "Không tìm thấy vai trò."
    ),

    ROLE_ALREADY_EXISTS(
            6001,
            HttpStatus.BAD_REQUEST,
            "Vai trò đã tồn tại."
    ),

    CANNOT_UPDATE_OWN_ROLE(
            6002,
            HttpStatus.FORBIDDEN,
            "CANNOT UPDATE OWN ROLE."
    ),

    CANNOT_MODIFY_SUPER_ADMIN(
            6003,
            HttpStatus.FORBIDDEN,
            "CANNOT MODIFY SUPER ADMIN."
    ),

    CANNOT_ASSIGN_SUPER_ADMIN(
            6004,
            HttpStatus.FORBIDDEN,
            "CANNOT ASSIGN SUPER ADMIN."
    ),

    ONLY_SUPER_ADMIN_CAN_ASSIGN_ADMIN(
            6005,
            HttpStatus.FORBIDDEN,
            "ONLY SUPER ADMIN CAN ASSIGN ADMIN."
    ),

    ONLY_SUPER_ADMIN_CAN_MANAGE_ADMIN(
            6006,
            HttpStatus.FORBIDDEN,
            "ONLY SUPER ADMIN CAN MANAGE ADMIN."
    ),

    CANNOT_REMOVE_LAST_ADMIN(
            6007,
            HttpStatus.CONFLICT,
            "CANNOT REMOVE LAST ADMIN."
    ),

    SYSTEM_ROLE_RESERVED(
            6008,
            HttpStatus.CONFLICT,
            "SYSTEM ROLE RESERVED."
    ),

    SYSTEM_ROLE_CANNOT_BE_MODIFIED(
            6007,
            HttpStatus.CONFLICT,
            "SYSTEM ROLE CANNOT BE MODIFIED."
    ),

    SYSTEM_ROLE_CANNOT_BE_DELETED(
            6007,
            HttpStatus.CONFLICT,
            "SYSTEM ROLE CANNOT BE DELETED."
    ),

    ROLE_IN_USE(
            6007,
            HttpStatus.CONFLICT,
            "ROLE IN USE."
    ),

    // ==========================================================
    // Permission
    // ==========================================================

    PERMISSION_NOT_FOUND(
            7000,
            HttpStatus.NOT_FOUND,
            "Không tìm thấy quyền."
    ),

    PERMISSION_ALREADY_EXISTS(
            7001,
            HttpStatus.BAD_REQUEST,
            "Quyền đã tồn tại."
    ),

    PERMISSION_IN_USE(
            7002,
            HttpStatus.CONFLICT,
            "PERMISSION IN USE."
    ),

    // ==========================================================
    // Location
    // ==========================================================

    LOCATION_NOT_FOUND(
            8000,
            HttpStatus.NOT_FOUND,
            "Không tìm thấy địa điểm."
    ),

    LOCATION_ALREADY_EXISTS(
            8001,
            HttpStatus.BAD_REQUEST,
            "Địa điểm đã tồn tại."
    ),

    LOCATION_NAME_REQUIRED(
            8002,
            HttpStatus.BAD_REQUEST,
            "Vui lòng nhập tên địa điểm."
    ),

    LOCATION_CATEGORY_REQUIRED(
            8003,
            HttpStatus.BAD_REQUEST,
            "Vui lòng chọn danh mục."
    ),

    LOCATION_ADDRESS_REQUIRED(
            8004,
            HttpStatus.BAD_REQUEST,
            "Vui lòng nhập địa chỉ."
    ),

    PRICING_CATEGORY_TITLE_REQUIRED(
            8005,
            HttpStatus.BAD_REQUEST,
            "Vui lòng nhập tên danh mục giá."
    ),

    PRICING_ITEM_TITLE_REQUIRED(
            8006,
            HttpStatus.BAD_REQUEST,
            "Vui lòng nhập tên mục giá."
    ),

    PRICING_ITEM_PRICE_REQUIRED(
            8007,
            HttpStatus.BAD_REQUEST,
            "Vui lòng nhập giá."
    ),

    PRICING_ITEM_NOT_FOUND(
            8008,
            HttpStatus.BAD_REQUEST,
            "Không tìm thấy Item"
    ),

    PRICING_CATEGORY_NOT_FOUND(
            8009,
            HttpStatus.BAD_REQUEST,
            "Không tìm thấy Category"
    ),

    OPENING_HOUR_TIME_REQUIRED(
            8010,
            HttpStatus.BAD_REQUEST,
            "Vui lòng nhập giờ"
    ),

    OPENING_HOUR_INVALID(
            8011,
            HttpStatus.BAD_REQUEST,
            "Giờ mở cửa không hợp lệ"
    ),

    LOCATION_PROVINCE_REQUIRED(
            8012,
            HttpStatus.BAD_REQUEST,
            "Vui lòng chọn tỉnh/thành phố."
    ),

    LOCATION_WARD_REQUIRED(
            8013,
            HttpStatus.BAD_REQUEST,
            "Vui lòng chọn phường/xã."
    ),

    LOCATION_WARD_INVALID(
            8014,
            HttpStatus.BAD_REQUEST,
            "Phường/xã không thuộc tỉnh/thành phố đã chọn."
    ),

    LOCATION_LATITUDE_INVALID(
            8015,
            HttpStatus.BAD_REQUEST,
            "LATITUDE không hợp lệ."
    ),

    LOCATION_LONGITUDE_INVALID(
            8016,
            HttpStatus.BAD_REQUEST,
            "LONGITUDE không hợp lệ."
    ),

    LOCATION_COORDINATES_INVALID(
            8017,
            HttpStatus.BAD_REQUEST,
            "Vĩ độ và kinh độ phải được cung cấp đồng thời."
    ),

    LOCATION_COORDINATES_REQUIRED(
            8018,
            HttpStatus.BAD_REQUEST,
            "Vui lòng xác định vị trí trên bản đồ."
    ),

    LOCATION_SEARCH_COORDINATES_INVALID(
            8019,
            HttpStatus.BAD_REQUEST,
            "Tọa độ tìm kiếm không hợp lệ."
    ),

    LOCATION_SEARCH_RADIUS_INVALID(
            8020,
            HttpStatus.BAD_REQUEST,
            "Bán kính tìm kiếm phải lớn hơn 0."
    ),

    // ==========================================================
    // Category
    // ==========================================================

    CATEGORY_NOT_FOUND(
            9000,
            HttpStatus.NOT_FOUND,
            "Không tìm thấy danh mục."
    ),

    CATEGORY_ALREADY_EXISTS(
            9001,
            HttpStatus.BAD_REQUEST,
            "Danh mục đã tồn tại."
    ),

    CATEGORY_IN_USE(
            9002,
            HttpStatus.CONFLICT,
            "Cannot delete a category that is assigned to locations."
    ),

    // ==========================================================
    // Amenity
    // ==========================================================

    AMENITY_NOT_FOUND(
            10000,
            HttpStatus.NOT_FOUND,
            "Không tìm thấy tiện ích."
    ),

    AMENITY_ALREADY_EXISTS(
            10001,
            HttpStatus.BAD_REQUEST,
            "Tiện ích đã tồn tại."
    ),

    AMENITY_IN_USE(
            10002,
            HttpStatus.CONFLICT,
            "Cannot delete a amenity that is assigned to locations."
    ),

    // ==========================================================
    // Review
    // ==========================================================

    REVIEW_NOT_FOUND(
            11000,
            HttpStatus.NOT_FOUND,
            "Không tìm thấy đánh giá."
    ),

    INVALID_LOCATION_REVIEW(
            11001,
            HttpStatus.BAD_REQUEST,
            "Đánh giá không thuộc địa điểm này."
    ),

    REVIEW_RATING_REQUIRED(
            11002,
            HttpStatus.BAD_REQUEST,
            "Vui lòng để lại số sao đánh giá."
    ),

    REVIEW_RATING_INVALID(
            11003,
            HttpStatus.BAD_REQUEST,
            "Số sao không hợp lệ."
    ),

    REVIEW_ALREADY_EXISTS(
            11004,
            HttpStatus.BAD_REQUEST,
            "Bạn đã đánh giá địa điểm này rồi."
    ),

    // ==========================================================
    // Administrative
    // ==========================================================

    PROVINCE_NOT_FOUND(
            12000,
            HttpStatus.NOT_FOUND,
            "Không tìm thấy tỉnh/thành phố."
    ),

    WARD_NOT_FOUND(
            12001,
            HttpStatus.NOT_FOUND,
            "Không tìm thấy phường/xã."
    ),

    // ==========================================================
    // MapVina
    // ==========================================================

    MAPVINA_LOCATION_NOT_FOUND(
            13000,
            HttpStatus.NOT_FOUND,
            "Không tìm thấy vị trí từ địa chỉ đã nhập."
    ),

    MAPVINA_SEARCH_FAILED(
            13001,
            HttpStatus.BAD_GATEWAY,
            "Không thể xác định vị trí từ địa chỉ."
    ),

    // ==========================================================
    // Admin
    // ==========================================================

    ADMIN_LISTING_STATUS_INVALID(
            14000,
            HttpStatus.BAD_REQUEST,
            "Trạng thái listing không hợp lệ."
    ),

    // ==========================================================
    // Email
    // ==========================================================

    INVALID_EMAIL_VERIFICATION_TOKEN(
            15000,
            HttpStatus.BAD_REQUEST,
            "Invalid Email Verification Token."
    ),

    EMAIL_VERIFICATION_TOKEN_EXPIRED(
            15001,
            HttpStatus.BAD_REQUEST,
            "Email Verification Token Expired."
    ),

    EMAIL_NOT_VERIFIED(
            15002,
            HttpStatus.BAD_REQUEST,
            "Email Not Verified."
    ),
    ;

    int code;
    HttpStatusCode statusCode;
    String message;
}
