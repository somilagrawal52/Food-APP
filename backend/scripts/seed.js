const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const User = require("../models/user");
const Category = require("../models/Category");
const Resturant = require("../models/Resturant");
const Food = require("../models/Food");
const Order = require("../models/Order");

const MONGO_URI = process.env.database_url || "mongodb://localhost:27017/Food-APP";

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB at:", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully.");

    // Clear existing data
    console.log("Clearing existing collections...");
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Resturant.deleteMany({}),
      Food.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log("Collections cleared.");

    // 1. Create Users
    console.log("Creating mock users...");
    const salt = await bcrypt.genSalt(10);
    const sharedPasswordHash = await bcrypt.hash("password123", salt);

    const usersData = [
      {
        Username: "Admin User",
        email: "admin@example.com",
        password: sharedPasswordHash,
        phoneNumber: "+1 (555) 019-2831",
        address: ["742 Evergreen Terrace, Suite 100, Metropolis"],
        userType: "admin",
        profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        answer: "blue",
      },
      {
        Username: "Marco Rossi (Vendor)",
        email: "vendor@example.com",
        password: sharedPasswordHash,
        phoneNumber: "+1 (555) 438-9120",
        address: ["128 Culinary Way, Downtown"],
        userType: "vendor",
        profileImage: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=400&q=80",
        answer: "pasta",
      },
      {
        Username: "Elena Vance (Artisan Chef)",
        email: "chef@artisan.com",
        password: sharedPasswordHash,
        phoneNumber: "+1 (555) 782-3490",
        address: ["54 Pastry Lane, French Quarter"],
        userType: "vendor",
        profileImage: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80",
        answer: "vanilla",
      },
      {
        Username: "John Doe (Customer)",
        email: "client@example.com",
        password: sharedPasswordHash,
        phoneNumber: "+1 (555) 890-2345",
        address: ["450 Broadway Ave, Apt 12B, Manhattan, NY"],
        userType: "client",
        profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
        answer: "green",
      },
      {
        Username: "Sophia Chen (Gourmet Explorer)",
        email: "sophia@luxury.com",
        password: sharedPasswordHash,
        phoneNumber: "+1 (555) 912-8472",
        address: ["88 Ocean Drive, Penthouse 4, Miami, FL"],
        userType: "client",
        profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
        answer: "tokyo",
      },
    ];

    const [adminUser, vendor1, vendor2, client1, client2] = await User.insertMany(usersData);
    console.log(`Created ${usersData.length} users (Password: password123).`);

    // 2. Create Categories
    console.log("Creating categories...");
    const categoriesData = [
      {
        title: "Pizza",
        imageURL: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Burger",
        imageURL: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Sushi",
        imageURL: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Italian",
        imageURL: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Healthy",
        imageURL: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Tacos",
        imageURL: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Desserts",
        imageURL: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Drinks",
        imageURL: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
      },
    ];

    const categories = await Category.insertMany(categoriesData);
    console.log(`Created ${categories.length} categories.`);

    // 3. Create Restaurants
    console.log("Creating restaurants...");
    const restaurantsData = [
      {
        title: "Trattoria Bella Napoli",
        imageURL: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
        logoURL: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80",
        time: "20-30 min",
        pickup: true,
        delivery: true,
        isOpen: true,
        rating: 4.8,
        ratingCount: "340 reviews",
        code: "NAPOLI01",
        coords: {
          address: "14 Via Vesuvio, Downtown Core",
          title: "Trattoria Bella Napoli",
          lat: 40.7128,
          lng: -74.006,
        },
        owner: vendor1._id,
      },
      {
        title: "The Artisan Burger Lab",
        imageURL: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",
        logoURL: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=200&q=80",
        time: "15-25 min",
        pickup: true,
        delivery: true,
        isOpen: true,
        rating: 4.7,
        ratingCount: "520 reviews",
        code: "BURGER01",
        coords: {
          address: "88 Shattuck Ave, Gourmet Ghetto",
          title: "The Artisan Burger Lab",
          lat: 40.7138,
          lng: -74.008,
        },
        owner: vendor1._id,
      },
      {
        title: "Zen Sushi & Omakase",
        imageURL: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
        logoURL: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=200&q=80",
        time: "25-35 min",
        pickup: true,
        delivery: true,
        isOpen: true,
        rating: 4.9,
        ratingCount: "890 reviews",
        code: "ZEN01",
        coords: {
          address: "210 Sakura St, Financial District",
          title: "Zen Sushi & Omakase",
          lat: 40.7148,
          lng: -74.002,
        },
        owner: vendor1._id,
      },
      {
        title: "Verde Botanica Bowls",
        imageURL: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80",
        logoURL: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80",
        time: "15-20 min",
        pickup: true,
        delivery: true,
        isOpen: true,
        rating: 4.6,
        ratingCount: "210 reviews",
        code: "VERDE01",
        coords: {
          address: "32 Greenway Blvd, Midtown",
          title: "Verde Botanica Bowls",
          lat: 40.7158,
          lng: -74.004,
        },
        owner: vendor2._id,
      },
      {
        title: "La Taquería Del Fuego",
        imageURL: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
        logoURL: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=200&q=80",
        time: "20-30 min",
        pickup: true,
        delivery: true,
        isOpen: true,
        rating: 4.8,
        ratingCount: "640 reviews",
        code: "TACO01",
        coords: {
          address: "77 Mission Way, Cultural Quarter",
          title: "La Taquería Del Fuego",
          lat: 40.7168,
          lng: -74.007,
        },
        owner: vendor2._id,
      },
      {
        title: "Velvet Crumb Bakery & Café",
        imageURL: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80",
        logoURL: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=200&q=80",
        time: "10-20 min",
        pickup: true,
        delivery: true,
        isOpen: true,
        rating: 4.9,
        ratingCount: "480 reviews",
        code: "VELVET01",
        coords: {
          address: "15 Rue de Sucre, West End",
          title: "Velvet Crumb Bakery & Café",
          lat: 40.7178,
          lng: -74.009,
        },
        owner: vendor2._id,
      },
      {
        title: "Midnight Crust Co.",
        imageURL: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=900&q=80",
        logoURL: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=200&q=80",
        time: "Opens at 10:00 PM",
        pickup: true,
        delivery: false,
        isOpen: false, // Closed for testing open/closed filter
        rating: 4.4,
        ratingCount: "130 reviews",
        code: "MIDCRUST",
        coords: {
          address: "99 Nocturne Alley, Lower East",
          title: "Midnight Crust Co.",
          lat: 40.7188,
          lng: -74.005,
        },
        owner: vendor1._id,
      },
    ];

    const [rNapoli, rBurger, rZen, rVerde, rTaco, rVelvet, rMidnight] = await Resturant.insertMany(restaurantsData);
    console.log(`Created ${restaurantsData.length} restaurants.`);

    // 4. Create Foods
    console.log("Creating dishes...");
    const foodsData = [
      // Trattoria Bella Napoli
      {
        title: "Classic Margherita DOP",
        description: "San Marzano tomatoes, fresh Buffalo mozzarella, extra virgin olive oil, and sweet basil on fermented sourdough.",
        price: 349,
        imageURL: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
        foodtags: "Pizza, Vegetarian, Italian, Bestseller",
        category: "Pizza",
        code: "MARG01",
        isAvailable: true,
        Resturants: rNapoli._id,
        rating: 4.9,
        ratingCount: "420",
      },
      {
        title: "Spicy Diavola Pizza",
        description: "Spicy Calabrian salami, house-made tomato sauce, fior di latte, and drizzled chili honey.",
        price: 429,
        imageURL: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
        foodtags: "Pizza, Spicy, Italian, Chef Special",
        category: "Pizza",
        code: "DIAV01",
        isAvailable: true,
        Resturants: rNapoli._id,
        rating: 4.8,
        ratingCount: "280",
      },
      {
        title: "Truffle Tagliolini",
        description: "Fresh egg tagliolini tossed in rich butter sauce, finished with shaved black Umbrian truffles and aged Parmigiano.",
        price: 520,
        imageURL: "https://images.unsplash.com/photo-1621996346565-e3d5d6281290?auto=format&fit=crop&w=800&q=80",
        foodtags: "Pasta, Italian, Gourmet, Truffle",
        category: "Italian",
        code: "TRUF01",
        isAvailable: true,
        Resturants: rNapoli._id,
        rating: 4.9,
        ratingCount: "310",
      },
      {
        title: "Slow-Cooked Bolognese",
        description: "Traditional ragù alla bolognese simmered for 8 hours with ground beef, pancetta, red wine, and tossed with pappardelle.",
        price: 460,
        imageURL: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
        foodtags: "Pasta, Italian, Classic",
        category: "Italian",
        code: "BOLO01",
        isAvailable: true,
        Resturants: rNapoli._id,
        rating: 4.7,
        ratingCount: "190",
      },

      // The Artisan Burger Lab
      {
        title: "The Truffle Umami Burger",
        description: "Dry-aged Angus beef patty, melted Gruyère cheese, caramelized shallots, black garlic truffle aioli on brioche.",
        price: 389,
        imageURL: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        foodtags: "Burger, Beef, Gourmet, Bestseller",
        category: "Burger",
        code: "UMAMI01",
        isAvailable: true,
        Resturants: rBurger._id,
        rating: 4.9,
        ratingCount: "510",
      },
      {
        title: "Smoky Bacon BBQ Smash",
        description: "Double smashed patties, crispy smoked bacon, aged cheddar, crispy onion strings, and house Bourbon BBQ glaze.",
        price: 369,
        imageURL: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
        foodtags: "Burger, Bacon, BBQ",
        category: "Burger",
        code: "SMASH01",
        isAvailable: true,
        Resturants: rBurger._id,
        rating: 4.8,
        ratingCount: "390",
      },
      {
        title: "Nashville Hot Crispy Chicken",
        description: "Buttermilk-brined fried chicken breast dipped in fiery chili oil, creamy slaw, and pickles on a toasted potato bun.",
        price: 329,
        imageURL: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80",
        foodtags: "Burger, Chicken, Spicy",
        category: "Burger",
        code: "NASH01",
        isAvailable: true,
        Resturants: rBurger._id,
        rating: 4.7,
        ratingCount: "270",
      },
      {
        title: "Parmesan Rosemary Truffle Fries",
        description: "Hand-cut Idaho potatoes tossed with white truffle oil, sea salt, fresh rosemary, and aged grated parmesan.",
        price: 189,
        imageURL: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80",
        foodtags: "Sides, Crispy, Fries",
        category: "Burger",
        code: "FRIES01",
        isAvailable: true,
        Resturants: rBurger._id,
        rating: 4.8,
        ratingCount: "440",
      },

      // Zen Sushi & Omakase
      {
        title: "Omakase Nigiri Selection (8 pcs)",
        description: "Chef's daily choice of pristine bluefin tuna, king salmon, yellowtail, unagi, and Hokkaido scallop with fresh wasabi.",
        price: 680,
        imageURL: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
        foodtags: "Sushi, Seafood, Raw, Chef Special",
        category: "Sushi",
        code: "OMA01",
        isAvailable: true,
        Resturants: rZen._id,
        rating: 5.0,
        ratingCount: "380",
      },
      {
        title: "Spicy Tuna Crunch Roll",
        description: "Sashimi-grade tuna, spicy sesame aioli, cucumber, topped with tempura crunchies and sweet kabayaki reduction.",
        price: 399,
        imageURL: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=800&q=80",
        foodtags: "Sushi, Spicy, Roll",
        category: "Sushi",
        code: "STUNA01",
        isAvailable: true,
        Resturants: rZen._id,
        rating: 4.8,
        ratingCount: "290",
      },
      {
        title: "Dragon Flame Roll",
        description: "BBQ freshwater eel and cucumber crowned with sliced avocado, flying fish roe, and spicy unagi glaze.",
        price: 450,
        imageURL: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
        foodtags: "Sushi, Special Roll, Avocado",
        category: "Sushi",
        code: "DRAG01",
        isAvailable: true,
        Resturants: rZen._id,
        rating: 4.9,
        ratingCount: "340",
      },

      // Verde Botanica Bowls
      {
        title: "Mediterranean Glow Harvest Bowl",
        description: "Warm quinoa, roasted sweet potatoes, crispy spiced chickpeas, marinated kale, Persian cucumbers, and creamy tahini dressing.",
        price: 299,
        imageURL: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
        foodtags: "Healthy, Vegan, Gluten-Free, Bowl",
        category: "Healthy",
        code: "GLOW01",
        isAvailable: true,
        Resturants: rVerde._id,
        rating: 4.7,
        ratingCount: "180",
      },
      {
        title: "Ahi Tuna Poke Power Bowl",
        description: "Sustainably sourced yellowfin tuna, purple sushi rice, edamame, sliced avocado, pickled ginger, and sesame ponzu.",
        price: 420,
        imageURL: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        foodtags: "Healthy, Poke, High Protein, Seafood",
        category: "Healthy",
        code: "POKE01",
        isAvailable: true,
        Resturants: rVerde._id,
        rating: 4.9,
        ratingCount: "250",
      },
      {
        title: "Golden Turmeric Citrus Immunity Elixir",
        description: "Freshly pressed cold orange, cold-pressed ginger, raw turmeric root, lemon juice, and black pepper extract.",
        price: 159,
        imageURL: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
        foodtags: "Drinks, Juice, Organic, Wellness",
        category: "Drinks",
        code: "IMMUN01",
        isAvailable: true,
        Resturants: rVerde._id,
        rating: 4.8,
        ratingCount: "120",
      },

      // La Taquería Del Fuego
      {
        title: "Slow-Braised Birria Tacos (3 pcs)",
        description: "Tender beef shank braised in guajillo broth, stuffed in corn tortillas with Oaxaca cheese, served with rich dipping consommé.",
        price: 360,
        imageURL: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
        foodtags: "Tacos, Mexican, Beef, Bestseller",
        category: "Tacos",
        code: "BIRR01",
        isAvailable: true,
        Resturants: rTaco._id,
        rating: 4.9,
        ratingCount: "610",
      },
      {
        title: "Crispy Baja Fish Tacos (3 pcs)",
        description: "Beer-battered fresh cod, chipotle lime crema, shredded cabbage, and fresh mango pico de gallo.",
        price: 340,
        imageURL: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80",
        foodtags: "Tacos, Seafood, Mexican, Crispy",
        category: "Tacos",
        code: "BAJA01",
        isAvailable: true,
        Resturants: rTaco._id,
        rating: 4.8,
        ratingCount: "370",
      },
      {
        title: "House Guacamole & Warm Totopos",
        description: "Hass avocados crushed to order with serrano chilis, cilantro, lime juice, sea salt, served with stone-ground tortilla chips.",
        price: 210,
        imageURL: "https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?auto=format&fit=crop&w=800&q=80",
        foodtags: "Tacos, Appetizer, Vegetarian",
        category: "Tacos",
        code: "GUAC01",
        isAvailable: true,
        Resturants: rTaco._id,
        rating: 4.7,
        ratingCount: "290",
      },

      // Velvet Crumb Bakery & Café
      {
        title: "Molten Valrhona Chocolate Lava Cake",
        description: "Warm single-origin French dark chocolate cake with a flowing molten core, dusted with cocoa and edible gold leaf.",
        price: 249,
        imageURL: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
        foodtags: "Desserts, Chocolate, French, Gourmet",
        category: "Desserts",
        code: "LAVA01",
        isAvailable: true,
        Resturants: rVelvet._id,
        rating: 4.9,
        ratingCount: "430",
      },
      {
        title: "Classic Madagascar Vanilla Crème Brûlée",
        description: "Rich baked custard infused with pure Madagascar bourbon vanilla beans, topped with a crisp caramelized sugar crust.",
        price: 229,
        imageURL: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=800&q=80",
        foodtags: "Desserts, French, Custard",
        category: "Desserts",
        code: "BRUL01",
        isAvailable: true,
        Resturants: rVelvet._id,
        rating: 4.8,
        ratingCount: "310",
      },
      {
        title: "Artisan Iced Caramel Oat Latte",
        description: "Double shot of single-origin espresso, house-made salted caramel syrup, and velvety steamed oat milk poured over crystal ice.",
        price: 189,
        imageURL: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80",
        foodtags: "Drinks, Coffee, Espresso, Oat Milk",
        category: "Drinks",
        code: "LATTE01",
        isAvailable: true,
        Resturants: rVelvet._id,
        rating: 4.9,
        ratingCount: "520",
      },
      {
        title: "Ceremonial Grade Matcha Latte",
        description: "Stone-ground Uji matcha whisked with warm oat milk and organic agave nectar.",
        price: 199,
        imageURL: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
        foodtags: "Drinks, Matcha, Japanese, Green Tea",
        category: "Drinks",
        code: "MAT01",
        isAvailable: true,
        Resturants: rVelvet._id,
        rating: 4.7,
        ratingCount: "210",
      },

      // Midnight Crust Co. (late night spot)
      {
        title: "Four Cheese White Truffle Pie",
        description: "Mozzarella, Gorgonzola dolce, Fontina, ricotta, roasted garlic oil, and white truffle essence.",
        price: 440,
        imageURL: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
        foodtags: "Pizza, Late Night, Cheese",
        category: "Pizza",
        code: "4CHZ01",
        isAvailable: true,
        Resturants: rMidnight._id,
        rating: 4.6,
        ratingCount: "160",
      },
    ];

    const foods = await Food.insertMany(foodsData);
    console.log(`Created ${foods.length} dishes.`);

    // 5. Create Realistic Orders
    console.log("Creating realistic orders with various fulfillment states...");
    const ordersData = [
      // 1. Pending Order (Placed by John Doe, ordered from Trattoria Bella Napoli)
      {
        buyer: client1._id,
        resturant: rNapoli._id,
        payment: 838, // 349 + 429 + 60
        deliveryAddress: "450 Broadway Ave, Apt 12B, Manhattan, NY (Instructions: Ring apartment buzzer 12B)",
        status: "Pending",
        items: [
          {
            food: foods[0]._id,
            title: foods[0].title,
            imageURL: foods[0].imageURL,
            price: foods[0].price,
            quantity: 1,
          },
          {
            food: foods[1]._id,
            title: foods[1].title,
            imageURL: foods[1].imageURL,
            price: foods[1].price,
            quantity: 1,
          },
        ],
        createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
      },

      // 2. Preparing Order (In kitchen, placed by Sophia Chen from Artisan Burger Lab)
      {
        buyer: client2._id,
        resturant: rBurger._id,
        payment: 578, // 389 + 189
        deliveryAddress: "88 Ocean Drive, Penthouse 4, Miami, FL (Instructions: Leave at concierge desk)",
        status: "Preparing",
        items: [
          {
            food: foods[4]._id, // Truffle Umami Burger
            title: foods[4].title,
            imageURL: foods[4].imageURL,
            price: foods[4].price,
            quantity: 1,
          },
          {
            food: foods[7]._id, // Parmesan Truffle Fries
            title: foods[7].title,
            imageURL: foods[7].imageURL,
            price: foods[7].price,
            quantity: 1,
          },
        ],
        createdAt: new Date(Date.now() - 35 * 60 * 1000), // 35 mins ago
      },

      // 3. On the way Order (Out for delivery from Zen Sushi to John Doe)
      {
        buyer: client1._id,
        resturant: rZen._id,
        payment: 1079, // 680 + 399
        deliveryAddress: "450 Broadway Ave, Apt 12B, Manhattan, NY (Instructions: Call on arrival)",
        status: "On the way",
        items: [
          {
            food: foods[8]._id, // Omakase Nigiri Selection
            title: foods[8].title,
            imageURL: foods[8].imageURL,
            price: foods[8].price,
            quantity: 1,
          },
          {
            food: foods[9]._id, // Spicy Tuna Crunch Roll
            title: foods[9].title,
            imageURL: foods[9].imageURL,
            price: foods[9].price,
            quantity: 1,
          },
        ],
        createdAt: new Date(Date.now() - 50 * 60 * 1000), // 50 mins ago
      },

      // 4. Delivered Order (Completed gourmet experience from Velvet Crumb to John Doe)
      {
        buyer: client1._id,
        resturant: rVelvet._id,
        payment: 438, // 249 + 189
        deliveryAddress: "450 Broadway Ave, Apt 12B, Manhattan, NY",
        status: "Delivered",
        items: [
          {
            food: foods[17]._id, // Lava Cake
            title: foods[17].title,
            imageURL: foods[17].imageURL,
            price: foods[17].price,
            quantity: 1,
          },
          {
            food: foods[19]._id, // Iced Caramel Oat Latte
            title: foods[19].title,
            imageURL: foods[19].imageURL,
            price: foods[19].price,
            quantity: 1,
          },
        ],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },

      // 5. Delivered Order (Delivered to Sophia from La Taquería Del Fuego)
      {
        buyer: client2._id,
        resturant: rTaco._id,
        payment: 570, // 360 + 210
        deliveryAddress: "88 Ocean Drive, Penthouse 4, Miami, FL",
        status: "Delivered",
        items: [
          {
            food: foods[14]._id, // Birria Tacos
            title: foods[14].title,
            imageURL: foods[14].imageURL,
            price: foods[14].price,
            quantity: 1,
          },
          {
            food: foods[16]._id, // Guacamole
            title: foods[16].title,
            imageURL: foods[16].imageURL,
            price: foods[16].price,
            quantity: 1,
          },
        ],
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      },

      // 6. Cancelled Order (Testing cancelled badge state)
      {
        buyer: client1._id,
        resturant: rVerde._id,
        payment: 299,
        deliveryAddress: "450 Broadway Ave, Apt 12B, Manhattan, NY",
        status: "Cancelled",
        items: [
          {
            food: foods[11]._id, // Mediterranean Harvest Bowl
            title: foods[11].title,
            imageURL: foods[11].imageURL,
            price: foods[11].price,
            quantity: 1,
          },
        ],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ];

    const orders = await Order.insertMany(ordersData);
    console.log(`Created ${orders.length} orders across diverse statuses.`);

    console.log("\n=======================================================");
    console.log(" MOCK DATA GENERATION COMPLETE!");
    console.log("=======================================================");
    console.log("Login Credentials (All share password: password123):");
    console.log("-------------------------------------------------------");
    console.log("1. Admin Account:  admin@example.com   | password123 (Full platform control)");
    console.log("2. Vendor Account: vendor@example.com  | password123 (Trattoria, Burger Lab, Zen Sushi)");
    console.log("3. Vendor Account: chef@artisan.com    | password123 (Verde Bowls, Taquería, Velvet Crumb)");
    console.log("4. Client Account: client@example.com  | password123 (John Doe - active orders & history)");
    console.log("5. Client Account: sophia@luxury.com   | password123 (Sophia Chen - gourmet foodie)");
    console.log("=======================================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedDatabase();
