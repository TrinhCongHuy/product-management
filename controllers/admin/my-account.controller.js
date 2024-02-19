const md5 = require('md5');
const Account = require("../../models/accounts.model")


// Hiển thị thông tin tài khoản [get] /admin/my-account/index
module.exports.index = async (req, res) => {

    res.render("admin/pages/my-account/index", {
        titlePage: "Thông tin cá nhân",
    })
}

// Thay đổi thông tin tài khoản [get] /admin/my-account/edit
module.exports.edit = async (req, res) => {

    res.render("admin/pages/my-account/edit", {
        titlePage: "Thay đổi thông tin cá nhân",
    })
}

// Cập nhật thông tin chi tiết tài khoản [patch] /admin/my-account/editPatch
module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id

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
    }
    res.redirect('back')
}