package com.hbk.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Member {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	/*카카오 가입자는 이메일이 없을 수도 있으므로 nullable = true 로 변경하거나,
	소셜 로그인 아이디(고유번호)를 저장할 컬럼을 추가합니다.
	*/
	@Column(unique = true)
	private String email;

	@Column(unique = true, nullable = false)
	private String nickname;

	@Column(nullable = false)
	private String password;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String phone;

	@Column(length = 500)
	private String address;
	// 카카오 회원은 비밀번호가 없으므로 null 허용으로 변경합니다.
	@Column(nullable = false)
	private String userType;

	private boolean marketingAgreed;

	private String provider;
	//카카오에서 넘겨주는 고유 회원번호
	private String providerId;

	private String profileImageUrl;

	// 💡 이용 정지 (관리자 > 회원 관리). 정지되면 로그인할 수 없고, 가지고 있던 로그인도 풀림
	@Column(nullable = false)
	private boolean suspended = false;

	@Column(length = 255)
	private String suspendedReason;

	private java.time.LocalDateTime suspendedAt;

	// 💡 회원 탈퇴한 때 (탈퇴하면 개인정보를 지우고 이 값만 남김)
	private java.time.LocalDateTime withdrawnAt;

	public String getUsername(){
		return this.name;
	}

}
