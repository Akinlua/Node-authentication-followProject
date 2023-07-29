

module.exports = (app, db, session, passport, ObjectId, LocalStrategy, bcrypt) => {

    app.use(session({  
        secret: 'sdufg',
        resave: true,
        saveUninitialized: true
      })), 
      app.use(passport.initialize())
      app.use(passport.session())

     //Save user id to a cookie
     passport.serializeUser((user, done) => {
        done(null, user._id)
      })
      
      //retrieve User details from cookie
      passport.deserializeUser((userId, done) => {
          db.collection('users').findOne(
            {_id: new ObjectId(userId)},
            (err, doc) => {
              done(null, doc)
            }
            )
      })
  
  
      let findUserDocument  = new LocalStrategy(
        (username, password, done) => {
          db.collection('users').findOne(
            {username: username},
            (err, user) => {
              if(err){
                return done(err)
              } else if (!user){
                done(null, false)
              } else if (!bcrypt.compareSync(password, user.password)){
                done(null, false)
              }else{
                done(null, user)
              }
            } 
          )
        }
      )
  
  
      passport.use(findUserDocument)
      
}