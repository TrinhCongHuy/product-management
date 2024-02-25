const User = require('../../models/user.model')
const ForgotPassword = require('../../models/forgot-password.model')
const md5 = require('md5')
const generate = require('../../helpers/generate')

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

// [GET] /password/forgot
module.exports.forgotPassword = async (req, res) => {

    res.render('client/pages/user/forgot-password', {
        titlePage: "Lấy lại mật khẩu"
    })
}

// [POST] /password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if(!user) {
        req.flash('error', `Email không hợp lệ!`);
        res.redirect('back')
        return;
    }

    const otp = generate.generateRandomNumber(6)

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()

    console.log(forgotPassword)

    res.redirect(`/user/password/otp?email=${email}`)
}

// [GET] /password/passwordOtp
module.exports.passwordOtp = async (req, res) => {
    const email = req.query.email

    res.render('client/pages/user/password-otp', {
        titlePage: "Gửi mã OTP",
        email: email
    })
}

// [POST] /password/passwordOtpPost
module.exports.passwordOtpPost = async (req, res) => {
    const email = req.body.email
    const otp = req.body.otp

    console.log(email)
    console.log(otp)

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })

    if(!result) {
        req.flash('error', `Mã OTP không hợp lệ!`);
        res.redirect('back')
        return;
    }

    const user = await User.findOne({
        email: email
    })

    res.cookie("tokenUser", user.tokenUser)

    res.redirect('/user/password/resetPassword')
}