import {CreateUserParams, GetMenuParams, SignInParams, User} from "@/type";

// Simple in-memory session for static login flow (non-persistent)
let staticSessionActive = false;
const staticUser = {
    name: "Nati Developer",
    email: "nati@gmail.com",
    avatar: "https://via.placeholder.com/150/FF9C01/FFFFFF?text=ND",
};

// Inline menu data (no external file dependency)
const menuData = [
    {
        name: "Classic Cheeseburger",
        description: "Beef patty, cheese, lettuce, tomato",
        image_url: "https://static.vecteezy.com/system/resources/previews/044/844/600/large_2x/homemade-fresh-tasty-burger-with-meat-and-cheese-classic-cheese-burger-and-vegetable-ai-generated-free-png.png",
        price: 25.99,
        rating: 4.5,
        calories: 550,
        protein: 25,
        category_name: "Burgers",
    },
    {
        name: "Pepperoni Pizza",
        description: "Loaded with cheese and pepperoni slices",
        image_url: "https://static.vecteezy.com/system/resources/previews/023/742/417/large_2x/pepperoni-pizza-isolated-illustration-ai-generative-free-png.png",
        price: 30.99,
        rating: 4.7,
        calories: 700,
        protein: 30,
        category_name: "Pizzas",
    },
    {
        name: "Bean Burrito",
        description: "Stuffed with beans, rice, salsa",
        image_url: "https://static.vecteezy.com/system/resources/previews/055/133/581/large_2x/deliciously-grilled-burritos-filled-with-beans-corn-and-fresh-vegetables-served-with-lime-wedge-and-cilantro-isolated-on-transparent-background-free-png.png",
        price: 20.99,
        rating: 4.2,
        calories: 480,
        protein: 18,
        category_name: "Burritos",
    },
    {
        name: "BBQ Bacon Burger",
        description: "Smoky BBQ sauce, crispy bacon, cheddar",
        image_url: "https://static.vecteezy.com/system/resources/previews/060/236/245/large_2x/a-large-hamburger-with-cheese-onions-and-lettuce-free-png.png",
        price: 27.5,
        rating: 4.8,
        calories: 650,
        protein: 29,
        category_name: "Burgers",
    },
    {
        name: "Chicken Caesar Wrap",
        description: "Grilled chicken, lettuce, Caesar dressing",
        image_url: "https://static.vecteezy.com/system/resources/previews/048/930/603/large_2x/caesar-wrap-grilled-chicken-isolated-on-transparent-background-free-png.png",
        price: 21.5,
        rating: 4.4,
        calories: 490,
        protein: 28,
        category_name: "Wraps",
    },
    {
        name: "Grilled Veggie Sandwich",
        description: "Roasted veggies, pesto, cheese",
        image_url: "https://static.vecteezy.com/system/resources/previews/047/832/012/large_2x/grilled-sesame-seed-bread-veggie-sandwich-with-tomato-and-onion-free-png.png",
        price: 19.99,
        rating: 4.1,
        calories: 420,
        protein: 19,
        category_name: "Sandwiches",
    },
];

const categoriesData = [
    { name: "Burgers", description: "Juicy grilled burgers" },
    { name: "Pizzas", description: "Oven-baked cheesy pizzas" },
    { name: "Burritos", description: "Rolled Mexican delights" },
    { name: "Sandwiches", description: "Stacked and stuffed sandwiches" },
    { name: "Wraps", description: "Rolled up wraps packed with flavor" },
    { name: "Bowls", description: "Balanced rice and protein bowls" },
];

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    // Static user creation - just return the user object
    if (email === "nati@gmail.com" && password === "Natideveloper") {
        staticSessionActive = true;
        return staticUser;
    }
    throw new Error("Invalid credentials for user creation.");
}

export const signIn = async ({ email, password }: SignInParams) => {
    // Bypass Appwrite for auth: accept only provided static credentials
    if (email === "nati@gmail.com" && password === "Natideveloper") {
        staticSessionActive = true;
        return staticUser;
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
    // Return inline menu filtered by optional category name and text query
    const normalizedQuery = (query || '').toString().toLowerCase();
    const normalizedCategory = (category || '').toString().toLowerCase();

    const filtered = menuData
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
    // Return inline categories and attach $id like Appwrite
    return categoriesData.map((cat, index) => ({
        $id: `${index + 1}`,
        name: cat.name,
        am_name: undefined,
        description: cat.description,
    })) as any;
}
