const signupRoutes = require('../routes/signup.user')
const loginRoutes = require('../routes/login.user')
const profileRoutes = require('../routes/profile.user')

module.exports = (app) => {
    app.use("/api", signupRoutes)
    app.use("/api",loginRoutes)
    app.use("/api",profileRoutes)
}