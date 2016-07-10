var request = require('request');
var Twitter = require('twitter');
var tkeys = require('./keys.js');
var spotify = require('spotify');
var inquirer = require('inquirer');
var fs = require('fs');
var callAPI = process.argv[2]
var spotifyCheck = process.argv[3]
var inputArray = process.argv.slice(3); //start array for multiple api inputs
var inputAll = inputArray.join('+'); //format array into + separated string values
var printArray = [];


    if (callAPI == 'my-tweets') {
    
            calltwitter();
    }
    else if (callAPI == 'spotify-this-song') {
        if (inputAll.length < 4) {
            inputAll = "Whats my age again"
            console.log("What\'s my age again");
            callSpotify(inputAll);
        }
        else {
            callSpotify(inputAll);
        }
    }
    else if (callAPI == 'movie-this') {
        if (inputAll.length < 4) {
            inputAll = "'Mr. Nobody"
            console.log(
                "If you haven't watched Mr. Nobody then you should: http://www.imdb.com/title/tt0485947/   You can catch it on Netflix!");
            callOMDB(inputAll);
        }
        else {
            callOMDB(inputAll);
        }
    }
    if (callAPI == 'do-what-it-says') {
        whatItSays()
    }

    function calltwitter(inputAll) {
            var url = 'statuses/user_timeline'
            var tk = tkeys.twitterKeys
            var client = new Twitter({
                consumer_key: tk.consumer_key,
                consumer_secret: tk.consumer_secret,
                access_token_key: tk.access_token_key,
                access_token_secret: tk.access_token_secret
            });
            var params = {
                screen_name: inputAll,
                count: 10
            };
            client.get(url, params, function(err, data) {
                for (var i = 0; i < data.length; i++) {
                    if (!err) {
                        printArray = []
                        printArray.push("User:" + " " + data[i].user.name);
                        tWhen = data[i].created_at;
                        printArray.push("Date:" + " " + tWhen.slice(0, 19));
                        printArray.push("Tweet:" + " " + data[i].text);
                        printArray.push(
                            "------------------------------------------"
                        );
                        print(printArray);
                    }
                    else {
                        error();
                    }
                }
            }); //END client get
        } //END call API 

    function callSpotify(inputAll) {
            var params = {
                type: 'track',
                query: inputAll
            };
            spotify.search(params, function(err, data) {
                if (!err) {
                    var track = data.tracks.items
                    for (var m = 0; m < track.length; m++) {
                        printArray = []
                        printArray.push("Artist: " + " " + track[m].artists[
                            0].name);
                        printArray.push("Song: " + " " + track[m].name);
                        printArray.push("Preview: " + " " + track[m].preview_url);
                        printArray.push("Album: " + " " + track[m].album.name);
                        printArray.push(
                            "------------------------------------------"
                        );
                        print(printArray);
                    }
                }
                else {
                    error();
                }
            });
        } // END function callSpotify

    function callOMDB(inputAll) {
            var url = 'http://www.omdbapi.com/?t=' + inputAll +
                '&y=&plot=short&r=json'
            request(url, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var movie = JSON.parse(body);
                    printArray = []
                    printArray.push(
                        "------------------------------------------");
                    printArray.push("Title: " + " " + movie["Title"]);
                    printArray.push("Year: " + " " + movie["Year"]);
                    printArray.push("Rating: " + " " + movie["imdbRating"]);
                    printArray.push("Country: " + " " + movie["Country"]);
                    printArray.push("Language: " + " " + movie["Language"]);
                    printArray.push("Plot: " + " " + movie["Plot"]);
                    printArray.push("Actors: " + " " + movie["Actors"]);
                    printArray.push(
                        "------------------------------------------");
                    print(printArray);
                }
                else {
                    error();
                }
            });
        } // END function callSpotify

    function whatItSays() {
        fs.readFile("random.txt", "utf8", function(error, data) {
            inputAll = data[1]
            console.log(data);
            callSpotify(inputAll);
        });
    }

function print(printArray) {
    for (var o = 0; o < printArray.length; o++) {
        console.log(printArray[o]);
    }
    }


function error() {
    console.log('Error occurred: ' + err);
    return;
}