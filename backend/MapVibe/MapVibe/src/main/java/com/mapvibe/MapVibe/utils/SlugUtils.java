package com.mapvibe.MapVibe.utils;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public class SlugUtils {
    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    public static String makeSlug(String input) {
        if (input == null) return null;

        // Chuyển chữ có dấu tiếng Việt thành không dấu
        String noWhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(noWhitespace, Normalizer.Form.NFD);
        String slug = Pattern.compile("\\p{InCombiningDiacriticalMarks}+").matcher(normalized).replaceAll("");

        // Chuyển chữ Đ thành d
        slug = slug.replaceAll("[đĐ]", "d");

        // Chuyển về chữ thường, xóa các ký tự đặc biệt không phải chữ/số/gạch ngang
        slug = NONLATIN.matcher(slug.toLowerCase(Locale.ENGLISH)).replaceAll("");

        // Loại bỏ các dấu gạch ngang liên tiếp (ví dụ: ca--phe -> ca-phe) và gạch ngang ở đầu/cuối
        slug = slug.replaceAll("-+", "-").replaceAll("^-|-$", "");

        return slug;
    }
}
