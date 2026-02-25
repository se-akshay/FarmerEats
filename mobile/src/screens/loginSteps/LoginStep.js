import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInputField from "../../components/auth/AuthInputField";
import AuthPrimaryButton from "../../components/auth/AuthPrimaryButton";
import SocialAuthRow from "../../components/auth/SocialAuthRow";
import authStyles from "../../styles/authStyles";

export default function LoginStep({
  form,
  onChange,
  onForgotPress,
  onLoginPress,
  onCreateAccountPress,
}) {
  return (
    <>
      <AuthHeader
        title="Welcome back!"
        subtitle="New here?"
        subtitleAction="Create account"
        onSubtitleActionPress={onCreateAccountPress}
      />

      <View style={authStyles.fieldsBlock}>
        <AuthInputField
          icon={<MaterialIcons name="email" size={14} color="#8e8e8e" />}
          placeholder="Email Address"
          value={form.email}
          onChangeText={(value) => onChange("email", value)}
          keyboardType="email-address"
        />

        <AuthInputField
          icon={<Feather name="lock" size={14} color="#8e8e8e" />}
          placeholder="Password"
          value={form.password}
          onChangeText={(value) => onChange("password", value)}
          secure
          rightActionLabel="Forgot?"
          onRightActionPress={onForgotPress}
        />
      </View>

      <AuthPrimaryButton label="Login" onPress={onLoginPress} />

      <Text style={authStyles.orText}>or login with</Text>

      <SocialAuthRow />
    </>
  );
}
