import { Feather } from "@expo/vector-icons";
import { View } from "react-native";
import AuthBottomAction from "../../components/auth/AuthBottomAction";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInputField from "../../components/auth/AuthInputField";
import authStyles from "../../styles/authStyles";

export default function ForgotPasswordStep({
  form,
  onChange,
  onBack,
  onSendCode,
}) {
  return (
    <>
      <AuthHeader
        title="Forgot Password?"
        subtitle="Remember your password?"
        subtitleAction="Login"
      />

      <View style={authStyles.fieldsBlock}>
        <AuthInputField
          icon={<Feather name="phone" size={14} color="#8e8e8e" />}
          placeholder="Phone Number"
          value={form.phone}
          onChangeText={(value) => onChange("phone", value)}
          keyboardType="phone-pad"
        />
      </View>

      <AuthBottomAction
        onBack={onBack}
        onPrimary={onSendCode}
        primaryLabel="Send Code"
      />
    </>
  );
}
