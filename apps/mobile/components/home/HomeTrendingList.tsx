import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FeaturedItem } from './HomeFeaturedMasterpieces';

export function HomeTrendingList({
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
          Trending Now
        </Text>
      </View>

      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.popularBento,
            {
              backgroundColor: activeTheme.glass,
              borderColor: activeTheme.border,
            },
          ]}
          activeOpacity={0.85}
          onPress={() => router.push('/food-detail')}
        >
          <View style={styles.popularImageContainer}>
            <Image source={{ uri: item.image }} style={styles.popularImage} />
          </View>

          <View style={styles.popularContent}>
            <View style={styles.popularTop}>
              <Text
                style={[styles.popularName, { color: activeTheme.text }]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <View style={styles.popularHeart}>
                <Ionicons
                  name="heart-outline"
                  size={20}
                  color={activeTheme.subtext}
                />
              </View>
            </View>

            <View style={styles.popularMeta}>
              <Text
                style={[styles.popularMetaText, { color: activeTheme.subtext }]}
              >
                {item.time} • High Demand
              </Text>
            </View>

            <View style={styles.popularBottom}>
              <Text style={[styles.popularPrice, { color: activeTheme.tint }]}>
                {item.price}
              </Text>
              <View style={[styles.miniAdd, { borderColor: activeTheme.border }]}>
                <Text style={[styles.miniAddText, { color: activeTheme.text }]}>
                  ADD
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
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
