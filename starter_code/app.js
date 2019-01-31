const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:
const clientId = '3ca06be35b9a4da882529f4610aca26f',
	clientSecret = '0903a31644ae4d069ea7d466f77d1a65';

const spotifyApi = new SpotifyWebApi({
	clientId: clientId,
	clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi
	.clientCredentialsGrant()
	.then((data) => {
		spotifyApi.setAccessToken(data.body['access_token']);
	})
	.catch((error) => {
		console.log('Something went wrong when retrieving an access token', error);
	});
// the routes go here:
app.get('/', (req, res, next) => {
	res.render('index');
});

app.post('/artist', (req, res, next) => {
	spotifyApi
		.searchArtists(req.body.name)
		.then((data) => {
			res.render('artist', {data});
		})
		.catch((err) => {
			console.log('The error while searching artists occurred: ', err);
		});

});

app.get("/albums/:id", (req, res, next) => {
	spotifyApi
		.getArtistAlbums(req.params.id)
		.then((data) => {
			res.render("albums", {data});
		})
		.catch((err) => {
			console.log('The error while searching artists occurred: ', err);
		});
})
app.get("/tracks/:id", (req, res, next) => {
	spotifyApi
		.getAlbumTracks(req.params.id)
		.then((data) => {
			res.render("tracks", {data});

			console.log('The received data from the API: ', data);
			// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
		})
		.catch((err) => {
			console.log('The error while searching artists occurred: ', err);
		});
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
