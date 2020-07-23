import React, {Component} from 'react';

export default class ButtonSettings extends Component {
    render() {
        const {label ='',classNameBtn, clickBtn,help} = this.props;
        return (
            <button className={classNameBtn} onClick={clickBtn} title={help}> {label} </button>
        )
    } 
}
