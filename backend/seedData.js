const products = [
    {
        name: "WalnutGrace Lounge Chair",
        description: "A timeless lounge chair crafted from solid walnut with premium leather upholstery. Perfect for modern living rooms and study spaces.",
        price: 1450,
        category: "Furniture",
        stock: 12,
        images: ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80"],
        ratings: 5,
        numReviews: 42,
        colors: ["#5D4037", "#212121", "#757575"],
        features: [
            { label: "Material", value: "Solid Walnut & Top-Grain Leather" },
            { label: "Dimensions", value: "W: 75cm, H: 85cm, D: 80cm" },
            { label: "Warranty", value: "5 Years Manufacturer Warranty" }
        ],
        reviews: []
    },
    {
        name: "Nordic Cloud Sofa",
        description: "Exceptional comfort meets Scandinavian design. This deep-seated sofa features stain-resistant fabric and a sturdy kiln-dried hardwood frame.",
        price: 2950,
        category: "Furniture",
        stock: 5,
        images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"],
        ratings: 5,
        numReviews: 67,
        colors: ["#F5F5F5", "#BDBDBD", "#616161"],
        features: [
            { label: "Fabric", value: "Performance Linen Blend" },
            { label: "Frame", value: "Kiln-Dried Hardwood" },
            { label: "Origin", value: "Made in Denmark" }
        ],
        reviews: []
    },
    {
        name: "Harmony Oak Sideboard",
        description: "Elegant storage solution featuring clean lines and soft-close doors. Hand-finished oak brings warmth to any dining or living area.",
        price: 1150,
        category: "Furniture",
        stock: 8,
        images: ["https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&q=80"],
        ratings: 4,
        numReviews: 28,
        colors: ["#E0C9A6", "#8B7355"],
        features: [
            { label: "Material", value: "Solid Oak & Oak Veneer" },
            { label: "Storage", value: "3 Soft-Close Doors, 2 Drawers" }
        ],
        reviews: []
    },
    {
        name: "Brass Pendant Globe",
        description: "A stunning statement piece that casts a warm, ambient glow. Hand-spun brass with a frosted glass globe for a sophisticated look.",
        price: 420,
        category: "Lighting",
        stock: 25,
        images: ["https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600&q=80"],
        ratings: 4,
        numReviews: 31,
        colors: ["#C5A059", "#212121"],
        features: [
            { label: "Material", value: "Antique Brass & Opal Glass" },
            { label: "Bulb", value: "E27 Max 60W (Included)" },
            { label: "Cord", value: "2m Adjustable Fabric Cable" }
        ],
        reviews: []
    },
    {
        name: "Teak Garden Lounger",
        description: "Relax in style with our premium teak lounger. Adjustable backrest and weather-resistant finish make it perfect for poolside or patio.",
        price: 2100,
        category: "Outdoor",
        stock: 15,
        images: ["https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&q=80"],
        ratings: 5,
        numReviews: 38,
        colors: ["#BCAAA4"],
        features: [
            { label: "Material", value: "Grade A Teak Wood" },
            { label: "Adjustments", value: "5 Reclining Positions" },
            { label: "Durability", value: "Weather & UV Resistant" }
        ],
        reviews: []
    }
];

module.exports = products;
