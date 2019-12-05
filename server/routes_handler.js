/**User Routes */
const signupRoutes = require('../routes/user/signup.user')
const loginRoutes = require('../routes/user/login.user')
const profileRoutes = require('../routes/user/profile.user')
const viewRestRoutes = require('../routes/user/view_rest.user')
const orderRoutes = require('../routes/user/order.user')

/**REST ROUTES */
const tableRoutes = require('../routes/rest/table.rest')
const restRoutes = require('../routes/rest/signup.rest')
const restLoginRoute = require('../routes/rest/login.rest')
const restProfileRoutes = require('../routes/rest/profile.rest')
const addFoodItemRoutes = require('../routes/rest/add_fooditems.rest')
module.exports = (app) => {
    app.use("/api", signupRoutes)
    app.use("/api",loginRoutes)
    app.use("/api",profileRoutes)
    app.use("/api",viewRestRoutes)
    app.use("/api",orderRoutes)

    app.use("/api/rest",restRoutes)
    app.use("/api/rest",restLoginRoute)
    app.use("/api/rest",restProfileRoutes)
    app.use("/api/rest",addFoodItemRoutes)
    app.use("/api/rest",tableRoutes)
}