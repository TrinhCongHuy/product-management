const Product = require('../../models/product.model')
const productsHelper = require('../../helpers/products')

module.exports.index = async (req, res) => {
    // Lấy ra sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    })

    const newProduct = productsHelper.priceNewProducts(productsFeatured)

    res.render('client/pages/home/index', {
        titlePage: "Trang chủ",
        productsFeatured: newProduct
    })
}