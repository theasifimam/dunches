import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { AddressBottomSheet } from '@/components/AddressBottomSheet';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'f2',
    name: 'Shish Kebabs',
    price: '$18.00',
    rating: '4.8',
    time: '15-20 min',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop',
  },
];

const ANNOUNCEMENTS = [
  {
    id: 'a1',
    badge: 'Limited Offer',
    title: 'Royal Feast Weekend 👑',
    subtitle: 'Book your table today and get a complimentary dessert + 2x reward points!',
    colors: ['#E6B325', '#C59A1A'] as const,
    textColor: '#000',
    btnColor: '#000',
    btnIconColor: '#E6B325'
  },
  {
    id: 'a2',
    badge: 'New Menu',
    title: 'Golden Hour Reserve ✨',
    subtitle: 'Experience our new exclusive sunset dining menu starting this Friday.',
    colors: ['#333333', '#111111'] as const,
    textColor: '#FFF',
    btnColor: '#E6B325',
    btnIconColor: '#000'
  },
  {
    id: 'a3',
    badge: 'Members Only',
    title: 'Crown Club Perks 🥂',
    subtitle: 'Get early access to our weekend specials and priority seating.',
    colors: ['#1A1A1A', '#000000'] as const,
    textColor: '#E6B325',
    btnColor: '#E6B325',
    btnIconColor: '#000'
  }
];

export default function HomeScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const activeTheme = Colors[theme];
  const [activeCategory, setActiveCategory] = useState('1');

  // Bottom Sheet State
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [addressSummary, setAddressSummary] = useState('');

  const handleOpenPress = () => bottomSheetRef.current?.present();

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
        {/* Soft gold highlight from the top left corner */}
        <LinearGradient
          colors={isDark ? ['rgba(230, 179, 37, 0.12)', 'transparent'] : ['rgba(255, 255, 255, 0.4)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 0.8 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 140 }]}
        >
          {/* Magazine Styled Header */}
          <View style={styles.header}>
            <View>
              <TouchableOpacity style={styles.deliverySelector} onPress={handleOpenPress} activeOpacity={0.7}>
                <Ionicons name="location" size={16} color={activeTheme.tint} />
                <Text style={styles.dateSubtext} numberOfLines={1}>
                   {addressSummary || 'Set Delivery Location'}
                </Text>
                <Ionicons name="chevron-down" size={14} color={activeTheme.tint} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: activeTheme.text }]}>Discover{'\n'}Royalty</Text>
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
            <View style={[styles.searchPill, { backgroundColor: activeTheme.glass, borderColor: activeTheme.border }]}>
              <Ionicons name="search" size={20} color={activeTheme.subtext} style={styles.searchIcon} />
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

          {/* Dribbble-styled Announcement Banners */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 25, gap: 15, paddingBottom: 15 }}
            style={{ marginBottom: 20 }}
            snapToInterval={width * 0.85 + 15}
            decelerationRate="fast"
          >
            {ANNOUNCEMENTS.map((offer) => (
              <TouchableOpacity 
                key={offer.id}
                style={[styles.announcementContainer, { width: width * 0.85 }]} 
                activeOpacity={0.9}
                onPress={() => router.push('/booking')}
              >
                <LinearGradient
                  colors={offer.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.announcementGradient}
                >
                  {/* Abstract decorative circles for Dribbble aesthetic */}
                  <View style={[styles.decorCircle, { width: 120, height: 120, borderRadius: 60, top: -50, right: -20, opacity: 0.15, backgroundColor: offer.textColor }]} />
                  <View style={[styles.decorCircle, { width: 80, height: 80, borderRadius: 40, bottom: -30, left: 10, opacity: 0.1, backgroundColor: offer.textColor }]} />

                  <View style={styles.announcementLeft}>
                    <View style={[styles.announcementBadge, { backgroundColor: offer.textColor === '#000' ? 'rgba(0,0,0,0.1)' : 'rgba(255, 255, 255, 0.25)' }]}>
                      <Text style={[styles.announcementBadgeTxt, { color: offer.textColor }]}>{offer.badge}</Text>
                    </View>
                    <Text style={[styles.announcementTitle, { color: offer.textColor }]}>{offer.title}</Text>
                    <Text style={[styles.announcementSub, { color: offer.textColor === '#000' ? 'rgba(0,0,0,0.7)' : (offer.textColor === '#E6B325' ? 'rgba(230,179,37,0.8)' : 'rgba(255, 255, 255, 0.9)') }]}>
                      {offer.subtitle}
                    </Text>
                  </View>

                  <View style={styles.announcementRight}>
                    <View style={[styles.announcementActionBtn, { backgroundColor: offer.btnColor }]}>
                      <Ionicons name="arrow-forward" size={20} color={offer.btnIconColor} />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Minimalist Categories */}
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
            ))}
          </ScrollView>

          {/* Featured Bento Carousel */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>Chef's Masterpieces</Text>
            <TouchableOpacity><Ionicons name="arrow-forward" size={24} color={activeTheme.tint} /></TouchableOpacity>
          </View>

          <FlatList
            data={FEATURED_ITEMS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.featuredList}
            snapToInterval={width * 0.75 + 25}
            decelerationRate="fast"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.featuredBento, { borderColor: activeTheme.border }]}
                activeOpacity={0.9}
                onPress={() => router.push('/food-detail')}
              >
                <Image source={{ uri: item.image }} style={styles.featuredImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.featuredGradient}
                />

                <View style={styles.featuredTags}>
                  <View style={styles.tagGlass}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.tagText}>{item.rating}</Text>
                  </View>
                  <View style={styles.tagGlass}>
                    <Text style={styles.tagText}>{item.time}</Text>
                  </View>
                </View>

                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredName} numberOfLines={1}>{item.name}</Text>
                  <View style={styles.featuredFooter}>
                    <Text style={styles.featuredPrice}>{item.price}</Text>
                    <View style={styles.addBtnSolid}>
                      <Ionicons name="add" size={20} color="#000" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />

          {/* Popular Now Asymmetric List */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>Trending Now</Text>
          </View>

          {FEATURED_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.popularBento, { backgroundColor: activeTheme.glass, borderColor: activeTheme.border }]}
              activeOpacity={0.85}
              onPress={() => router.push('/food-detail')}
            >
              <View style={styles.popularImageContainer}>
                <Image source={{ uri: item.image }} style={styles.popularImage} />
              </View>

              <View style={styles.popularContent}>
                <View style={styles.popularTop}>
                  <Text style={[styles.popularName, { color: activeTheme.text }]} numberOfLines={1}>{item.name}</Text>
                  <View style={styles.popularHeart}>
                    <Ionicons name="heart-outline" size={20} color={activeTheme.subtext} />
                  </View>
                </View>

                <View style={styles.popularMeta}>
                  <Text style={[styles.popularMetaText, { color: activeTheme.subtext }]}>{item.time} • High Demand</Text>
                </View>

                <View style={styles.popularBottom}>
                  <Text style={[styles.popularPrice, { color: activeTheme.tint }]}>{item.price}</Text>
                  <View style={[styles.miniAdd, { borderColor: activeTheme.border }]}>
                    <Text style={[styles.miniAddText, { color: activeTheme.text }]}>ADD</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}

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
  announcementContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  announcementGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    backgroundColor: '#FFF',
  },
  announcementLeft: {
    flex: 1,
    marginRight: 15,
    zIndex: 2,
  },
  announcementBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  announcementBadgeTxt: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  announcementTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  announcementSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  announcementRight: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  announcementActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingRight: 6,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  featuredList: {
    paddingHorizontal: 25,
    gap: 25,
    marginBottom: 45,
  },
  featuredBento: {
    width: width * 0.75,
    height: 310,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  featuredTags: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    gap: 10,
  },
  tagGlass: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backdropFilter: 'blur(10px)', // iOS visual effect if supported
  },
  tagText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  featuredInfo: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    right: 25,
  },
  featuredName: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 10,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredPrice: {
    color: '#E6B325',
    fontSize: 24,
    fontWeight: '900',
  },
  addBtnSolid: {
    backgroundColor: '#E6B325',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularBento: {
    flexDirection: 'row',
    marginHorizontal: 25,
    marginBottom: 20,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  popularImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
  },
  popularImage: {
    width: '100%',
    height: '100%',
  },
  popularContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
    height: 80,
  },
  popularTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  popularName: {
    fontSize: 18,
    fontWeight: '800',
    flex: 1,
  },
  popularHeart: {
    padding: 4,
  },
  popularMeta: {
    marginBottom: 8,
  },
  popularMetaText: {
    fontSize: 12,
    fontWeight: '600',
  },
  popularBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  popularPrice: {
    fontSize: 18,
    fontWeight: '900',
  },
  miniAdd: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
  },
  miniAddText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
