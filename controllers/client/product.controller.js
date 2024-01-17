const Product = require('../../models/product.model')

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({position: "desc"});

    const newProduct = products.map(item => {
        item.priceNew = ((item.price * (100 - item.discountPercentage))/100).toFixed(0);
        return item
    });
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