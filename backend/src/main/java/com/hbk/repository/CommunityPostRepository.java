package com.hbk.repository;

import com.hbk.domain.CommunityCategory;
import com.hbk.entity.CommunityPost;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {

    // 최신순 더 보기 (cursorId보다 오래된 글). category가 null이면 전체
    @Query("select p from CommunityPost p where (:cursorId is null or p.id < :cursorId) " +
            "and (:category is null or p.category = :category) order by p.id desc")
    List<CommunityPost> findPage(@Param("cursorId") Long cursorId, @Param("category") CommunityCategory category, Pageable pageable);

    // 마이 > 작성한 글
    List<CommunityPost> findByAuthorEmailOrderByIdDesc(String email);
}
