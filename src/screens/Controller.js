import React, { useState, useEffect } from "react";
import Home from "../screens/home/Home";
import Details from "../screens/details/Details";
import { BrowserRouter as Router, Route } from "react-router-dom";
import BookShow from "../screens/bookshow/BookShow";
import Confirmation from "../screens/confirmation/Confirmation";

const Controller = () => {

	const baseUrl = "/api/v1/";

	const [genreList, setGenreList] = useState([]);
	const [artistList, setArtistList] = useState([]);
	const [moviesList, setMoviesList] = useState([]);
	const [moviesFilterdList, setMoviesFilteredList] = useState([]);

	// Fetch data for dropdown Genre //
	async function loadGenre() {

		try {
			const response = await fetch('http://localhost:8085/api/v1/genres', {
				headers: {
					"Accept": "application/json;charset=UTF-8"
				},
			});
			const result = await response.json();

			let genre = [result.genres];

			setGenreList(genre[0]);

		} catch (e) {

			alert(`Error: ${e.message}`);

		}
	}
	// Fetch data for dropdown Genre //

	// Fetch data for dropdown Artist //
	async function loadArtist() {

		try {
			const response = await fetch('http://localhost:8085/api/v1/artists', {
				headers: {
					"Accept": "application/json;charset=UTF-8"
				},
			});
			const result = await response.json();

			let artist = [result.artists];

			setArtistList(artist[0]);

		} catch (e) {

			alert(`Error: ${e.message}`);

		}
	}
	// Fetch data for dropdown Artist //

	// Fetch data for Movies List //
	async function loadMovies() {

		try {
			const response = await fetch('http://localhost:8085/api/v1/movies?status=PUBLISHED', {
				headers: {
					"Accept": "application/json;charset=UTF-8"
				},
			});
			const result = await response.json();

			let movie = [result.movies];

			setMoviesList(movie[0]);

		} catch (e) {

			alert(`Error: ${e.message}`);

		}
	}
	// Fetch data for Movies List //

	// Fetch data for Filtered Movies List //
	async function loadFilteredMovies(moviename, gen, art, startdate, enddate) {

		try {
			const response = await fetch('http://localhost:8085/api/v1/movies?status=RELEASED&title=' + moviename + '&genre=' + gen + '&artists=' +
				art + '&start_date=' + startdate + '&end_date=' + enddate, {
				headers: {
					"Accept": "application/json;charset=UTF-8"
				},
			});
			const result = await response.json();

			let movie = [result.movies];

			setMoviesFilteredList(movie[0]);

		} catch (e) {

			alert(`Error: ${e.message}`);

		}
	}
	// Fetch data for Filtered Movies List //

	// Movies Filter handler
	function moviesFilterHandler(moviename, gen, art, startdate, enddate) {
		loadFilteredMovies(moviename, gen, art, startdate, enddate);
	}

	useEffect(() => {
		loadArtist();
		loadGenre();
		loadMovies();
		loadFilteredMovies('', '', '', '', '');
	}, []);

	return (
		<Router>
			<div className="main-container">
				<Route
					exact
					path="/"
					render={(props) => <Home {...props} baseUrl={baseUrl} genreList={genreList} artistList={artistList} moviesList={moviesList}
						moviesFilterdList={moviesFilterdList}
						moviesFilterHandler={(moviename, gen, art, startdate, enddate) => moviesFilterHandler(moviename, gen, art, startdate, enddate)} />}
				/>
				<Route
					path="/movie/:id"
					render={(props) => <Details {...props} baseUrl={baseUrl} />}
				/>
				<Route
					path="/bookshow/:id"
					render={(props) => <BookShow {...props} baseUrl={baseUrl} />}
				/>
				<Route
					path="/confirm/:id"
					render={(props) => <Confirmation {...props} baseUrl={baseUrl} />}
				/>
			</div>
		</Router>
	);
};

export default Controller;