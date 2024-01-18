const Product = require('../../models/product.model')
const systemConfig = require("../../config/system")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")

// Hiển thị sản phẩm [get] /admin/products
module.exports.index = async (req, res) => {
    // Bộ lọc
    const filterStatus = filterStatusHelper(req.query)

    let find = {
        deleted: false
    }

    if (req.query.status) {
        find.status = req.query.status
    }

    // Search
    const objectSearch = searchHelper(req.query)

    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }

    // Pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        },
        req.query,
        countProducts
    ) 

    const sort = {}

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    }else {
        sort.position = "desc"
    }
        
    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
        titlePage: "Trang sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

// Thay đổi trạng thái hoạt động [patch] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status
    const id = req.params.id

    await Product.updateOne({ _id: id }, { status: status})

    req.flash('success', 'Cập nhật trạng thái thành công!');

    res.redirect('back')
}

// [patch] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type
    const ids = req.body.ids.split(", ")

    switch(type) {
        case "active": 
            await Product.updateMany({_id: { $in: ids }}, {status: "active"})
            req.flash('success', `Cập nhật trạng thái thành công của ${ids.length} sản phẩm`);
            break;
        case "inactive": 
            await Product.updateMany({_id: { $in: ids }}, {status: "inactive"})
            break;
        case "del-all": 
            await Product.updateMany({_id: { $in: ids }}, {deleted: true, deletedAt: new Date()})
            break;
        case "change-position": 
            for (const item of ids) {
                const [id, position] = item.split("-")
                await Product.updateOne({ _id: id }, { position: position})
            }
            break;
        default:
            break;
    }
    res.redirect('back')
}

// delete product (Xoá vĩnh viễn) [delete] /admin/products/delete/:id
// module.exports.deleteItem = async (req, res) => {
//     const id = req.params.id

//     await Product.deleteOne({ _id: id });

//     res.redirect('back')
// }

// delete product (Xoá mềm => còn tồn tại trong db) [delete] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id

    await Product.updateOne({ _id: id }, 
        {
            deleted: true,
            deletedAt: new Date()
        });

    res.redirect('back')
}

// Thêm mới sản phẩm [get] /admin/products/create
module.exports.create = (req, res) => {
    res.render("admin/pages/products/create", {
        titlePage: "Thêm sản phẩm"
    })
}
// Thêm mới sản phẩm [post] /admin/products/create
module.exports.createPost = async (req, res) => {  
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)

    if(req.body.position == ""){
        const countProducts = await Product.countDocuments()
        req.body.position = countProducts + 1   
    }else {
        req.body.position = parseInt(req.body.position)
    }

    const product = new Product(req.body)
    await product.save()

    res.redirect(`${systemConfig.prefixAdmin}/products`)
}


// Sửa sản phẩm [get] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find)
    
        res.render("admin/pages/products/edit", {
            titlePage: "Sửa sản phẩm",
            product: product
        })
    }catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}
// Sửa sản phẩm [patch] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {  
    const id = req.params.id

    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`
    }

    try {
        await Product.updateOne({ _id: id }, req.body)
        req.flash('success', `Cập nhật sản phẩm thành công`);
    }catch(error) {
        req.flash('error', `Cập nhật sản phẩm không thành công`);
    }

    res.redirect("back")
}

// Chi tiết sản phẩm [get] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id
    const find = {
        deleted: false,
        _id: id
    }

    const product = await Product.findOne(find)
    console.log(product)

    res.render("admin/pages/products/detail", {
        titlePage: product.title,
        product: product
    })
}