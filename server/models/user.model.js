import mongoose from 'mongoose'
import crypto from 'crypto'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    hashed_password: {
        type: String,
        required: "Password is required"
    },
    salt: String

})

UserSchema.methods = {
    /**
     * This method is called to verify sign-in attempts by
matching the user-provided password text with the hashed_password
stored in the database for a specific user
     */
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    /**
     * This method is used to generate an encrypted hash
from the plain-text password and a unique salt value using the crypto
module from Node
     */
    encryptPassword: function (password) {
        if (!password) {
            return ''
        }
        try {
            const encrypted = crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
            return encrypted
        } catch (err) {
            return ''
        }
    },

    /**
     * 
     * This method generates a unique and random salt value using
    the current timestamp at execution and Math.random()
     */
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
}
/**
 * Add custom validation logic and associate it with the hashed_password
 */
UserSchema.path('hashed_password').validate(function (v) {
    if (this._password && this._password.length < 6) {
        this.invalidate('password', 'Password must be at least 6 characters.')
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required')
    }
}, null)

UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)

    }).get(function () {
        return this._password
    })




export default mongoose.model('User', UserSchema)