const supertest = require('supertest')
const {User} = require('../models/user')


describe('Authentication',()=>{
    beforeAll((done)=>{
        app = require('../server/test_server')
        app.listen(done);
    })
    afterAll((done)=>{
        //await User.deleteMany({})
        app.close(done)
    })
    describe('POST /api/signup',()=>{
        it('- Should signup a user',async ()=>{

            var dummyUser = {
                name: "Akshat Anurag",
                email: 'akshatanurg1999@gmail.com',
                password: 'Anurag2@',
                mob_no: 9015799705
            }
            let res = await supertest(app).post('/api/signup').send(dummyUser)
            //console.log(res.body)
            expect(res.status).toBe(200)
        })
        it('- Should check db if signup successful or not',async ()=>{
            let res = await User.find({email:"akshatanurg1999@gmail.com"})
            expect(res.length).toBe(1)
            //await User.deleteMany({})
        })
    })
    describe('POST /api/login',()=>{
        it('- should login a user',async ()=>{
            let res = await supertest(app).post("/api/login").send({email: "akshatanurg1999@gmail.com",password: "Anurag2@"})
            expect(res.status).toBe(200)
            //console.log(res.body)
            //await User.deleteMany({})
        })
    })

})
