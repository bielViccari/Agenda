const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
})

const LoginModel = mongoose.model('Login', LoginSchema)

class Login {
    constructor(body) {
        this.body = body
        this.errors = []
        this.user = null
    }
    
    async register() {
        this.validate()
        if(this.errors.length > 0) return; 

        await this.userExists()
        if(this.errors.length > 0) return; 
        
        //hashing password using bcrypt
        const salt = bcrypt.genSaltSync();
        this.body.password = bcrypt.hashSync(this.body.password, salt)

        try {
            //saving the data from this.body in mongoDB.
            this.user = await LoginModel.create(this.body)
        } catch (e) {
            console.log(e)
        }
    }

    async userExists() {
        const user = await LoginModel.findOne({ email: this.body.email })
        if(user) this.errors.push('Usuário ja existe.')
    }

    validate() {
        //validação dos campos
        this.cleanUp();
        //validado email utilizando o validator
        if (!validator.isEmail(this.body.email)) this.errors.push('Email Inválido');

        if (this.body.password.length < 3 || this.body.password.length > 50) this.errors.push('A senha precisa ter entre 3 e 50 caracteres');
    }


    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = ''
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        }
    }
}


module.exports = Login