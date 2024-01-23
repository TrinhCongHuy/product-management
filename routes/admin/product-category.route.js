const express = require('express')
const controller = require('../../controllers/admin/product-category.controller')
const multer  = require('multer')
const router = express.Router()

const uploadCloud = require("../../middleware/admin/uploadCloud.middleware")

const upload = multer()
const validates = require("../../validates/admin/product-category.validate")

router.get('/', controller.index)

router.get('/create', controller.create)

router.post(
    '/create', 
    upload.single('thumbnail'), 
    uploadCloud.upload,
    validates.createPost,
    controller.createPost
)

router.get('/edit/:id', controller.edit)

router.patch(
    '/edit/:id', 
    upload.single('thumbnail'), 
    uploadCloud.upload,
    validates.createPost,
    controller.editPatch
)




module.exports = router