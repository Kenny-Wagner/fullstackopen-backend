require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Phonebook = require('./models/phonebook')
const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

morgan.token('data', (req,res) => JSON.stringify(req.body))
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.data(req, res)
  ].join(' ')
}))

app.get('/', (request, response) => {
    response.send('<h1>Phonebook Backend </h1>')
})

app.get('/api/persons', (request, response) => {
    Phonebook.find({})
    .then( phonebook => {
      response.json(phonebook)
    })
})

app.get('/api/info', (request, response) => {
    
    const requestTime = new Date()
    const formattedDate = `${requestTime.toDateString()} ${requestTime.toTimeString()} GMT${requestTime.getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(requestTime.getTimezoneOffset() / 60).toString().padStart(2, '0')}00 (${requestTime.toString().match(/\((.*)\)/)[1]})`;
    Phonebook.find({})
      .then(entries => {
          response.send(`<p>Phonebook as info for ${entries.length} people</p>` +`<p>${formattedDate}</p>`)  
      })

})

app.get('/api/persons/:id', (req, res, next) => {
    Phonebook.findById(req.params.id)
      .then(entry => {
        if (entry) {
          res.json(entry)
        } else {
          res.status(404).end()
        }
      })
      .catch(error => next(error))
      
})

app.delete('/api/persons/:id', (req, res) => {
  Phonebook.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
})

app.post('/api/persons', (req, res, next) => {

  const newEntry = new Phonebook({
      name: req.body.name,
      number: req.body.number
  })

  newEntry.save()
    .then(savedEntry => {
      return res.json(savedEntry)
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (req,res, next) => {
  const {name, number} = req.body

  Phonebook.findByIdAndUpdate(
    req.params.id,
    {name, number},
    {new: true, runValidators: true, context: 'query'}
  )
    .then(entry => {
      console.log(entry)
      res.json(entry)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(400).send({error: "unknown endpoint" })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({error: error.message})
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, ()=> {
  console.log(`Server running on port ${PORT}`)
  })
