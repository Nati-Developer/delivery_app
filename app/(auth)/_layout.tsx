import {View, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, ImageBackground, Image} from 'react-native'
import {Redirect, Slot} from "expo-router";
import {images} from "@/constants";
import useAuthStore from "@/store/auth.store";

export default function AuthLayout() {
    const { isAuthenticated } = useAuthStore();

    if(isAuthenticated) return <Redirect href="/" />

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView className="bg-white h-full" keyboardShouldPersistTaps="handled">
                <View className="w-full relative" style={{ height: Dimensions.get('screen').height / 2.25}}>
                    <ImageBackground source={images.loginGraphic} className="size-full rounded-b-lg" resizeMode="stretch" />
                    <Image source={images.logo} className="self-center size-48 absolute -bottom-16 z-10" />
                </View>
                <View className="mt-20 mb-2">
                    <Text
                        className="h1-bold text-center"
                        style={{
                            color: '#FFA500',
                            textShadowColor: 'rgba(255, 165, 0, 0.85)',
                            textShadowOffset: { width: 0, height: 0 },
                            textShadowRadius: 12,
                        }}
                    >
                        ዘዌ ፋስት ፉድ
                    </Text>
                </View>
                <Slot />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
