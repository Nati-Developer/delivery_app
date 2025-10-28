import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { getMenu } from '@/lib/appwrite';
import { MenuItem } from '@/type';
import CustomButton from '@/components/CustomButton';
import { useCartStore } from '@/store/cart.store';

const MenuDetail = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [item, setItem] = useState<MenuItem | null>(null);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCartStore();

    useEffect(() => {
        const loadItem = async () => {
            try {
                const menuItems = await getMenu({ category: '', query: '' });
                const foundItem = menuItems.find(menuItem => menuItem.$id === id);
                setItem(foundItem || null);
            } catch (error) {
                console.error('Error loading menu item:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadItem();
        }
    }, [id]);

    const handleAddToCart = () => {
        if (item) {
            addItem({
                id: item.$id,
                name: item.name,
                price: item.price,
                image_url: item.image_url,
                customizations: []
            });
            router.back();
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 justify-center items-center">
                    <Text className="text-lg">Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!item) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 justify-center items-center">
                    <Text className="text-lg">Item not found</Text>
                    <TouchableOpacity onPress={() => router.back()} className="mt-4">
                        <Text className="text-primary">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1">
                {/* Header Image */}
                <View className="relative h-80">
                    <Image 
                        source={{ uri: item.image_url }} 
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="absolute top-4 left-4 bg-black/50 rounded-full p-2"
                    >
                        <Text className="text-white text-lg">←</Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View className="px-5 py-6">
                    {/* Title and Price */}
                    <View className="mb-4">
                        <Text className="h1-bold text-dark-100 mb-2">{item.name}</Text>
                        <Text className="h2-bold text-primary">ETB {item.price}</Text>
                    </View>

                    {/* Description */}
                    <View className="mb-6">
                        <Text className="h3-bold text-dark-100 mb-2">Description</Text>
                        <Text className="body-regular text-gray-200">{item.description}</Text>
                    </View>

                    {/* Nutrition Info */}
                    <View className="mb-6">
                        <Text className="h3-bold text-dark-100 mb-3">Nutrition Information</Text>
                        <View className="flex-row justify-between bg-gray-50 p-4 rounded-lg">
                            <View className="items-center">
                                <Text className="h3-bold text-primary">{item.calories}</Text>
                                <Text className="small-regular text-gray-200">Calories</Text>
                            </View>
                            <View className="items-center">
                                <Text className="h3-bold text-primary">{item.protein}g</Text>
                                <Text className="small-regular text-gray-200">Protein</Text>
                            </View>
                            <View className="items-center">
                                <Text className="h3-bold text-primary">{item.rating}</Text>
                                <Text className="small-regular text-gray-200">Rating</Text>
                            </View>
                        </View>
                    </View>

                    {/* Add to Cart Button */}
                    <CustomButton 
                        title="Add to Cart - ETB {item.price}"
                        onPress={handleAddToCart}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default MenuDetail;
