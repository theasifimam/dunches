import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export interface FeaturedItem {
  id: string;
  name: string;
  price: string;
  rating: string;
  time: string;
  image: string;
}

export function HomeFeaturedMasterpieces({
  items,
  activeTheme,
}: {
  items: FeaturedItem[];
  activeTheme: any;
}) {
  const router = useRouter();

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>
          Chef's Masterpieces
        </Text>
        <TouchableOpacity>
          <Ionicons name="arrow-forward" size={24} color={activeTheme.tint} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
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
              <Text style={styles.featuredName} numberOfLines={1}>
                {item.name}
              </Text>
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
    </>
  );
}

const styles = StyleSheet.create({
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
});
