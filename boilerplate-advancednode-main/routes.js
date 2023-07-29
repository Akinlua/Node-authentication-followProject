module.exports = (app, db, bodyParser, passport, bcrypt) => {
    app.listen(3000)
    console.log("App listening on port 3000")


    app.get('/', (req, res) => {

      req.session.count ++
      console.log(req.session)
      res.render('home.pug', {message: "Welcome to Our app"})
    
    })
    
   

    var urlencodedParser = bodyParser.urlencoded({extended: false})

    app.post('/login', urlencodedParser, passport.authenticate('local', {failureRedirect:  '/'} ), (req, res) => {
      console.log(req.user)
      res.redirect('/profile')

    })

    let isSinedIn = (req, res, next) => {
        if(req.isAuthenticated()){
          next()
        }
        else{
          res.redirect('/')
        }
    }

    app.get('/profile', isSinedIn, (req,res) => {

      
      res.render('profile', {name: req.user.name, bio: req.user.bio, pic: req.user.pic} )
    })

    app.get("/logout", (req,res) => {
      req.logOut()
      res.redirect('/')
    })

   
////////////////////////

    app.post('/register', 
      urlencodedParser,
      (req,res,next) => {

        //check if user already exit
        db.collection('users').findOne(
          {username: req.body.username},
          (err, user) => {
            if(!err && user){
              res.redirect('/')
            }
          }
        )

        //create new user
        let hash = bcrypt.hashSync(req.body.password, 12)
        db.collection('users').insertOne(
          {
            username: req.body.username,
            password: hash,
            name: req.body.name,
            bio: req.body.bio,
            pic: req.body.pic
          },
          (err, createdUser) => {
            if(!err && createdUser) {
              next()
            }
        }
        )
      },
      passport.authenticate('local', {failureRedirect:  '/'} ),
      (req, res) => {
        res.redirect('profile')
      }      

    )


    app.use((req,res) => {
      res.status(400)
      .type('text')
      .send('NOT FOUND')
    })
}