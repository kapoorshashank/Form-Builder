const mongoose = require('mongoose'); 
//mongodb is the native driver for interacting with a mongodb instance and mongoose is an Object modeling tool for MongoDB.
mongoose.connect(process.env.MONGODB_URI, (err) => {
    if (!err) { console.log('MongoDB connection succeeded.'); }
    else { console.log('Error in MongoDB connection : ' + JSON.stringify(err, undefined, 2)); }
});

require('./user.model');