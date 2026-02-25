import { TextInput, View } from "react-native";
import authStyles from "../../styles/authStyles";

export default function OtpInputRow({ value, onChange }) {
  return (
    <View style={authStyles.otpContainer}>
      {value.map((digit, index) => (
        <View key={index} style={authStyles.otpBox}>
          <TextInput
            style={authStyles.otpInput}
            maxLength={1}
            keyboardType="numeric"
            value={digit}
            onChangeText={(text) => onChange(index, text)}
            placeholder=""
          />
        </View>
      ))}
    </View>
  );
}
