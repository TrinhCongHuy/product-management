const Product = require('../../models/product.model')
const productsHelper = require('../../helpers/products')


// [GET] /search
module.exports.index = async (req, res) => {
    const keyword = (req.query.keyword)
    let newProduct = []
    if (keyword) {
        const keywordRegex = new RegExp(keyword, 'i')
        const products = await Product.find({
            title: keywordRegex,
            status: "active",
            deleted: false
        })

        newProduct = productsHelper.priceNewProducts(products)        
    }
    res.render('client/pages/search/index', {
        titlePage: "Kết quả tìm kiếm",
        keyword: keyword,
        products: newProduct
    })
}
