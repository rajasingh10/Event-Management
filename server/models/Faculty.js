const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const FacultySchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdOn: {
        type: Number,
        default: + new Date()
    },
    password: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        default: 'Faculty'
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
});

FacultySchema.methods.generateAuthToken = async function () {
    try {
        // console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString(), role: "Faculty" }, process.env.ACCESS_TOKEN_SECRET);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        return responder.error(res, error.message, 400);
    }
}

const Faculty = mongoose.model('Faculty', FacultySchema);

module.exports = Faculty;