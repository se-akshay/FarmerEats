import { Feather } from "@expo/vector-icons";
import { View } from "react-native";
import AuthBottomAction from "../../components/auth/AuthBottomAction";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInputField from "../../components/auth/AuthInputField";
import authStyles from "../../styles/authStyles";

export default function ResetPasswordStep({
  form,
  onChange,
  onBack,
  onSubmit,
}) {
  return (
    <>
      <AuthHeader
        title="Reset Password"
        subtitle="Remember your password?"
        subtitleAction="Login"
      />

      <View style={authStyles.fieldsBlock}>
        <AuthInputField
          icon={<Feather name="lock" size={14} color="#8e8e8e" />}
          placeholder="New Password"
          value={form.newPassword}
          onChangeText={(value) => onChange("newPassword", value)}
          secure
        />

        <AuthInputField
          icon={<Feather name="lock" size={14} color="#8e8e8e" />}
          placeholder="Confirm New Password"
          value={form.confirmPassword}
          onChangeText={(value) => onChange("confirmPassword", value)}
          secure
        />
      </View>

      <AuthBottomAction
        onBack={onBack}
        onPrimary={onSubmit}
        primaryLabel="Submit"
      />
    </>
  );
}
