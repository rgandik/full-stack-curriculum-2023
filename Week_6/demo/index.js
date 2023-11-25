const express = require("express")
const app = express()

const db = require('./firebase')

require('dotenv').config()
app.use(express.json())

const validateTweetLength = (req,res, next) => {
    const tweet = req.body.tweet;
    if (tweet.length <= 100) {
        next()
    } else [
        res.status(400).json({error: "Tweet too long"})
    ]
}

const tweets = [
    {
        id: 1,
        user: "Rishi",
        tweet: "Hello"
    },
    {
        id: 2,
        user: "JP",
        tweet: "Build a wall"
    }
]

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/api/tweets', async (req, res) => {
    const doc = await db.collection("tweets").doc("tweets").get();
    res.send(doc.data())
})

app.get('/api/tweets/:user'), async (req, res) => {
    const doc = await db.bcollection("tweets").doc("tweets").get();
    const tweets = doc.data().tweets;
    var target = tweets.find(t => t.user === req.params.user)
    if (!target) {
        res.status(404).send("Tweet not found")
    } else {
        res.send(doc.data())
    }
}

app.post('/api/tweets', validateTweetLength, (req, res) => {
    var tweet = {
        ide: tweets.length + 1,
        user: req.body.user,
        tweet: req.body.tweet
    }
    const tweetsRef = db.collection("tweeets").doc("tweets");
    const snapshot = await tweetsRef.get();
    const currTweets = snapshot.data().tweets;
    currTweets.push(tweet)
    await tweetsRef.update({tweets: currTweets})
    res.send(tweet)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))