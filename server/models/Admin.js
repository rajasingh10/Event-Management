const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        default: 'Admin'
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
})

AdminSchema.methods.generateAuthToken = async function () {
    try {
        console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString(), role: "Admin" }, process.env.ACCESS_TOKEN_SECRET);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        return responder.error(res, error.message, 400);
    }
}

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;