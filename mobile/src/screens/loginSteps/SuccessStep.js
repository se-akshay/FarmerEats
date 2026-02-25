import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import AuthPrimaryButton from "../../components/auth/AuthPrimaryButton";
import authStyles from "../../styles/authStyles";

export default function SuccessStep({ onBackToLogin }) {
  return (
    <>
      <View style={authStyles.confirmWrap}>
        <View style={authStyles.checkCircle}>
          <Ionicons name="checkmark" size={58} color="#1bb436" />
        </View>

        <Text style={authStyles.confirmTitle}>You’re all done!</Text>
        <Text style={authStyles.confirmDesc}>
          Hang tight! We are currently reviewing your account and will follow up
          with you in 2-3 business days. In the meantime, you can set-up your
          inventory.
        </Text>
      </View>

      <AuthPrimaryButton label="Got it!" onPress={onBackToLogin} />
    </>
  );
}
