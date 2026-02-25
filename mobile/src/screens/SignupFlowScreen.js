import { useMemo, useState } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

const REGISTER_ENDPOINT = "https://sowlab.com/assignment/user/register";

const DAY_CONFIG = [
  { label: "M", key: "mon" },
  { label: "T", key: "tue" },
  { label: "W", key: "wed" },
  { label: "Th", key: "thu" },
  { label: "F", key: "fri" },
  { label: "S", key: "sat" },
  { label: "Su", key: "sun" },
];

function Field({
  icon,
  placeholder,
  secure = false,
  half = false,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize = "none",
}) {
  return (
    <View style={[styles.fieldWrap, half && styles.fieldHalf]}>
      <View style={styles.fieldIcon}>{icon}</View>
      <TextInput
        style={styles.fieldInput}
        placeholder={placeholder}
        placeholderTextColor="#b8b8b8"
        secureTextEntry={secure}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

function BrandHeader({ stepLabel, title, description }) {
  return (
    <View>
      <Text style={styles.brand}>FarmerEats</Text>
      <Text style={styles.stepText}>{stepLabel}</Text>
      <Text style={styles.title}>{title}</Text>
      {!!description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

function BottomAction({
  onBack,
  onPrimary,
  primaryLabel,
  leftLabel,
  onLeftPress,
  disabled = false,
}) {
  return (
    <View style={styles.bottomRow}>
      {onBack ? (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#2b2b2b" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onLeftPress}>
          <Text style={styles.loginText}>{leftLabel}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.primaryButton, disabled && styles.primaryButtonDisabled]}
        onPress={onPrimary}
        disabled={disabled}
      >
        <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SignupFlowScreen({ onLoginPress }) {
  const [step, setStep] = useState(0);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialType, setSocialType] = useState("email");
  const [activeDay, setActiveDay] = useState("mon");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    business_name: "",
    informal_name: "",
    address: "",
    city: "",
    state: "New York",
    zip_code: "",
    registration_proof: "",
    device_token: "0imfnc8mVLWwsAawjYr4Rx-Af50DDqtlx",
    social_id: "0imfnc8mVLWwsAawjYr4Rx-Af50DDqtlx",
  });
  const [selectedSlotsByDay, setSelectedSlotsByDay] = useState({
    mon: ["8:00am - 10:00am", "10:00am - 1:00pm"],
    tue: ["8:00am - 10:00am", "10:00am - 1:00pm"],
    wed: ["8:00am - 10:00am", "10:00am - 1:00pm", "1:00pm - 4:00pm"],
    thu: ["8:00am - 10:00am", "10:00am - 1:00pm", "1:00pm - 4:00pm"],
    fri: ["8:00am - 10:00am", "10:00am - 1:00pm"],
    sat: ["8:00am - 10:00am", "10:00am - 1:00pm"],
    sun: ["8:00am - 10:00am"],
  });

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const timeSlots = useMemo(
    () => [
      "8:00am - 10:00am",
      "10:00am - 1:00pm",
      "1:00pm - 4:00pm",
      "4:00pm - 7:00pm",
      "7:00pm - 10:00pm",
    ],
    [],
  );

  const activeDaySlots = selectedSlotsByDay[activeDay] || [];

  const toggleSlot = (slot) => {
    setSelectedSlotsByDay((prev) => {
      const previousSlots = prev[activeDay] || [];
      const hasSlot = previousSlots.includes(slot);
      const nextSlots = hasSlot
        ? previousSlots.filter((item) => item !== slot)
        : [...previousSlots, slot];

      return {
        ...prev,
        [activeDay]: nextSlots,
      };
    });
  };

  const getPayload = () => ({
    full_name: form.full_name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    password: form.password,
    role: "farmer",
    business_name: form.business_name.trim(),
    informal_name: form.informal_name.trim(),
    address: form.address.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    zip_code: Number(form.zip_code),
    registration_proof: form.registration_proof.trim(),
    business_hours: selectedSlotsByDay,
    device_token: form.device_token.trim(),
    type: socialType,
    social_id: form.social_id.trim(),
  });

  const validateBeforeSubmit = () => {
    if (!form.full_name.trim()) return "Full name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!form.phone.trim()) return "Phone is required.";
    if (!form.password) return "Password is required.";
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }
    if (!form.business_name.trim()) return "Business name is required.";
    if (!form.informal_name.trim()) return "Informal name is required.";
    if (!form.address.trim()) return "Address is required.";
    if (!form.city.trim()) return "City is required.";
    if (!form.state.trim()) return "State is required.";
    if (!form.zip_code.trim() || Number.isNaN(Number(form.zip_code))) {
      return "Valid zip code is required.";
    }
    if (!form.registration_proof.trim()) {
      return "Registration proof is required.";
    }

    const hasBusinessHours = Object.values(selectedSlotsByDay).some(
      (slots) => slots.length > 0,
    );

    if (!hasBusinessHours) {
      return "Please select at least one business hour slot.";
    }

    return "";
  };

  const validateCurrentStep = () => {
    if (step === 0) {
      if (!form.full_name.trim()) return "Full name is required.";
      if (!form.email.trim()) return "Email is required.";
      if (!form.phone.trim()) return "Phone is required.";
      if (!form.password) return "Password is required.";
      if (!form.confirmPassword) return "Please re-enter password.";
      if (form.password !== form.confirmPassword) {
        return "Passwords do not match.";
      }
    }

    if (step === 1) {
      if (!form.business_name.trim()) return "Business name is required.";
      if (!form.informal_name.trim()) return "Informal name is required.";
      if (!form.address.trim()) return "Address is required.";
      if (!form.city.trim()) return "City is required.";
      if (!form.state.trim()) return "State is required.";
      if (!form.zip_code.trim() || Number.isNaN(Number(form.zip_code))) {
        return "Valid zip code is required.";
      }
    }

    if (step === 2) {
      if (!form.registration_proof.trim()) {
        return "Registration proof is required.";
      }
    }

    if (step === 3) {
      const hasBusinessHours = Object.values(selectedSlotsByDay).some(
        (slots) => slots.length > 0,
      );

      if (!hasBusinessHours) {
        return "Please select at least one business hour slot.";
      }
    }

    return "";
  };

  const handleContinue = () => {
    const validationError = validateCurrentStep();

    if (validationError) {
      Alert.alert("Validation", validationError);
      return;
    }

    nextStep();
  };

  const submitSignup = async () => {
    const validationError = validateBeforeSubmit();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(REGISTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(getPayload()),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        setSubmitError(data?.message || "Registration failed.");
        return;
      }

      setStep(5);
      Alert.alert("Registered", data?.message || "Registered successfully.");
    } catch (error) {
      setSubmitError("Unable to connect. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        {step === 0 && (
          <>
            <BrandHeader stepLabel="Signup 1 of 4" title="Welcome!" />

            <View style={styles.socialRow}>
              <TouchableOpacity
                style={[
                  styles.socialButton,
                  socialType === "google" && styles.socialButtonActive,
                ]}
                onPress={() => setSocialType("google")}
              >
                <AntDesign name="google" size={36} color="#db4437" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.socialButton,
                  socialType === "apple" && styles.socialButtonActive,
                ]}
                onPress={() => setSocialType("apple")}
              >
                <AntDesign name="apple1" size={36} color="#111" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.socialButton,
                  socialType === "facebook" && styles.socialButtonActive,
                ]}
                onPress={() => setSocialType("facebook")}
              >
                <FontAwesome name="facebook" size={36} color="#1877f2" />
              </TouchableOpacity>
            </View>

            <Text style={styles.orText}>or signup with</Text>

            <View style={styles.fieldsBlock}>
              <Field
                icon={
                  <Ionicons name="person-outline" size={14} color="#8e8e8e" />
                }
                placeholder="Full Name"
                value={form.full_name}
                onChangeText={(value) => updateForm("full_name", value)}
                autoCapitalize="words"
              />
              <Field
                icon={<MaterialIcons name="email" size={14} color="#8e8e8e" />}
                placeholder="Email Address"
                value={form.email}
                onChangeText={(value) => updateForm("email", value)}
                keyboardType="email-address"
              />
              <Field
                icon={<Feather name="phone" size={14} color="#8e8e8e" />}
                placeholder="Phone Number"
                value={form.phone}
                onChangeText={(value) => updateForm("phone", value)}
                keyboardType="phone-pad"
              />
              <Field
                icon={<Feather name="lock" size={14} color="#8e8e8e" />}
                placeholder="Password"
                secure
                value={form.password}
                onChangeText={(value) => updateForm("password", value)}
              />
              <Field
                icon={<Feather name="lock" size={14} color="#8e8e8e" />}
                placeholder="Re-enter Password"
                secure
                value={form.confirmPassword}
                onChangeText={(value) => updateForm("confirmPassword", value)}
              />
            </View>

            <BottomAction
              leftLabel="Login"
              onLeftPress={onLoginPress}
              primaryLabel="Continue"
              onPrimary={handleContinue}
            />
          </>
        )}

        {step === 1 && (
          <>
            <BrandHeader stepLabel="Signup 2 of 4" title="Farm Info" />

            <View style={styles.fieldsBlock}>
              <Field
                icon={<Feather name="tag" size={14} color="#8e8e8e" />}
                placeholder="Business Name"
                value={form.business_name}
                onChangeText={(value) => updateForm("business_name", value)}
                autoCapitalize="words"
              />
              <Field
                icon={
                  <Ionicons
                    name="person-circle-outline"
                    size={14}
                    color="#8e8e8e"
                  />
                }
                placeholder="Informal Name"
                value={form.informal_name}
                onChangeText={(value) => updateForm("informal_name", value)}
                autoCapitalize="words"
              />
              <Field
                icon={
                  <Ionicons name="home-outline" size={14} color="#8e8e8e" />
                }
                placeholder="Street Address"
                value={form.address}
                onChangeText={(value) => updateForm("address", value)}
                autoCapitalize="words"
              />
              <Field
                icon={
                  <Ionicons name="location-outline" size={14} color="#8e8e8e" />
                }
                placeholder="City"
                value={form.city}
                onChangeText={(value) => updateForm("city", value)}
                autoCapitalize="words"
              />

              <View style={styles.halfRow}>
                <View style={styles.fieldHalf}>
                  <TouchableOpacity
                    style={styles.selectField}
                    onPress={() => {
                      const states = ["New York", "California", "Florida"];
                      const currentIndex = states.indexOf(form.state);
                      const nextIndex = (currentIndex + 1) % states.length;
                      updateForm("state", states[nextIndex]);
                    }}
                  >
                    <Text
                      style={[
                        styles.selectPlaceholder,
                        !!form.state && styles.selectValue,
                      ]}
                    >
                      {form.state || "State"}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color="#6e6e6e" />
                  </TouchableOpacity>
                </View>
                <Field
                  placeholder="Enter Zipcode"
                  half
                  value={form.zip_code}
                  onChangeText={(value) =>
                    updateForm("zip_code", value.replace(/[^0-9]/g, ""))
                  }
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <BottomAction
              onBack={prevStep}
              onPrimary={handleContinue}
              primaryLabel="Continue"
            />
          </>
        )}

        {step === 2 && (
          <>
            <BrandHeader
              stepLabel="Signup 3 of 4"
              title="Verification"
              description="Attach proof of Department of Agriculture registrations i.e. Florida Fresh, USDA Approved, USDA Organic"
            />

            <View style={styles.verificationRow}>
              <Text style={styles.attachText}>
                Attach proof of registration
              </Text>
              <TouchableOpacity style={styles.cameraBtn}>
                <Feather name="camera" size={15} color="#fff" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.proofInput}
              placeholder="e.g. my_proof.pdf"
              placeholderTextColor="#b8b8b8"
              value={form.registration_proof}
              onChangeText={(value) => updateForm("registration_proof", value)}
            />

            <BottomAction
              onBack={prevStep}
              onPrimary={handleContinue}
              primaryLabel="Continue"
            />
          </>
        )}

        {step === 3 && (
          <>
            <BrandHeader
              stepLabel="Signup 4 of 4"
              title="Business Hours"
              description="Choose the hours your farm is open for pickups. This will allow customers to order deliveries."
            />

            <View style={styles.daysRow}>
              {DAY_CONFIG.map((day) => (
                <TouchableOpacity
                  key={day.key}
                  style={[
                    styles.dayChip,
                    activeDay === day.key && styles.dayChipActive,
                  ]}
                  onPress={() => setActiveDay(day.key)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      activeDay === day.key && styles.dayTextActive,
                    ]}
                  >
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.slotWrap}>
              {timeSlots.map((slot) => {
                const active = activeDaySlots.includes(slot);
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[styles.slotChip, active && styles.slotChipActive]}
                    onPress={() => toggleSlot(slot)}
                  >
                    <Text
                      style={[styles.slotText, active && styles.slotTextActive]}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <BottomAction
              onBack={prevStep}
              onPrimary={handleContinue}
              primaryLabel="Signup"
            />
          </>
        )}

        {step === 4 && (
          <>
            <BrandHeader
              stepLabel="Signup 3 of 4"
              title="Verification"
              description="Attached proof of Department of Agriculture registrations i.e. Florida Fresh, USDA Approved, USDA Organic"
            />

            <View style={styles.verificationRowWithAvatar}>
              <Text style={styles.attachText}>
                Attach proof of registration
              </Text>
              <View style={styles.rightIconsWrap}>
                <TouchableOpacity style={styles.cameraBtn}>
                  <Feather name="camera" size={15} color="#fff" />
                </TouchableOpacity>
                <View style={styles.avatarMock}>
                  <Ionicons name="person" size={16} color="#fff" />
                </View>
              </View>
            </View>

            <View style={styles.fileRow}>
              <Text style={styles.fileName}>
                {form.registration_proof || "No file selected"}
              </Text>
              <Ionicons name="close" size={14} color="#4a4a4a" />
            </View>

            {!!submitError && (
              <Text style={styles.errorText}>{submitError}</Text>
            )}

            <BottomAction
              onBack={prevStep}
              onPrimary={submitSignup}
              primaryLabel={isSubmitting ? "Submitting..." : "Submit"}
              disabled={isSubmitting}
            />
          </>
        )}

        {step === 5 && (
          <>
            <View style={styles.confirmWrap}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={58} color="#1bb436" />
              </View>

              <Text style={styles.confirmTitle}>You’re all done!</Text>
              <Text style={styles.confirmDesc}>
                Hang tight! We are currently reviewing your account and will
                follow up with you in 2-3 business days. In the meantime, you
                can set-up your inventory.
              </Text>
            </View>

            <BottomAction onPrimary={() => setStep(0)} primaryLabel="Got it!" />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3eced",
  },
  pageHeading: {
    marginLeft: 22,
    marginTop: 2,
    color: "#bcb3b5",
    fontSize: 30,
    fontWeight: "300",
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",

    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  brand: {
    height: 120,
    fontSize: 30,
    color: "#222",
    marginBottom: 10,
    fontWeight: "700",
    paddingTop: 50,
  },
  stepText: {
    color: "#a7a7a7",
    fontSize: 10,
    marginBottom: 4,
  },
  title: {
    fontSize: 33,
    fontWeight: "800",
    color: "#202020",
    marginBottom: 10,
  },
  description: {
    color: "#514747f8",
    fontSize: 12,
    lineHeight: 13,
    maxWidth: 300,
    marginBottom: 30,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 6,
    marginBottom: 10,
  },
  socialButton: {
    width: 62,
    height: 48,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ececec",
    alignItems: "center",
    justifyContent: "center",
  },
  socialButtonActive: {
    borderColor: "#d9765f",
    borderWidth: 2,
  },
  orText: {
    color: "#cbcbcb",
    fontSize: 17,
    alignSelf: "center",
    marginBottom: 12,
    fontWeight: 600,
  },
  fieldsBlock: {
    marginTop: 2,
    gap: 10,
  },
  fieldWrap: {
    height: 56,
    borderRadius: 7,
    backgroundColor: "#f3f3f3",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  fieldIcon: {
    width: 16,
    alignItems: "center",
    marginRight: 15,
  },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: "#383838",
  },
  halfRow: {
    flexDirection: "row",
    gap: 8,
  },
  fieldHalf: {
    flex: 1,
  },
  selectField: {
    height: 36,
    borderRadius: 7,
    backgroundColor: "#f3f3f3",
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectPlaceholder: {
    color: "#b8b8b8",
    fontSize: 11,
  },
  selectValue: {
    color: "#383838",
  },
  verificationRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 30,
  },
  verificationRowWithAvatar: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightIconsWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  attachText: {
    fontSize: 18,
    color: "#2a2a2a",
  },
  proofInput: {
    marginTop: 14,
    height: 48,
    borderRadius: 7,
    backgroundColor: "#f3f3f3",
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#383838",
  },
  cameraBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "#d9765f",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarMock: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#303030",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  daysRow: {
    marginTop: 6,
    flexDirection: "row",
    // gap: 19,
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dayChip: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e7e7e7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#f9f9f9",
    height: 40,
    width: 40,
  },
  dayChipActive: {
    backgroundColor: "#d9765f",
    borderColor: "#d9765f",
  },
  dayText: {
    fontSize: 10,
    color: "#7d7d7d",
  },
  dayTextActive: {
    color: "#fff",
  },
  slotWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  slotChip: {
    backgroundColor: "#efefef",
    borderRadius: 4,
    paddingVertical: 9,
    paddingHorizontal: 10,
    height: 30,
  },
  slotChipActive: {
    backgroundColor: "#fbcf76",
  },
  slotText: {
    fontSize: 12,
    color: "#595959",
  },
  slotTextActive: {
    color: "#5a4200",
    fontWeight: "600",
  },
  fileRow: {
    marginTop: 18,
    height: 50,
    borderRadius: 7,
    backgroundColor: "#ececec",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fileName: {
    fontSize: 15,
    color: "#5c5c5c",
    textDecorationLine: "underline",
  },
  errorText: {
    marginTop: 10,
    color: "#cf2f2f",
    fontSize: 12,
  },
  confirmWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: -20,
  },
  checkCircle: {
    marginBottom: 14,
  },
  confirmTitle: {
    fontSize: 38,
    fontWeight: "800",
    color: "#222",
    marginBottom: 10,
  },
  confirmDesc: {
    fontSize: 14,
    color: "#a8a8a8",
    textAlign: "center",
    lineHeight: 16,
    maxWidth: 290,
  },
  bottomRow: {
    marginTop: "auto",
    paddingTop: 20,
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  loginText: {
    fontSize: 10,
    color: "#101010",
    textDecorationLine: "underline",
    marginLeft: 2,
  },
  backButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    height: 36,
    minWidth: 120,
    borderRadius: 18,
    backgroundColor: "#d9765f",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "600",
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
});
