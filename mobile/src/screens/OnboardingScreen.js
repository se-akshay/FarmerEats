import { View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import OnboardingCard from "../components/OnboardingCard";
import { onboardingData } from "../data/onboardingData";

export default function OnboardingScreen({ onLoginPress, onJoinPress }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance cards every 1 second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        return prevIndex === onboardingData.length - 1 ? 0 : prevIndex + 1;
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <OnboardingCard
        item={onboardingData[currentIndex]}
        currentIndex={currentIndex}
        total={onboardingData.length}
        onLoginPress={onLoginPress}
        onJoinPress={onJoinPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7EDEE",
  },
});
