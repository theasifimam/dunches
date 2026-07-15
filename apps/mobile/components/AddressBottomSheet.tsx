import React, { useState, forwardRef, useMemo, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/context/ThemeContext';

export interface AddressBottomSheetProps {
  onAddressChange: (summary: string) => void;
}

export const AddressBottomSheet = forwardRef<BottomSheetModal, AddressBottomSheetProps>(({ onAddressChange }, ref) => {
  const { theme, isDark } = useAppTheme();
  const activeTheme = Colors[theme];

  const snapPoints = useMemo(() => ['70%', '95%'], []);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState('');
  const [mapRegion, setMapRegion] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const [isMapFullScreen, setIsMapFullScreen] = useState(false);
  const mapRef = useRef<MapView>(null);
  const fullScreenMapRef = useRef<MapView>(null);

  const fetchAddressDetails = async (lat: number, lng: number) => {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (results.length > 0) {
        const addressObj = results[0];

        const generatedStreet = `${addressObj.streetNumber || ''} ${addressObj.street || ''}`.trim() || addressObj.name || '';
        if (generatedStreet) setStreet(generatedStreet);

        const generatedCity = addressObj.district || addressObj.city || addressObj.subregion || '';
        if (generatedCity) setCity(generatedCity);

        if (addressObj.region) setStateRegion(addressObj.region);
        if (addressObj.postalCode) setZip(addressObj.postalCode);

        setCountry(addressObj.country || 'India');
      }
    } catch (e) {
      console.log('Error reverse geocoding', e);
    }
  };

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

    const newRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    };

    setMapRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);
    fullScreenMapRef.current?.animateToRegion(newRegion, 1000);

    await fetchAddressDetails(location.coords.latitude, location.coords.longitude);
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.6} />
    ),
    []
  );

  const handleClosePress = () => {
    (ref as React.MutableRefObject<BottomSheetModal>).current?.dismiss();
  };

  const saveDetails = () => {
    const summary = street ? `${street}, ${city}` : 'Set Delivery Location';
    onAddressChange(summary);
    handleClosePress();
  };

  return (
    <>
      <BottomSheetModal
        ref={ref}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: activeTheme.background }}
        handleIndicatorStyle={{ backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          <Text style={[styles.sheetTitle, { color: activeTheme.text }]}>Delivery Location</Text>

          {/* Map Preview */}
          <View style={[styles.mapContainer, { borderColor: activeTheme.border }]}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={mapRegion}
              userInterfaceStyle={isDark ? "dark" : "light"}
              onRegionChangeComplete={(region) => setMapRegion(region)}
            >
              <Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }} />
            </MapView>

            <View style={styles.mapActions}>
              <TouchableOpacity style={styles.mapBtn} onPress={getUserLocation}>
                <Ionicons name="locate" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mapBtn} onPress={() => setIsMapFullScreen(true)}>
                <Ionicons name="expand" size={20} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={styles.mapOverlay} pointerEvents="none">
              <Text style={styles.mapOverlayText}>Drag to fine-tune</Text>
            </View>
          </View>

          {/* Form Fields */}
          <Text style={[styles.inputLabel, { color: activeTheme.subtext }]}>STREET ADDRESS</Text>
          <View style={[styles.inputContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
            <Ionicons name="location-outline" size={20} color={activeTheme.text} style={styles.inputIcon} />
            <BottomSheetTextInput
              value={street}
              onChangeText={setStreet}
              style={[styles.sheetInput, { color: activeTheme.text }]}
              placeholderTextColor={activeTheme.subtext}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.flexHalf, { paddingRight: 5 }]}>
              <Text style={[styles.inputLabel, { color: activeTheme.subtext }]}>CITY / DISTRICT</Text>
              <View style={[styles.inputContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                <BottomSheetTextInput
                  value={city}
                  onChangeText={setCity}
                  style={[styles.sheetInput, { color: activeTheme.text, paddingHorizontal: 15 }]}
                  placeholderTextColor={activeTheme.subtext}
                />
              </View>
            </View>

            <View style={[styles.flexHalf, { paddingLeft: 5 }]}>
              <Text style={[styles.inputLabel, { color: activeTheme.subtext }]}>ZIP CODE</Text>
              <View style={[styles.inputContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                <BottomSheetTextInput
                  value={zip}
                  onChangeText={setZip}
                  style={[styles.sheetInput, { color: activeTheme.text, paddingHorizontal: 15 }]}
                  placeholderTextColor={activeTheme.subtext}
                />
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.flexHalf, { paddingRight: 5 }]}>
              <Text style={[styles.inputLabel, { color: activeTheme.subtext }]}>STATE</Text>
              <View style={[styles.inputContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                <BottomSheetTextInput
                  value={stateRegion}
                  onChangeText={setStateRegion}
                  style={[styles.sheetInput, { color: activeTheme.text, paddingHorizontal: 15 }]}
                  placeholderTextColor={activeTheme.subtext}
                />
              </View>
            </View>

            <View style={[styles.flexHalf, { paddingLeft: 5 }]}>
              <Text style={[styles.inputLabel, { color: activeTheme.subtext }]}>COUNTRY</Text>
              <View style={[styles.inputContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                <BottomSheetTextInput
                  value={country}
                  onChangeText={setCountry}
                  style={[styles.sheetInput, { color: activeTheme.text, paddingHorizontal: 15 }]}
                  placeholderTextColor={activeTheme.subtext}
                />
              </View>
            </View>
          </View>

          <Text style={[styles.inputLabel, { color: activeTheme.subtext }]}>CONTACT NUMBER</Text>
          <View style={[styles.inputContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
            <Ionicons name="call-outline" size={20} color={activeTheme.text} style={styles.inputIcon} />
            <BottomSheetTextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={[styles.sheetInput, { color: activeTheme.text }]}
              placeholderTextColor={activeTheme.subtext}
            />
          </View>

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={saveDetails}
          >
            <Text style={styles.saveBtnText}>Confirm Delivery Details</Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheetModal>

      {/* Full Screen Map Modal */}
      <Modal visible={isMapFullScreen} animationType="slide">
        <View style={{ flex: 1, backgroundColor: activeTheme.background }}>
          <StatusBar hidden={true} />
          <MapView
            ref={fullScreenMapRef}
            style={{ flex: 1 }}
            initialRegion={mapRegion}
            showsUserLocation={true}
            userInterfaceStyle={isDark ? "dark" : "light"}
            onRegionChangeComplete={(region) => setMapRegion(region)}
          >
            <Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }} />
          </MapView>

          <SafeAreaView style={styles.fullScreenMapHeader} pointerEvents="box-none">
            <TouchableOpacity style={styles.mapCloseBtn} onPress={() => setIsMapFullScreen(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </SafeAreaView>

          <View style={[styles.fullScreenMapFooter, { backgroundColor: activeTheme.glass, borderColor: activeTheme.border }]}>
            <TouchableOpacity style={styles.mapBtnLarge} onPress={getUserLocation}>
              <Ionicons name="locate" size={20} color="#000" />
              <Text style={styles.mapBtnLargeText}>Use Current Location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={async () => {
              await fetchAddressDetails(mapRegion.latitude, mapRegion.longitude);
              setIsMapFullScreen(false);
            }}>
              <Text style={styles.saveBtnText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  sheetContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
    paddingTop: 10,
  },
  mapContainer: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 30,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  mapOverlayText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexHalf: {
    flex: 1,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  sheetInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#E6B325',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  mapBtnLargeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  mapActions: {
    position: 'absolute',
    top: 10,
    right: 10,
    gap: 10,
  },
  mapBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E6B325',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fullScreenMapHeader: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  mapCloseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6B325',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  fullScreenMapFooter: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  mapBtnLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6B325',
    padding: 12,
    borderRadius: 12,
    marginBottom: 5,
    gap: 10,
  },
});
