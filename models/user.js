
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var crypto   = require('crypto');

/**
 * User Schema
 */

var UserSchema = new Schema({
    id       : ObjectId,
    username : String,
    userpass : String,
    email    : String,
    avator   : String,
    kas      : [{ type : Schema.Types.ObjectId, ref : 'Ka' }]
});

/**
 * Virtuals
 */

UserSchema.virtual('password')
.set(function(password) {
    this._password = password
    this.userpass = this.encryptPassword(password)
})
.get(function() { return this._password })

/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
	next();
});

/**
 * Methods
 */

UserSchema.methods = {

    /**
    * Authenticate - check if the passwords are the same
    *
    * @param {String} plainText
    * @return {Boolean}
    * @api public
    */
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.userpass;
    },

    /**
    * Encrypt password
    *
    * @param {String} password
    * @return {String}
    * @api public
    */
    encryptPassword: function(password) {
        if (!password) return '';
        // using the ObjectId as the salt
        return crypto.createHmac('sha1', this._id.toString()).update(password).digest('hex');
    }
}

mongoose.model('User', UserSchema)