const Product = require('../../models/product.model')
const productsHelper = require('../../helpers/products')


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

// detail product
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slug
        const file = {
            slug: slug,
            status: "active",
            deleted: false
        }

        const product = await Product.findOne(file)

        res.render('client/pages/products/detail', {
            titlePage: product.title,
            product: product
        })
    }catch(error) {
        res.redirect(`/products`)
    }
    
}