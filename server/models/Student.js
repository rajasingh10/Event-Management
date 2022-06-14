const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const { bool } = require('joi');
const StudentSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    createdOn: {
        type: Number,
        default: + new Date()
    },
    branch: {
        type: String,
        required: true
    },
    email_verified: {
        type: Boolean,
        default: false
    },

    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
    },
    role: {
        type: String,
        default: 'Student'
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
})

StudentSchema.methods.generateAuthToken = async function () {
    try {
        // console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString(), role: "Student" }, process.env.ACCESS_TOKEN_SECRET);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        return responder.error(res, error.message, 400);
    }
}


const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;