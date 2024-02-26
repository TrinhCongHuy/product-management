const SettingGeneral = require('../../models/settings-general.model')

// [GET] /general
module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({})

    res.render("admin/pages/settings/general", {
        titlePage: "Trang cài đặt chung",
        settingGeneral: settingGeneral
    })
}

// [PATCH] /general
module.exports.generalPatch = async (req, res) => {

    const settingGeneral = await SettingGeneral.findOne({})

    if(settingGeneral) {
        await SettingGeneral.updateOne(
            {
                _id: settingGeneral.id
            },
            req.body
        )
    }else {
        const record = new SettingGeneral(req.body)
        await record.save()
    }

    req.flash("success", "Cập nhật thành công!")

    res.redirect("back")
}