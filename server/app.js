const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: { origin: '*' }
})
const port = process.env.PORT || 8080

app.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Methods',
    'GET,PUT,POST,DELETE,PATCH,OPTIONS'
  )
  res.header('Access-Control-Allow-Origin', req.get('origin'))
  res.header('Vary', 'Origin')
  res.header('Access-Control-Allow-Headers', 'Content-Type')

  next()
})

// io.on('connection', socket => {
//   console.log('user connected')
//   socket.join('testroon')

//   socket.on('disconnect', function () {
//     console.log('user disconnected')
//   })
// })
let currUser
io.on('connection', socket => {
  // Currently connected user
  currUser = socket.id
  console.log(`user ${currUser} connected`)

  // This will retrieve & add the user to the room ID passed on the client.
  console.log('joining room ' + socket.handshake.query.room)
  socket.join(socket.handshake.query.room)

  socket.on('configChange', function (arg) {
    console.log('config Changed')
    let config = JSON.parse(arg);
    console.log('broadcasting to ' + config.room + '...')
    io.to(config.room).emit('configChange', config)
  })

  socket.on('disconnect', function () {
    console.log('user disconnected')
  })
})

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/join', (req, res) => {
  let room = req.query.room
  console.log('joining ' + room + '...')
  currUser.join(room)
})

app.get('/broadcast', (req, res) => {
  let room = req.query.room;
  let config = JSON.parse(req.query.config)
  console.log('broadcasting to ' + room + '...')
  io.to(room).emit('configChange', config)
})

server.listen(port, function () {
  console.log(`Listening on port ${port}`)
})
