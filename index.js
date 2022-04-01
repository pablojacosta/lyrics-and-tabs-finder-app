const express = require('express')
const cors = require('cors')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()
app.use(cors())
app.use(express.static('build'))

app.get('/lyrics', (req, res) => {
  
  const options = {
    method: 'GET',
    url: req.query.passedUrl,
    responseType: 'text'
  }

  axios
    .request(options)
    .then((response) => {
      const html = response.data
      const $ = cheerio.load(html)
   
      let lyrics = []

      $("div[class*='Lyrics__Container']", html).each(function () {
        let scrappedLyrics = $(this)
        scrappedLyrics.find('a').each(function () {
          $(this).replaceWith($(this).find('span').html())
        })
        lyrics.push(scrappedLyrics.html())
      })
      res.send(lyrics)
    }).catch((err) => console.log(err))
  })

const PORT = process.env.port || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

