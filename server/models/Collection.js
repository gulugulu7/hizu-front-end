const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CollectionSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    house_id: {
        type: Schema.Types.ObjectId,
        ref: 'houses'
    },
    collection_time: {
        type: Date,
        default: Date.now
    }
});


module.exports = Collection = mongoose.model("collections", CollectionSchema);