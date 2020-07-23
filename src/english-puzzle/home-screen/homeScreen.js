import React from 'react';
import s from './homeScreen.module.css'
import { Link } from 'react-router-dom';


const HomeScreen = () => {
    return (
        <div className={s.base}>
            <div className={s.background}>
                <div className={s.title}>
                    <h1>English-puzzle</h1>
                    <Link to='/game' className={s.link}>
                    <button className={s.start_btn}>start</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}


export default HomeScreen;