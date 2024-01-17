const express = require('express')
const methodOverride = require('method-override')
const flash = require('express-flash')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
require('dotenv').config();
const database = require('./config/database')
const route = require('./routes/client/index.route')
const routeAdmin = require('./routes/admin/index.route')
const systemConfig = require('./config/system')

database.connect()
const app = express()
const port = process.env.PORT

app.use(methodOverride('_method'))

app.set("views", `${__dirname}/views`)
app.set("view engine", "pug")

app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.locals.prefixAdmin = systemConfig.prefixAdmin

route(app)
routeAdmin(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})