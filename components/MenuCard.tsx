import {Text, TouchableOpacity, Image, Platform} from 'react-native'
import {MenuItem} from "@/type";
import {useCartStore} from "@/store/cart.store";

const MenuCard = ({ item }: { item: MenuItem}) => {
    const { $id, image_url, name, am_name, price } = item;
    const imageUrl = image_url;
    const { addItem } = useCartStore();

    return (
        <TouchableOpacity className="menu-card" style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787'}: {}}>
            <Image source={{ uri: imageUrl }} className="size-32 absolute -top-10" resizeMode="contain" />
            <Text className="text-center base-bold text-dark-100" numberOfLines={1}>{am_name || name}</Text>
            {am_name && (
                <Text className="text-center small-regular text-gray-200 mt-0.5" numberOfLines={1}>{name}</Text>
            )}
            <Text className="body-regular text-gray-200 mb-4">From ETB {price}</Text>
            <TouchableOpacity onPress={() => addItem({ id: $id, name, price, image_url: imageUrl, customizations: []})}>
                <Text className="paragraph-bold text-primary">Add to Cart +</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}
export default MenuCard
