const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

// Import new seeds from generated JS file
const seedProducts = require('./seedData');

const importData = async () => {
    try {
        await connectDB();
        await Product.deleteMany();
        const createdProducts = await Product.insertMany(seedProducts);
        console.log('Data Imported!');

        // Output a mapping of names to new IDs for frontend sync
        const mapping = {};
        createdProducts.forEach(p => {
            mapping[p.name] = p._id.toString();
        });
        const fs = require('fs');
        fs.writeFileSync('id_mapping.json', JSON.stringify(mapping, null, 2));
        console.log('ID mapping saved to id_mapping.json');

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
