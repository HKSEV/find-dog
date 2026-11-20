package com.hbk.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

// 💡 사진 업로드 공통: 실제 사진 파일(PNG·JPG·GIF·WEBP)만 받고, 파일 이름은 서버가 새로 지음
//    - 브라우저가 보낸 Content-Type 만 믿지 않고 파일 앞부분(매직 바이트)으로 진짜 사진인지 확인
//    - 원래 파일 이름·확장자를 쓰지 않음 (.html·.svg 같은 파일이 /uploads 로 올라가 열리지 않게)
public final class ImageUploads {
    private ImageUploads() {}

    // 진짜 사진이면 확장자(png/jpg/gif/webp), 아니면 null
    public static String extensionOf(MultipartFile file) {
        if (file == null || file.isEmpty()) return null;
        byte[] head = new byte[12];
        int read;
        try (InputStream in = file.getInputStream()) {
            read = in.readNBytes(head, 0, head.length);
        } catch (IOException e) {
            return null;
        }
        if (read >= 8 && (head[0] & 0xFF) == 0x89 && head[1] == 'P' && head[2] == 'N' && head[3] == 'G') return "png";
        if (read >= 3 && (head[0] & 0xFF) == 0xFF && (head[1] & 0xFF) == 0xD8 && (head[2] & 0xFF) == 0xFF) return "jpg";
        if (read >= 6 && head[0] == 'G' && head[1] == 'I' && head[2] == 'F' && head[3] == '8') return "gif";
        if (read >= 12 && head[0] == 'R' && head[1] == 'I' && head[2] == 'F' && head[3] == 'F'
                && head[8] == 'W' && head[9] == 'E' && head[10] == 'B' && head[11] == 'P') return "webp";
        return null;
    }

    // uploads 폴더에 새 이름으로 저장하고 "/uploads/이름" 을 돌려줌 (사진이 아니면 IllegalArgumentException)
    public static String save(MultipartFile file, String prefix) throws IOException {
        String extension = extensionOf(file);
        if (extension == null) throw new IllegalArgumentException("not an image");
        String filename = prefix + "_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + "." + extension;
        Path path = Paths.get(System.getProperty("user.dir"), "uploads", filename);
        Files.createDirectories(path.getParent());
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, path, StandardCopyOption.REPLACE_EXISTING); // 힙에 통째로 올리지 않고 바로 파일로
        }
        return "/uploads/" + filename;
    }
}
