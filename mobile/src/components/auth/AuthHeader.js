import { Text, TouchableOpacity, View } from "react-native";
import authStyles from "../../styles/authStyles";

export default function AuthHeader({
  title,
  stepLabel,
  subtitle,
  subtitleAction,
  onSubtitleActionPress,
}) {
  return (
    <View style={authStyles.headerWrap}>
      <Text style={authStyles.brand}>FarmerEats</Text>
      {!!stepLabel && <Text style={authStyles.stepText}>{stepLabel}</Text>}
      <Text style={authStyles.title}>{title}</Text>

      {(subtitle || subtitleAction) && (
        <View style={authStyles.subtitleRow}>
          {!!subtitle && <Text style={authStyles.subtitle}>{subtitle}</Text>}
          {!!subtitleAction && (
            <TouchableOpacity onPress={onSubtitleActionPress}>
              <Text style={authStyles.subtitleAction}>{subtitleAction}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
