import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { MENU_ITEMS, MENU_CATEGORIES } from "./booking.constants";
import { s } from "./booking.styles";
import { StepHeading } from "./CommonComponents";

export default function Step3({ cartMap, mealTotal, onQty, T, isDark }: any) {
  return (
    <>
      <StepHeading
        icon="restaurant-outline"
        title="What meals shall we serve?"
        sub="Pre-order dishes and they'll be ready the moment you arrive. This step is optional — you can always order at the table."
        T={T}
      />

      <View
        style={[
          s.optionalNote,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.04)",
            borderColor: T.border,
          },
        ]}
      >
        <Ionicons
          name="information-circle-outline"
          size={16}
          color={T.subtext}
        />
        <Text style={[s.optionalNoteTxt, { color: T.subtext }]}>
          Meals are <Text style={{ fontWeight: "800" }}>optional</Text>. You can
          tap {"\"Skip & Pay\""} to proceed without pre-ordering.
        </Text>
      </View>

      {MENU_CATEGORIES.map((cat) => {
        const items = MENU_ITEMS.filter((m) => m.category === cat);
        return (
          <View key={cat} style={s.menuCatBlock}>
            <Text style={[s.menuCatLbl, { color: T.tint }]}>
              {cat.toUpperCase()}
            </Text>
            <View
              style={[
                s.sectionInner,
                { backgroundColor: T.glass, borderColor: T.border },
              ]}
            >
              {items.map((item, index) => {
                const qty = cartMap[item.id] || 0;
                return (
                  <React.Fragment key={item.id}>
                    {index > 0 && (
                      <View style={[s.menuDivider, { backgroundColor: T.border }]} />
                    )}
                    <View style={s.menuItemRow}>
                      <Image source={item.image} style={s.menuImage} contentFit="cover" />
                      <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={[s.menuName, { color: T.text }]}>
                          {item.name}
                        </Text>
                        <Text style={[s.menuPrice, { color: T.tint }]}>
                          ${item.price.toFixed(2)}
                        </Text>
                      </View>
                      <View style={s.qtyCtrl}>
                        {qty > 0 ? (
                          <>
                            <TouchableOpacity
                              style={[s.qBtn, { borderColor: T.border }]}
                              onPress={() => onQty(item.id, -1)}
                            >
                              <Ionicons name="remove" size={15} color={T.text} />
                            </TouchableOpacity>
                            <Text style={[s.qVal, { color: T.text }]}>{qty}</Text>
                            <TouchableOpacity
                              style={[
                                s.qBtn,
                                { backgroundColor: T.tint, borderColor: T.tint },
                              ]}
                              onPress={() => onQty(item.id, 1)}
                            >
                              <Ionicons name="add" size={15} color="#000" />
                            </TouchableOpacity>
                          </>
                        ) : (
                          <TouchableOpacity
                            style={[s.addBtn, { borderColor: T.tint }]}
                            onPress={() => onQty(item.id, 1)}
                          >
                            <Ionicons name="add" size={16} color={T.tint} />
                            <Text style={[s.addBtnTxt, { color: T.tint }]}>
                              Add
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </React.Fragment>
                );
              })}
            </View>
          </View>
        );
      })}

      {mealTotal > 0 && (
        <View
          style={[
            s.mealSubCard,
            { backgroundColor: T.tint + "10", borderColor: T.tint + "30" },
          ]}
        >
          <View>
            <Text style={[s.mealSubLbl, { color: T.subtext }]}>
              Meals subtotal
            </Text>
            <Text style={[s.mealSubNote, { color: T.subtext }]}>
              Paid when you arrive or at checkout
            </Text>
          </View>
          <Text style={[s.mealSubVal, { color: T.tint }]}>
            ${mealTotal.toFixed(2)}
          </Text>
        </View>
      )}
    </>
  );
}
