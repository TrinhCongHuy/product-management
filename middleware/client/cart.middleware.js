const Cart = require('../../models/cart.model')

module.exports.cartId = async (req, res, next) => {
    
    if (!req.cookies.cartId) {
        const cart = new Cart()
        await cart.save()

        const expiresTime = 1000 * 60 * 60 * 24 * 365

        res.cookie('cartId', cart.id, { expires: new Date(Date.now() + expiresTime)})
    }else {
        const cartId = req.cookies.cartId
        const cart = await Cart.findOne({
            _id: cartId
        })
        const totalProduct = cart.products.reduce((total, item) => {
            return total + item.quantity
        }, 0)

        cart.totalProduct = totalProduct
        
        res.locals.miniCart = cart
    }

    next()
}