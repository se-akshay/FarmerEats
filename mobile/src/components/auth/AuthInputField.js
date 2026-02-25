import { Text, TextInput, TouchableOpacity, View } from "react-native";
import authStyles, { authTheme } from "../../styles/authStyles";

export default function AuthInputField({
  icon,
  placeholder,
  value,
  onChangeText,
  secure = false,
  keyboardType = "default",
  autoCapitalize = "none",
  rightActionLabel,
  onRightActionPress,
}) {
  return (
    <View style={authStyles.fieldWrap}>
      <View style={authStyles.fieldIcon}>{icon}</View>
      <TextInput
        style={authStyles.fieldInput}
        placeholder={placeholder}
        placeholderTextColor={authTheme.inputPlaceholder}
        secureTextEntry={secure}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        value={value}
        onChangeText={onChangeText}
      />
      {!!rightActionLabel && (
        <TouchableOpacity
          style={authStyles.inlineAction}
          onPress={onRightActionPress}
        >
          <Text style={authStyles.inlineActionText}>{rightActionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
