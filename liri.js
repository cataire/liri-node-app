const keys = require('./keys.js').twitterKeys;
const spotifyKeys = require('./keys.js').spotifyKeys;
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('file-system');

let command = process.argv[2];
let argumentPresent = process.argv[3];
let search = process.argv.splice(3);

function run(command, search) {

		if (!command) {
			console.log(`\nFor the last 20 tweets type "my-tweets"; 
			\nTo find a song on Spotify type "spotify-this" and a song name;
			\nTo find a movie type "movie-this" and a movie name;`);
		}

		else if (command === "my-tweets") {

		searchTwitter();

		}

		else if (command === "spotify-this-song") {

		searchSpotify(search);	

		}

		else if (command === "movie-this") {

		searchOMDB(search);

		}

		else if (command === "do-what-it-says") {

		doWhatItSays();
			
		}

		else {
			console.log(`\nLiri doesn't know that command.
				\nFor the last 20 tweets type "my-tweets"; 
			\nTo find a song on Spotify type "spotify-this" and a song name;
			\nTo find a movie type "movie-this" and a movie name;`);
		};

};

//=========== twitter ============//

function searchTwitter() {

	var client = new Twitter({
	  consumer_key: keys.consumer_key,
	  consumer_secret: keys.consumer_secret,
	  access_token_key: keys.access_token_key,
	  access_token_secret: keys.access_token_secret
	});

	client.get('search/tweets', {q: "BukashkaMu"}, function(error, tweets, response) {

	if (error) {
		console.log(error);
	}

	else {

		for (var index = 0; index < tweets.statuses.length; index++) {
			console.log("\n\n" + tweets.statuses[index].created_at);
			console.log("\n" + tweets.statuses[index].text);

		}
		
	};

		fs.appendFile("log.txt", "\nTweets were searched", function(err) {
			console.log("\nLog.txt updated")
		});

	});

};



//========= spotify =========================

function searchSpotify(search) {

console.log(search);
console.log(testVariable);

	if (argumentPresent === undefined) {
		search = 'bill gates';
	};

	var spotify = new Spotify({
	  id: spotifyKeys.id,
	  secret: spotifyKeys.secret
	});

		console.log(search);

	spotify.search({ type: 'track', query: search }, function(error, data) {

		if (error) {
		    console.log(error);
		}

  		else {

	  	console.log("\nSong name: " + data.tracks.items[0].name);
		console.log("\nArtist: " + data.tracks.items[0].artists[0].name);
		console.log("\nAlbum: " + data.tracks.items[0].album.name);
		console.log("\nLink: " + data.tracks.items[0].href);

		};

		fs.appendFile("log.txt", "\n" + search, function(err) {
			console.log("Log.txt updated");
		});

	});

};



// ============= OMDB ===========


function searchOMDB(search) {	

console.log(search);

	if (argumentPresent === undefined) {
		search = 'Mr Nobody';
	};

request('http://www.omdbapi.com/?apikey=trilogy&t=' + search, function (error, response, body) {


	

	if (error) {
		console.log(error);
	}

	else {

		let movieData = JSON.parse(body);
		console.log("\n\nTitle: " + movieData.Title);
		console.log("\nYear: " + movieData.Year);
		console.log("\nIMDB Rating: " + movieData.imdbRating);
		console.log("\nCountry: " + movieData.Country);
		console.log("\nLanguage: " + movieData.Language);
		console.log("\nPlot: " + movieData.Plot);
		console.log("\nActors: " + movieData.Actors);
		console.log("\nRotten Tomatoes Rating: " + movieData.Ratings[1].Value);

	};

		fs.appendFile("log.txt", "\n" + search, function(err) {
			console.log("\nLog.txt updated");
		});

	});
}



function doWhatItSays() {

fs.readFile("random.txt", 'utf8', function(error, data) {

		if (!"random.txt") {
			fs.writeFile("random.txt", "File created", function(error){
				if (error) {
					console.log(error);
				}
			});
		}

		if (error) {
			console.log(error);
		}
		
		else {
			console.log(data);
			let dataSplit = data.split(",");
			search = dataSplit[1];
			run(dataSplit[0], search);

		};

	});

};


run(command, search);
