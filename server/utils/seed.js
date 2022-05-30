const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const seeder = {
    seedAdmins: async () => {
        try {
            const AlreadyExist = await Admin.findOne({ email: "admin@gmail.com" });
            if (AlreadyExist) {
                console.log('Admin account already exists, not seeding');
            }
            else {
                encryptedPassword = await bcrypt.hash("admin8889", 10);
                const admin = new Admin({ email: "admin@gmail.com", password: encryptedPassword });
                // const token = jwt.sign({ user_id: admin._id, email: admin._email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2h" });
                // admin.token = token;
                await admin.save();
                console.log(admin)
            }

        } catch (err) {
            console.log(err)
        }

    }
}

module.exports = seeder;