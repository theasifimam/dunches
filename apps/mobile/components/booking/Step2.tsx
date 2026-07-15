import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TABLE_LAYOUT } from "./booking.constants";
import { s } from "./booking.styles";
import { StepHeading } from "./CommonComponents";

const { width } = Dimensions.get("window");

export default function Step2({
  bookedTables,
  selTable,
  guests,
  onSelect,
  T,
  isDark,
}: any) {
  const zones = [
    {
      row: 1,
      label: "HIGHWAY VIEW",
      sub: "2-seaters",
      tables: TABLE_LAYOUT.filter((t) => t.row === 1),
    },
    {
      row: 2,
      label: "CENTER HALL",
      sub: "4-seaters",
      tables: TABLE_LAYOUT.filter((t) => t.row === 2),
    },
    {
      row: 3,
      label: "FAMILY BOOTHS",
      sub: "6-seaters",
      tables: TABLE_LAYOUT.filter((t) => t.row === 3),
    },
  ];

  return (
    <>
      <StepHeading
        icon="location-outline"
        title="Where would you like to sit?"
        sub="Tap any available table on the floor plan below."
        T={T}
      />

      {/* Legend */}
      <View
        style={[
          s.legend,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.03)",
            borderColor: T.border,
          },
        ]}
      >
        {[
          { c: "#10b981", bg: "rgba(16,185,129,0.15)", lbl: "Available" },
          { c: "#EF4444", bg: "rgba(239,68,68,0.12)", lbl: "Booked" },
          { c: T.tint, bg: T.tint + "28", lbl: "Selected" },
        ].map((l) => (
          <View key={l.lbl} style={s.legendItem}>
            <View
              style={[s.legendDot, { borderColor: l.c, backgroundColor: l.bg }]}
            />
            <Text style={[s.legendLbl, { color: T.subtext }]}>{l.lbl}</Text>
          </View>
        ))}
      </View>

      {/* Floor entrance banner */}
      <View
        style={[
          s.entranceBanner,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.03)",
            borderColor: T.border,
          },
        ]}
      >
        <Text style={[s.entranceTxt, { color: T.subtext }]}>
          ⬆ ENTRANCE / MAIN DOOR
        </Text>
      </View>

      {zones.map((zone) => (
        <View key={zone.row} style={s.zoneBlock}>
          <View style={s.zoneHeader}>
            <Text style={[s.zoneLabel, { color: T.tint }]}>{zone.label}</Text>
            <Text style={[s.zoneSub, { color: T.subtext }]}>{zone.sub}</Text>
          </View>
          <View style={s.tableRow}>
            {zone.tables.map((table) => {
              const booked = bookedTables.includes(table.id);
              const selected = selTable === table.id;
              const tW =
                table.row === 1
                  ? (width - 108) / 5
                  : table.row === 2
                    ? (width - 96) / 4
                    : (width - 82) / 3;
              const tH = table.row === 1 ? 52 : table.row === 2 ? 58 : 64;

              return (
                <TouchableOpacity
                  key={table.id}
                  disabled={booked}
                  activeOpacity={0.75}
                  style={[
                    s.tableBtn,
                    {
                      width: tW,
                      height: tH,
                      borderColor: selected
                        ? T.tint
                        : booked
                          ? "#EF4444"
                          : "#10b981",
                      backgroundColor: selected
                        ? T.tint
                        : booked
                          ? "rgba(239,68,68,0.08)"
                          : "rgba(16,185,129,0.07)",
                    },
                  ]}
                  onPress={() => onSelect(table.id, table.capacity)}
                >
                  <Text
                    style={[
                      s.tableLbl,
                      {
                        color: selected
                          ? "#000"
                          : booked
                            ? "#EF4444"
                            : "#10b981",
                      },
                    ]}
                  >
                    {table.id}
                  </Text>
                  <Text
                    style={[
                      s.tableCap,
                      {
                        color: selected
                          ? "#00000099"
                          : booked
                            ? "#EF444466"
                            : "#10b98166",
                      },
                    ]}
                  >
                    {table.capacity}p
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      {/* Availability notice */}
      <View
        style={[
          s.availNote,
          { backgroundColor: T.tint + "10", borderColor: T.tint + "30" },
        ]}
      >
        <Ionicons name="time-outline" size={15} color={T.tint} />
        <Text style={[s.availNoteTxt, { color: T.subtext }]}>
          Availability shown is based on your selected date & time slot.
        </Text>
      </View>

      {/* Selection banner */}
      {selTable ? (
        <View
          style={[
            s.selAlert,
            { backgroundColor: "#10b98115", borderColor: "#10b98140" },
          ]}
        >
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          <Text style={[s.selAlertTxt, { color: T.text }]}>
            <Text style={{ fontWeight: "900" }}>Table {selTable}</Text> selected
            — seats up to{" "}
            {TABLE_LAYOUT.find((t) => t.id === selTable)?.capacity} guests.
          </Text>
        </View>
      ) : (
        <View
          style={[
            s.hint,
            { backgroundColor: T.tint + "10", borderColor: T.tint + "28" },
          ]}
        >
          <Ionicons name="hand-left-outline" size={15} color={T.tint} />
          <Text style={[s.hintTxt, { color: T.subtext }]}>
            Tap a green table to select your spot.
          </Text>
        </View>
      )}
    </>
  );
}
