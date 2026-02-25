import { TouchableOpacity, View } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import authStyles from "../../styles/authStyles";

export default function SocialAuthRow({
  onGooglePress,
  onApplePress,
  onFacebookPress,
}) {
  return (
    <View style={authStyles.socialRow}>
      <TouchableOpacity style={authStyles.socialButton} onPress={onGooglePress}>
        <AntDesign name="google" size={25} color="#db4437" />
      </TouchableOpacity>
      <TouchableOpacity style={authStyles.socialButton} onPress={onApplePress}>
        <AntDesign name="apple1" size={25} color="#111" />
      </TouchableOpacity>
      <TouchableOpacity
        style={authStyles.socialButton}
        onPress={onFacebookPress}
      >
        <FontAwesome name="facebook" size={25} color="#1877f2" />
      </TouchableOpacity>
    </View>
  );
}
