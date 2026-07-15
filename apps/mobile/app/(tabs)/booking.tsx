import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { useAppTheme } from "@/context/ThemeContext";

import { s } from "@/components/booking/booking.styles";
import {
  TABLE_LAYOUT,
  STEP_LABELS,
  RESERVATION_FEE,
  makeDaysList,
  genRef,
  CartItem,
} from "@/components/booking/booking.constants";
import { ProgressBar } from "@/components/booking/CommonComponents";
import Step1 from "@/components/booking/Step1";
import Step2 from "@/components/booking/Step2";
import Step3 from "@/components/booking/Step3";
import Step4 from "@/components/booking/Step4";
import SuccessScreen from "@/components/booking/SuccessScreen";

export default function BookingScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const T = Colors[theme];
  const bg = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";

  // ── Navigation state ─────────────────────────────────────────────
  const [step, setStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // ── Step 1 ───────────────────────────────────────────────────────
  const daysList = useMemo(makeDaysList, []);
  const [selDate, setSelDate] = useState<Date>(new Date());
  const [selTime, setSelTime] = useState("6:00 PM");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [vehicle, setVehicle] = useState("Car");

  // ── Step 2 ───────────────────────────────────────────────────────
  const [selTable, setSelTable] = useState<string | null>(null);

  // ── Step 3 ───────────────────────────────────────────────────────
  const [cart, setCart] = useState<CartItem[]>([]);

  // ── Step 4 ───────────────────────────────────────────────────────
  const [payMethod, setPayMethod] = useState<"card" | "upi">("card");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bookingRef, setBookingRef] = useState("");

  // ── Derived ──────────────────────────────────────────────────────
  const bookedTables = useMemo(() => {
    const hash =
      selDate.getDate() +
      selTime.length +
      parseInt(selTime.replace(/\D/g, "") || "0");
    return TABLE_LAYOUT.filter((_, i) => (i + hash) % 3 === 0).map((t) => t.id);
  }, [selDate, selTime]);

  const cartMap = useMemo(() => {
    const m: Record<string, number> = {};
    cart.forEach((c) => {
      m[c.id] = c.qty;
    });
    return m;
  }, [cart]);

  const mealTotal = useMemo(
    () =>
      cart.reduce((s, c) => {
        const item = MENU_ITEMS_LOOKUP(c.id);
        return s + (item ? item.price * c.qty : 0);
      }, 0),
    [cart],
  );

  const grandTotal = RESERVATION_FEE + mealTotal;

  // ── Helper lookup to bypass importing full array for derived state ──
  function MENU_ITEMS_LOOKUP(id: string) {
    const lookup: Record<string, number> = {
      m1: 18.99,
      m2: 14.99,
      m3: 3.99,
      m4: 9.99,
      m5: 12.99,
      m6: 3.49,
      m7: 4.99,
      m8: 5.99,
      m9: 2.99,
      m10: 16.99,
    };
    return lookup[id] ? { price: lookup[id] } : null;
  }

  // ── Validation ───────────────────────────────────────────────────
  const step0Valid = name.trim().length > 0 && phone.trim().length > 0;
  const step1Valid = !!selTable;
  const step3Valid =
    payMethod === "card"
      ? cardNum.trim().length >= 16 &&
        expiry.trim().length >= 4 &&
        cvv.trim().length >= 3
      : upiId.trim().includes("@");

  // ── Navigation ───────────────────────────────────────────────────
  const slideTo = useCallback(
    (next: number) => {
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: -40,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
      setStep(next);
    },
    [slideAnim],
  );

  const goNext = () => slideTo(step + 1);
  const goBack = () => slideTo(step - 1);

  // ── Cart handler ─────────────────────────────────────────────────
  const setQty = (id: string, delta: number) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (!existing) {
        return delta > 0 ? [...prev, { id, qty: 1 }] : prev;
      }
      const nq = existing.qty + delta;
      if (nq <= 0) return prev.filter((c) => c.id !== id);
      return prev.map((c) => (c.id === id ? { ...c, qty: nq } : c));
    });
  };

  // ── Confirm ──────────────────────────────────────────────────────
  const handlePay = () => {
    setBookingRef(genRef(selTable || "XX", selTime));
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setStep(0);
    setSelDate(new Date());
    setSelTime("6:00 PM");
    setName("");
    setPhone("");
    setGuests(2);
    setVehicle("Car");
    setSelTable(null);
    setCart([]);
    setCardNum("");
    setExpiry("");
    setCvv("");
    setUpiId("");
  };

  // ─── RENDER ───────────────────────────────────────────────────────
  const canNext = [step0Valid, step1Valid, true, step3Valid][step] ?? true;

  return (
    <View style={s.root}>
      {/* Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={isDark ? ["#333333", "#111111", "#000000"] : ["#FFFFFF", "#FDF0D5", "#e6b32511"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <LinearGradient
        colors={["rgba(230,179,37,0.09)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.7 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>
        {/* ══ SUCCESS SCREEN ══════════════════════════════════════════════ */}
        {isSuccess ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[s.scroll, { paddingBottom: 60 }]}
          >
            <SuccessScreen
              bookingRef={bookingRef}
              selTable={selTable!}
              selDate={selDate}
              selTime={selTime}
              guests={guests}
              cart={cart}
              mealTotal={mealTotal}
              grandTotal={grandTotal}
              T={T}
              isDark={isDark}
              onHome={() => router.push("/")}
              onMenu={() => router.push("/explore")}
              onNew={handleReset}
            />
          </ScrollView>
        ) : (
          <>
            {/* ── FIXED HEADER ──────────────────────────────────────────── */}
            <View style={[s.topBar, { borderBottomColor: T.border }]}>
              <View style={s.topBarInner}>
                <View>
                  <Text style={[s.topTitle, { color: T.text }]}>
                    Reserve A Table
                  </Text>
                  <Text style={[s.topSub, { color: T.subtext }]}>
                    Step {step + 1} of {STEP_LABELS.length} —{" "}
                    {STEP_LABELS[step]}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[s.skipBtn, { borderColor: T.border }]}
                  onPress={() => router.push("/explore")}
                >
                  <Ionicons name="bicycle" size={14} color={T.tint} />
                  <Text style={[s.skipBtnText, { color: T.subtext }]}>
                    Order Home
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Progress bar */}
              <View style={s.progressWrap}>
                <ProgressBar step={step} colors={T} />
              </View>
            </View>

            {/* ── STEP CONTENT ──────────────────────────────────────────── */}
            <Animated.View
              style={[s.stepBody, { transform: [{ translateX: slideAnim }] }]}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={s.scroll}
                keyboardShouldPersistTaps="handled"
              >
                {step === 0 && (
                  <Step1
                    daysList={daysList}
                    selDate={selDate}
                    selTime={selTime}
                    name={name}
                    phone={phone}
                    guests={guests}
                    vehicle={vehicle}
                    onDate={(d: Date) => {
                      setSelDate(d);
                      setSelTable(null);
                    }}
                    onTime={(t: string) => {
                      setSelTime(t);
                      setSelTable(null);
                    }}
                    onName={setName}
                    onPhone={setPhone}
                    onGuests={(d: number) =>
                      setGuests((g) => Math.max(1, Math.min(12, g + d)))
                    }
                    onVehicle={setVehicle}
                    T={T}
                    bg={bg}
                  />
                )}
                {step === 1 && (
                  <Step2
                    bookedTables={bookedTables}
                    selTable={selTable}
                    guests={guests}
                    onSelect={(id: string, cap: number) => {
                      setSelTable((prev) => (prev === id ? null : id));
                      setGuests(cap);
                    }}
                    T={T}
                    isDark={isDark}
                  />
                )}
                {step === 2 && (
                  <Step3
                    cartMap={cartMap}
                    mealTotal={mealTotal}
                    onQty={setQty}
                    T={T}
                    isDark={isDark}
                  />
                )}
                {step === 3 && (
                  <Step4
                    selDate={selDate}
                    selTime={selTime}
                    selTable={selTable}
                    guests={guests}
                    cart={cart}
                    mealTotal={mealTotal}
                    grandTotal={grandTotal}
                    payMethod={payMethod}
                    cardNum={cardNum}
                    expiry={expiry}
                    cvv={cvv}
                    upiId={upiId}
                    onPayMethod={setPayMethod}
                    onCardNum={setCardNum}
                    onExpiry={setExpiry}
                    onCvv={setCvv}
                    onUpiId={setUpiId}
                    T={T}
                    bg={bg}
                    isDark={isDark}
                  />
                )}
                <View style={{ height: 20 }} />
              </ScrollView>
            </Animated.View>

            {/* ── FIXED BOTTOM NAV ──────────────────────────────────────── */}
            <SafeAreaView
              edges={["bottom"]}
              style={[
                s.bottomBar,
                {
                  borderTopColor: 'transparent',
                  backgroundColor: 'transparent',
                },
              ]}
            >
              <View style={s.navRow}>
                {step > 0 ? (
                  <TouchableOpacity
                    style={[s.backBtn, { borderColor: T.border }]}
                    onPress={goBack}
                  >
                    <Ionicons name="arrow-back" size={18} color={T.text} />
                    <Text style={[s.backBtnTxt, { color: T.text }]}>Back</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ flex: 0.4 }} />
                )}

                {step < 3 ? (
                  <TouchableOpacity
                    style={[s.nextBtn, !canNext && s.nextBtnDisabled]}
                    onPress={canNext ? goNext : undefined}
                    activeOpacity={canNext ? 0.85 : 1}
                  >
                    <Text style={s.nextBtnTxt}>
                      {step === 2
                        ? cart.length > 0
                          ? "Review & Pay"
                          : "Skip & Pay"
                        : "Continue"}
                    </Text>
                    <Ionicons name="arrow-forward" size={18} color="#000" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[s.nextBtn, !canNext && s.nextBtnDisabled]}
                    onPress={canNext ? handlePay : undefined}
                    activeOpacity={canNext ? 0.85 : 1}
                  >
                    <Ionicons name="lock-closed" size={16} color="#000" />
                    <Text style={s.nextBtnTxt}>
                      Pay ${grandTotal.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </SafeAreaView>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}
