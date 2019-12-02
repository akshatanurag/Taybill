const supertest = require('supertest')
const {User} = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('config')
generateAuthToken = function(bodyEmail) {
    return jwt.sign(
      {
        email: bodyEmail
      },
      config.get("jwtPrivateKey"),
      {
        expiresIn: "30d"
      }
    );
  };
describe('Profile',()=>{
    describe('GET - /api/profile',()=>{
        beforeAll((done)=>{
            app = require('../server/test_server')
            app.listen(done);
        })
        afterAll((done)=>{
            //await User.deleteMany({})
            app.close(done)
        })
        it('- should get user profile',async (req,res)=>{
            let token = await generateAuthToken('akshatanurg1999@gmail.com')
            console.log(token)
            res= await supertest(app).get("/api/profile").set('x-auth-token',token)
            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({success: true})
        })
    })
})