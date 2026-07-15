import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { theme, isDark } = useAppTheme();
  const activeTheme = Colors[theme];


  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          height: 65,
          backgroundColor: activeTheme.tabBg,
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          height: 65,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 10,
        },

        tabBarBackground: () => (
          <BlurView
            intensity={isDark ? 80 : 50}
            tint={isDark ? "dark" : "light"}
            style={[
              StyleSheet.absoluteFill,
              {
                overflow: 'hidden',
                // borderWidth: 1,
                borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0,0,0,0.05)',
              },
            ]}
          />
        ),

        tabBarActiveTintColor: activeTheme.tint,
        tabBarInactiveTintColor: activeTheme.subtext,
        tabBarShowLabel: false,
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "search" : "search-outline"} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: 'Booking',
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "cart" : "cart-outline"} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={26} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E6B325',
    marginTop: 4,
  },
});
