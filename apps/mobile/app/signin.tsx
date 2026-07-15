import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInDown,
} from "react-native-reanimated";
import { Colors } from "@/constants/theme";
import { useAppTheme } from "@/context/ThemeContext";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const BG_IMAGE =
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop";

export default function SignInScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme, isDark } = useAppTheme();
  const activeTheme = Colors[theme];
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const otpRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  useEffect(() => {
    let interval: any;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((p) => p - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOTP = () => {
    if (phoneNumber.length !== 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      setTimer(30);
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    }, 1500);
  };

  const handleOtpChange = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, "");
    if (!cleanText) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = cleanText.substring(0, 1);
    setOtp(newOtp);
    if (index < 3 && cleanText) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        otpRefs[index - 1].current?.focus();
      }
    }
  };

  useEffect(() => {
    if (otp.join("").length === 4) handleVerifyOTP();
  }, [otp]);

  const handleVerifyOTP = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      dispatch(
        loginSuccess({
          name: "Ayaan Ahmed",
          phone: `${countryCode} ${phoneNumber}`,
          email: "ayaan.ahmed@mughl.com",
          tier: "Royal Heir",
          ordersCount: 24,
          points: 1200,
        }),
      );
      setTimeout(() => router.back(), 1500);
    }, 1500);
  };

  const isPhoneValid = phoneNumber.length === 10;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: BG_IMAGE }}
        style={StyleSheet.absoluteFill}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.9)"]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <BlurView intensity={20} tint="light" style={styles.blurCircle}>
            <Ionicons name="close" size={24} color="#FFF" />
          </BlurView>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.contentSpacer} />

        <Animated.View
          entering={SlideInDown.duration(800).springify()}
          style={styles.bottomSheet}
        >
          <BlurView
            intensity={Platform.OS === "ios" ? 80 : 100}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.sheetContent}>
            {success ? (
              <Animated.View
                entering={FadeIn.duration(600)}
                style={styles.successContainer}
              >
                <View style={styles.successIconWrapper}>
                  <Ionicons
                    name="checkmark"
                    size={60}
                    color={activeTheme.tint}
                  />
                </View>
                <Text style={styles.title}>Welcome Back.</Text>
                <Text style={styles.subtitle}>
                  Your table at the Imperial Court awaits.
                </Text>
              </Animated.View>
            ) : step === "phone" ? (
              <Animated.View
                entering={FadeInDown.duration(600)}
                key="phone-step"
              >
                <Text style={styles.title}>Unlock Premium.</Text>
                <Text style={styles.subtitle}>
                  Enter your mobile number to access exclusive reservations and
                  pre-orders.
                </Text>

                <View style={styles.inputContainer}>
                  <TouchableOpacity style={styles.countryCodePicker}>
                    <Text style={styles.countryCodeText}>{countryCode}</Text>
                    <Ionicons name="chevron-down" size={14} color="#FFF" />
                  </TouchableOpacity>
                  <View style={styles.divider} />
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Mobile Number"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    keyboardType="number-pad"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    autoFocus
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    { backgroundColor: activeTheme.tint },
                    !isPhoneValid && styles.primaryButtonDisabled,
                  ]}
                  onPress={handleSendOTP}
                  disabled={!isPhoneValid || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <>
                      <Text style={styles.primaryButtonText}>Continue</Text>
                      <Ionicons name="arrow-forward" size={20} color="#000" />
                    </>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <Animated.View entering={FadeInDown.duration(600)} key="otp-step">
                <TouchableOpacity
                  style={styles.backLink}
                  onPress={() => setStep("phone")}
                >
                  <Ionicons
                    name="arrow-back"
                    size={18}
                    color={activeTheme.tint}
                  />
                  <Text
                    style={[styles.backLinkText, { color: activeTheme.tint }]}
                  >
                    Change Number
                  </Text>
                </TouchableOpacity>
                <Text style={styles.title}>Verify Code.</Text>
                <Text style={styles.subtitle}>
                  We've sent a 4-digit security code to {countryCode}{" "}
                  {phoneNumber}
                </Text>

                <View style={styles.otpContainer}>
                  {otp.map((digit, idx) => (
                    <TextInput
                      key={idx}
                      ref={otpRefs[idx]}
                      value={digit}
                      onChangeText={(val) => handleOtpChange(val, idx)}
                      onKeyPress={(e) => handleKeyPress(e, idx)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                      style={[
                        styles.otpCell,
                        digit
                          ? {
                              borderColor: activeTheme.tint,
                              color: activeTheme.tint,
                            }
                          : {},
                      ]}
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    { backgroundColor: activeTheme.tint },
                    otp.join("").length !== 4 && styles.primaryButtonDisabled,
                  ]}
                  onPress={handleVerifyOTP}
                  disabled={otp.join("").length !== 4 || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Verify & Login</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.resendContainer}>
                  {timer > 0 ? (
                    <Text style={styles.resendText}>
                      Resend code in {timer}s
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={() => setTimer(30)}>
                      <Text
                        style={[
                          styles.resendAction,
                          { color: activeTheme.tint },
                        ]}
                      >
                        Resend Code
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingHorizontal: 20,
    zIndex: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
  },
  blurCircle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  contentSpacer: {
    flex: 1,
  },
  bottomSheet: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  sheetContent: {
    padding: 30,
    paddingBottom: Platform.OS === "ios" ? 50 : 30,
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 10,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.6)",
    lineHeight: 22,
    marginBottom: 35,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 30,
    height: 65,
    paddingHorizontal: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  countryCodePicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  countryCodeText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 15,
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    color: "#FFF",
    fontWeight: "500",
    letterSpacing: 1,
  },
  primaryButton: {
    flexDirection: "row",
    height: 65,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "800",
  },
  backLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  backLinkText: {
    fontSize: 14,
    fontWeight: "600",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 35,
  },
  otpCell: {
    width: (width - 100) / 4,
    height: 70,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    color: "#FFF",
  },
  resendContainer: {
    marginTop: 25,
    alignItems: "center",
  },
  resendText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
  },
  resendAction: {
    fontSize: 15,
    fontWeight: "700",
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  successIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
});
