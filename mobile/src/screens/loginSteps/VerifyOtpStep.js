import { Text, TouchableOpacity } from "react-native";
import AuthBottomAction from "../../components/auth/AuthBottomAction";
import AuthHeader from "../../components/auth/AuthHeader";
import OtpInputRow from "../../components/auth/OtpInputRow";
import authStyles from "../../styles/authStyles";

export default function VerifyOtpStep({
  otp,
  onOtpChange,
  onBack,
  onSubmit,
  onResend,
}) {
  return (
    <>
      <AuthHeader
        title="Verify OTP"
        subtitle="Remember your password?"
        subtitleAction="Login"
      />

      <OtpInputRow value={otp} onChange={onOtpChange} />

      <TouchableOpacity style={authStyles.centerLink} onPress={onResend}>
        <Text style={authStyles.centerLinkText}>Resend Code</Text>
      </TouchableOpacity>

      <AuthBottomAction
        onBack={onBack}
        onPrimary={onSubmit}
        primaryLabel="Submit"
      />
    </>
  );
}
