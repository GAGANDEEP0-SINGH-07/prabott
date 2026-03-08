export const PAGES = ["Furniture", "Outdoor", "Lighting", "Dining", "Bathrooms", "Mirrors & Décor"];

export const PAGE_DATA = {
    "Furniture": {
        hero: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=1600&q=80",
        tagline: "Timeless pieces for modern living",
        description: "Explore our curated collection of premium furniture, handcrafted with the finest materials for enduring beauty and exceptional comfort.",
        filters: ["All", "Sofas", "Chairs", "Tables", "Storage", "Beds", "Cabinets"],
        color: "#c8b99a",
        accent: "#8B7355",
        products: [
            { id: 1, name: "WalnutGrace Lounge Chair", cat: "Chairs", price: 1450, oldPrice: 1800, rating: 5, reviews: 42, badge: "New", img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80" },
            { id: 2, name: "Nordic Cloud Sofa", cat: "Sofas", price: 2950, oldPrice: null, rating: 5, reviews: 67, badge: null, img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80" },
            { id: 3, name: "Harmony Oak Sideboard", cat: "Storage", price: 1150, oldPrice: 1400, rating: 4, reviews: 28, badge: "Sale", img: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&q=80" },
            { id: 4, name: "ChicHaven Armchair", cat: "Chairs", price: 1540, oldPrice: null, rating: 5, reviews: 55, badge: "New", img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80" },
            { id: 5, name: "Luna Leather Bean Sofa", cat: "Sofas", price: 3240, oldPrice: null, rating: 5, reviews: 33, badge: null, img: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&q=80" },
            { id: 6, name: "Vertex Patio Chair", cat: "Chairs", price: 1650, oldPrice: 2000, rating: 4, reviews: 19, badge: "Sale", img: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80" },
            { id: 7, name: "Nebula Family Sofa", cat: "Sofas", price: 2590, oldPrice: null, rating: 5, reviews: 81, badge: "New", img: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=600&q=80" },
            { id: 8, name: "Minimalist Buffet Table", cat: "Tables", price: 1280, oldPrice: null, rating: 4, reviews: 22, badge: null, img: "https://images.unsplash.com/photo-1611967164521-abae8fba4668?w=600&q=80" },
            { id: 9, name: "Oak Extension Dining Table", cat: "Tables", price: 1890, oldPrice: 2200, rating: 5, reviews: 47, badge: "Sale", img: "https://images.unsplash.com/photo-1604074131665-7a4b13870ab3?w=600&q=80" },
        ]
    },
    "Outdoor": {
        hero: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1600&q=80",
        tagline: "Bring luxury to the open air",
        description: "Premium outdoor furniture designed to withstand the elements while elevating your garden, patio, and terrace into an elegant outdoor sanctuary.",
        filters: ["All", "Garden Sets", "Loungers", "Patio Chairs", "Benches", "Planters", "Umbrellas"],
        color: "#a8c4a2",
        accent: "#5B8A51",
        products: [
            { id: 10, name: "Teak Garden Lounger", cat: "Loungers", price: 2100, oldPrice: null, rating: 5, reviews: 38, badge: "New", img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&q=80" },
            { id: 11, name: "Rattan Patio Set", cat: "Garden Sets", price: 3400, oldPrice: 4000, rating: 4, reviews: 52, badge: "Sale", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
            { id: 12, name: "Stone Garden Bench", cat: "Benches", price: 890, oldPrice: null, rating: 5, reviews: 29, badge: null, img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80" },
            { id: 13, name: "Hammock Chair Stand", cat: "Loungers", price: 1200, oldPrice: null, rating: 4, reviews: 15, badge: "New", img: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80" },
            { id: 14, name: "Woven Outdoor Armchair", cat: "Patio Chairs", price: 1650, oldPrice: null, rating: 5, reviews: 43, badge: null, img: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80" },
            { id: 15, name: "Cedar Planter Box", cat: "Planters", price: 480, oldPrice: 600, rating: 4, reviews: 61, badge: "Sale", img: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80" },
        ]
    },
    "Lighting": {
        hero: "https://images.unsplash.com/photo-1513506003901-1e6a35086571?w=1600&q=80",
        tagline: "Illuminate your world with elegance",
        description: "Every room tells a story through light. Discover our curated collection of handcrafted luminaires that blend artistry with function.",
        filters: ["All", "Floor Lamps", "Pendant Lights", "Table Lamps", "Wall Sconces", "Chandeliers", "LED"],
        color: "#d4c89a",
        accent: "#B8A44E",
        products: [
            { id: 20, name: "Marble Base Floor Lamp", cat: "Floor Lamps", price: 680, oldPrice: null, rating: 5, reviews: 44, badge: "New", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80" },
            { id: 21, name: "Brass Pendant Globe", cat: "Pendant Lights", price: 420, oldPrice: 560, rating: 4, reviews: 31, badge: "Sale", img: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600&q=80" },
            { id: 22, name: "Washi Paper Table Lamp", cat: "Table Lamps", price: 290, oldPrice: null, rating: 5, reviews: 58, badge: null, img: "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=600&q=80" },
            { id: 23, name: "Arched Arc Floor Lamp", cat: "Floor Lamps", price: 840, oldPrice: null, rating: 5, reviews: 27, badge: "New", img: "https://images.unsplash.com/photo-1513506003901-1e6a35086571?w=600&q=80" },
            { id: 24, name: "Cluster Chandelier Gold", cat: "Chandeliers", price: 1850, oldPrice: 2200, rating: 5, reviews: 18, badge: "Sale", img: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&q=80" },
            { id: 25, name: "Linen Drum Pendant", cat: "Pendant Lights", price: 310, oldPrice: null, rating: 4, reviews: 36, badge: null, img: "https://images.unsplash.com/photo-1530603907829-659dc1b3f567?w=600&q=80" },
        ]
    },
    "Dining": {
        hero: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1600&q=80",
        tagline: "Where meals become memories",
        description: "Craft the perfect dining experience with our elegant tables, chairs, and accessories — designed for families who appreciate beauty at every meal.",
        filters: ["All", "Dining Tables", "Dining Chairs", "Bar Stools", "Benches", "Buffets", "Sets"],
        color: "#c4a882",
        accent: "#9A7B52",
        products: [
            { id: 30, name: "Extendable Oak Dining Table", cat: "Dining Tables", price: 2200, oldPrice: null, rating: 5, reviews: 63, badge: "New", img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80" },
            { id: 31, name: "Velvet Dining Chair Set", cat: "Dining Chairs", price: 980, oldPrice: 1200, rating: 4, reviews: 45, badge: "Sale", img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80" },
            { id: 32, name: "Industrial Bar Stool", cat: "Bar Stools", price: 540, oldPrice: null, rating: 4, reviews: 28, badge: null, img: "https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80" },
            { id: 33, name: "Marble Top Dining Table", cat: "Dining Tables", price: 3600, oldPrice: null, rating: 5, reviews: 17, badge: "New", img: "https://images.unsplash.com/photo-1604074131665-7a4b13870ab3?w=600&q=80" },
            { id: 34, name: "Rattan Dining Chair", cat: "Dining Chairs", price: 720, oldPrice: 890, rating: 5, reviews: 52, badge: "Sale", img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80" },
            { id: 35, name: "6-Piece Dining Set", cat: "Sets", price: 4500, oldPrice: null, rating: 5, reviews: 24, badge: null, img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80" },
        ]
    },
    "Bathrooms": {
        hero: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&q=80",
        tagline: "Spa-like serenity at home",
        description: "Transform your bathroom into a private sanctuary. Our bathroom collection merges functionality with refined aesthetics for a truly luxurious experience.",
        filters: ["All", "Vanities", "Mirrors", "Storage", "Towel Rails", "Bath Accessories", "Freestanding"],
        color: "#a8b8c4",
        accent: "#6B8A9E",
        products: [
            { id: 40, name: "Floating Oak Vanity Unit", cat: "Vanities", price: 1890, oldPrice: null, rating: 5, reviews: 39, badge: "New", img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80" },
            { id: 41, name: "Brass Towel Rail", cat: "Towel Rails", price: 280, oldPrice: 380, rating: 4, reviews: 72, badge: "Sale", img: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&q=80" },
            { id: 42, name: "Stone Freestanding Bath", cat: "Freestanding", price: 4200, oldPrice: null, rating: 5, reviews: 14, badge: null, img: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&q=80" },
            { id: 43, name: "Wicker Storage Basket Set", cat: "Storage", price: 160, oldPrice: null, rating: 4, reviews: 88, badge: "New", img: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&q=80" },
            { id: 44, name: "Marble Soap Dispenser", cat: "Bath Accessories", price: 95, oldPrice: 120, rating: 5, reviews: 103, badge: "Sale", img: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=600&q=80" },
            { id: 45, name: "LED Bathroom Mirror", cat: "Mirrors", price: 680, oldPrice: null, rating: 5, reviews: 56, badge: null, img: "https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=600&q=80" },
        ]
    },
    "Mirrors & Décor": {
        hero: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=80",
        tagline: "Reflect your personal style",
        description: "From statement mirrors to curated décor objects, add the finishing touches that make your space feel truly complete and uniquely yours.",
        filters: ["All", "Wall Mirrors", "Floor Mirrors", "Decorative Objects", "Vases", "Candles", "Art Prints"],
        color: "#c4b8a8",
        accent: "#8B7B6B",
        products: [
            { id: 50, name: "Arched Oak Frame Mirror", cat: "Wall Mirrors", price: 890, oldPrice: null, rating: 5, reviews: 71, badge: "New", img: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80" },
            { id: 51, name: "Full-Length Brass Mirror", cat: "Floor Mirrors", price: 1240, oldPrice: 1500, rating: 4, reviews: 49, badge: "Sale", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80" },
            { id: 52, name: "Ceramic Bud Vase Set", cat: "Vases", price: 145, oldPrice: null, rating: 5, reviews: 92, badge: null, img: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600&q=80" },
            { id: 53, name: "Geometric Candle Holder", cat: "Candles", price: 78, oldPrice: null, rating: 5, reviews: 134, badge: "New", img: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=600&q=80" },
            { id: 54, name: "Abstract Canvas Print", cat: "Art Prints", price: 320, oldPrice: 420, rating: 4, reviews: 41, badge: "Sale", img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80" },
            { id: 55, name: "Travertine Decorative Bowl", cat: "Decorative Objects", price: 195, oldPrice: null, rating: 5, reviews: 28, badge: null, img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80" },
        ]
    }
};
