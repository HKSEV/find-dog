package com.hbk;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(locations = "classpath:admin-test.properties")
class DogBackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
