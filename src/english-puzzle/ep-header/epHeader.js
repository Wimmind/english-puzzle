import React from 'react';
import s from './epHeader.module.css'

const EpHeader = () => {
    return (
        <div className={s.header_wrapper}>
            <div className={s.header_container}>
                <h1 className={s.header_title}>English-puzzle</h1>
            </div>
        </div>
    )
}

export default EpHeader;