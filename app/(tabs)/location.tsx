import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import CustomButton from '@/components/CustomButton';

const LocationMap = () => {
    const [region, setRegion] = useState({
        latitude: 8.9806,
        longitude: 38.7578,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });
    const [hasPermission, setHasPermission] = useState(false);
    const [selected, setSelected] = useState<{ latitude: number; longitude: number } | null>(null);
    const [address, setAddress] = useState<string>('');

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Location permission is required.');
                return;
            }
            setHasPermission(true);

            const current = await Location.getCurrentPositionAsync({});
            setRegion((prev) => ({
                ...prev,
                latitude: current.coords.latitude,
                longitude: current.coords.longitude,
            }));
            setSelected({ latitude: current.coords.latitude, longitude: current.coords.longitude });

            try {
                const geocode = await Location.reverseGeocodeAsync({
                    latitude: current.coords.latitude,
                    longitude: current.coords.longitude,
                });
                if (geocode?.[0]) {
                    const g = geocode[0];
                    setAddress(`${g.name || ''} ${g.street || ''}, ${g.subregion || ''}, ${g.region || ''}`.trim());
                }
            } catch {}
        })();
    }, []);

    const onConfirm = () => {
        if (!selected) return;
        Alert.alert('Location Selected', `Lat: ${selected.latitude.toFixed(5)}, Lng: ${selected.longitude.toFixed(5)}\n${address}`);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-5 py-4">
                <Text className="h2-bold text-dark-100 mb-2">Select Delivery Location</Text>
                <Text className="body-regular text-gray-200 mb-4">Drag the pin or tap to select location in Addis Ababa</Text>
            </View>

            <View className="flex-1">
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ width: '100%', height: '100%' }}
                    region={region}
                    onRegionChangeComplete={setRegion}
                    onPress={(e) => setSelected(e.nativeEvent.coordinate)}
                >
                    {selected && (
                        <Marker
                            coordinate={selected}
                            draggable
                            onDragEnd={(e) => setSelected(e.nativeEvent.coordinate)}
                            title="Selected Location"
                            description={address}
                        />
                    )}
                </MapView>
            </View>

            <View className="px-5 py-4 bg-white border-t border-gray-200">
                <Text className="small-regular text-gray-200 mb-2" numberOfLines={2}>{address || '...'}</Text>
                <CustomButton title="Confirm Location" onPress={onConfirm} />
            </View>
        </SafeAreaView>
    );
};

export default LocationMap;
