package com.app.webnongsan.controller;

import com.app.webnongsan.domain.Order;

import com.app.webnongsan.domain.OrderDetail;
import com.app.webnongsan.domain.Product;
import com.app.webnongsan.domain.response.PaginationDTO;
import com.app.webnongsan.domain.response.feedback.FeedbackDTO;
import com.app.webnongsan.domain.response.order.OrderDTO;
import com.app.webnongsan.service.OrderDetailService;
import com.app.webnongsan.service.OrderService;
import com.app.webnongsan.service.ProductService;
import com.app.webnongsan.util.exception.ResourceInvalidException;
import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.*;
import com.app.webnongsan.util.annotation.ApiMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import com.turkraft.springfilter.boot.Filter;

import java.util.List;
import java.time.Instant;
import java.util.Optional;

import com.app.webnongsan.domain.response.RestResponse;
import com.app.webnongsan.domain.response.order.OrderDetailDTO;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("api/v2")
@AllArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final OrderDetailService orderDetailService;
    private final ProductService productService;

    @GetMapping("allOrders")
    @ApiMessage("Get all Orders")
    public ResponseEntity<PaginationDTO> getAll(@Filter Specification<Order> spec, Pageable pageable){
        return ResponseEntity.ok(this.orderService.getAll(spec, pageable));
    }

    @GetMapping("orderInfo/{orderId}")
    @ApiMessage("Get order information")
    public ResponseEntity<Optional<OrderDTO>> getOrderInfor(@PathVariable("orderId") long orderId){
        return ResponseEntity.ok(this.orderService.findOrder(orderId));
    }

    @GetMapping("overviewOrder")
    @ApiMessage("Get order for overview page")
    public ResponseEntity<List<OrderDTO>> getLastFiveOrders(){
        return ResponseEntity.ok(this.orderService.getLastFiveOrders());
    }

    @GetMapping("updateOrderStatus/{orderId}")
    @ApiMessage("Update order status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam("status") int status){

        Order order = this.orderService.get(orderId);
        order.setStatus(status);
        if (status == 2 || status == 3) {
            order.setDeliveryTime(Instant.now());
        }
        if (status == 3) { //Hủy đơn hàng thì lấy hết tất cả số lượng sản phẩm của orderDetail từ orderId trả về số lượng sản phẩm
            List<OrderDetail> orderDetails = this.orderDetailService.findByOrderId(orderId);

            for (OrderDetail orderDetail : orderDetails) {
                Product p = orderDetail.getProduct();
                p.setQuantity(p.getQuantity()+orderDetail.getQuantity());
                this.productService.update(p);
            }

        }
        OrderDTO o = new OrderDTO();
        o.setId(orderId);
        o.setStatus(status);
        o.setOrderTime(order.getOrderTime());
        o.setDeliveryTime(order.getDeliveryTime());
        this.orderService.save((order));
        return ResponseEntity.ok(o);
        }
    @PostMapping("checkout")
    @ApiMessage("Create a checkout payment")
    public ResponseEntity<RestResponse<Long>> create(
            @RequestParam("userId") Long userId,
            @RequestParam("address") String address,
            @RequestParam("phone") String phone,
            @RequestParam("paymentMethod") String paymentMethod,
            @RequestParam("totalPrice") Double totalPrice,
            @RequestPart("items") List<OrderDetailDTO> items
    ) throws ResourceInvalidException{
        RestResponse<Long> response = new RestResponse<>();
        try {
            OrderDTO orderDTO = new OrderDTO();
            orderDTO.setUserId(userId);
            orderDTO.setAddress(address);
            orderDTO.setPhone(phone);
            orderDTO.setPaymentMethod(paymentMethod);
            orderDTO.setTotalPrice(totalPrice);
            orderDTO.setItems(items);
            Order order = orderService.create(orderDTO);

            response.setData(order.getId());
            response.setStatusCode(HttpStatus.CREATED.value());
            response.setMessage("Thanh toán thành công");

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }catch (ResourceInvalidException e) {
            response.setStatusCode(HttpStatus.BAD_REQUEST.value());
            response.setError(e.getMessage());
            response.setMessage("Có lỗi xảy ra: thông tin người dùng không hợp lệ");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.setError(e.getMessage());
            response.setMessage("Có lỗi xảy ra trong quá trình thanh toán");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("orders")
    @ApiMessage("Get orders by user")
    public ResponseEntity<PaginationDTO> getOrderByUser(
            Pageable pageable,
            @RequestParam(value = "status", required = false) Integer status
    ) throws ResourceInvalidException {
        return ResponseEntity.ok(this.orderService.getOrderByCurrentUser(pageable, status));
    }

    @GetMapping("totalSuccessOrder")
    @ApiMessage("Get total price and count of all successful orders")
    public ResponseEntity<double[]> getTotalPriceOfSuccessfulOrders() {
        double[] totals = this.orderService.getTotalSuccessOrder();
        return ResponseEntity.ok(totals);
    }

}
