import { useRef } from "react";
import { TextInput, View } from "react-native";
import authStyles from "../../styles/authStyles";

export default function OtpInputRow({ value, onChange }) {
  const inputRefs = useRef([]);

  const handleChangeText = (index, text) => {
    onChange(index, text);

    const normalized = text.replace(/[^0-9]/g, "").slice(0, 1);
    if (normalized && index < value.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index, event) => {
    if (event.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={authStyles.otpContainer}>
      {value.map((digit, index) => (
        <View key={index} style={authStyles.otpBox}>
          <TextInput
            ref={(input) => {
              inputRefs.current[index] = input;
            }}
            style={authStyles.otpInput}
            maxLength={1}
            keyboardType="numeric"
            value={digit}
            onChangeText={(text) => handleChangeText(index, text)}
            onKeyPress={(event) => handleKeyPress(index, event)}
            placeholder=""
            returnKeyType="done"
          />
        </View>
      ))}
    </View>
  );
}
