import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store';
import { useAppTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

const PORTIONS = ['Small', 'Medium', 'Large'];

export default function FoodDetailScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme, isDark } = useAppTheme();
  const activeTheme = Colors[theme];
  const [selectedPortion, setSelectedPortion] = useState('Medium');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: dish.id || 'c1', // Using fallback since static data doesn't have ID yet
      name: dish.name,
      price: dish.price,
      quantity: quantity,
      size: selectedPortion,
      image: dish.images[0],
    }));
    router.push('/cart');
  };


  const dish = {
    id: 'd1',
    name: 'Royale Biryani',
    price: 24.00,
    rating: '4.9',
    time: '25-30 min',
    calories: '450 kcal',
    description: 'Our signature Royale Biryani is a masterpiece of Mughal heritage. Slow-cooked with long-grain Basmati rice, tender hand-picked lamb, and a secret blend of 24 spices, finished with pure saffron and crispy caramelized onions.',
    images: [
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=1000&auto=format&fit=crop',
    ],
  };

  const [activeImage, setActiveImage] = useState(0);

  const handleScroll = (event: any) => {
    const slide = Math.ceil(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
    if (slide !== activeImage) {
      setActiveImage(slide);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: activeTheme.background }]}>
      <LinearGradient
        colors={activeTheme.gradient}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Image Carousel */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {dish.images.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.heroImage} />
            ))}
          </ScrollView>

          {/* Indicators */}
          <View style={styles.indicatorContainer}>
            {dish.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  { backgroundColor: activeImage === index ? activeTheme.tint : 'rgba(255,255,255,0.4)' },
                  activeImage === index && { width: 25 }
                ]}
              />
            ))}
          </View>

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)', activeTheme.background === '#FFFFFF' ? '#FFF' : '#0A0A0A']}
            style={styles.imageGradient}
          />


          <SafeAreaView style={styles.headerActions}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
              <BlurView intensity={30} tint={isDark ? "dark" : "light"} style={styles.blurIcon}>
                <Ionicons name="chevron-back" size={24} color={activeTheme.text} />
              </BlurView>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <BlurView intensity={30} tint={isDark ? "dark" : "light"} style={styles.blurIcon}>
                <Ionicons name="heart" size={24} color="#FF4B4B" />
              </BlurView>
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={[styles.dishName, { color: activeTheme.text }]}>{dish.name}</Text>
              <Text style={[styles.category, { color: activeTheme.tint }]}>Premium Mughalai</Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qBtn}>
                <Ionicons name="remove" size={20} color={activeTheme.text} />
              </TouchableOpacity>
              <Text style={[styles.qText, { color: activeTheme.text }]}>{quantity}</Text>
              <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qBtn}>
                <Ionicons name="add" size={20} color={activeTheme.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Bento */}
          <View style={styles.statsRow}>
            <View style={[styles.statBadge, { backgroundColor: activeTheme.glass }]}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={[styles.statText, { color: activeTheme.text }]}>{dish.rating}</Text>
            </View>
            <View style={[styles.statBadge, { backgroundColor: activeTheme.glass }]}>
              <Ionicons name="time-outline" size={16} color={activeTheme.tint} />
              <Text style={[styles.statText, { color: activeTheme.text }]}>{dish.time}</Text>
            </View>
            <View style={[styles.statBadge, { backgroundColor: activeTheme.glass }]}>
              <Ionicons name="flame-outline" size={16} color="#FF6347" />
              <Text style={[styles.statText, { color: activeTheme.text }]}>{dish.calories}</Text>
            </View>
          </View>

          <Text style={[styles.descriptionHeader, { color: activeTheme.text }]}>Description</Text>
          <Text style={[styles.descriptionContent, { color: activeTheme.subtext }]}>{dish.description}</Text>

          {/* Portions */}
          <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>Choice of Portion</Text>
          <View style={styles.portionContainer}>
            {PORTIONS.map((portion) => (
              <TouchableOpacity
                key={portion}
                onPress={() => setSelectedPortion(portion)}
                style={[
                  styles.portionBtn,
                  { backgroundColor: activeTheme.glass },
                  selectedPortion === portion && { backgroundColor: activeTheme.tint }
                ]}
              >
                <Text style={[
                  styles.portionText,
                  { color: activeTheme.text },
                  selectedPortion === portion && { color: activeTheme.onPrimary, fontWeight: 'bold' }
                ]}>
                  {portion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Redesigned Floating Bottom Bar */}
      <View style={styles.newBottomBarContainer}>
        <BlurView intensity={isDark ? 80 : 100} tint={isDark ? "dark" : "light"} style={styles.newBottomBlur}>
          <View style={styles.newPriceSection}>
            <Text style={[styles.newPriceLabel, { color: activeTheme.subtext }]}>TOTAL</Text>
            <Text style={[styles.newTotalPrice, { color: activeTheme.text }]}>
              ${(dish.price * quantity).toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.newCheckoutBtn}
            activeOpacity={0.9}
            onPress={handleAddToCart}
          >
            <Text style={[styles.newCheckoutText, { color: activeTheme.onPrimary }]}>Add</Text>
            <View style={[styles.newIconCircle, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
              <Ionicons name="cart" size={20} color={activeTheme.onPrimary} />
            </View>
          </TouchableOpacity>
        </BlurView>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: width * 1.1,
    position: 'relative',
  },
  heroImage: {
    width: width,
    height: '100%',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    zIndex: 10,
  },
  indicator: {
    width: 8,
    height: 4,
    borderRadius: 2,
  },

  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  headerActions: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  blurIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 25,
    marginTop: -20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
  },
  dishName: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  qBtn: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statText: {
    fontSize: 14,
    fontWeight: '700',
  },
  descriptionHeader: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
  },
  descriptionContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 15,
  },
  portionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  portionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  portionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  newBottomBarContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    height: 60,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  newBottomBlur: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingRight: 10,
    justifyContent: 'space-between',
  },
  newPriceSection: {
    justifyContent: 'center',
  },
  newPriceLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  newTotalPrice: {
    fontSize: 26,
    fontWeight: '900',
  },
  newCheckoutBtn: {
    backgroundColor: '#E6B325',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 25,
    paddingRight: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 15,
  },
  newCheckoutText: {
    fontSize: 16,
    fontWeight: '800',
  },
  newIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

