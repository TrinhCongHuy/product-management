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

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
        const find = {
            deleted: false,
            _id: id
        }
        const data = await Role.findOne(find)
        res.render("admin/pages/roles/edit", {
            titlePage: "Chỉnh sửa nhóm quyền",
            data: data
        })
    }catch(error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}

module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    await Role.updateOne({ _id: id }, req.body)
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

module.exports.permissions = async (req, res) => {
    const  find = {
        deleted: false
    }

    const records = await Role.find(find)
    
    res.render("admin/pages/roles/permissions", {
        titlePage: "Trang phân quyền",
        records: records
    })
}

module.exports.permissionsPatch = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions)
    for (const item of permissions) {
        await Role.updateOne({_id: item.id}, {permissions: item.permissions})
    }
        
    res.redirect("back")
}