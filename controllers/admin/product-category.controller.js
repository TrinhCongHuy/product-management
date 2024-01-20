const ProductCategory = require('../../models/product-category.model')
const systemConfig = require("../../config/system")

// Hiển thị danh mục sản phẩm [get] /admin/product-category
module.exports.index = async (req, res) => {
    res.render("admin/pages/product-category/index", {
        titlePage: "Danh mục sản phẩm"
    })
}

// Thêm danh mục sản phẩm [get] /admin/product-category
module.exports.create = async (req, res) => {
    res.render("admin/pages/product-category/create", {
        titlePage: "Tạo mới danh mục"
    })
}

// Thêm mới sản phẩm [post] /admin/products/create
module.exports.createPost = async (req, res) => {  
    if(req.body.position == "") {
        const count = await ProductCategory.countDocuments()
        req.body.position = count  + 1
    }else {
        req.body.position = parseInt(req.body.position)
    }

    const record = new ProductCategory(req.body)
    await record.save()

    res.redirect(`${systemConfig.prefixAdmin}/product-category`)
}

