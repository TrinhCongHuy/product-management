const express = require('express')
const path = require('path');
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
const moment = require("moment")

// socket.io
const http = require('http');
const { Server } = require("socket.io");


database.connect()
const app = express()
const port = process.env.PORT

app.use(methodOverride('_method'))

app.set("views", `${__dirname}/views`)
app.set("view engine", "pug")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));


app.locals.prefixAdmin = systemConfig.prefixAdmin
app.locals.moment = moment

app.use(express.static(`${__dirname}/public`))

// socket.io
const server = http.createServer(app);
const io = new Server(server);

global._io = io


route(app)
routeAdmin(app)

app.get("*", (req, res) => {
    res.render("client/pages/error/404"), {
        titlePage: "404 Not Found"
    }
})

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})