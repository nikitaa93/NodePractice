let mongoose   = require('mongoose');
let Schema     = mongoose.Schema;
let validate = require('mongoose-validator');
//require('mongoose-type-email');

// nameValidator = validate({
//     validator: isAlphanumeric,
//     message: 'Name should contain alpha-numeric characters only',
//   });

let UserSchema = new Schema({
    name     :  {
        type     : String,
        match    :  /[a-z][A-z]/,
        unique   : true,
        //validate:   nameValidator,
        required : true
    },
    email    : {
        type : String,
        match: /\S+@\S+\.\S+/,
        //type     : mongoose.SchemaTypes.Email,
        unique   : true,
        required : true
    },
        
    username : {
        type     : String,
        unique   : true,
        required : true
    } 
});

module.exports = mongoose.model('User',UserSchema);




