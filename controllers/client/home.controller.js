const Product = require('../../models/product.model')
const productsHelper = require('../../helpers/products')

module.exports.index = async (req, res) => {
    // Lấy ra sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    })

    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured)

    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({position : "desc"}).limit(6)

    const newProductsNew = productsHelper.priceNewProducts(productsNew)

    res.render('client/pages/home/index', {
        titlePage: "Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    })
}