import { useState } from "react";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import LoginFlowScreen from "./src/screens/LoginFlowScreen";
import SignupFlowScreen from "./src/screens/SignupFlowScreen";

const SCREENS = {
  ONBOARDING: "onboarding",
  LOGIN: "login",
  SIGNUP: "signup",
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.ONBOARDING);

  if (screen === SCREENS.LOGIN) {
    return (
      <LoginFlowScreen onCreateAccountPress={() => setScreen(SCREENS.SIGNUP)} />
    );
  }

  if (screen === SCREENS.SIGNUP) {
    return <SignupFlowScreen onLoginPress={() => setScreen(SCREENS.LOGIN)} />;
  }

  return (
    <OnboardingScreen
      onLoginPress={() => setScreen(SCREENS.LOGIN)}
      onJoinPress={() => setScreen(SCREENS.SIGNUP)}
    />
  );
}
