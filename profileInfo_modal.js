var mongoose = require('mongoose');
var profile_info = new mongoose.Schema({
   user_id:{type: mongoose.Schema.Types.ObjectId, ref: 'users' },
   title:{type: mongoose.Schema.Types.ObjectId, ref: 'designations' },
   description:{type:String},
   dob:{type:Date},
   doj:{type:Date},
   pro_pic:{type:String},
   current_activity:{type:String},
   address:{type:String},
   mobile:{type:Number},
   alt_mobile:{type:Number},
   notes:[{type: mongoose.Schema.Types.ObjectId, ref: 'notes' }],
},{
	timestamps: true
});

module.exports = mongoose.model('profile_info',profile_info);