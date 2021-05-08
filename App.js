import './App.css';
import HomeView from './HomeView.js';
import React, {useState} from 'react';
import SearchView from './SearchView.js'
import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import HeroesList from './HeroesList.js';
import MoviesList from './MoviesList.js';

const firebaseConfig = {
  apiKey: "AIzaSyBR-EK56lACit4-uOHdyB8QDbRbDcCJaJY",
  authDomain: "comp426-final-project-429bd.firebaseapp.com",
  databaseURL: "https://comp426-final-project-429bd-default-rtdb.firebaseio.com",
  projectId: "comp426-final-project-429bd",
  storageBucket: "comp426-final-project-429bd.appspot.com",
  messagingSenderId: "347591301721",
  appId: "1:347591301721:web:554fb260776bce7e12ef48",
  measurementId: "G-Z7QZRHYF8H"
};

const app = firebase.initializeApp(firebaseConfig);
export const db = firebase.database();
export let globalUser = null;

const options = ['Home', 'Search', 'My Heroes', 'My Movies and Shows', 'Sign In'];

const App = () => {
  const [selected, setSelected] = useState('Home');
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  let [user, setUser] = useState(null);

  const handleNavButtonClick = ({target}) => {
    setSelected((prevSelected) => {
      if (prevSelected === target.value) {
          return prevSelected;
      } else {
          return target.value;
      }
    })
  }

  const handleSignIn = (event) => {
    event.preventDefault();
    console.log(username)
    console.log(password)
    firebase.auth().signInWithEmailAndPassword(username, password)
      .then((userCredential) => {
        alert('success')
        setUser(() => {
          globalUser = userCredential.user
          return userCredential.user
        });
      })
      .catch((error) => {
        alert(error.message);
        return error;
      })
  }

  const handleSignOut = (event) => {
    event.preventDefault();
    firebase.auth().signOut().then(() => {
      setUser(() => {
        globalUser = null;
        return null;
      })
      alert('Sign out successful')
    }).catch(() => {
      alert('error signing out');
    })
  }

  const handleRegister = (event) => {
    event.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(username, password)
      .then((userCredential) => {
        alert('New account created');
        setUser(() => {
          globalUser = userCredential.user;
          return userCredential.user;
        });
      })
      .catch(() => {
        alert('Error registering account')
      })
  }

  const handleUsername = ({target}) => {
      setUsername(() => target.value)
  }

  const handlePassword = ({target}) => {
      setPassword(() => target.value)
  }

  let view;

  if (selected === 'Home') {
    view = <HomeView />
  } else if (selected === 'Search') {
    view = <SearchView />
  } else if (selected === 'My Heroes') {
    view = <HeroesList />
  } else if (selected === 'My Movies and Shows') {
    view = <MoviesList />;
  }

  let userIdentifier;

  if (user !== null) {
    userIdentifier = <p className='identify'>{user.email}</p>
  }

  if (selected !== 'Sign In') {
    return (
      <div className='app'>
        <div className='search'>
          <div className='buttonHolder'>
                {options.map(option => {
                    if (option === 'Sign In' && user !== null) {
                      return <button className='navButton' value={option} onClick={handleNavButtonClick} id={option} key={option} disabled={selected === option}>Sign Out</button>
                    }
                    return <button className='navButton' value={option} onClick={handleNavButtonClick} id={option} key={option} disabled={selected === option}>{option}</button>
                })}      
          </div>
        </div>
        {view}
      </div>
    );
  } else {
    return (
      <div className='app'>
        <div className='search'>
          <div className='buttonHolder'>
                {options.map(option => {
                    if (option === 'Sign In' && user !== null) {
                      return <button className='navButton' value={option} onClick={handleNavButtonClick} id={option} key={option} disabled={selected === option}>Sign Out</button>
                    }
                    return <button className='navButton' value={option} onClick={handleNavButtonClick} id={option} key={option} disabled={selected === option}>{option}</button>
                })}      
          </div>
        </div>
        <div id='signIn'>
          <p>To sign in, enter your email and password and click sign in</p>
          <p>To create a new account, enter the desired email and password for your account and click register</p>
          <form id='signInForm'>
            <label className='signInLabel' htmlFor='username'>Username </label>
            <input className='signInInput' type='text' id='username' onChange={handleUsername} disabled={user !== null}/>
            <br/>
            <label className='signInLabel' htmlFor='password'>Password </label>
            <input className='signInInput' type='password' id='password' onChange={handlePassword} disabled={user !== null}/>
            <br/>
            {user === null ? <button className='signInButton' onClick={handleSignIn}>Sign In</button> : ''}
            {user === null ? <button className='signInButton' onClick={handleRegister}>Register</button> : <button className='signInButton' id='signOut' onClick={handleSignOut}>Sign Out</button>}
          </form>
        </div>
      </div>
    )
  }
}

export default App;
