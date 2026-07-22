import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/context/ThemeContext';
import { AddressBottomSheet } from '@/components/AddressBottomSheet';
import { LinearGradient } from 'expo-linear-gradient';

import { HomeAnnouncements } from '@/components/home/HomeAnnouncements';
import { HomeFeaturedMasterpieces } from '@/components/home/HomeFeaturedMasterpieces';
import { HomeTrendingList } from '@/components/home/HomeTrendingList';

const CATEGORIES = [
  { id: '1', name: 'All', icon: 'grid-outline' },
  { id: '2', name: 'Biryani', icon: 'restaurant-outline' },
  { id: '3', name: 'Kebabs', icon: 'flame-outline' },
  { id: '4', name: 'Curry', icon: 'bowl-outline' },
  { id: '5', name: 'Desserts', icon: 'ice-cream-outline' },
];

const FEATURED_ITEMS = [
  {
    id: 'f1',
    name: 'Royale Biryani',
    price: '$24.00',
    rating: '4.9',
    time: '25-30 min',
    image:
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'f2',
    name: 'Shish Kebabs',
    price: '$18.00',
    rating: '4.8',
    time: '15-20 min',
    image:
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop',
  },
];

export default function HomeScreen() {
  const { theme, isDark } = useAppTheme();
  const activeTheme = Colors[theme];
  const [activeCategory, setActiveCategory] = useState('1');

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [addressSummary, setAddressSummary] = useState('');

  const handleOpenPress = () => bottomSheetRef.current?.present();

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={
            isDark
              ? ['#333333', '#111111', '#000000']
              : ['#FFFFFF', '#FDF0D5', '#e6b32511']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={
            isDark
              ? ['rgba(230, 179, 37, 0.12)', 'transparent']
              : ['rgba(255, 255, 255, 0.4)', 'transparent']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 0.8 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 140 },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <TouchableOpacity
                style={styles.deliverySelector}
                onPress={handleOpenPress}
                activeOpacity={0.7}
              >
                <Ionicons name="location" size={16} color={activeTheme.tint} />
                <Text style={styles.dateSubtext} numberOfLines={1}>
                  {addressSummary || 'Set Delivery Location'}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={14}
                  color={activeTheme.tint}
                />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: activeTheme.text }]}>
                Discover{'\n'}Royalty
              </Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/100' }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>

          {/* Search Pill */}
          <View style={styles.searchContainer}>
            <View
              style={[
                styles.searchPill,
                {
                  backgroundColor: activeTheme.glass,
                  borderColor: activeTheme.border,
                },
              ]}
            >
              <Ionicons
                name="search"
                size={20}
                color={activeTheme.subtext}
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Search the royal menu..."
                placeholderTextColor={activeTheme.subtext}
                style={[styles.searchInput, { color: activeTheme.text }]}
              />
              <TouchableOpacity style={styles.filterBtn}>
                <Ionicons name="options-outline" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Announcements */}
          <HomeAnnouncements />

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContent}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor:
                      activeCategory === cat.id
                        ? activeTheme.text
                        : 'transparent',
                  },
                  activeCategory !== cat.id && {
                    borderWidth: 1,
                    borderColor: activeTheme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color:
                        activeCategory === cat.id
                          ? activeTheme.background
                          : activeTheme.text,
                    },
                    activeCategory === cat.id && { fontWeight: '800' },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Masterpieces */}
          <HomeFeaturedMasterpieces
            items={FEATURED_ITEMS}
            activeTheme={activeTheme}
          />

          {/* Trending */}
          <HomeTrendingList
            items={FEATURED_ITEMS}
            activeTheme={activeTheme}
          />

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      <AddressBottomSheet
        ref={bottomSheetRef}
        onAddressChange={setAddressSummary}
      />
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
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 25,
    marginBottom: 35,
    marginTop: 10,
  },
  dateSubtext: {
    color: '#E6B325',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
    maxWidth: 150,
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: '900',
    lineHeight: 44,
    letterSpacing: -1.5,
  },
  deliverySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
    backgroundColor: 'rgba(230, 179, 37, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E6B325',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    paddingHorizontal: 25,
    marginBottom: 25,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingRight: 6,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  filterBtn: {
    backgroundColor: '#E6B325',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryScroll: {
    marginBottom: 40,
  },
  categoryContent: {
    paddingHorizontal: 25,
    gap: 12,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
