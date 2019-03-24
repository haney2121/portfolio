const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdBlogs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;