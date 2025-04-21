const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['hostel', 'flatmate', 'food', 'essentials', 'places', 'notes', 'books', 'electronics', 'clothing', 'furniture', 'other']
  },
  price: {
    type: String,
    required: [true, 'Please provide a price'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  cloudinary_id: {
    type: String
  },
  user: {
    name: String,
    email: String,
    uid: {
      type: String,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema); 