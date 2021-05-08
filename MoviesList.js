import {db, globalUser} from './App.js';
import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import {useState} from 'react';

const MoviesList = () => {
    const [state, setState] = useState({hasRun: false, movies: {}})
    if (globalUser === null) {
        return (
            <div>
                <p>You must sign in to view your movies list</p>
                <p>Navigate to sign in page</p>
            </div>
        )
    }

    if (state.hasRun === false) {
        const heroesRef = db.ref(`${globalUser.uid}/movies`);
        heroesRef.get()
            .then((snapshot) => {
                setState(() => {
                    return {hasRun: true, movies: snapshot.val()}
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }
    
    if (state.movies !== {} && state.hasRun === true) {
        let movies = []
        for (let key in state.movies) {
            movies.push(state.movies[key]);
        }
        return (
            <div>
                {movies.map(movie => {
                   return (
                        <div className='movieCard'>
                            <h3>{movie.l}</h3>
                            <div className='movieInfo'>
                                <p>Type: {movie.q === 'feature' ? 'Movie' : 'Show or Video'}</p>
                                <p>Starring: {movie.s}</p>
                                <p>Released: {movie.y}</p>
                            </div>              
                        </div>

                   )
                })}
            </div>
        )
    } else {
        return <p></p>
    }

}

export default MoviesList;