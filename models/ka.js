
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

/**
 * Ka Schema
 */

var KaSchema = new Schema({
	id 		: ObjectId,
	title	: String,
	ka 		: String,
	creator : { type : Schema.Types.ObjectId, ref : 'User'},
	create: { type: Date, default: Date.now }
});

/**
 * Pre-save hook
 */

KaSchema.pre('save', function(next) {
	next();
});

mongoose.model('Ka', KaSchema)