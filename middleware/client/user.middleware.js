const User = require('../../models/user.model')

module.exports.infoUser = async (req, res, next) => {
    const user = await User.findOne({
        tokenUser: req.cookies.tokenUser,
        deleted: false
    }).select("-password")

    if (user) {
        res.locals.user = user
    }

    next()
}