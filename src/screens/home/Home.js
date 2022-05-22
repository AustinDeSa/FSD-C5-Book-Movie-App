import React, { useState } from 'react';
import Header from "../../common/header/Header";
import "./Home.css";
import { GridList, GridListTile, GridListTileBar, Card, Button, FormControl, InputLabel, Input, Checkbox, TextField, MenuItem, CardContent } from '@material-ui/core';
import Moment from 'moment';
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

// Style the Grids
const mainGrid = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
};

const gridList = {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
};

const useStyles = makeStyles(theme => ({
    cardtitle: {
        color: theme.palette.primary.light,
        margin: theme.spacing(1),
        textTransform: "uppercase",
    },
    maincard: {
        margin: theme.spacing(1),
        minWidth: 240,
        maxWidth: 240,
    },
    root: {
        width: "max-content",
    },
}));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Home = function ({ genreList, artistList, moviesList, moviesFilterdList, moviesFilterHandler }) {
    // Artist Dropdown //
    var resart = '';
    const [art, setArtist] = useState("");

    const handleArtistChange = (e, value) => {
        for (var i = 0; i < value.length; i++) {
            if (value.length === 1) {
                resart = value[i].first_name + ' ' + value[i].last_name;
            } else {
                resart = resart + ',' + value[i].first_name + ' ' + value[i].last_name;
            }
        }
        setArtist(resart);
    };
    // Artist Dropdown //

    // Genre Dropdown //
    var resgen = '';
    const [gen, setGenres] = useState("");

    const handleGenresChange = (e, value) => {
        for (var i = 0; i < value.length; i++) {
            if (value.length === 1) {
                resgen = value[i].genre;
            } else {
                resgen = resgen + ',' + value[i].genre;
            }
        }
        setGenres(resgen);
    }
    // Genre Dropdown //

    // State for Search Filter //
    const [addSearchForm, setSearchForm] = useState({
        id: 0,
        moviename: '',
        startdate: '',
        enddate: '',
    });

    // Search Filter form onChange 
    const inputFilterChangedHandler = (e) => {
        const state = addSearchForm;
        state[e.target.name] = e.target.value;
        setSearchForm({ ...state })
    }

    const { moviename, startdate, enddate } = addSearchForm;

    const onSearchFormSubmitted = (e) => {
        e.preventDefault();

        moviesFilterHandler(moviename, gen, art, startdate, enddate);
    }
    // State for Search Filter //

    // Date format //
    Moment.locale('en');
    // Date format //

    const classes = useStyles();

    return (
        <div>
            <Header showButton="btn-hide" />
            <div className="home-header">Upcoming Movies</div>
            <div style={mainGrid}>
                <GridList style={gridList} cols={6} cellHeight={250}>
                    {moviesList.map(movies => (
                        <GridListTile key={movies.id}>
                            <img src={movies.poster_url} alt={movies.title} />
                            <GridListTileBar
                                title={movies.title}
                            />
                        </GridListTile>
                    ))}
                </GridList>
            </div>
            <div className='home-container'>
                <div className='home-search-movies'>
                    <GridList cols={4} cellHeight={350}>
                        {moviesFilterdList.map(filmovies => (
                            <GridListTile key={filmovies.id} className="home-grid-tile" component={Link} to={`/movie/${filmovies.id}`}>
                                <img src={filmovies.poster_url} alt={filmovies.title} />
                                <GridListTileBar
                                    title={filmovies.title}
                                    subtitle={"Release Date " + Moment(filmovies.release_date).format('ddd MMM DD yyyy')}
                                />
                            </GridListTile>
                        ))}
                    </GridList>
                </div>
                <div className='home-search-filter'>
                    <Card raised={true} className={classes.root}>
                        <CardContent>
                            <form onSubmit={onSearchFormSubmitted}>
                                <div className={classes.cardtitle}>
                                    FIND MOVIES BY:
                                </div>
                                <div>
                                    <FormControl>
                                        <InputLabel htmlFor="my-input-name" className={classes.maincard}>Movie Name</InputLabel>
                                        <Input id="my-input-name" aria-describedby="my-helper-text" name="moviename" type='text'
                                            onChange={inputFilterChangedHandler} className={classes.maincard} value={moviename} />
                                    </FormControl><br /><br />
                                    <FormControl>
                                        <Autocomplete className={classes.maincard} onChange={handleGenresChange}
                                            name="gen" multiple id="my-input-genre" size="small"
                                            options={genreList} getOptionLabel={option => option.genre}
                                            disableCloseOnSelect
                                            renderOption={(option, { selected }) => (
                                                <React.Fragment>
                                                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                                                    <MenuItem>{option.genre}</MenuItem>
                                                </React.Fragment>
                                            )}
                                            renderInput={params => (
                                                <TextField {...params} variant="standard" label="Genres" />
                                            )}
                                        />
                                    </FormControl><br /><br />
                                    <FormControl>
                                        <Autocomplete className={classes.maincard} onChange={handleArtistChange}
                                            name="art" multiple id="my-input-art" size="small"
                                            options={artistList} getOptionLabel={option => option.first_name + ' ' + option.last_name}
                                            disableCloseOnSelect
                                            renderOption={(option, { selected }) => (
                                                <React.Fragment>
                                                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                                                    <MenuItem>{option.first_name + ' ' + option.last_name}</MenuItem>
                                                </React.Fragment>
                                            )}
                                            renderInput={params => (
                                                <TextField {...params} variant="standard" label="Artists" />
                                            )}
                                        />
                                    </FormControl><br /><br />
                                    <FormControl>
                                        <InputLabel htmlFor="my-input-startdate" shrink={true} className={classes.maincard}>Release Date Start</InputLabel>
                                        <TextField id="my-input-startdate" aria-describedby="my-helper-text" name="startdate" type='date'
                                            onChange={inputFilterChangedHandler} className={classes.maincard} value={startdate} />
                                    </FormControl><br /><br />
                                    <FormControl>
                                        <InputLabel htmlFor="my-input-enddate" shrink={true} className={classes.maincard}>Release Date End</InputLabel>
                                        <TextField id="my-input-enddate" aria-describedby="my-helper-text" name="enddate" type='date'
                                            onChange={inputFilterChangedHandler} className={classes.maincard} value={enddate} />
                                    </FormControl><br /><br />
                                </div>
                                <div className={classes.maincard}>
                                    <Button type="submit" variant="contained" color="primary" className='search-btn'>APPLY</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    )
}

export default Home;