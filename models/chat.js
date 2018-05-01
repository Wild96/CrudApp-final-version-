var mongoose = require('mongoose');

//chat schema
var chatschema = mongoose.Schema({
   // name:String,
   // message:String,
    user: String,
    msg:String

});
module.exports = mongoose.model('chat', chatschema);