const mongoose = require('mongoose')

const url =
  `mongodb+srv://fullstack:fullstack123@fullstackopen.k76voap.mongodb.net/testNoteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
  })

  const Note = mongoose.model('Note', noteSchema)

  
  const note = new Note({
    content: 'HTML is y',
    important: false,
  })

  note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
  })
  
//   Note.find({}).then(result => {
//     result.forEach(note => {
//       console.log(note)
//     })
//     mongoose.connection.close()
//   })
})