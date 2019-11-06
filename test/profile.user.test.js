const supertest = require('supertest')

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
            res= await supertest(app).get("/api/profile")
            expext(res.status).toBe(200)
            expext(res.body).toMatchObject({success: true})
        })
    })
})