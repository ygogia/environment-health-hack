var mongoose = require('mongoose');

var Schema 	 = mongoose.Schema;

var UserSchema = new Schema({
		username: {type:String, required:true, unique:true},
		password: {type:String, required:true},
		name:String,
		isAllergic:Boolean,
		homeAddress:{
			name:String,
			latitude:Number,
			longitude:Number
		},
		workAddress:{
			name:String,
			latitude:Number,
			longitude:Number
		},
		created_at: Date,
		updated_at:Date
	});
module.exports =  mongoose.model('user',UserSchema);