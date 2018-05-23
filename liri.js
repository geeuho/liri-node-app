// require("dotenv").config();

var fs = require('fs');
var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var inquirer = require('inquirer');
var request = require('request');

var location = process.argv[1]
var command = process.argv[2];
var input = process.argv[3];
console.log(location);
console.log(command);
console.log(input);

if (command === undefined) {
	inquirer.prompt([
	  // intial list of commands
	  {
	    type: "list",
	    message: "Which command would you like to perform?",
	    choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
	    name: "listcommand"
	  },
	])
	.then(function(response) {
			command = response["listcommand"];
			console.log(command);
			switch(command) {
				case "my-tweets":
					twitter();
					break;
				case "spotify-this-song":
					inquirer.prompt([
						{
							type: "input",
							message:"What song would you like to spotify search?",
							name: "searchedSong"
						}
					])
					.then(function(response){
						spotify(response["searchedSong"]);
					})
					break;
				case "movie-this":
				inquirer.prompt([
					{
						type: "input",
						message:"What movie would you like to omdb search?",
						name: "searchedMovie"
					}
				])
				.then(function(response){
					omdb(response["searchedMovie"]);
				})
					break;
				case "do-what-it-says":
					dowhatitsays();
					break;
				default:
					console.log("Please enter valid command.");
					break;
			}
		
	});
 
} 

function twitter() {
	// console.log(keys.twitter);
	var params = {
		screen_name: 'AllenShin5',
		exclude_replies: true,
		include_rts: false,
	};

	
	var client = new Twitter(keys.twitter);
	
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
			console.log("hi");
	  	for (i = 0; i < tweets.length; i++) {
            
		    console.log("Tweet #" + (i+1));
		    console.log("Date: " + tweets[i].created_at);
		    console.log("Tweeted: " + tweets[i].text);

	  	}  
	  }
	});
}

 
//initialize spotify
function spotify(songName) {
	console.log(songName);
	// console.log(keys.spotify);
	var newSpotify = new Spotify(keys.spotify);

	if (!songName) {
		songName = "'The Sign' by Ace of Base"
	}
	newSpotify.search({ type: 'track', query: songName }, function(err, data) {
		if (err) {
		  return console.log("There's either a typo or the song doesn't exist. Please try again.");
		}
		var song = data.tracks.items;
	
		for (var i = 0; i < 5; i++) {
			
			console.log("Artist: " + song[i].artists[0].name);
			console.log("Song: " + song[i].name); 
			console.log("From Album: " + song[i].album.name);
			console.log("Preview: " + song[i].preview_url);
		
		}
	});
}

//initialize omdb
function omdb(movieName) {
	console.log(movieName);
	// console.log(keys.omdb);
	var queryURL = "https://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=" + keys.omdb.id + "&";
	console.log(queryURL);
	if (!movieName) {
		console.log("If you haven't watched 'Mr. Nobody' then you should: "
			+ "http://www.imdb.com/title/tt0485947"
			+ "It's on Netflix!");
		queryUrl = "https://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=40e9cece";
		} else {
		request(queryURL, function (error, response, body) {
			// console.log('error:', error); // Print the error if one occurred
			var movie = JSON.parse(body);
			// console.log(movie);	
				console.log("Title: " + movie.Title);
				console.log("Year: " + movie.Year);
				console.log("IMDB Rating: " + movie.imdbRating);
				console.log("Rotten Tomatoes Rating: " + movie.tomatoRating);
				console.log("Produced in: " + movie.Country);
				console.log("Language: " + movie.Language);
				console.log("Actors: " + movie.Actors);
				console.log("Plot: " + movie.Plot);
		});
	}
}

function dowhatitsays(){
	console.log("hi");
}