"use strict";
const axios = require("axios");
const OAuth2 = require("oauth").OAuth2;
const Twit = require("twit");

// CANADA
module.exports.botca = async () => {
  try {
    const tw = new Twit({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token: process.env.ACCESS_TOKEN_KEY,
      access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    });

    const response = await axios({
      url:
        "https://trends.google.com/trends/api/dailytrends?hl=en-US&tz=240&geo=CA&ns=15",
    });
    let responseFormatted = response.data.substring(5);
    const res = JSON.parse(responseFormatted);
    // create 3 tweets
    let tweets = [];
    for (let i = 0; i < 3; i++) {
      tweets.push(
        `${i + 1}. ${
          res.default.trendingSearchesDays[0].trendingSearches[i].title.query
        } - ${
          res.default.trendingSearchesDays[0].trendingSearches[i]
            .formattedTraffic
        } searches! 🕵️ 🇨🇦 \n\n 📰 Related: ${
          res.default.trendingSearchesDays[0].trendingSearches[i].articles[0]
            .url
        }`
      );
    }
    // post the top 3 in reverse order
    for (let i = 2; i >= 0; i--) {
      console.log("Currently trying to tweet this: " + tweets[i]);
      try {
        await tw.post("statuses/update", { status: tweets[i] });
        console.log("Tweet posted! 🎉");
      } catch (err) {
        console.log("An error has occurred while trying to post 😪");
        console.log(err);
      }
    }
  } catch (err) {
    console.log("An error has occurred 🥲");
    console.log(err);
  }
};
