import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RESERVATION_FEE, MENU_ITEMS, CartItem } from "./booking.constants";
import { s } from "./booking.styles";
import { StepHeading, InputRow, Label } from "./CommonComponents";

export default function Step4({
  selDate,
  selTime,
  selTable,
  guests,
  cart,
  mealTotal,
  grandTotal,
  payMethod,
  cardNum,
  expiry,
  cvv,
  upiId,
  onPayMethod,
  onCardNum,
  onExpiry,
  onCvv,
  onUpiId,
  T,
  bg,
  isDark,
}: any) {
  return (
    <>
      <StepHeading
        icon="card-outline"
        title="Confirm & Pay"
        sub="Review your booking summary and complete the reservation fee to secure your table."
        T={T}
      />

      {/* Summary card */}
      <View
        style={[s.sumCard, { backgroundColor: T.glass, borderColor: T.border }]}
      >
        <Text style={[s.sumTitle, { color: T.subtext }]}>BOOKING SUMMARY</Text>

        {[
          {
            icon: "calendar-outline",
            label: "Date",
            val: selDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }),
          },
          { icon: "time-outline", label: "Time", val: selTime },
          { icon: "grid-outline", label: "Table", val: `Table ${selTable}` },
          { icon: "people-outline", label: "Guests", val: `${guests} guests` },
        ].map((r) => (
          <View key={r.label} style={s.sumRow}>
            <Ionicons name={r.icon as any} size={15} color={T.subtext} />
            <Text style={[s.sumLbl, { color: T.subtext }]}>{r.label}</Text>
            <Text style={[s.sumVal, { color: T.text }]}>{r.val}</Text>
          </View>
        ))}

        {cart.length > 0 && (
          <>
            <View style={[s.dash, { borderColor: T.border }]} />
            <Text style={[s.sumMealsTitle, { color: T.subtext }]}>
              PRE-ORDERED MEALS
            </Text>
            {cart.map((c: CartItem) => {
              const item = MENU_ITEMS.find((m) => m.id === c.id);
              return item ? (
                <View key={c.id} style={s.sumMealRow}>
                  <Text style={[s.sumMealName, { color: T.text }]}>
                    {item.name} × {c.qty}
                  </Text>
                  <Text style={[s.sumMealPx, { color: T.subtext }]}>
                    ${(item.price * c.qty).toFixed(2)}
                  </Text>
                </View>
              ) : null;
            })}
          </>
        )}

        <View style={[s.dash, { borderColor: T.border }]} />

        <View style={s.sumTotals}>
          <View>
            <Text style={[s.sumFeeNote, { color: T.subtext }]}>
              Reservation fee (refundable)
            </Text>
            {mealTotal > 0 && (
              <Text style={[s.sumFeeNote, { color: T.subtext }]}>
                Meals pre-order
              </Text>
            )}
            <Text style={[s.sumGrandLbl, { color: T.text }]}>
              Total Due Now
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={[s.sumFeeAmt, { color: T.subtext }]}>
              ${RESERVATION_FEE.toFixed(2)}
            </Text>
            {mealTotal > 0 && (
              <Text style={[s.sumFeeAmt, { color: T.subtext }]}>
                ${mealTotal.toFixed(2)}
              </Text>
            )}
            <Text style={[s.sumGrandAmt, { color: T.tint }]}>
              ${grandTotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Payment method */}
      <Label text="PAYMENT METHOD" color={T.subtext} />
      <View style={s.payRow}>
        {[
          { key: "card", icon: "card-outline", label: "Credit / Debit Card" },
          { key: "upi", icon: "phone-portrait-outline", label: "UPI / Wallet" },
        ].map((m) => {
          const sel = payMethod === m.key;
          return (
            <TouchableOpacity
              key={m.key}
              style={[
                s.payBtn,
                {
                  borderColor: sel ? T.tint : T.border,
                  backgroundColor: sel ? T.tint + "14" : "transparent",
                },
              ]}
              onPress={() => onPayMethod(m.key)}
            >
              <Ionicons
                name={m.icon as any}
                size={20}
                color={sel ? T.tint : T.subtext}
              />
              <Text style={[s.payBtnLbl, { color: sel ? T.text : T.subtext }]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {payMethod === "card" ? (
        <>
          <Label text="CARD NUMBER" color={T.subtext} />
          <InputRow icon="card-outline" border={T.border}>
            <TextInput
              style={[s.input, { color: T.text }]}
              placeholder="0000 0000 0000 0000"
              placeholderTextColor={T.subtext}
              keyboardType="number-pad"
              maxLength={16}
              value={cardNum}
              onChangeText={onCardNum}
            />
          </InputRow>
          <View style={s.twoCol}>
            <View style={{ flex: 1 }}>
              <Label text="EXPIRY" color={T.subtext} />
              <View style={[s.inputRow, { borderBottomColor: T.border }]}>
                <TextInput
                  style={[s.input, { color: T.text }]}
                  placeholder="MM / YY"
                  placeholderTextColor={T.subtext}
                  maxLength={5}
                  value={expiry}
                  onChangeText={onExpiry}
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Label text="CVV" color={T.subtext} />
              <View style={[s.inputRow, { borderBottomColor: T.border }]}>
                <TextInput
                  style={[s.input, { color: T.text }]}
                  placeholder="• • •"
                  placeholderTextColor={T.subtext}
                  keyboardType="number-pad"
                  maxLength={3}
                  secureTextEntry
                  value={cvv}
                  onChangeText={onCvv}
                />
              </View>
            </View>
          </View>
        </>
      ) : (
        <>
          <Label text="UPI ID" color={T.subtext} />
          <InputRow icon="at-outline" border={T.border}>
            <TextInput
              style={[s.input, { color: T.text }]}
              placeholder="yourname@bank"
              placeholderTextColor={T.subtext}
              autoCapitalize="none"
              value={upiId}
              onChangeText={onUpiId}
            />
          </InputRow>
        </>
      )}

      {/* Secure badge */}
      <View style={s.secureBadge}>
        <Ionicons name="shield-checkmark-outline" size={14} color="#10b981" />
        <Text style={[s.secureTxt, { color: T.subtext }]}>
          Payment info is encrypted and never stored on our servers.
        </Text>
      </View>
    </>
  );
}
