import { Text, TouchableOpacity } from "react-native";
import authStyles from "../../styles/authStyles";

export default function AuthPrimaryButton({ label, onPress, style }) {
  return (
    <TouchableOpacity style={[authStyles.loginButton, style]} onPress={onPress}>
      <Text style={authStyles.primaryButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}
