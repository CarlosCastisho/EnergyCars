const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const path = require('path');
const passport = require('passport');

// inicializamos
const app = express();
//require('./lib/passport'); // PARA QUE LA APLICACION SE ENTERE DE LA AUTENTIFICACION DE CREACION

//settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//app.use(passport.initialize()); //INICIAR PASSPORT
//app.use(passport.session()); // INICIAR SECCION DE PASSPORT

//Global Variables
app.use((req, res, next) => {

    next();
})

//Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/autos', require('./routes/autos'));

//Public
app.use(express.static(path.join(__dirname, 'public')))

//Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});