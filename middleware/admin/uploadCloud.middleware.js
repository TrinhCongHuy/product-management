const uploadCloudinary = require('../../helpers/uploadToCloudinary')

module.exports.upload = async (req, res, next) => {
    if(req.file) {
      const result = await uploadCloudinary(req.file.buffer)
      req.body[req.file.fieldname] = result
    }
      
    next()
}