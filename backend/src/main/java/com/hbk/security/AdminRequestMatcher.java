package com.hbk.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;

import java.util.List;
import java.util.Set;

public class AdminRequestMatcher implements RequestMatcher {
    private static final RequestMatcher ADMIN_PATH = PathPatternRequestMatcher.pathPattern("/api/admin/**");
    private static final RequestMatcher LOGIN_PATH = PathPatternRequestMatcher.pathPattern("/api/admin/login");
    private static final List<PathPatternRequestMatcher> REGISTRATION_PATHS = Set.of(
            "/api/animals/recommended", "/api/animals/parse-link", "/api/campaigns",
            "/api/youtube", "/api/fellow-news", "/api/need-help", "/api/shelter-animals"
    ).stream().map(PathPatternRequestMatcher::pathPattern).toList();

    @Override
    public boolean matches(HttpServletRequest request) {
        if ("OPTIONS".equals(request.getMethod())) return false;
        if (LOGIN_PATH.matches(request)) return false;
        if (ADMIN_PATH.matches(request)) return true;
        return !Set.of("GET", "HEAD").contains(request.getMethod())
                && REGISTRATION_PATHS.stream().anyMatch(path -> path.matches(request));
    }
}
