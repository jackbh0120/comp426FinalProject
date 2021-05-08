import React, {useState} from 'react';
import './SearchView.css';
import axios from "axios";
import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import {db, globalUser} from './App.js'

const SearchView = () => {
    const [state, setState] = useState({view: 'New Search', hero: {}, input: ''});

    const searchForHeroes = async (event) => {
        event.preventDefault();
        if (state.input === '') {
            alert('Cannot search empty');
            return;
        } else {
            console.log(state.input);
            const params = {hero: state.input};
            const rootURL = 'https://superhero-search.p.rapidapi.com/api/';
           

            const options = {
                method: 'GET',
                url: rootURL,
                params: params,
                headers: {
                  'x-rapidapi-key': '2875b789ecmsh55fb8dda8845ff1p11bbb9jsnccf8e0e8c6cf',
                  'x-rapidapi-host': 'superhero-search.p.rapidapi.com'
                }
              };

            const randomHero = {
                method: 'GET',
                url: 'https://superhero-search.p.rapidapi.com/api/heroes',
                headers: {
                    'x-rapidapi-key': '2875b789ecmsh55fb8dda8845ff1p11bbb9jsnccf8e0e8c6cf',
                    'x-rapidapi-host': 'superhero-search.p.rapidapi.com'
                }
            }
              
            let response = await axios(options);
            console.log(response.data);
            let hero;

            if (response.data === 'Hero Not Found') {
                alert("Your search didn't find anything, here is a random hero (or villain).");
                response = await axios(randomHero);
                console.log(response.data);
                hero = response.data[0];
                console.log(hero);
            } else {
                hero = response.data;
            }

            setState(() => {
                return {view: 'Searched', hero: hero, input: ''};
            })

        }
    }

    const handleInputChange = ({target}) => {
        setState((prevState) => {
            return {view: prevState.view, hero: prevState.hero, input: target.value};
        })
    }

    const handleNewSearchClick = (event) => {
        event.preventDefault();
        setState(() => {
            return {view: 'New Search', hero: {}, input: ''};
        })
    }

    const handleMovieButtonClick = async (event) => {
        event.preventDefault();
        const options = {
            method: 'GET',
            url: 'https://imdb8.p.rapidapi.com/auto-complete',
            params: {q: state.hero['name']},
            headers: {
                'x-rapidapi-key': '2875b789ecmsh55fb8dda8845ff1p11bbb9jsnccf8e0e8c6cf',
                'x-rapidapi-host': 'imdb8.p.rapidapi.com'
            }
        }
        const movieResults = await axios(options);
        console.log(movieResults);
        setState((prevState) => {
            let movieData;
            if (movieResults.data['d'].length > 3) {
                movieData = movieResults.data['d'].slice(0, 3);
            } else {
                movieData = movieResults.data['d'];
            }
            
            return {view: 'Movie View', hero: prevState.hero, input: '', movies: movieData}
        })
    }

    const addToHeroList = (event) => {
        event.preventDefault();
        if (globalUser === null) {
            alert('Must sign in to add to hero list');
            return;
        } else {
            const userId = globalUser.uid;
            db.ref(`${userId}/heroes/${state.hero['id']}`).set(state.hero);
        }
    }

    const addToMovieList = (event) => {
        event.preventDefault();
        let id = event.target.getAttribute('id')
        if (globalUser === null) {
            alert('Must sign in to add to movie list');
            return;
        } else {
            const userId = globalUser.uid;
            const myMovie = state.movies[id];
            const ref = db.ref(`${userId}/movies/${myMovie['l']}`)
            ref.set(myMovie);
        }
    }

    let view;
    let idTracker = -1;

    if (state.view === 'New Search')  {
        view = (
            <div>
                <h1>Search For Your Favorite Hero!</h1>
                <form>
                    <label htmlFor='searchBox'>Hero: </label>
                    <input type='text' id='searchBox' onChange={handleInputChange}/>
                    <button onClick={searchForHeroes}>Search</button>
                </form>
            </div>

        )
    } else if (state.view === 'Searched') {
        view = (
            <div className='searchView'>
                <button onClick={handleNewSearchClick} id='newSearch'>New Search</button>
                <div className='heroCard'>
                    <h3>{state.hero['name']}</h3>
                    <button id='addToMyList' onClick={addToHeroList}>Add To My Heroes List</button>
                    <div className='heroBio'>
                        <p>Full Name: {state.hero['biography']['fullName']}</p>
                        <br/>
                        <p>Aliases: {state.hero['biography']['aliases'].toString()}</p>
                        <br/>
                        <p>Species: {state.hero['appearance']['race']}</p>
                        <br/>
                        <p>Superhero Groups: {state.hero['connections']['groupAffiliation']}</p>
                        <br/>
                        <p>First Comic Appearance: {state.hero['biography']['firstAppearance']}</p>
                        <br/>
                        <p>Publisher: {state.hero['biography']['publisher']}</p>
                    </div>              
                </div>
                <img src={state.hero['images']['sm']} alt={state.hero['name']}/>
                <div id='movieButtonDiv'>
                    <button id='moviesButton' onClick={handleMovieButtonClick}>View Movies and TV Shows</button>
                </div>
            </div>
            
        )
    } else if (state.view === 'Movie View') {
        view = (
        <div className='moviesAndHeroes'>
            <button onClick={handleNewSearchClick} id='newSearch'>New Search</button>
            <div className='row'>
                <div className='column'>
                    <div className='searchView'>
                        <div className='heroCard'>
                            <h3>{state.hero['name']}</h3>
                            <div className='heroBio'>
                                <p>Full Name: {state.hero['biography']['fullName']}</p>
                                <br/>
                                <p>Aliases: {state.hero['biography']['aliases'].toString()}</p>
                                <br/>
                                <p>Species: {state.hero['appearance']['race']}</p>
                                <br/>
                                <p>Superhero Groups: {state.hero['connections']['groupAffiliation']}</p>
                                <br/>
                                <p>First Comic Appearance: {state.hero['biography']['firstAppearance']}</p>
                                <br/>
                                <p>Publisher: {state.hero['biography']['publisher']}</p>
                            </div>              
                        </div>
                        <img src={state.hero['images']['sm']} alt={state.hero['name']}/>
                    </div>
                </div>
                <div className='column'>
                    <div id='moviesContainer'>
                        {state.movies.map(movie => {
                            idTracker++;
                            return (
                                <div key={movie['l']} className='movie'>
                                    <div>
                                        <h3>{movie['l']}</h3>
                                        <button id={idTracker} onClick={addToMovieList}>Add to Movie List</button>
                                    </div>
                                    <div className='movieInfo'>
                                        <p>Type: {movie['q'] === 'feature' ? 'Movie' : 'Show or Video'}</p>
                                        <p>Starring: {movie['s']}</p>
                                        <p>Released: {movie['y']}</p>
                                    </div>
                                    <img src={movie['i']['imageUrl']} alt={movie['l']} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
        )
    }

    return (
        <div>
            {view}
        </div>
    )
}

export default SearchView;