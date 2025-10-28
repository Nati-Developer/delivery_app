import {SafeAreaView} from "react-native-safe-area-context";
import {FlatList, Text, View} from "react-native";
import {useLocalSearchParams, router} from "expo-router";
import {useEffect, useState} from "react";
import cn from "clsx";

import CartButton from "@/components/CartButton";
import MenuCard from "@/components/MenuCard";
import SearchBar from "@/components/SearchBar";
import {MenuItem} from "@/type";
import {getMenu} from "@/lib/appwrite";

const MenuList = () => {
    const { category } = useLocalSearchParams<{ category?: string }>();
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const load = async () => {
        setLoading(true);
        try {
            const data = await getMenu({ category: (category as string) || '', query: '' });
            setItems(data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [category]);

    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={items}
                renderItem={({ item, index }) => {
                    const isFirstRightColItem = index % 2 === 0;
                    return (
                        <View className={cn("flex-1 max-w-[48%]", !isFirstRightColItem ? 'mt-10': 'mt-0')}>
                            <MenuCard item={item as MenuItem} />
                        </View>
                    )
                }}
                keyExtractor={(item) => item.$id}
                numColumns={2}
                columnWrapperClassName="gap-7"
                contentContainerClassName="gap-7 px-5 pb-32"
                ListHeaderComponent={() => (
                    <View className="my-5 gap-5">
                        <View className="flex-between flex-row w-full">
                            <View className="flex-start">
                                <Text className="small-bold uppercase text-primary">{category ? `${category}` : 'Menu'}</Text>
                                <View className="flex-start flex-row gap-x-1 mt-0.5">
                                    <Text className="paragraph-semibold text-dark-100">Choose your favorite</Text>
                                </View>
                            </View>
                            <CartButton />
                        </View>
                        <SearchBar />
                    </View>
                )}
                ListEmptyComponent={() => !loading && <Text className="px-5">No items</Text>}
            />
        </SafeAreaView>
    );
}

export default MenuList;


