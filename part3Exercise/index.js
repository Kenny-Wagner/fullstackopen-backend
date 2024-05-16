const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
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

let phonebook = 
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Phonebook Backend </h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/api/info', (request, response) => {
    
    const requestTime = new Date()
    const formattedDate = `${requestTime.toDateString()} ${requestTime.toTimeString()} GMT${requestTime.getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(requestTime.getTimezoneOffset() / 60).toString().padStart(2, '0')}00 (${requestTime.toString().match(/\((.*)\)/)[1]})`;

    response.send(
        `<p>Phonebook as info for ${phonebook.length} people</p>` +
        `<p>${formattedDate}</p>`
    )
})

app.get('/api/persons/:id', (req, res) => {
    const reqId = Number(req.params.id)
    const phoneEntry = phonebook.find(entry => entry.id === reqId)
    if (!phoneEntry) {
        res.status(404).end()
    }

    res.json(phoneEntry)
})

app.delete('/api/persons/:id', (req, res) => {
  const reqId = Number(req.params.id)
  const phoneEntry = phonebook.find(entry => entry.id ===reqId)

  if (!phoneEntry) {
    res.status(404).end()
  }

  phonebook = phonebook.filter(entry => entry.id !== reqId)
  res.json(phonebook)

})

app.post('/api/persons', (req, res) => {
  const newEntry = req.body

  if(!newEntry.name || !newEntry.number){
    return res.status(400).json({
      error: 'missing content'
    })
  }

  const phonebookNames = phonebook.map(entry => entry.name)

  if (phonebookNames.includes(newEntry.name)){
    return res.status(400).json({
      'error': 'name must be unique'
    })
  }

  newEntry.id = Math.floor(100000000 * Math.random())
  phonebook = phonebook.concat(newEntry)
  
  res.json(phonebook)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)