console.log("The Bot is starting");
var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);
// var fs = require('fs');

const Quote = require('inspirational-quotes');

// console.log(Quote.getRandomQuote());
// console.log(Quote.getQuote());
///////////////Retweet Section///////////////////////////////////////////////////////////////////
const retweet = (searchTag) => {
  const params = {
    q: searchTag,
    result_type: 'mixed',
    count: 100,
  };

  T.get('search/tweets', params, (srcErr, srcData, srcRes) => {
    const tweets = srcData.statuses;
    if (!srcErr) {
      let tweetIDList = [];

      tweets.forEach((tweet) => {
        if (tweet.text.startsWith('RT @')) {
          if (tweet.retweeted_status) {
            tweetIDList.push(tweet.retweeted_status.id_str);
          } else {
            tweetIDList.push(tweet.id_str);
          }
        } else {
          tweetIDList.push(tweet.id_str);
        }
      });

      // Filter unique tweet IDs.
      tweetIDList = tweetIDList.filter((value, index, self) => self.indexOf(value) === index);

      tweetIDList.forEach((tweetID) => {
        // Retweet
        T.post('statuses/retweet/:id', {
          id: tweetID,
        }, (rtErr, rtData, rtRes) => {
          if (!rtErr || rtData) {
            console.log(`\n\nRetweeted! ID - ${tweetID}`);
          } else {
            console.log(`\nError... Duplication maybe...  ${tweetID}`);
          }
        });

        /*
        // Like a tweet
        Twitter.post('favorites/create', {
          id: tweetID,
        })
          .then(() => {
            console.log('Liked tweet successfully!');
          }).catch(() => {
            console.log('Already Liked this tweet.');
          });
        */
      });
    } else {
      console.log(`Error while searching: ${srcErr}`);
      process.exit(1);
    }
  });
};

// Run every 60 seconds
setInterval(() => {
  // retweet('#javascript OR #nodejs OR #100DaysOfCode');
  retweet('#twitme OR #python OR #dataanalytics OR #startup OR #webdeveloper OR #webdevelopment OR #softwareengineer OR #remote OR #codingjobs OR #codingmemes OR #programmermemes');
}, 60000);

////////////////POST INSPIRATIONAL QUOTE USING API////////////////////////////////////////////////////////////////////////////////////
function tweetQuote(){
  var quote=Quote.getQuote();
  var quoteTxt=quote.text;
  var quoteAuthor=quote.author;
  // console.log(quoteTxt+"\n"+" - "+quoteAuthor);
   tweetIt(quoteTxt+"\n"+" - "+quoteAuthor);
}

 tweetQuote();
setInterval(tweetQuote,1000*60*60*2);//2 hr

function tweetIt(txt) {

    var tweet = {
      status: txt
    }

    T.post('statuses/update', tweet, tweeted);

  function tweeted(err, data, response) {
    if (err) console.log('Something went wrong');
    else console.log('It is working');
     // console.log(data);
  }
};
