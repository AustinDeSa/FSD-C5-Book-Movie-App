import React, { useState, useEffect } from "react";
import Header from "../../common/header/Header";
import "./Details.css";
import { Box, Button, Grid, GridList, GridListTile, GridListTileBar, Typography, } from "@material-ui/core";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import YouTube from "react-youtube";
import Rating from "@material-ui/lab/Rating";
import StarBorderIcon from "@material-ui/icons/StarBorder";

const opts = {
    width: "100%",
};

const Details = ({ match }) => {
    const [rating, setRating] = useState(0);

    const [moviesDetailsList, setMoviesDetailsList] = useState([]);

    const [artisitList, setArtistList] = useState([]);

    const [youtubeList, setYoutubeList] = useState("");

    let videoCode;

    if (youtubeList) {
        videoCode = youtubeList.split("v=")[1].split("&")[0];
    }

    useEffect(() => {
        MovieDetails(match.params.id);
    }, []);

    // Fetch data for Movie Details //
    async function MovieDetails(id) {

        try {
            const response = await fetch('http://localhost:8085/api/v1/movies/' + id, {
                headers: {
                    "Accept": "application/json;charset=UTF-8"
                },
            });
            const result = await response.json();

            setMoviesDetailsList(result);

            setYoutubeList(result.trailer_url);

            setArtistList(result.artists);

        } catch (e) {

            alert(`Error: ${e.message}`);

        }
    }
    // Fetch data for Movie Details //

    return (
        <React.Fragment>
            <Header showButton="btn-show" />

            <Button component={Link} to="/" className="btn-back">
                <Typography>
                    <ArrowBackIosIcon />
                    Back to home
                </Typography>
            </Button>
            <Grid container style={{ overflow: "hidden" }}>
                <Grid item xs={2} >
                    <Grid item xs={12} className="poster-main">
                        <img src={moviesDetailsList.poster_url} alt="poster" className="poster-img" />
                    </Grid>
                </Grid>
                <Grid item xs={8} >
                    <div className="details-container-mid">
                        <Typography variant="h2">{moviesDetailsList.title}</Typography>
                        <Typography variant="body1">
                            <strong>Genres: </strong>
                            {moviesDetailsList.genres}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Duration: </strong>
                            {moviesDetailsList.duration}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Release Date: </strong>
                            {new Date(moviesDetailsList.release_date).toDateString()}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Rating: </strong>
                            {moviesDetailsList.rating}
                        </Typography>
                        <Typography className="space-top" variant="body1">
                            <strong>Plot: </strong>
                            <a href={moviesDetailsList.wiki_url}>(Wiki Link)</a>
                            {" " + moviesDetailsList.storyline}
                        </Typography>
                        <Typography className="space-top" variant="body1">
                            <strong>Trailer: </strong>
                        </Typography>

                        <YouTube videoId={videoCode} opts={opts} config={{ youtube: { playerVars: { origin: 'https://youtube.com', host: 'https://www.youtube.com' } } }} />
                    </div>
                </Grid>
                <Grid item xs={2} style={{ padding: 0 }}>
                    <Box display="block">
                        <Typography variant="body1">
                            <strong>Rate this movie:</strong>
                        </Typography>
                        <Rating
                            name="customized-empty"
                            size="large"
                            value={rating}
                            onChange={(e, v) => setRating(v)}
                            icon={<StarBorderIcon fontSize="inherit" />}
                            precision={0.5}
                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                        />
                    </Box><br />
                    <Box display="block">
                        <Typography className="space-top-bottom">
                            <span className="bold">Artists:</span>
                        </Typography>
                        <GridList cols={2}>
                            {artisitList.map(artist => (
                                <GridListTile key={artist.id}>
                                    <img src={artist.profile_url} alt={artist.first_name} />
                                    <GridListTileBar
                                        title={`${artist.first_name} ${artist.last_name}`}
                                    />
                                </GridListTile>
                            ))}
                        </GridList>
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default Details;