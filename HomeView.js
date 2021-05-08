import './HomeView.css'
import superman from './commonHeroes/Superman.png';
import batman from './commonHeroes/Batman.png';
import spiderman from './commonHeroes/Spiderman.png';
import hulk from './commonHeroes/Hulk.png';

const HomeView = () => {
    return (
        <div className='homePage'>
            <h1 className='title'>WELCOME TO THE ULTIMATE SUPERHERO SITE</h1>
            <h3>Navigate to the "Search" tab to begin searching for heroes!</h3>
            <div className='row'>
                <div className='column'>
                    <img src={superman} alt='Superman'/>
                    <img src={spiderman} alt='Spiderman'/>
                </div>
                <div className='column'>
                    <img src={batman} alt='Batman'/>
                    <img src={hulk} alt='Hulk'/>
                </div>
            </div>
        </div>
    )
}

export default HomeView;