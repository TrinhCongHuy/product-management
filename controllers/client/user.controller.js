const User = require('../../models/user.model')
const ForgotPassword = require('../../models/forgot-password.model')
const md5 = require('md5')
const generate = require('../../helpers/generate')
const sendMailHelper = require('../../helpers/sendMail')

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


    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        req.flash('error', `Email không tồn tại!`);
        res.redirect('back')
        return;
    }

    if(md5(password) != user.password) {
        req.flash('error', `Sai mật khẩu!`);
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

    // Tạo mã OTP và lưu OTP, email vào collection
    const otp = generate.generateRandomNumber(6)

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()

    console.log(forgotPassword)

    // Thực hiện gửi email để lấy mã

    const subject = "Mã OTP xác minh lấy lại mật khẩu!"
    const html = `Mã OTP lấy lại mật khẩu là ${otp}. Thời hạn sử dụng là 3 phút. Lưu ý: Không để lộ mã OTP.`

    sendMailHelper.sendMail(email, subject, html)

    res.redirect(`/user/password/otp?email=${email}`)
}

// [GET] /password/passwordOtp
module.exports.passwordOtp = async (req, res) => {
    const email = req.query.email

    res.render('client/pages/user/otp-password', {
        titlePage: "Gửi mã OTP",
        email: email
    })
}

// [POST] /password/passwordOtpPost
module.exports.passwordOtpPost = async (req, res) => {
    const email = req.body.email
    const otp = req.body.otp

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

    res.redirect('/user/password/reset')
}

// [GET] /password/reset
module.exports.passwordReset = async (req, res) => {

    res.render('client/pages/user/reset-password', {
        titlePage: "Đổi mật khẩu"
    })
}


// [POST] /password/reset
module.exports.passwordResetPost = async (req, res) => {
    const password = req.body.password
    const tokenUser = req.cookies.tokenUser

    await User.updateOne(
        {
            tokenUser: tokenUser
        },
        {
            password: password
        }
    )

   res.redirect("/")
}

// [GET] /info
module.exports.infoUser = async (req, res) => {
    const tokenUser = req.cookies.tokenUser

    const user = await User.findOne({
        tokenUser: tokenUser
    }).select("fullName email status")

    res.render('client/pages/user/info-user', {
        titlePage: "Thông tin cá nhân",
        user: user
    })
}