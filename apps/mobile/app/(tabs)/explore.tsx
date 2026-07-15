import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Categories specific to Explore might have icons
const EXPLORE_CATEGORIES = [
  { id: '1', name: 'Curated' },
  { id: '2', name: 'Appetizers' },
  { id: '3', name: 'Main Course' },
  { id: '4', name: 'Breads' },
  { id: '5', name: 'Desserts' },
];

const EXPLORE_ITEMS = [
  {
    id: 'e1',
    name: 'Tandoori Murgh',
    price: '$22.00',
    time: '20 min',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'e2',
    name: 'Shahi Curry',
    price: '$18.00',
    time: '25 min',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'e3',
    name: 'Garlic Naan',
    price: '$4.00',
    time: '10 min',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'e4',
    name: 'Gulab Jamun',
    price: '$8.00',
    time: '5 min',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'e5',
    name: 'Mutton Seekh',
    price: '$26.00',
    time: '30 min',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'e6',
    name: 'Phirni',
    price: '$9.00',
    time: '15 min',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000&auto=format&fit=crop',
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const activeTheme = Colors[theme];
  const [activeCategory, setActiveCategory] = useState('1');

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: activeTheme.text }]}>Explore{'\n'}Cuisine</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={[styles.searchPill, { backgroundColor: activeTheme.glass, borderColor: activeTheme.border }]}>
          <Ionicons name="search" size={20} color={activeTheme.subtext} style={styles.searchIcon} />
          <TextInput
            placeholder="Search by name, category..."
            placeholderTextColor={activeTheme.subtext}
            style={[styles.searchInput, { color: activeTheme.text }]}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
        data={EXPLORE_CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={({ item: cat }) => (
          <TouchableOpacity
            onPress={() => setActiveCategory(cat.id)}
            style={[
              styles.categoryPill,
              { backgroundColor: activeCategory === cat.id ? activeTheme.text : 'transparent' },
              activeCategory !== cat.id && { borderWidth: 1, borderColor: activeTheme.border }
            ]}
          >
            <Text style={[
              styles.categoryText,
              { color: activeCategory === cat.id ? activeTheme.background : activeTheme.text },
              activeCategory === cat.id && { fontWeight: '800' }
            ]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>Our Royal Catalog</Text>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      {/* Premium Sweeping Gradient Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={isDark ? ['#333333', '#111111', '#000000'] : ['#FFFFFF', '#FDF0D5', '#e6b32511']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={isDark ? ['rgba(230, 179, 37, 0.12)', 'transparent'] : ['rgba(255, 255, 255, 0.4)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 0.8 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={EXPLORE_ITEMS}
          ListHeaderComponent={renderHeader}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.gridItem, { backgroundColor: activeTheme.glass, borderColor: activeTheme.border }]}
              onPress={() => router.push('/food-detail')}
              activeOpacity={0.8}
            >
              <Image source={{ uri: item.image }} style={styles.gridImage} />
              <View style={styles.gridContent}>
                <Text style={[styles.gridName, { color: activeTheme.text }]} numberOfLines={1}>{item.name}</Text>
                <Text style={[styles.gridTime, { color: activeTheme.subtext }]}>{item.time}</Text>
                <View style={styles.gridBottom}>
                  <Text style={[styles.gridPrice, { color: activeTheme.tint }]}>{item.price}</Text>
                  <View style={[styles.miniAddWrapper, { borderColor: activeTheme.border }]}>
                     <Ionicons name="add" size={16} color={activeTheme.text} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
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
    paddingTop: 10,
  },
  header: {
    paddingHorizontal: 25,
    marginBottom: 25,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: '900',
    lineHeight: 44,
    letterSpacing: -1.5,
  },
  searchContainer: {
    paddingHorizontal: 25,
    marginBottom: 35,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingRight: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    height: '100%',
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6B325',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryScroll: {
    marginBottom: 35,
  },
  categoryContent: {
    paddingHorizontal: 25,
    gap: 12,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginBottom: 20,
    gap: 15,
  },
  gridItem: {
    flex: 1,
    borderRadius: 30,
    padding: 12,
    borderWidth: 1,
  },
  gridImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    marginBottom: 12,
  },
  gridContent: {
    paddingHorizontal: 5,
    paddingBottom: 5,
  },
  gridName: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  gridTime: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  gridBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridPrice: {
    fontSize: 16,
    fontWeight: '900',
  },
  miniAddWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
