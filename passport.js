const express= require('express');
const passport =require('passport');
const session = require('express-session');
const LocalStrategy=require('passport-local').Strategy;
const port=process.env.PORT||5000;
const app=express();



//passport autentication with local strategy
    
        passport.use(new LocalStrategy((username,password, done ) =>{
    if(username === 'revital' && password ==='123'  ) {
        return done(null,'revital')
    }

    return done (null,false);

}));


passport.serializeUser((user,done) => {
const {username} =user;
done (null,{username});
});


passport.deserializeUser((user,done) => {
    done(null,user);
});



const isAuthorized =(req,res,next) =>{
    if(req.isAuthenticated()) return next();
    res.redirect('/login');
}


//middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(session ({
    name: 'sessionID',
    secret:process.env.SECRET ||'oukkgff8879907655',
    resave: false,
    saveUninitialized:true,
    cookie: {
        maxAge: 60 *60*1000*24*7,
        httpOnly:true
    }
}));
//express+ passport
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(__dirname + '/public'));
app.get('/list',isAuthorized,(req,res) => {
    res.send(`
    <head>
    <link rel="stylesheet" type="text/css" href="css/style.css" />
    </head>
    <h1>Our List</h1>
        <ul>
        <li>Greece</li>
        <li>Isreal</li>
        <li>Haifa</li>
        <li>USA</li>
        </ul>

    `);
});


app.use(express.static(__dirname + '/public'));
app.route('/login')
.get(( req,res) => {
    res.send(`
    <html>
    <head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="css/style.css" />
    </head>
    <h1>Form</h1>
    <form method ="POST" action ="/login">
    <input type="text" name="username" placeholder="enter user name">
    <input type="text" name="password" placeholder ="enter password">
    <input type="text" name="email" placeholder ="enter email">
     <button type="submit" class="btn btn-primary mb-2">Submit</button>
    </form>
    </html>


    `);
})

.post(passport.authenticate('local',{
failureRedirect: '/login',
successRedirect:'/list'

}));
app.listen(port, () =>console.log(`Server started on port${port}`));



