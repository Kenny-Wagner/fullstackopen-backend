const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3
    },
    name: {
        type: String 
    },
    passwordHash: {
        type: String,
        required: true
    },
    notes: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Blog'
        }
    ]
})


const User = new mongoose.model('User', userSchema)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      //do not reveal passwordhash
      delete returnedObject.passwordHash
    }
  })
module.exports = User