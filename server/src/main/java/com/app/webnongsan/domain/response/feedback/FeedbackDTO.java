package com.app.webnongsan.domain.response.feedback;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
public class FeedbackDTO {
    private Long userId;
    private String userName;
    private String userAvatarUrl;
    private Long productId;
    private int ratingStar;
    private String description;
    private Instant updatedAt;

    public FeedbackDTO() {
    }
}
