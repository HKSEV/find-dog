package com.hbk.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

// 💡 내 동네 설정용 주소 검색 (카카오 로컬 API를 서버에서 대신 부름)
//    REST 키를 화면에 드러내지 않고, 카카오에 등록하지 않은 주소(로컬 테스트 등)에서도 쓸 수 있게
@Service
public class GeoService {
    private static final String KAKAO_LOCAL = "https://dapi.kakao.com/v2/local";

    private final RestClient client;

    public GeoService(@Value("${KAKAO_REST_API_KEY:}") String restKey) {
        this.client = RestClient.builder()
                .baseUrl(KAKAO_LOCAL)
                .defaultHeader("Authorization", "KakaoAK " + restKey)
                .build();
    }

    // 동네·주소·장소 이름으로 찾기 (주소 검색에 없으면 장소 검색). 결과: 이름, 주소, 좌표
    public List<Map<String, Object>> search(String query){
        String text = query == null ? "" : query.trim();
        if (text.isEmpty()) return List.of();
        if (text.length() > 50) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "검색어는 50자 이내로 적어 주세요.");

        List<Map<String, Object>> results = new ArrayList<>();
        for (Map<?, ?> doc : documents(get("/search/address.json?size=10&query={q}", text))) {
            Map<?, ?> region = doc.get("address") instanceof Map<?, ?> map ? map : Map.of();
            String label = firstNonBlank(str(region.get("region_3depth_h_name")), str(region.get("region_3depth_name")), str(doc.get("address_name")));
            results.add(place(label, str(doc.get("address_name")), num(doc.get("y")), num(doc.get("x"))));
        }
        if (results.isEmpty()) {
            for (Map<?, ?> doc : documents(get("/search/keyword.json?size=10&query={q}", text))) {
                String address1 = firstNonBlank(str(doc.get("road_address_name")), str(doc.get("address_name")));
                results.add(place(str(doc.get("place_name")), address1, num(doc.get("y")), num(doc.get("x"))));
            }
        }
        return results;
    }

    // 좌표 -> 동네 이름 (현재 위치로 설정할 때)
    public Map<String, Object> region(double lat, double lng){
        if (lat < 32 || lat > 39.5 || lng < 124 || lng > 132) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "한국 안의 위치만 쓸 수 있어요.");
        for (Map<?, ?> doc : documents(get("/geo/coord2regioncode.json?x={x}&y={y}", lng, lat))) {
            if ("H".equals(str(doc.get("region_type")))) {
                return place(str(doc.get("region_3depth_name")), str(doc.get("address_name")), lat, lng);
            }
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "이 위치의 동네를 찾지 못했어요.");
    }

    private Map<?, ?> get(String uri, Object... params){
        try {
            Map<?, ?> body = client.get().uri(uri, params).retrieve().body(Map.class);
            return body == null ? Map.of() : body;
        } catch (Exception error) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "주소를 찾지 못했어요. 잠시 후 다시 시도해 주세요.", error);
        }
    }

    private static List<Map<?, ?>> documents(Map<?, ?> body){
        List<Map<?, ?>> list = new ArrayList<>();
        if (body.get("documents") instanceof List<?> docs) {
            for (Object doc : docs) if (doc instanceof Map<?, ?> map) list.add(map);
        }
        return list;
    }

    private static String str(Object value){
        return value == null ? "" : value.toString();
    }

    private static double num(Object value){
        try {
            return Double.parseDouble(str(value));
        } catch (NumberFormatException error) {
            return 0;
        }
    }

    private static Map<String, Object> place(String label, String address, double lat, double lng){
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("label", label);
        map.put("address", address);
        map.put("lat", lat);
        map.put("lng", lng);
        return map;
    }

    private static String firstNonBlank(String... values){
        for (String value : values) if (value != null && !value.isBlank()) return value;
        return "";
    }
}
