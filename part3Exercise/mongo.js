const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@fullstackopen.k76voap.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=fullstackopen`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Phonebook = mongoose.model('Person', phonebookSchema)

const phonebookEntry = new Phonebook({
  name: process.argv[3],
  number: process.argv[4],
})

if (process.argv.length < 5) {

    Phonebook.find({}).then(result => {
        result.forEach(entry => {
            console.log(entry)
        })

    mongoose.connection.close()
    })
}

else {
    phonebookEntry.save().then(result => {
        console.log('phonebook entry saved!')
        mongoose.connection.close()
    })
}


