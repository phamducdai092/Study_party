package com.web.utils.socket;

import com.web.socket.SocketMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class SocketNotificationAspect {

    private final SimpMessagingTemplate messagingTemplate;
    private final ExpressionParser parser = new SpelExpressionParser();

    // Pointcut: Chạy sau khi bất kỳ hàm nào có gắn @SocketNotify trả về thành công
    // returning = "result": Lấy giá trị return của hàm đặt tên là 'result'
    @AfterReturning(pointcut = "@annotation(socketNotify)", returning = "result")
    public void handleSocketNotification(SocketNotify socketNotify, Object result) {
        if (result == null) return;
        try {
            // 1. Giải mã SpEL để lấy Topic chuẩn
            // Context chứa biến #result chính là giá trị return của hàm
            StandardEvaluationContext context = new StandardEvaluationContext();
            context.setVariable("result", result);
            String topic = parser.parseExpression(socketNotify.topic()).getValue(context, String.class);
            // 2. Tạo Message
            SocketMessage message = SocketMessage.builder()
                    .type(socketNotify.type())
                    .payload(result) // Mặc định lấy luôn kết quả trả về làm payload
                    .build();
            log.info("📢 AOP TRYING TO SEND: Topic=[{}] Type=[{}] Payload=[{}]",
                    topic, socketNotify.type(), result);
            // 3. Bắn tin
            messagingTemplate.convertAndSend(topic, message);
            
            log.info("📡 Auto-sent Socket Msg [{}] to [{}]", socketNotify.type(), topic);

        } catch (Exception e) {
            log.error("Failed to send auto socket notification: {}", e.getMessage());
            // Không throw exception để tránh làm rollback transaction chính
        }
    }
}