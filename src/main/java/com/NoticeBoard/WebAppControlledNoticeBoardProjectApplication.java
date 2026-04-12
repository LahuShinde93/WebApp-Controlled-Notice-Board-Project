package com.noticeboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class WebAppControlledNoticeBoardProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebAppControlledNoticeBoardProjectApplication.class, args);
		System.out.println("\n========================================");
		System.out.println("🚀 Smart Notice Board API is running!");
		System.out.println("📍 Server: http://localhost:8080");
		System.out.println("📚 API Docs: http://localhost:8080/api");
		System.out.println("========================================\n");
	}

}
