package com.web.services.account;


import com.web.dto.request.verify.*;

public interface AccountService {

    void requestVerifyEmail(VerifyEmailRequest req);
    void confirmVerifyEmail(ConfirmVerifyEmailRequest req);

    void forgotPassword(ForgotPasswordRequest req);
    void resetPassword(ResetPasswordRequest req);

    void changePassword(String email, ChangePasswordRequest req);
}
