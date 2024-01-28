const Account = require("../../models/accounts.model")
const Role = require("../../models/roles.model")
const systemConfig = require("../../config/system")
const md5 = require('md5');

// Hiển thị danh sách tài khoản [get] /admin/accounts/index
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }

    const records = await Account.find(find).select("-password -token")
    console.log(records)
    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        })
        record.role = role    
    }

    res.render("admin/pages/accounts/index", {
        titlePage: "Trang tài khoản",
        records: records
    })
}

// Thêm mới tài khoản [get] /admin/accounts/create
module.exports.create = async (req, res) => {
    const find = {
        deleted: false
    }

    const roles = await Role.find(find)

    res.render("admin/pages/accounts/create", {
        titlePage: "Tạo mới tài khoản",
        roles: roles
    })
}

// Thêm mới tài khoản [post] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const emailExit = await Account.findOne({
        email: req.body.email,
        deleted: false
    })

    if(emailExit) {
        req.flash('error', `Email ${req.body.email} đã tồn tại!`)
        res.redirect("back")
    }else {
        req.body.password = md5(req.body.password)
    
        const record = new Account(req.body)
        await record.save()

        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}

// Chỉnh sửa tài khoản [get] /admin/accounts/edit
module.exports.edit = async (req, res) => {
    const id = req.params.id
    const find = {
        _id: id,
        deleted: false
    }

    const data = await Account.findOne(find)
    const roles = await Role.find({deleted: false})


    res.render("admin/pages/accounts/edit", {
        titlePage: "Chỉnh sửa tài khoản",
        data: data,
        roles: roles
    })
}
// Chỉnh sửa tài khoản [patch] /admin/accounts/edit
module.exports.editPatch = async (req, res) => {
    const id = req.params.id

    const emailExit = await Account.findOne({
        _id: { $ne : id},
        email: req.body.email,
        deleted: false
    })

    if(emailExit) {
        req.flash('error', `Email ${req.body.email} đã tồn tại!`)
    }else {
        if (req.body.password) {
            req.body.password = md5(req.body.password)
        }else {
            delete req.body.password
        }

        await Account.updateOne({_id: id}, req.body)
        req.flash("success", "Cập nhật tài khoản thành công!")

        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}