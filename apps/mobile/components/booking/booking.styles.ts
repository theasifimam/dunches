import { StyleSheet } from "react-native";
import { ticketStyles } from "./bookingTicket.styles";

export const pb = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 4 },
  col: { alignItems: "center", width: 54 },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  lbl: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.3,
    textAlign: "center",
  },
  line: { flex: 1, height: 1.5, marginTop: 14 },
});

export const s = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },

  // Top bar
  topBar: { borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 14 },
  topBarInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 22,
    paddingTop: 10,
    marginBottom: 14,
  },
  topTitle: { fontSize: 22, fontWeight: "800", letterSpacing: -0.5 },
  topSub: { fontSize: 12, fontWeight: "500", marginTop: 2 },
  skipBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 24,
    borderWidth: 1,
  },
  skipBtnText: { fontSize: 12, fontWeight: "700" },
  progressWrap: { paddingHorizontal: 22 },

  // Step body
  stepBody: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingTop: 26, paddingBottom: 24 },

  // Step heading
  stepHead: { alignItems: "center", marginBottom: 32 },
  stepIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: 8,
  },
  stepSub: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 12,
  },

  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
    marginBottom: 10,
    marginLeft: 2,
  },

  // Day picker
  dayPill: {
    width: 58,
    height: 80,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dayName: { fontSize: 11, fontWeight: "600", marginBottom: 2 },
  dayNum: { fontSize: 20, fontWeight: "700", lineHeight: 26 },
  dayMon: { fontSize: 10, fontWeight: "500", marginTop: 2 },

  // Time grid
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 24,
  },
  timePill: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  timeText: { fontSize: 14, fontWeight: "700" },

  divider: { height: StyleSheet.hairlineWidth, marginVertical: 24 },

  // Prefix (country code)
  prefix: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
    borderRightWidth: 0,
    marginRight: 6,
  },
  prefixTxt: { fontSize: 15, fontWeight: "600" },

  // Inputs
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderBottomWidth: 1,
    paddingHorizontal: 4,
    marginBottom: 18,
  },
  input: { flex: 1, fontSize: 15, fontWeight: "600" },

  // Two-column
  twoCol: { flexDirection: "row", gap: 12, marginBottom: 4 },

  // Counter
  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    borderRadius: 22,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  cBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cVal: { fontSize: 20, fontWeight: "900" },

  // Chip
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipTxt: { fontSize: 14, fontWeight: "700" },

  // Hint
  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 20,
    borderWidth: 0,
    marginTop: 8,
  },
  hintTxt: { fontSize: 12, flex: 1 },

  // Legend
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 22,
    padding: 12,
    borderRadius: 22,
    borderWidth: 0,
    marginBottom: 16,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 14, height: 14, borderRadius: 6, borderWidth: 1 },
  legendLbl: { fontSize: 10, fontWeight: "600", textTransform: "uppercase" },

  // Entrance banner
  entranceBanner: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: "dashed",
    marginBottom: 20,
    alignItems: "center",
  },
  entranceTxt: { fontSize: 11, fontWeight: "600", letterSpacing: 1.5 },

  // Table zones
  zoneBlock: { marginBottom: 22 },
  zoneHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 10,
  },
  zoneLabel: { fontSize: 11, fontWeight: "900", letterSpacing: 1.5 },
  zoneSub: { fontSize: 11, fontWeight: "500" },
  tableRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tableBtn: {
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tableLbl: { fontSize: 13, fontWeight: "900" },
  tableCap: { fontSize: 9, fontWeight: "700", marginTop: 1 },

  availNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 20,
    borderWidth: 0,
    marginBottom: 12,
  },
  availNoteTxt: { fontSize: 12, flex: 1 },
  selAlert: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 22,
    borderWidth: 0,
  },
  selAlertTxt: { fontSize: 13, lineHeight: 18, flex: 1 },

  // Menu
  optionalNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 14,
    borderRadius: 20,
    borderWidth: 0,
    marginBottom: 22,
  },
  optionalNoteTxt: { flex: 1, fontSize: 12, lineHeight: 17 },
  menuCatBlock: { marginBottom: 18 },
  menuCatLbl: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 24,
    borderWidth: 0,
    marginBottom: 10,
  },
  menuImage: {
    width: 64,
    height: 64,
    borderRadius: 14,
    marginRight: 14,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  menuName: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  menuPrice: { fontSize: 13, fontWeight: "500" },
  qtyCtrl: { flexDirection: "row", alignItems: "center", gap: 8 },
  qBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  qVal: { fontSize: 15, fontWeight: "900", minWidth: 18, textAlign: "center" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
  },
  addBtnTxt: { fontSize: 13, fontWeight: "800" },
  mealSubCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 22,
    borderWidth: 0,
    marginTop: 6,
  },
  mealSubLbl: { fontSize: 14, fontWeight: "800", marginBottom: 2 },
  mealSubNote: { fontSize: 11 },
  mealSubVal: { fontSize: 22, fontWeight: "900" },

  // Bottom bar
  bottomBar: { borderTopWidth: StyleSheet.hairlineWidth },
  navRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 6,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 45,
    paddingHorizontal: 25,
    borderRadius: 24,
    borderWidth: 1,
  },
  backBtnTxt: { fontSize: 15, fontWeight: "600" },
  nextBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 45,
    borderRadius: 24,
    backgroundColor: "#E6B325",
  },
  nextBtnDisabled: { opacity: 0.38 },
  nextBtnTxt: { fontSize: 16, fontWeight: "700", color: "#000" },

  ...ticketStyles,
});
