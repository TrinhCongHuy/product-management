const mongoose = require("mongoose");
slug = require('mongoose-slug-updater'),
mongoose.plugin(slug)

const productSchema = new mongoose.Schema({  
    title: String,
    parent_id: {
        type: String,
        default: ""
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: { 
        type: String, 
        slug: "title" ,
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
});
  

const ProductCategory = mongoose.model('ProductCategory', productSchema, 'product-category');
module.exports = ProductCategory;