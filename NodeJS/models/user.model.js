const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'Full name can\'t be empty'
    },
    email: {
        type: String,
        required: 'Email can\'t be empty',
        unique: true
    },
    password: {
        type: String,
        required: 'Password can\'t be empty',
        minlength: [4, 'Password must be atleast 4 character long']
    },
    saltSecret: String // need not to be set from frontend; pre event function is used for encryption/decryption of the password
});

// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

// Pre event to encypt/decrypt the password
userSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});


// Methods
userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

//Generate JWT Token
userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},     // passing payload of JWT; Headers are set by the package // iat(issued at time) will be added to payload containing date time value
        process.env.JWT_SECRET,           // passing Secret code of JWT : this will be unique and picked from env variable
    {
        expiresIn: process.env.JWT_EXP    //expiration time of JWT; exp(expiration time will be added to the payload, after this expiration time token wont work) 
    });
}



mongoose.model('User', userSchema);