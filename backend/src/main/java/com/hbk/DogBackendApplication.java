package com.hbk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class DogBackendApplication {

	public static void main(String[] args) {
		// 서버(Render)는 UTC라서 작성 시각이 9시간 어긋남 -> 한국 시간으로 고정
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
		SpringApplication.run(DogBackendApplication.class, args);
	}

}
