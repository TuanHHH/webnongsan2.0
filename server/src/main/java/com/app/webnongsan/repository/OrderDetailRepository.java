package com.app.webnongsan.repository;

import com.app.webnongsan.domain.OrderDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;


import java.util.List;
@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail,Long>, JpaSpecificationExecutor<OrderDetail> {

    Page<OrderDetail> findByOrderId(long orderId, Pageable pageable);
}

