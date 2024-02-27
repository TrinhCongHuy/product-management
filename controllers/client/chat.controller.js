// [GET] /
module.exports.index = async (req, res) => {
    res.render('client/pages/chat/index', {
        titlePage: "Trang tin nhắn"
    })
}