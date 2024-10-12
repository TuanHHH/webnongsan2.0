package com.app.webnongsan.repository;

import com.app.webnongsan.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    boolean existsByCategoryId(Long categoryId);

    @Query("SELECT MAX(p.price) FROM Product p " +
            "WHERE (:category IS NULL OR p.category.name = :category) " +
            "AND (:productName IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :productName, '%')))")
    double getMaxPriceByCategoryAndProductName(@Param("category") String category,
                                               @Param("productName") String productName);


}
