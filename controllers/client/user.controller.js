const User = require('../../models/user.model')
const md5 = require('md5')

// [GET] /register
module.exports.register = async (req, res) => {
    res.render('client/pages/user/register', {
        titlePage: "Trang đăng ký"
    })
}

// [POST] /register
module.exports.registerPost = async (req, res) => {

    const exitEmail = await User.findOne({
        email: req.body.email,
        delete: false
    })

    if (exitEmail) {
        req.flash('warning', `Email đã tồn tại!`);
        res.redirect('back')
        return;
    }

    req.body.password = md5(req.body.password)
    const user = new User(req.body)
    await user.save();

    res.cookie("tokenUser", user.tokenUser)

    res.redirect('/')

}

// [GET] /login
module.exports.login = async (req, res) => {
    res.render('client/pages/user/login', {
        titlePage: "Trang đăng nhập"
    })
}

// [POST] /login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    console.log(req.body)

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    console.log(user)

    if (!user) {
        req.flash('error', `Email không tồn tại!`);
        res.redirect('back')
        return;
    }

    if(md5(password) != user.password) {
        req.flash('error', `Sai khẩu khẩu!`);
        res.redirect('back')
        return;
    }

    if (user.status == "inactive") {
        req.flash('error', `Tài khoản đã bị khoá!`);
        res.redirect('back')
        return;
    }

    res.cookie("tokenUser", user.tokenUser)

    res.redirect("/")
}

// [GET] /logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser")

    res.redirect("/")
}