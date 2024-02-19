const Account = require("../../models/accounts.model")
const systemConfig = require("../../config/system")
const md5 = require('md5');

// Đăng nhập tài khoản [get] /admin/auth/login
module.exports.login = async (req, res) => {
    if (req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
    }else {
        res.render("admin/pages/auth/login", {
            titlePage: "Đăng nhập"
        })
    }
}

// Đăng nhập tài khoản [post] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    const password = req.body.password
    const email = req.body.email

    const find = {
        email: email,
        deleted: false
    }
    
    const user = await Account.findOne(find)

    if(!user) {
        req.flash('error', `Email ${email} không tồn tại!`)
        res.redirect("back")
        return;
    }

    if(md5(password) != user.password) {
        req.flash('error', "Sai mật khẩu!")
        res.redirect("back")
        return;
    }

    if(user.status == "inactive") {
        req.flash('error', "Tài khoản đã bị khoá!")
        res.redirect("back")
        return;
    }
    
    res.cookie("token", user.token)
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
}

// Đăng xuất tài khoản [get] /admin/auth/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("token")
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
}