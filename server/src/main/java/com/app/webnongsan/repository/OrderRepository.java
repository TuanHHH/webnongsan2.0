package com.app.webnongsan.repository;
import com.app.webnongsan.domain.Order;
import com.app.webnongsan.domain.response.cart.CartItemDTO;
import com.app.webnongsan.domain.response.order.OrderDetailDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    @Query("SELECT new com.app.webnongsan.domain.response.order.OrderDetailDTO" +
            "(p.id, p.productName, od.quantity, od.unit_price, p.imageUrl, p.category.name, o.id, o.orderTime, o.status) " +
            "FROM OrderDetail od JOIN od.order o JOIN od.product p " +
            "WHERE o.user.id = :userId "+
            "AND (:status IS NULL OR o.status = :status) " +
            "ORDER BY o.orderTime DESC ")
    Page<OrderDetailDTO> findOrderItemsByUserId(
            @Param("userId") Long userId,
            @Param("status") Integer status,
            Pageable pageable);
}

//SELECT *
//FROM webnongsan.order_detail od
//JOIN webnongsan.orders o ON od.order_id = o.id
//JOIN webnongsan.products p ON od.product_id = p.id
//WHERE o.user_id = 2;

