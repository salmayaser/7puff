//defining dependancies 
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    adminRouting = require('./routes/admin'),
    userRouting = require('./routes/user'),
    authRouting = require('./routes/auth'),
    userModel = require('./models/user'),
    mongoose = require('mongoose'),
    multer = require('multer'),
    session = require('express-session'),
    flash = require('connect-flash'),
    mongodbStore = require('connect-mongodb-session')(session),
    // mongodbUri = "mongodb://localhost:27017/?readPreference=primary&7puff=MongoDB%20Compass&ssl=false",
    mongodbUri = "mongodb+srv://salma:salma@cluster0.av8gc.mongodb.net/7puff?authSource=admin&replicaSet=atlas-12bmyg-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true",
    store = new mongodbStore({
        uri: mongodbUri,
        collection: "sessions"

    });
//views and public files 
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public/'))
app.use("/images", express.static(__dirname + '/images'))
app.use(session({ secret: "long string value my secret", resave: false, saveUninitialized: false, store: store }))
app.use((req, res, next) => {
    if (!req.session.user) {
        next();
    } else {
        userModel.findById(req.session.user._id).then((user) => {
            req.user = user
            next()
        }).catch((err) => console.log(err))
    }
})
app.use(flash())
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname)
    },
})
//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage }).single("image"))

//routing 
app.use(adminRouting);
app.use(userRouting);
app.use(authRouting);

// mongoose.connect("mongodb://localhost:27017/7puff")
mongoose.connect(mongodbUri, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        // app.listen(process.env.PORT);
        app.listen(3000)

        console.log("connected")
    })
    .catch((err) => console.log(err))
