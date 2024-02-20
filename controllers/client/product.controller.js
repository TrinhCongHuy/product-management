const Product = require('../../models/product.model')
const ProductCategory = require('../../models/product-category.model')
const productsHelper = require('../../helpers/products')
const productCategoryHelper = require('../../helpers/product-category')


// [GET] /product
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({position: "desc"});

    const newProduct = productsHelper.priceNewProducts(products)

    res.render('client/pages/products/index', {
        titlePage: "Trang sản phẩm",
        products: newProduct
    })
}

// [GET] /product/:slug
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slug
        const find = {
            slug: slug,
            status: "active",
            deleted: false
        }

        const product = await Product.findOne(find)

        res.render('client/pages/products/detail', {
            titlePage: product.title,
            product: product
        })
    }catch(error) {
        res.redirect(`/products`)
    }
}

// [GET] /product/:slugCategory
module.exports.category = async (req, res) => {
    try{
        const slugCategory = req.params.slugCategory

        const category = await ProductCategory.findOne({
            slug: slugCategory,
            status: "active",
            deleted: false
        })

        const listSubCategory = await productCategoryHelper.getSubCategory(category.id)
        const listSubCategoryId = listSubCategory.map(item => item.id)

        const productsCategory = await Product.find({
            product_category_id: {$in : [category.id, ...listSubCategoryId]},
            deleted: false
        }).sort({ position: "desc"} )

        const newProduct = productsHelper.priceNewProducts(productsCategory)

        res.render('client/pages/products/index', {
            titlePage: category.title,
            products: newProduct
        })
    }catch(error) {
        res.redirect(`/products`)
    }
}