import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MENU_ITEMS, CartItem } from "./booking.constants";
import { s } from "./booking.styles";

export default function SuccessScreen({
  bookingRef,
  selTable,
  selDate,
  selTime,
  guests,
  cart,
  mealTotal,
  grandTotal,
  T,
  isDark,
  onHome,
  onMenu,
  onNew,
}: any) {
  const tickBg = isDark ? "#161616" : "#FFFDF5";
  return (
    <View style={{ paddingTop: 16 }}>
      {/* Check */}
      <View style={s.successTop}>
        <View
          style={[
            s.checkCircle,
            { borderColor: "#10b981", backgroundColor: "rgba(16,185,129,0.1)" },
          ]}
        >
          <Ionicons name="checkmark-circle" size={64} color="#10b981" />
        </View>
        <Text style={[s.successTitle, { color: T.text }]}>
          Booking Confirmed!
        </Text>
        <Text style={[s.successSub, { color: T.subtext }]}>
          Your table is reserved. Show this ticket at the entrance.
        </Text>
      </View>

      {/* Digital Ticket */}
      <View style={[s.ticket, { backgroundColor: tickBg }]}>
        <LinearGradient
          colors={["#E6B325", "#C99A1A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.tickBand}
        />
        <View
          style={[s.cutL, { backgroundColor: isDark ? "#0A0A0A" : "#F0EBE0" }]}
        />
        <View
          style={[s.cutR, { backgroundColor: isDark ? "#0A0A0A" : "#F0EBE0" }]}
        />

        <View style={s.tickHead}>
          <Text style={s.tickRest}>✦ MUGHL DINING ✦</Text>
          <Text style={[s.tickTable, { color: "#E6B325" }]}>
            TABLE {selTable}
          </Text>
          <Text style={s.tickRef}>{bookingRef}</Text>
        </View>

        <View
          style={[s.tickDash, { borderColor: isDark ? "#2A2A2A" : "#E0D8C8" }]}
        />

        <View style={s.tickGrid}>
          {[
            {
              lbl: "DATE",
              val: selDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              hi: false,
            },
            { lbl: "TIME", val: selTime, hi: false },
            { lbl: "GUESTS", val: `${guests} Pax`, hi: false },
            { lbl: "STATUS", val: "CONFIRMED", hi: true },
          ].map((r) => (
            <View key={r.lbl} style={s.tickCell}>
              <Text style={s.tickCellLbl}>{r.lbl}</Text>
              <Text
                style={[
                  s.tickCellVal,
                  { color: r.hi ? "#10b981" : isDark ? "#FFF" : "#111" },
                ]}
              >
                {r.val}
              </Text>
            </View>
          ))}
        </View>

        {cart.length > 0 && (
          <>
            <View
              style={[
                s.tickDash,
                { borderColor: isDark ? "#2A2A2A" : "#E0D8C8" },
              ]}
            />
            <Text style={s.tickMealHdr}>PRE-ORDERED MEALS</Text>
            {cart.map((c: CartItem) => {
              const item = MENU_ITEMS.find((m) => m.id === c.id);
              return item ? (
                <View key={c.id} style={s.tickMealRow}>
                  <Text
                    style={[
                      s.tickMealName,
                      { color: isDark ? "#CCC" : "#555" },
                    ]}
                  >
                    {item.name} × {c.qty}
                  </Text>
                  <Text
                    style={[s.tickMealPx, { color: isDark ? "#888" : "#777" }]}
                  >
                    ${(item.price * c.qty).toFixed(2)}
                  </Text>
                </View>
              ) : null;
            })}
          </>
        )}

        <View
          style={[s.tickDash, { borderColor: isDark ? "#2A2A2A" : "#E0D8C8" }]}
        />

        <View style={s.tickTotal}>
          <Text style={[s.tickTotalLbl, { color: isDark ? "#777" : "#999" }]}>
            TOTAL PAID
          </Text>
          <Text style={[s.tickTotalAmt, { color: "#E6B325" }]}>
            ${grandTotal.toFixed(2)}
          </Text>
        </View>

        <View
          style={[
            s.tickBarArea,
            { borderTopColor: isDark ? "#2A2A2A" : "#E0D8C8" },
          ]}
        >
          <Ionicons
            name="barcode-outline"
            size={72}
            color={isDark ? "#444" : "#CCC"}
          />
          <Text style={[s.tickBarRef, { color: isDark ? "#444" : "#CCC" }]}>
            {bookingRef}
          </Text>
        </View>
      </View>

      {/* Action buttons */}
      <TouchableOpacity style={s.primaryBtn} onPress={onHome}>
        <Ionicons name="home-outline" size={18} color="#000" />
        <Text style={s.primaryBtnTxt}>Return Home</Text>
      </TouchableOpacity>
      {cart.length === 0 && (
        <TouchableOpacity
          style={[s.secondBtn, { borderColor: T.border }]}
          onPress={onMenu}
        >
          <Ionicons name="restaurant-outline" size={18} color={T.text} />
          <Text style={[s.secondBtnTxt, { color: T.text }]}>
            Browse Full Menu
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[s.secondBtn, { borderColor: T.border }]}
        onPress={onNew}
      >
        <Ionicons name="add-circle-outline" size={18} color={T.text} />
        <Text style={[s.secondBtnTxt, { color: T.text }]}>
          Make Another Booking
        </Text>
      </TouchableOpacity>
    </View>
  );
}
