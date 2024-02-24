
// [GET] /register
module.exports.register = async (req, res) => {
    res.render('client/pages/user/register', {
        titlePage: "Trang đăng ký"
    })
}