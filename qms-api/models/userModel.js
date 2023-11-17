const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

// static register method
userSchema.statics.register = async function (userName, password) {

    // validation
    if (!userName || !password) {
        throw Error('All fields must be filled')
    }
    // if (!validator.isStrongPassword(password)) {
    //     throw Error('Password not strong enough')
    // }

    const exists = await this.findOne({ userName })

    if (exists) {
        throw Error('userName already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ userName, password: hash })

    return user
}

// static login method
userSchema.statics.login = async function (userName, password) {

    if (!userName || !password) {
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({ userName })
    if (!user) {
        throw Error('Incorrect credentials')
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error('Incorrect credentials')
    }

    return user
}

module.exports = mongoose.model('User', userSchema)