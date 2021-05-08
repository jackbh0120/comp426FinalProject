import {db, globalUser} from './App.js';
import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import {useState} from 'react';

const HeroesList = () => {
    const [state, setState] = useState({hasRun: false, heroes: {}})
    if (globalUser === null) {
        return (
            <div>
                <p>You must sign in to view your heroes list</p>
                <p>Navigate to sign in page</p>
            </div>
        )
    }

    if (state.hasRun === false) {
        const heroesRef = db.ref(`${globalUser.uid}/heroes`);
        heroesRef.get()
            .then((snapshot) => {
                setState(() => {
                    return {hasRun: true, heroes: snapshot.val()}
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }
    // heroesRef.on('value', (snapshot) => {
    //     console.log('snapshot:')
    //     console.log(snapshot.val());
    //     heroesListObj = snapshot.val();
    // });
    console.log(state.heroes);
    if (state.heroes !== {} && state.hasRun === true) {
        let heroes = []
        for (let key in state.heroes) {
            heroes.push(state.heroes[key]);
        }
        return (
            <div>
                {heroes.map(hero => {
                   return (
                        <div className='heroCard'>
                            <h3>{hero.name}</h3>
                            <div className='heroBio'>
                                <p>Full Name: {hero.biography.fullName}</p>
                                <br/>
                                <p>Aliases: {hero.biography.aliases.toString()}</p>
                                <br/>
                                <p>Species: {hero.appearance.race}</p>
                                <br/>
                                <p>Superhero Groups: {hero.connections.groupAffiliation}</p>
                                <br/>
                                <p>First Comic Appearance: {hero.biography.firstAppearance}</p>
                                <br/>
                                <p>Publisher: {hero.biography.publisher}</p>
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

export default HeroesList;