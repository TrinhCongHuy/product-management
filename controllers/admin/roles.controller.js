const Role = require("../../models/roles.model")
const systemConfig = require("../../config/system")


module.exports.index = async (req, res) => {

    const record = await Role.find()

    res.render("admin/pages/roles/index", {
        titlePage: "Trang phân quyền",
        record: record
    })
}

module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        titlePage: "Tạo mới nhóm quyền",
    })
}

module.exports.createPost = async (req, res) => {
    
    console.log(req.body)

    const record = new Role(req.body)
    await record.save()

    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}