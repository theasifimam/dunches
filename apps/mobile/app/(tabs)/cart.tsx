import React from 'react';
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
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/context/ThemeContext';
import { RootState, updateQuantity, clearCart, removeFromCart } from '@/store';

const { width, height } = Dimensions.get('window');

export default function CartScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme, isDark } = useAppTheme();
  const activeTheme = Colors[theme];

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + 5.00;

  const handleUpdateQuantity = (id: string, size: string, delta: number) => {
    dispatch(updateQuantity({ id, size, delta }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleRemoveItem = (id: string, size: string) => {
    dispatch(removeFromCart({ id, size }));
  };

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
        {/* Immersive Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color={activeTheme.text} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={[styles.headerTitle, { color: activeTheme.text }]}>Selection</Text>
            <View style={[styles.itemCounter, { backgroundColor: activeTheme.tint }]}>
              <Text style={styles.counterText}>{cartItems.length}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleClearCart}>
            <Ionicons name="trash-outline" size={24} color={activeTheme.subtext} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {cartItems.length > 0 ? (
            <View style={styles.bentoGrid}>
              {cartItems.map((item, index) => (
                <View key={`${item.id}-${item.size}-${index}`} style={[styles.royalBento, { backgroundColor: activeTheme.glass }]}>
                  <View style={styles.bentoImageContainer}>
                    <Image source={{ uri: item.image }} style={styles.bentoImage} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.4)']}
                      style={styles.bentoImageOverlay}
                    />
                  </View>

                  <View style={styles.bentoContent}>
                    <View style={styles.bentoMain}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.bentoName, { color: activeTheme.text }]} numberOfLines={1}>{item.name}</Text>
                        <TouchableOpacity onPress={() => handleRemoveItem(item.id, item.size)}>
                          <Ionicons name="close" size={20} color={activeTheme.subtext} />
                        </TouchableOpacity>
                      </View>
                      <Text style={[styles.bentoSize, { color: activeTheme.subtext }]}>{item.size} Royale</Text>
                    </View>

                    <View style={styles.bentoFooter}>
                      <Text style={[styles.bentoPrice, { color: activeTheme.tint }]}>${(item.price * item.quantity).toFixed(0)}</Text>
                      <View style={[styles.bentoControls, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                        <TouchableOpacity onPress={() => handleUpdateQuantity(item.id, item.size, -1)} style={styles.ctrlBtn}>
                          <Ionicons name="remove" size={16} color={activeTheme.text} />
                        </TouchableOpacity>
                        <Text style={[styles.ctrlText, { color: activeTheme.text }]}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => handleUpdateQuantity(item.id, item.size, 1)} style={styles.ctrlBtn}>
                          <Ionicons name="add" size={16} color={activeTheme.text} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}

              {/* Delivery Goal Section */}
              <BlurView intensity={20} tint={isDark ? "dark" : "light"} style={styles.goalBento}>
                <View style={styles.goalInfo}>
                  <Text style={[styles.goalHeader, { color: activeTheme.text }]}>Express Royale Delivery</Text>
                  <Text style={[styles.goalSub, { color: activeTheme.subtext }]}>Your feast is being prepared with royal precision.</Text>
                </View>
                <View style={styles.goalIcon}>
                  <Ionicons name="flash" size={24} color={activeTheme.tint} />
                </View>
              </BlurView>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={[styles.emptyCircle, { backgroundColor: activeTheme.glass }]}>
                <Ionicons name="cart-outline" size={100} color={activeTheme.tint} />
              </View>
              <Text style={[styles.emptyTitle, { color: activeTheme.text }]}>Your royal plate is currently bare.</Text>
              <TouchableOpacity onPress={() => router.push('/')} style={styles.browseBtn}>
                <Text style={[styles.browseText, { color: activeTheme.onPrimary }]}>Browse The Menu</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{ height: 180 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Payment Shelf - Redesigned */}
      {cartItems.length > 0 && (
        <View style={styles.paymentShelf}>
          <BlurView intensity={isDark ? 80 : 100} tint={isDark ? "dark" : "light"} style={styles.shelfContent}>
            <View style={styles.summaryTable}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: activeTheme.subtext }]}>Subtotal</Text>
                <Text style={[styles.summaryValue, { color: activeTheme.text }]}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: activeTheme.subtext }]}>Processing</Text>
                <Text style={[styles.summaryValue, { color: activeTheme.text }]}>$5.00</Text>
              </View>
            </View>

            <View style={styles.shelfBottom}>
              <View style={styles.totalBlock}>
                <Text style={[styles.totalLabel, { color: activeTheme.subtext }]}>TOTAL DUE</Text>
                <Text style={[styles.totalPrice, { color: activeTheme.text }]}>${total.toFixed(2)}</Text>
              </View>
              <TouchableOpacity style={styles.royalPayBtn} activeOpacity={0.9}>
                <Text style={[styles.payText, { color: activeTheme.onPrimary }]}>Place Order</Text>
                <View style={[styles.payIcon, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
                  <Ionicons name="chevron-forward" size={20} color={activeTheme.onPrimary} />
                </View>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  itemCounter: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  bentoGrid: {
    gap: 20,
  },
  royalBento: {
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  bentoImageContainer: {
    width: 80,
    height: 85,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  bentoImage: {
    width: '100%',
    height: '100%',
  },
  bentoImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  bentoContent: {
    flex: 1,
    paddingLeft: 12,
    paddingVertical: 4,
    justifyContent: 'space-between',
  },
  bentoMain: {
    gap: 2,
  },
  bentoName: {
    fontSize: 18,
    fontWeight: '800',
    flex: 1,
    paddingRight: 8,
  },
  bentoSize: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bentoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  bentoPrice: {
    fontSize: 20,
    fontWeight: '900',
  },
  bentoControls: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  ctrlBtn: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctrlText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: '800',
  },
  goalBento: {
    padding: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  goalInfo: {
    flex: 1,
    paddingRight: 15,
  },
  goalHeader: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  goalSub: {
    fontSize: 12,
    lineHeight: 16,
  },
  goalIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentShelf: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 30,
  },
  shelfContent: {
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 35,
  },
  summaryTable: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 25,
  },
  summaryItem: {
    flex: 1,
    gap: 4,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  shelfBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15,
  },
  totalBlock: {
    gap: 4,
    flex: 1,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  totalPrice: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  royalPayBtn: {
    backgroundColor: '#E6B325',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 10,
    flexShrink: 1,
  },
  payText: {
    fontSize: 16,
    fontWeight: '900',
  },
  payIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.15,
  },
  emptyCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 30,
    marginBottom: 30,
  },
  browseBtn: {
    backgroundColor: '#E6B325',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseText: {
    fontSize: 16,
    fontWeight: '900',
  },
});

