export const products = [
    // --- Furniture (Chairs, Sofas, Tables, etc) ---
    {
        id: 'f1',
        name: 'WalnutGrace Chair',
        img: '/picture/WalnutGrace Chair.webp',
        category: 'Furniture',
        type: 'Chair',
        price: '£ 1,450',
        numericPrice: 1450,
        color: 'Brown',
        rating: 4.8,
        inStock: true,
        sale: false,
    },
    {
        id: 'f2',
        name: 'Minimalist Luxe Storage Buffet',
        img: '/picture/Luxe Storage Buffet.webp',
        category: 'Furniture',
        type: 'Table',
        price: '£ 2,950',
        numericPrice: 2950,
        color: 'Black',
        rating: 4.9,
        inStock: true,
        sale: true,
    },
    {
        id: 'f3',
        name: 'Classic Harmony Sideboard',
        img: '/picture/Classic Harmony Sideboard.webp',
        category: 'Furniture',
        type: 'Table',
        price: '£ 1,150',
        numericPrice: 1150,
        color: 'Brown',
        rating: 4.5,
        inStock: true,
        sale: false,
    },
    {
        id: 'f4',
        name: 'ChicHaven Couch',
        img: '/picture/ChicHaven Couch.webp',
        category: 'Furniture',
        type: 'Sofa', // Originally 'Chair' in mock but named Couch
        price: '£ 1,540',
        numericPrice: 1540,
        color: 'Grey',
        rating: 4.7,
        inStock: true,
        sale: false,
    },
    {
        id: 'f5',
        name: 'Relaxation Lounge Chair',
        img: '/picture/Lounge Chair.webp',
        category: 'Furniture',
        type: 'Chair',
        price: '£ 2,150',
        numericPrice: 2150,
        color: 'Black',
        rating: 4.6,
        inStock: true,
        sale: true,
    },
    {
        id: 'f6',
        name: 'Nebula Cozy Family Sofa',
        img: '/picture/Nebula Cozy Family Sofa.webp',
        category: 'Furniture',
        type: 'Sofa',
        price: '£ 2,590',
        numericPrice: 2590,
        color: 'White',
        rating: 4.9,
        inStock: true,
        sale: false,
    },
    {
        id: 'f7',
        name: 'Luna Luxury Leather Couch',
        img: '/picture/Leather Couch.webp',
        category: 'Furniture',
        type: 'Sofa',
        price: '£ 3,240',
        numericPrice: 3240,
        color: 'Brown',
        rating: 5.0,
        inStock: false,
        sale: false,
    },
    {
        id: 'f8',
        name: 'Velvet Dream Accent Chair',
        img: '/picture/WalnutGrace Chair.webp', // reusing image for mock
        category: 'Furniture',
        type: 'Chair',
        price: '£ 890',
        numericPrice: 890,
        color: 'Green',
        rating: 4.3,
        inStock: true,
        sale: true,
    },

    // --- Outdoor ---
    {
        id: 'o1',
        name: 'Vertex Premium Patio Chair',
        img: '/picture/Vertex Premium Patio Chair.webp',
        category: 'Outdoor',
        type: 'Chair',
        price: '£ 1,650',
        numericPrice: 1650,
        color: 'White',
        rating: 4.8,
        inStock: true,
        sale: false,
    },
    {
        id: 'o2',
        name: 'Breeze Wicker Sofa Set',
        img: '/picture/Lounge Chair.webp', // ref mock
        category: 'Outdoor',
        type: 'Sofa',
        price: '£ 2,800',
        numericPrice: 2800,
        color: 'Brown',
        rating: 4.5,
        inStock: true,
        sale: true,
    },
    {
        id: 'o3',
        name: 'SunHaven Teak Dining Table',
        img: '/picture/Classic Harmony Sideboard.webp', // ref mock
        category: 'Outdoor',
        type: 'Table',
        price: '£ 1,450',
        numericPrice: 1450,
        color: 'Brown',
        rating: 4.7,
        inStock: false,
        sale: false,
    },
    {
        id: 'o4',
        name: 'Oasis Sun Lounger',
        img: '/picture/Lounge Chair.webp', // ref mock
        category: 'Outdoor',
        type: 'Chair',
        price: '£ 950',
        numericPrice: 950,
        color: 'Grey',
        rating: 4.6,
        inStock: true,
        sale: false,
    },

    // --- Lightning ---
    {
        id: 'l1',
        name: 'Aura Minimalist Floor Lamp',
        img: '/picture/WalnutGrace Chair.webp', // ref mock
        category: 'Lightning',
        type: 'Floor Lamp',
        price: '£ 450',
        numericPrice: 450,
        color: 'Black',
        rating: 4.4,
        inStock: true,
        sale: false,
    },
    {
        id: 'l2',
        name: 'Nova Brass Pendant Light',
        img: '/picture/Luxe Storage Buffet.webp', // ref mock
        category: 'Lightning',
        type: 'Ceiling',
        price: '£ 320',
        numericPrice: 320,
        color: 'Gold',
        rating: 4.9,
        inStock: true,
        sale: true,
    },
    {
        id: 'l3',
        name: 'Lumina Ceramic Table Lamp',
        img: '/picture/Classic Harmony Sideboard.webp', // ref mock
        category: 'Lightning',
        type: 'Table Lamp',
        price: '£ 210',
        numericPrice: 210,
        color: 'White',
        rating: 4.2,
        inStock: true,
        sale: false,
    },
    {
        id: 'l4',
        name: 'Eclipse Wall Sconce',
        img: '/picture/Leather Couch.webp', // ref mock
        category: 'Lightning',
        type: 'Wall',
        price: '£ 180',
        numericPrice: 180,
        color: 'Black',
        rating: 4.5,
        inStock: false,
        sale: false,
    },

    // --- Dinning ---
    {
        id: 'd1',
        name: 'Feast Grand Oak Table',
        img: '/picture/Classic Harmony Sideboard.webp', // ref mock
        category: 'Dinning',
        type: 'Table',
        price: '£ 3,100',
        numericPrice: 3100,
        color: 'Brown',
        rating: 4.8,
        inStock: true,
        sale: false,
    },
    {
        id: 'd2',
        name: 'Bistro Rattan Dining Chair',
        img: '/picture/WalnutGrace Chair.webp', // ref mock
        category: 'Dinning',
        type: 'Chair',
        price: '£ 350',
        numericPrice: 350,
        color: 'Brown',
        rating: 4.6,
        inStock: true,
        sale: true,
    },
    {
        id: 'd3',
        name: 'Cuisine Marble Round Table',
        img: '/picture/Luxe Storage Buffet.webp', // ref mock
        category: 'Dinning',
        type: 'Table',
        price: '£ 2,650',
        numericPrice: 2650,
        color: 'White',
        rating: 4.9,
        inStock: true,
        sale: false,
    },
    {
        id: 'd4',
        name: 'Sleek Metal Bar Stool',
        img: '/picture/Vertex Premium Patio Chair.webp', // ref mock
        category: 'Dinning',
        type: 'Stool',
        price: '£ 220',
        numericPrice: 220,
        color: 'Black',
        rating: 4.3,
        inStock: true,
        sale: false,
    },

    // --- Bathrooms ---
    {
        id: 'b1',
        name: 'Aqua Spa Vanity Set',
        img: '/picture/Luxe Storage Buffet.webp', // ref mock
        category: 'Bathrooms',
        type: 'Vanity',
        price: '£ 1,800',
        numericPrice: 1800,
        color: 'White',
        rating: 4.7,
        inStock: true,
        sale: false,
    },
    {
        id: 'b2',
        name: 'Zen Bamboo Towel Rack',
        img: '/picture/Classic Harmony Sideboard.webp', // ref mock
        category: 'Bathrooms',
        type: 'Storage',
        price: '£ 150',
        numericPrice: 150,
        color: 'Brown',
        rating: 4.5,
        inStock: true,
        sale: true,
    },
    {
        id: 'b3',
        name: 'Oasis Freestanding Bathtub',
        img: '/picture/Nebula Cozy Family Sofa.webp', // ref mock
        category: 'Bathrooms',
        type: 'Bathtub',
        price: '£ 3,400',
        numericPrice: 3400,
        color: 'White',
        rating: 5.0,
        inStock: true,
        sale: false,
    },

    // --- Mirrors & Decors ---
    {
        id: 'm1',
        name: 'Reflect Arch Floor Mirror',
        img: '/picture/Classic Harmony Sideboard.webp', // ref mock
        category: 'Mirrors & Decors',
        type: 'Mirror',
        price: '£ 420',
        numericPrice: 420,
        color: 'Gold',
        rating: 4.8,
        inStock: true,
        sale: false,
    },
    {
        id: 'm2',
        name: 'Vivid Abstract Canvas Print',
        img: '/picture/Leather Couch.webp', // ref mock
        category: 'Mirrors & Decors',
        type: 'Art',
        price: '£ 280',
        numericPrice: 280,
        color: 'Multi',
        rating: 4.6,
        inStock: true,
        sale: true,
    },
    {
        id: 'm3',
        name: 'Echo Geometric Wall Mirror',
        img: '/picture/Luxe Storage Buffet.webp', // ref mock
        category: 'Mirrors & Decors',
        type: 'Mirror',
        price: '£ 190',
        numericPrice: 190,
        color: 'Black',
        rating: 4.4,
        inStock: false,
        sale: false,
    },
    {
        id: 'm4',
        name: 'Serene Ceramic Vase Set',
        img: '/picture/WalnutGrace Chair.webp', // ref mock
        category: 'Mirrors & Decors',
        type: 'Decor',
        price: '£ 110',
        numericPrice: 110,
        color: 'White',
        rating: 4.3,
        inStock: true,
        sale: false,
    }
];

// Helper to get all available colors in a category
export const getColorsForCategory = (categoryName) => {
    const defaultColors = ['Black', 'White', 'Brown', 'Grey', 'Gold', 'Green', 'Multi'];
    if (!categoryName) return defaultColors;

    // In a real app we'd map over the products dynamically, but for our mock we just return these
    return defaultColors;
};

// Helper to get types/subcategories for a category
export const getTypesForCategory = (categoryName) => {
    const productsInCategory = products.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
    const uniqueTypes = [...new Set(productsInCategory.map(p => p.type))];
    return uniqueTypes.length > 0 ? uniqueTypes : ['All'];
};
