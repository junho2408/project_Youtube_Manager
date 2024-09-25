const express = require('express')
const app = express()

app.listen(6666)

const userRouter = require('./routes/users')
const channelRouter = require('./routes/channels')
const db = require('./mariadb')

app.use("/", userRouter)
app.use("/channels", channelRouter)