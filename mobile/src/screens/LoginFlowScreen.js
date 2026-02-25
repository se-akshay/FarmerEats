import { useMemo, useState } from "react";
import { Alert, SafeAreaView, View } from "react-native";
import { LOGIN_STEPS, OTP_LENGTH } from "../constants/authFlow";
import authStyles from "../styles/authStyles";
import ForgotPasswordStep from "./loginSteps/ForgotPasswordStep";
import LoginStep from "./loginSteps/LoginStep";
import ResetPasswordStep from "./loginSteps/ResetPasswordStep";
import SuccessStep from "./loginSteps/SuccessStep";
import VerifyOtpStep from "./loginSteps/VerifyOtpStep";

const LOGIN_ENDPOINT = "https://sowlab.com/assignment/user/login";
const FORGOT_PASSWORD_ENDPOINT =
  "https://sowlab.com/assignment/user/forgot-password";
const VERIFY_OTP_ENDPOINT = "https://sowlab.com/assignment/user/verify-otp";
const RESET_PASSWORD_ENDPOINT =
  "https://sowlab.com/assignment/user/reset-password";

const initialForm = {
  email: "",
  password: "",
  phone: "",
  newPassword: "",
  confirmPassword: "",
};

export default function LoginFlowScreen() {
  const [step, setStep] = useState(LOGIN_STEPS.LOGIN);
  const [form, setForm] = useState(initialForm);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handlers = useMemo(
    () => ({
      goToLogin: () => setStep(LOGIN_STEPS.LOGIN),
      goToForgotPassword: () => setStep(LOGIN_STEPS.FORGOT_PASSWORD),
      goToOtp: () => setStep(LOGIN_STEPS.VERIFY_OTP),
      goToResetPassword: () => setStep(LOGIN_STEPS.RESET_PASSWORD),
      goToSuccess: () => setStep(LOGIN_STEPS.SUCCESS),
      backFromForgotPassword: () => setStep(LOGIN_STEPS.LOGIN),
      backFromOtp: () => setStep(LOGIN_STEPS.FORGOT_PASSWORD),
      backFromResetPassword: () => setStep(LOGIN_STEPS.VERIFY_OTP),
    }),
    [],
  );

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateOtp = (index, value) => {
    const normalizedValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    setOtp((prev) => {
      const nextOtp = [...prev];
      nextOtp[index] = normalizedValue;
      return nextOtp;
    });
  };

  const resetState = () => {
    setForm(initialForm);
    setOtp(Array(OTP_LENGTH).fill(""));
    setResetToken("");
    setStep(LOGIN_STEPS.LOGIN);
  };

  const handleLogin = async () => {
    if (isLoggingIn) return;

    if (!form.email.trim()) {
      Alert.alert("Login failed", "Email cannot be empty.");
      return;
    }

    if (!form.password) {
      Alert.alert("Login failed", "Password cannot be empty.");
      return;
    }

    setIsLoggingIn(true);

    try {
      const payload = {
        email: form.email.trim(),
        password: form.password,
        role: "farmer",
        device_token: "0imfnc8mVLWwsAawjYr4Rx-Af50DDqtlx",
        type: "email",
        social_id: "0imfnc8mVLWwsAawjYr4Rx-Af50DDqtlx",
      };

      const response = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        Alert.alert(
          "Login failed",
          data?.message || "Wrong password or user does not exist.",
        );
        return;
      }

      setStep(LOGIN_STEPS.SUCCESS);
    } catch (error) {
      Alert.alert("Login failed", "Unable to connect. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSendCode = async () => {
    if (isSendingOtp) return;

    if (!form.phone.trim()) {
      Alert.alert("Forgot password", "Phone number cannot be empty.");
      return;
    }

    setIsSendingOtp(true);

    try {
      const response = await fetch(FORGOT_PASSWORD_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ mobile: form.phone.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        Alert.alert(
          "Forgot password",
          data?.message || "Could not send OTP. Please try again.",
        );
        return;
      }

      Alert.alert(
        "Forgot password",
        data?.message || "OTP sent to your mobile.",
      );
      setStep(LOGIN_STEPS.VERIFY_OTP);
    } catch (error) {
      Alert.alert("Forgot password", "Unable to connect. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (isVerifyingOtp) return;

    const otpValue = otp.join("").trim();

    if (!otpValue) {
      Alert.alert("Verify OTP", "OTP cannot be empty.");
      return;
    }

    if (otpValue.length !== OTP_LENGTH) {
      Alert.alert("Verify OTP", `Please enter ${OTP_LENGTH} digit OTP.`);
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const response = await fetch(VERIFY_OTP_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ otp: otpValue }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        Alert.alert("Verify OTP", data?.message || "Invalid OTP.");
        return;
      }

      const verificationToken = String(data?.token || otpValue).trim();

      if (!verificationToken) {
        Alert.alert("Verify OTP", "Verification token is missing.");
        return;
      }

      setResetToken(verificationToken);
      Alert.alert("Verify OTP", data?.message || "OTP verified successful.");
      setStep(LOGIN_STEPS.RESET_PASSWORD);
    } catch (error) {
      Alert.alert("Verify OTP", "Unable to connect. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    if (isResettingPassword) return;

    if (!resetToken) {
      Alert.alert("Reset password", "Invalid token. Verify OTP again.");
      return;
    }

    if (!form.newPassword) {
      Alert.alert("Reset password", "Password cannot be empty.");
      return;
    }

    if (!form.confirmPassword) {
      Alert.alert("Reset password", "Confirm password cannot be empty.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      Alert.alert(
        "Reset password",
        "Password and confirm password not matched.",
      );
      return;
    }

    setIsResettingPassword(true);

    try {
      const response = await fetch(RESET_PASSWORD_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          token: resetToken,
          password: form.newPassword,
          cpassword: form.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        Alert.alert(
          "Reset password",
          data?.message ||
            "Your password reset request failed, please try again.",
        );
        return;
      }

      Alert.alert(
        "Reset password",
        data?.message || "Your password has been successfully changed.",
      );
      setStep(LOGIN_STEPS.SUCCESS);
    } catch (error) {
      Alert.alert("Reset password", "Unable to connect. Please try again.");
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <View style={authStyles.card}>
        {step === LOGIN_STEPS.LOGIN && (
          <LoginStep
            form={form}
            onChange={updateForm}
            onForgotPress={handlers.goToForgotPassword}
            onLoginPress={handleLogin}
          />
        )}

        {step === LOGIN_STEPS.FORGOT_PASSWORD && (
          <ForgotPasswordStep
            form={form}
            onChange={updateForm}
            onBack={handlers.backFromForgotPassword}
            onSendCode={handleSendCode}
          />
        )}

        {step === LOGIN_STEPS.VERIFY_OTP && (
          <VerifyOtpStep
            otp={otp}
            onOtpChange={updateOtp}
            onBack={handlers.backFromOtp}
            onSubmit={handleVerifyOtp}
            onResend={() => undefined}
          />
        )}

        {step === LOGIN_STEPS.RESET_PASSWORD && (
          <ResetPasswordStep
            form={form}
            onChange={updateForm}
            onBack={handlers.backFromResetPassword}
            onSubmit={handleResetPassword}
          />
        )}

        {step === LOGIN_STEPS.SUCCESS && (
          <SuccessStep onBackToLogin={resetState} />
        )}
      </View>
    </SafeAreaView>
  );
}
