package com.app.webnongsan.service;

import com.app.webnongsan.domain.Feedback;
import com.app.webnongsan.domain.Product;
import com.app.webnongsan.domain.User;
import com.app.webnongsan.domain.response.PaginationDTO;
import com.app.webnongsan.domain.response.feedback.FeedbackDTO;
import com.app.webnongsan.domain.response.product.ResProductDTO;
import com.app.webnongsan.repository.FeedbackRepository;
import com.app.webnongsan.repository.ProductRepository;
import com.app.webnongsan.repository.UserRepository;
import com.app.webnongsan.util.SecurityUtil;
import com.app.webnongsan.util.exception.ResourceInvalidException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Feedback addFeedback(FeedbackDTO feedbackDTO) throws ResourceInvalidException {
        User u = userRepository.findById(feedbackDTO.getUserId()).orElseThrow(() -> new ResourceInvalidException("User không tồn tại"));
        if (u == null) throw new ResourceInvalidException("User không tồn tại");

        Product p = productRepository.findById(feedbackDTO.getProductId()).orElseThrow(() -> new ResourceInvalidException("Sản phẩm không tồn tại"));

        boolean exists = this.feedbackRepository.existsByUserIdAndProductId(u.getId(), p.getId());

        Feedback f;
        if (!exists) {
            f = new Feedback();
            f.setProduct(p);
            f.setUser(u);
            f.setDescription(feedbackDTO.getDescription());
            f.setStatus(0);
            f.setRatingStar(feedbackDTO.getRatingStar());
            this.feedbackRepository.save(f);
        } else {
            f = feedbackRepository.findByUserIdAndProductId(u.getId(), p.getId());
            f.setDescription(feedbackDTO.getDescription());
            f.setRatingStar(feedbackDTO.getRatingStar());
            this.feedbackRepository.save(f);
        }
        double averageRating = feedbackRepository.calculateAverageRatingByProductId(p.getId());
        p.setRating(averageRating);
        productRepository.save(p);

        return f;
    }

    public boolean checkValidFeedbackId(long id) {
        return this.feedbackRepository.existsById(id);
    }
    public long getTotalFeedbacksByProductId(Long productId){
        return this.feedbackRepository.countByProductId(productId);
    }
    public PaginationDTO getAll(Specification<Feedback> spec, Pageable pageable){
        Page<Feedback> feedbackPage = this.feedbackRepository.findAll(spec,pageable);

        PaginationDTO p = new PaginationDTO();
        PaginationDTO.Meta meta = new PaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber()+1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(feedbackPage.getTotalPages());
        meta.setTotal(feedbackPage.getTotalElements());

        p.setMeta(meta);

        List<FeedbackDTO> listFeedbacks = feedbackPage.getContent().stream().map(this::convertToFeedbackDTO).toList();
        p.setResult(listFeedbacks);
        return p;

    }
    public PaginationDTO getByProductId(Long productId, Pageable pageable) {
        Page<Feedback> feedbackPage = this.feedbackRepository.findByProductId(productId, pageable);

        PaginationDTO p = new PaginationDTO();
        PaginationDTO.Meta meta = new PaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(feedbackPage.getTotalPages());
        meta.setTotal(feedbackPage.getTotalElements());

        p.setMeta(meta);

        List<FeedbackDTO> listFeedback = feedbackPage.getContent().stream()
                .map(this::convertToFeedbackDTO).toList();
        p.setResult(listFeedback);
        return p;
    }
    public FeedbackDTO convertToFeedbackDTO(Feedback feedback) {
        FeedbackDTO feedbackDTO = new FeedbackDTO();
        Optional<User> optionalUser = userRepository.findById(feedback.getUser().getId());
        User u = optionalUser.get();
        feedbackDTO.setUserId(u.getId());
        feedbackDTO.setUserName(u.getName());
        feedbackDTO.setProductId(feedback.getProduct().getId());
        feedbackDTO.setDescription(feedback.getDescription());
        feedbackDTO.setRatingStar(feedback.getRatingStar());
        feedbackDTO.setUserAvatarUrl(feedback.getUser().getAvatarUrl());
        feedbackDTO.setUpdatedAt(feedback.getUpdatedAt());
        return feedbackDTO;
    }
}
