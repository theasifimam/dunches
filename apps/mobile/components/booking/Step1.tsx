import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TIME_SLOTS, VEHICLES } from "./booking.constants";
import { s } from "./booking.styles";
import { StepHeading, InputRow, Label } from "./CommonComponents";

export default function Step1({
  daysList,
  selDate,
  selTime,
  name,
  phone,
  guests,
  vehicle,
  onDate,
  onTime,
  onName,
  onPhone,
  onGuests,
  onVehicle,
  T,
  bg,
}: any) {
  return (
    <>
      <StepHeading
        icon="calendar-outline"
        title="When are you visiting?"
        sub="Pick a date and time for your reservation, then tell us about your group."
        T={T}
      />

      <Label text="SELECT DATE" color={T.subtext} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingBottom: 22 }}
      >
        {daysList.map((d: any, i: number) => {
          const sel =
            selDate.getDate() === d.date.getDate() &&
            selDate.getMonth() === d.date.getMonth();
          return (
            <TouchableOpacity
              key={i}
              onPress={() => onDate(d.date)}
              style={[
                s.dayPill,
                {
                  borderColor: sel ? T.tint : T.border,
                  backgroundColor: sel ? T.tint : "transparent",
                },
              ]}
            >
              <Text style={[s.dayName, { color: sel ? "#000" : T.subtext }]}>
                {d.dayName}
              </Text>
              <Text style={[s.dayNum, { color: sel ? "#000" : T.text }]}>
                {d.dayNum}
              </Text>
              <Text style={[s.dayMon, { color: sel ? "#000" : T.subtext }]}>
                {d.month}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Label text="SELECT TIME SLOT" color={T.subtext} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingBottom: 22 }}
      >
        {TIME_SLOTS.map((t, i) => {
          const sel = selTime === t;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => onTime(t)}
              style={[
                s.timePill,
                {
                  borderColor: sel ? T.tint : T.border,
                  backgroundColor: sel ? T.tint : "transparent",
                },
              ]}
            >
              <Text style={[s.timeText, { color: sel ? "#000" : T.text }]}>
                {t}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={[s.divider, { backgroundColor: T.border }]} />

      <Label text="FULL NAME" color={T.subtext} />
      <InputRow icon="person-outline" border={T.border}>
        <TextInput
          style={[s.input, { color: T.text }]}
          placeholder="Your full name"
          placeholderTextColor={T.subtext}
          value={name}
          onChangeText={onName}
        />
      </InputRow>

      <Label text="PHONE NUMBER" color={T.subtext} />
      <InputRow icon="call-outline" border={T.border}>
        <View
          style={[s.prefix, { borderRightColor: T.border, borderRightWidth: 1 }]}
        >
          <Text style={[s.prefixTxt, { color: T.text }]}>+91</Text>
        </View>
        <TextInput
          style={[s.input, { color: T.text }]}
          placeholder="000 000 0000"
          placeholderTextColor={T.subtext}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={onPhone}
        />
      </InputRow>

      <Label text="NO. OF GUESTS" color={T.subtext} />
      <View style={[s.counter, { backgroundColor: bg, marginBottom: 20 }]}>
        <TouchableOpacity style={s.cBtn} onPress={() => onGuests(-1)}>
          <Ionicons name="remove" size={18} color={T.text} />
        </TouchableOpacity>
        <Text style={[s.cVal, { color: T.text }]}>{guests}</Text>
        <TouchableOpacity style={s.cBtn} onPress={() => onGuests(1)}>
          <Ionicons name="add" size={18} color={T.text} />
        </TouchableOpacity>
      </View>

      <Label text="VEHICLE" color={T.subtext} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingBottom: 22 }}
      >
        {VEHICLES.map((v) => {
          const sel = vehicle === v;
          return (
            <TouchableOpacity
              key={v}
              onPress={() => onVehicle(v)}
              style={[
                s.chip,
                {
                  borderColor: sel ? T.tint : T.border,
                  backgroundColor: sel ? T.tint : "transparent",
                },
              ]}
            >
              <Text style={[s.chipTxt, { color: sel ? "#000" : T.text }]}>
                {v}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Validation hint */}
      {(!name.trim() || !phone.trim()) && (
        <View
          style={[
            s.hint,
            { backgroundColor: T.tint + "12", borderColor: T.tint + "30" },
          ]}
        >
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={T.tint}
          />
          <Text style={[s.hintTxt, { color: T.subtext }]}>
            Please fill your name and phone number to continue.
          </Text>
        </View>
      )}
    </>
  );
}
