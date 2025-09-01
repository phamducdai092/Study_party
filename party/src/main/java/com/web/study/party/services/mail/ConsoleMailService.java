package com.web.study.party.services.mail;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Primary
@RequiredArgsConstructor
public class ConsoleMailService implements MailService {

    private final JavaMailSender mailSender;
    private final MailProps props;

    @Override
    public void send(String to, String subject, String html) {
        if (!props.isEnabled()) {
            log.info("[MAIL-DISABLED] to={} subject={} html={}", to, subject, html);
            return;
        }
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            // multipart=true để support HTML + inline content
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(props.getFrom());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true); // true = HTML
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Send mail failed: to={}, subject={}, err={}", to, subject, e.toString());
            // tuỳ m: có thể ném RuntimeException để BE báo lỗi
            throw new IllegalStateException("Không gửi được email, thử lại sau.");
        }
    }

    @Override
    public void sendOtp(String to, String purpose, String otp, int ttlSeconds) {
        String subject = "[YourApp] " + purpose;
        String html = """
                <div style="font-family:Arial,Helvetica,sans-serif; max-width:560px">
                  <h2>%(purpose)s</h2>
                  <p>Mã OTP của bạn là:</p>
                  <div style="font-size:28px;font-weight:700;letter-spacing:4px;margin:12px 0;">%(otp)s</div>
                  <p>Mã sẽ hết hạn sau <b>%(ttl)s phút</b>. Nếu không phải bạn yêu cầu, hãy bỏ qua email này.</p>
                  <hr/>
                  <p style="color:#888;font-size:12px">YourApp • Đây là email tự động, vui lòng không trả lời.</p>
                </div>
                """
                .replace("%(purpose)s", purpose)
                .replace("%(otp)s", otp)
                .replace("%(ttl)s", String.valueOf(Math.max(1, ttlSeconds / 60)));

        send(to, subject, html);
    }
}
