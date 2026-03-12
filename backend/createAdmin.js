const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    const adminEmail = 'adminm@gmail.com'; // Change this if you want a different email
    const adminPassword = 'adminpassword123'; // Change this to your desired password
    const adminName = 'System Admin';

    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Check if user already exists
        let user = await User.findOne({ email: adminEmail });

        if (user) {
            console.log('User already exists. Updating to superadmin...');
            user.role = 'superadmin';
            // We only update password if you want to reset it
            user.password = adminPassword;
            await user.save();
            console.log('User updated to Super Admin successfully!');
        } else {
            console.log('Creating new Super Admin user...');
            user = await User.create({
                name: adminName,
                email: adminEmail,
                password: adminPassword,
                role: 'superadmin'
            });
            console.log('Super Admin user created successfully!');
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
