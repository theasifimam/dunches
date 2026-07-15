import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { STEP_LABELS } from "./booking.constants";
import { s, pb } from "./booking.styles";

export function ProgressBar({ step, colors }: { step: number; colors: any }) {
  const icons: any[] = [
    "calendar-outline",
    "location-outline",
    "restaurant-outline",
    "card-outline",
  ];
  return (
    <View style={pb.row}>
      {STEP_LABELS.map((lbl, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <React.Fragment key={i}>
            <View style={pb.col}>
              <View
                style={[
                  pb.circle,
                  done && {
                    backgroundColor: "#10b981",
                    borderColor: "#10b981",
                  },
                  active && {
                    backgroundColor: colors.tint,
                    borderColor: colors.tint,
                  },
                  !done && !active && { borderColor: colors.border },
                ]}
              >
                {done ? (
                  <Ionicons name="checkmark" size={12} color="#fff" />
                ) : (
                  <Ionicons
                    name={icons[i]}
                    size={12}
                    color={active ? "#000" : colors.subtext}
                  />
                )}
              </View>
              <Text
                style={[
                  pb.lbl,
                  {
                    color: done
                      ? "#10b981"
                      : active
                        ? colors.tint
                        : colors.subtext,
                  },
                ]}
              >
                {lbl}
              </Text>
            </View>
            {i < STEP_LABELS.length - 1 && (
              <View
                style={[
                  pb.line,
                  { backgroundColor: i < step ? "#10b981" : colors.border },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

export function StepHeading({ icon, title, sub, T }: any) {
  return (
    <View style={s.stepHead}>
      <View
        style={[
          s.stepIconCircle,
          { backgroundColor: T.tint + "20", borderColor: T.tint + "40" },
        ]}
      >
        <Ionicons name={icon} size={22} color={T.tint} />
      </View>
      <Text style={[s.stepTitle, { color: T.text }]}>{title}</Text>
      <Text style={[s.stepSub, { color: T.subtext }]}>{sub}</Text>
    </View>
  );
}

export function InputRow({ icon, children, border }: any) {
  return (
    <View style={[s.inputRow, { borderBottomColor: border }]}>
      {icon && (
        <Ionicons
          name={icon}
          size={18}
          color="#888"
          style={{ marginRight: 10 }}
        />
      )}
      {children}
    </View>
  );
}

export const Label = ({ text, color }: { text: string; color: string }) => (
  <Text style={[s.label, { color }]}>{text}</Text>
);
