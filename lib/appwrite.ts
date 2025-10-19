import {Account, Avatars, Client, Databases, ID, Query, Storage} from "react-native-appwrite";
import {CreateUserParams, GetMenuParams, SignInParams} from "@/type";
import useAuthStore from "@/store/auth.store";
import dummyData from "@/lib/data";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: "com.jsm.foodordering",
    databaseId: '68f4f584002ea44877fb',
    bucketId: '68643e170015edaa95d7',
    userCollectionId: '68629b0a003d27acb18f',
    categoriesCollectionId: '68643a390017b239fa0f',
    menuCollectionId: '68643ad80027ddb96920',
    customizationsCollectionId: '68643c0300297e5abc95',
    menuCustomizationsCollectionId: '68643cd8003580ecdd8f'
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

// Simple in-memory session for static login flow (non-persistent)
let staticSessionActive = false;
const staticUser = {
    name: "Nati Developer",
    email: "nati@gmail.com",
    avatar: avatars.getInitialsURL("Nati Developer"),
};

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)
        if(!newAccount) throw Error;

        await signIn({ email, password });

        const avatarUrl = avatars.getInitialsURL(name);

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            { email, name, accountId: newAccount.$id, avatar: avatarUrl }
        );
    } catch (e) {
        throw new Error(e as string);
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    // Bypass Appwrite for auth: accept only provided static credentials
    if (email === "nati@gmail.com" && password === "Natideveloper") {
        staticSessionActive = true;

        // Update auth store immediately so UI reflects login state
        const { setIsAuthenticated, setUser } = useAuthStore.getState();
        setUser(staticUser as any);
        setIsAuthenticated(true);
        return;
    }

    throw new Error("Invalid email or password.");
}

export const getCurrentUser = async () => {
    // Return mock user if static session is active; otherwise behave as logged out
    if (staticSessionActive) {
        return staticUser as any;
    }

    // If no static session, return null to indicate not authenticated
    return null as any;
}

export const getMenu = async ({ category, query }: GetMenuParams) => {
    // Return static menu filtered by optional category name and text query
    const normalizedQuery = (query || '').toString().toLowerCase();
    const normalizedCategory = (category || '').toString().toLowerCase();

    const filtered = dummyData.menu
        .filter((item) => {
            const matchesCategory = !normalizedCategory || item.category_name.toLowerCase() === normalizedCategory;
            const matchesQuery = !normalizedQuery || item.name.toLowerCase().includes(normalizedQuery);
            return matchesCategory && matchesQuery;
        })
        .map((item, index) => ({
            // Mimic Appwrite document shape minimal fields used by UI
            $id: `${index + 1}`,
            name: item.name,
            am_name: undefined,
            price: item.price + 200,
            image_url: item.image_url,
            description: item.description,
            calories: item.calories,
            protein: item.protein,
            rating: item.rating,
            type: item.category_name,
        }));

    return filtered as any;
}

export const getCategories = async () => {
    // Return static categories and attach $id like Appwrite
    return dummyData.categories.map((cat, index) => ({
        $id: `${index + 1}`,
        name: cat.name,
        am_name: undefined,
        description: cat.description,
    })) as any;
}
