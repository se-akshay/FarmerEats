import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import authStyles from "../../styles/authStyles";

export default function AuthBottomAction({ onBack, primaryLabel, onPrimary }) {
  return (
    <View style={authStyles.actionRow}>
      <TouchableOpacity style={authStyles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color="#2b2b2b" />
      </TouchableOpacity>
      <TouchableOpacity style={authStyles.primaryButton} onPress={onPrimary}>
        <Text style={authStyles.primaryButtonText}>{primaryLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}
