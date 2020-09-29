const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const app = express();

//Loading database 
const keys = require('./config/keys');

//Handlebars Helpers
const {truncate,stripTags,formatDate,select,editIcon} = require('./helpers/hbs');
//Loading Models
require('./models/User');
require('./models/Story');

//Load Passport
require('./config/passport')(passport);

//Method Override MiddleWare
app.use(methodOverride('_method'));

//Loading The routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');
// Map Global Promise - get rid of warning 
mongoose.Promise = global.Promise;

//MongoDb connection
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(res => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

//HandleBars Middleware
app.engine('handlebars',exphbs({
  helpers:{
    truncate:truncate,
    stripTags:stripTags,
    formatDate:formatDate,
    select:select,
    editIcon:editIcon
  },
  defaultLayout:'main',
  handlebars: allowInsecurePrototypeAccess(handlebars)
}));

app.set('view engine','handlebars')
app.use(cookieParser());

// BodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//express session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//set global variables
app.use((req,res,next)=>{
  res.locals.user = req.user || null;
  next();
});
const PORT = process.env.PORT || 5000;

app.listen(PORT,() => {
    console.log(`Server Started at Port ${PORT}`)
});
//static bootstrap folder
app.use(express.static(path.join(__dirname,'public')));
app.use('/scripts', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/popperjs', express.static(__dirname + '/node_modules/popper.js/dist'));

//Using Routes
app.use('/auth',auth);
app.use('/',index);
app.use('/stories',stories);