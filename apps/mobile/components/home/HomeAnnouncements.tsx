import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export const ANNOUNCEMENTS = [
  {
    id: 'a1',
    badge: 'Limited Offer',
    title: 'Royal Feast Weekend 👑',
    subtitle: 'Book your table today and get a complimentary dessert + 2x reward points!',
    colors: ['#E6B325', '#C59A1A'] as const,
    textColor: '#000',
    btnColor: '#000',
    btnIconColor: '#E6B325',
  },
  {
    id: 'a2',
    badge: 'New Menu',
    title: 'Golden Hour Reserve ✨',
    subtitle: 'Experience our new exclusive sunset dining menu starting this Friday.',
    colors: ['#333333', '#111111'] as const,
    textColor: '#FFF',
    btnColor: '#E6B325',
    btnIconColor: '#000',
  },
  {
    id: 'a3',
    badge: 'Members Only',
    title: 'Crown Club Perks 🥂',
    subtitle: 'Get early access to our weekend specials and priority seating.',
    colors: ['#1A1A1A', '#000000'] as const,
    textColor: '#E6B325',
    btnColor: '#E6B325',
    btnIconColor: '#000',
  },
];

export function HomeAnnouncements() {
  const router = useRouter();

  return (
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
            <View
              style={[
                styles.decorCircle,
                {
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  top: -50,
                  right: -20,
                  opacity: 0.15,
                  backgroundColor: offer.textColor,
                },
              ]}
            />
            <View
              style={[
                styles.decorCircle,
                {
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  bottom: -30,
                  left: 10,
                  opacity: 0.1,
                  backgroundColor: offer.textColor,
                },
              ]}
            />

            <View style={styles.announcementLeft}>
              <View
                style={[
                  styles.announcementBadge,
                  {
                    backgroundColor:
                      offer.textColor === '#000'
                        ? 'rgba(0,0,0,0.1)'
                        : 'rgba(255, 255, 255, 0.25)',
                  },
                ]}
              >
                <Text
                  style={[styles.announcementBadgeTxt, { color: offer.textColor }]}
                >
                  {offer.badge}
                </Text>
              </View>
              <Text style={[styles.announcementTitle, { color: offer.textColor }]}>
                {offer.title}
              </Text>
              <Text
                style={[
                  styles.announcementSub,
                  {
                    color:
                      offer.textColor === '#000'
                        ? 'rgba(0,0,0,0.7)'
                        : offer.textColor === '#E6B325'
                        ? 'rgba(230,179,37,0.8)'
                        : 'rgba(255, 255, 255, 0.9)',
                  },
                ]}
              >
                {offer.subtitle}
              </Text>
            </View>

            <View style={styles.announcementRight}>
              <View
                style={[
                  styles.announcementActionBtn,
                  { backgroundColor: offer.btnColor },
                ]}
              >
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={offer.btnIconColor}
                />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  announcementBadgeTxt: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  announcementTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  announcementSub: {
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
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});
