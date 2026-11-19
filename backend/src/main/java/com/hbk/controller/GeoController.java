package com.hbk.controller;

import com.hbk.service.GeoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// 💡 내 동네 설정: 주소 검색, 현재 위치 -> 동네 이름
@RestController
@RequestMapping("/api/geo")
@RequiredArgsConstructor
public class GeoController {
    private final GeoService geoService;

    // GET /api/geo/search?query=망원동
    @GetMapping("/search")
    public List<Map<String, Object>> search(@RequestParam String query){
        return geoService.search(query);
    }

    // GET /api/geo/region?lat=37.55&lng=126.90
    @GetMapping("/region")
    public Map<String, Object> region(@RequestParam double lat, @RequestParam double lng){
        return geoService.region(lat, lng);
    }
}
