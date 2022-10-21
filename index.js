const express = require('express')
const app = express()
require('dotenv').config();
const path = require('path')
const sequelize = require('./database')
const UserModel = require('./userModels')
const port = process.env.PORT || 5000;
const {Telegraf} = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);


// app.use(express.static(path.join(__dirname, 'site')))
app.get('/', async (req, res) => {
   res.send("Hello!")
   // res.sendFile(path.join(__dirname, 'site', 'index.html'))
})

app.get('/backendapi/newvisitors/:workid', async (req, res) => {
   res.send("Hello!")
   const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
   fetch(`https://ipwho.is/${ip}`)
	.then(response => response.json())
	.then(async data => {
      console.log(data)

      console.log(req.params.workid)
      const user = await UserModel.findOne({ where: {workId: '' + req.params.workid} })

      if (user && data.success) {
         console.log(user.username)
         bot.telegram.sendMessage(user.chatId, `
📶 Посещение ccылки
🏳️ IP: ${ip}
▫️ Страна: ${data.flag.img} ${data.country}
▫️ Город: ${data.city}
🚥 OS: ${req.headers['user-agent'] }
         `);
      } else if (user) {
         bot.telegram.sendMessage(user.chatId, `
📶 Посещение ccылки
🏳️ IP: ${ip}
         `);
      }
   })
	.catch(err => console.error(err));

   
})

app.listen(port, async () => {
   
   await sequelize.authenticate();
   await sequelize.sync();
  console.log(`Example app listening at http://localhost:${port}`)
})