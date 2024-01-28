const systemConfig = require("../../config/system")

module.exports.requireAuth = (req, res, next) => {
    if (!req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
    }else {
        next()
    }
}