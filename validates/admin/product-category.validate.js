module.exports.createPost = (req, res, next) => {
    if (req.body.title == "") {
        req.flash('warning', `Vui lòng nhập tiêu đề!`);
        res.redirect('back')
        return;
    }
    next()
}