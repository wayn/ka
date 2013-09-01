var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var KaSchema = new Schema({
	id 		: ObjectId,
	title	: String,
	ka 		: String,
	create: { type: Date, default: Date.now }
});

KaSchema.pre('save', function(next) {
	next();
});

mongoose.model('Ka', KaSchema)