const http = require("http")
const express = require("express")
const WebSocket = require("ws")
const fs = require('fs')
const app = express()

const server = http.createServer(app)

const webSocketServer = new WebSocket.Server({ server })

webSocketServer.on('connection', ws => {
  const data = JSON.parse(fs.readFileSync("data.json", "binary"))
  ws.send(JSON.stringify(data))
  console.log('user connected')

  ws.on('message', m => {
    const data = JSON.parse(fs.readFileSync("data.json", "binary"))
    const req = JSON.parse(m)

    if (req.message) {
      const messageText = req.message
      const messageObj = {
        senler: "user",
        text: messageText
      }

      data.messages.push(messageObj)

      fs.writeFileSync("data.json", JSON.stringify(data))

      webSocketServer.clients.forEach(client => client.send(JSON.stringify(data)))
    }
    if (req["input_type"]) {
      const inputType = req["input_type"]

      data["input_type"] = inputType

      fs.writeFileSync("data.json", JSON.stringify(data))

      webSocketServer.clients.forEach(client => client.send(JSON.stringify(data)))
    }

    if (req.language) {
      const language = req["language"]

      data["language"] = language

      fs.writeFileSync("data.json", JSON.stringify(data))

      webSocketServer.clients.forEach(client => client.send(JSON.stringify(data)))
    }
  })

  ws.on("error", e => {
    ws.send(JSON.stringify({ error: 'ws: error' }))
    console.log(e)
  })

  ws.on('close', () => {
    console.log('user disconnected')
  })
})

const PORT = process.env.PORT || 9898

server.listen(PORT, () => console.log(`Server started ${PORT}`))