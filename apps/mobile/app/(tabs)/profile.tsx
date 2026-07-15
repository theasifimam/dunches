import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/theme";
import { useAppTheme } from "@/context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { RootState, logout } from "@/store";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme, toggleTheme, isDark } = useAppTheme();
  const activeTheme = Colors[theme];

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const SettingItem = ({ icon, title, value, type = "chevron" }: any) => (
    <TouchableOpacity style={[styles.settingItem]}>
      <View style={styles.settingLeft}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: activeTheme.tint + "20" },
          ]}
        >
          <Ionicons name={icon} size={22} color={activeTheme.tint} />
        </View>
        <Text style={[styles.settingTitle, { color: activeTheme.text }]}>
          {title}
        </Text>
      </View>
      {type === "toggle" ? (
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: "#767577", true: activeTheme.tint }}
          thumbColor={isDark ? "#FFF" : "#f4f3f4"}
        />
      ) : (
        <View style={styles.settingRight}>
          {value && (
            <Text style={[styles.settingValue, { color: activeTheme.subtext }]}>
              {value}
            </Text>
          )}
          <Ionicons
            name="chevron-forward"
            size={20}
            color={activeTheme.subtext}
          />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Premium Sweeping Gradient Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={
            isDark
              ? ["#333333", "#111111", "#000000"]
              : ["#FFFFFF", "#FDF0D5", "#e6b32511"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Soft gold highlight from the top left corner */}
        <LinearGradient
          colors={
            isDark
              ? ["rgba(230, 179, 37, 0.12)", "transparent"]
              : ["rgba(255, 255, 255, 0.4)", "transparent"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 0.8 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {isAuthenticated ? (
            <>
              {/* Profile Header */}
              <View style={styles.header}>
                <View
                  style={[
                    styles.profileImageContainer,
                    { borderColor: activeTheme.tint },
                  ]}
                >
                  <Image
                    source={{ uri: "https://i.pravatar.cc/100" }}
                    style={styles.profileImage}
                  />
                  <TouchableOpacity style={styles.editButton}>
                    <Ionicons name="camera" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.profileName, { color: activeTheme.text }]}>
                  {user?.name || "Ayaan Ahmed"}
                </Text>
                <Text style={[styles.profileEmail, { color: activeTheme.subtext }]}>
                  {user?.phone || user?.email || "ayaan@mughl.com"}
                </Text>
              </View>

              {/* Stats */}
              <View style={styles.statsContainer}>
                <View
                  style={[styles.statItem, { backgroundColor: activeTheme.glass }]}
                >
                  <Text style={[styles.statValue, { color: activeTheme.tint }]}>
                    {user?.ordersCount || 24}
                  </Text>
                  <Text style={[styles.statLabel, { color: activeTheme.subtext }]}>
                    Orders
                  </Text>
                </View>
                <View
                  style={[styles.statItem, { backgroundColor: activeTheme.glass }]}
                >
                  <Text style={[styles.statValue, { color: activeTheme.tint }]}>
                    {user?.points || 1200}
                  </Text>
                  <Text style={[styles.statLabel, { color: activeTheme.subtext }]}>
                    Points
                  </Text>
                </View>
              </View>

              {/* Settings Groups */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: activeTheme.subtext }]}>
                  APPEARANCE
                </Text>
                <View
                  style={[
                    styles.sectionInner,
                    { backgroundColor: activeTheme.glass },
                  ]}
                >
                  <SettingItem
                    icon={isDark ? "moon-outline" : "sunny-outline"}
                    title="Dark Mode"
                    type="toggle"
                  />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: activeTheme.subtext }]}>
                  ACCOUNT
                </Text>
                <View
                  style={[
                    styles.sectionInner,
                    { backgroundColor: activeTheme.glass },
                  ]}
                >
                  <SettingItem icon="person-outline" title="Personal Info" />
                  <View
                    style={[
                      styles.divider,
                      { backgroundColor: activeTheme.border },
                    ]}
                  />
                  <SettingItem
                    icon="location-outline"
                    title="Addresses"
                    value="2 saved"
                  />
                  <View
                    style={[
                      styles.divider,
                      { backgroundColor: activeTheme.border },
                    ]}
                  />
                  <SettingItem icon="card-outline" title="Payment Methods" />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: activeTheme.subtext }]}>
                  PREFERENCES
                </Text>
                <View
                  style={[
                    styles.sectionInner,
                    { backgroundColor: activeTheme.glass },
                  ]}
                >
                  <SettingItem icon="notifications-outline" title="Notifications" />
                  <View
                    style={[
                      styles.divider,
                      { backgroundColor: activeTheme.border },
                    ]}
                  />
                  <SettingItem
                    icon="language-outline"
                    title="Language"
                    value="English"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.logoutButton, { borderColor: activeTheme.border }]}
                onPress={() => dispatch(logout())}
              >
                <Ionicons name="log-out-outline" size={22} color="#FF4B4B" />
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Signed Out View */}
              <View style={styles.loggedOutCard}>
                <View style={styles.loggedOutIconContainer}>
                  <LinearGradient
                    colors={isDark ? ['#E6B325', '#9A7815'] : ['#E6B325', '#FFD875']}
                    style={styles.loggedOutIconBg}
                  >
                    <Ionicons name="crown-outline" size={40} color={isDark ? '#000' : '#FFF'} />
                  </LinearGradient>
                </View>

                <Text style={[styles.loggedOutTitle, { color: activeTheme.text }]}>
                  The Royal Privilege
                </Text>
                
                <Text style={[styles.loggedOutSubtitle, { color: activeTheme.subtext }]}>
                  Unlock access to the Imperial VIP suite, track your dining reservations, pre-order high-demand recipes, and earn royal loyalty points.
                </Text>

                <TouchableOpacity
                  style={[styles.loginButton, { backgroundColor: activeTheme.tint }]}
                  onPress={() => router.push('/signin')}
                >
                  <Text style={styles.loginButtonTxt}>ACCESS PRIVILEGE PROFILE</Text>
                  <Ionicons name="arrow-forward" size={16} color="#000" />
                </TouchableOpacity>
              </View>

              {/* Settings Groups (Only appearance when logged out) */}
              <View style={[styles.section, { marginTop: 15 }]}>
                <Text style={[styles.sectionTitle, { color: activeTheme.subtext }]}>
                  APPEARANCE
                </Text>
                <View
                  style={[
                    styles.sectionInner,
                    { backgroundColor: activeTheme.glass },
                  ]}
                >
                  <SettingItem
                    icon={isDark ? "moon-outline" : "sunny-outline"}
                    title="Dark Mode"
                    type="toggle"
                  />
                </View>
              </View>
            </>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  profileImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    padding: 3,
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 55,
  },
  editButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#E6B325",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#000",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 40,
  },
  statItem: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 15,
    marginLeft: 5,
  },
  sectionInner: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  divider: {
    height: 1,
    marginLeft: 67,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 10,
    gap: 10,
  },
  logoutText: {
    color: "#FF4B4B",
    fontSize: 16,
    fontWeight: "700",
  },
  // Logged out styles
  loggedOutCard: {
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(230, 179, 37, 0.15)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    marginBottom: 20,
    marginTop: 10,
  },
  loggedOutIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loggedOutIconBg: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loggedOutTitle: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  loggedOutSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 25,
    opacity: 0.8,
  },
  loginButton: {
    flexDirection: "row",
    height: 52,
    borderRadius: 15,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: '#E6B325',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  loginButtonTxt: {
    color: "#000",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
});
