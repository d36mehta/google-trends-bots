"use strict";
const axios = require("axios");
const OAuth2 = require("oauth").OAuth2;
const Twit = require("twit");

// USA
module.exports.botus = async () => {
  try {
    const tw = new Twit({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token: process.env.ACCESS_TOKEN_KEY,
      access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    });

    const response = await axios({
      url:
        "https://trends.google.com/trends/api/dailytrends?hl=en-US&tz=240&geo=US&ns=15",
    });
    let responseFormatted = response.data.substring(5);
    const res = JSON.parse(responseFormatted);
    // create 3 tweets
    let tweets = [];
    const numberOfTweets = 3;
    /* if there's 2 sets of trending searches days (i.e. on Saturday mornings, there's 2 sets: Friday evening and Saturday morning)
       then always take the older trending searches data if there's not enough new trending searches */
    let day = 0;
    let search = 0;
    while (tweets.length <= numberOfTweets) {
      const check = !!res.default.trendingSearchesDays[day].trendingSearches[
        search
      ];
      if (check) {
        tweets.push(
          `${tweets.length + 1}. ${
            res.default.trendingSearchesDays[day].trendingSearches[search].title
              .query
          } - ${
            res.default.trendingSearchesDays[day].trendingSearches[search]
              .formattedTraffic
          } searches! 🕵️ 🇺🇸 \n\n 📰 Related: ${
            res.default.trendingSearchesDays[day].trendingSearches[search]
              .articles[0].url
          }`
        );
        search++;
      } else {
        // if there isn't enough trend data for the current day, then use the previous day
        day = 1;
        search = 0;
      }
    }

    // post the top 3 in reverse order
    for (let i = tweets.length - 1; i >= 0; i--) {
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
