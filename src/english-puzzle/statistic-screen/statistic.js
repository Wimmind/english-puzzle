import React,{Component} from 'react';
import EpHeader from "../ep-header/epHeader";
import { Link } from 'react-router-dom';
import s from './statistic.module.css'
import paintings1 from '../image-description/level1';
import paintings2 from '../image-description/level2';
import paintings3 from '../image-description/level3';
import paintings4 from '../image-description/level4';
import paintings5 from '../image-description/level5';
import paintings6 from '../image-description/level6';
export default class StatisticScreen extends Component {

    saySentences = (sentences) => {
        const audio = new Audio(`https://raw.githubusercontent.com/wimmind/rslang-data/master/${sentences}`);
        audio.play();
    }

    render () {
        const { location } = this.props;
        const trueNumber = `${location.state.statistic.trueSentences.length}`;
        const falseNumber = `${location.state.statistic.falseSentences.length}`;
        const level = location.state.level;
        const page = location.state.page;
        let objDescription;
        
        switch (String(level+1)) {
            case "2":
                objDescription = paintings2;
                break;
            case "3":
                objDescription = paintings3;
                break;
            case "4":
                objDescription = paintings4;
                break;
            case "5":
                objDescription = paintings5;
            break;
            case "6":
                objDescription = paintings6;
            break;
            default:
                objDescription = paintings1;
        }
        
        const image = paintings1[page+1].imageSrc

        const description = `${paintings1[page+1].author} - ${paintings1[page+1].name}(${paintings1[page+1].year})`

        return (
            <div>
                <div className={s.background}>
                </div>
                <EpHeader/>
                <div className={s.mainBase}>
                    <div>
                        <div className={s.about_image}>
                            <h4>{description}</h4>
                            <a href={`https://raw.githubusercontent.com/wimmind/rslang_data_paintings/master/${image}`}>
                                <img 
                                    className={s.image_round} 
                                    src={`https://raw.githubusercontent.com/wimmind/rslang_data_paintings/master/${image}`} 
                                    alt="image" 
                                />
                            </a>
                        </div>
                        <h3>
                            I don't know <span className={s.title_false}>{falseNumber} </span>
                        </h3>
                        {location.state.statistic.falseSentences.map((field,i) => (
                            <div className={s.sentences} key={i.toString() + 'd3'} >
                                <button className={s.speaker_btn} onClick={()=>this.saySentences(field.audio)}></button>
                                {field.sentences}
                            </div>
                        ))}
                        </div>
                    
                        <div>
                        <h3>
                            I know <span className={s.title_true}>{trueNumber} </span>
                        </h3>
                        {location.state.statistic.trueSentences.map((field,i) => (
                            <div className={s.sentences} key={i.toString() + 'd4'} >
                                <button className={s.speaker_btn} onClick={()=>this.saySentences(field.audio)} title={'pronunciation button'}></button>
                                {field.sentences}
                            </div>
                        ))}
                        <Link to={{pathname: '/game'}} >
                            <button className={s.continue_btn } >Continue</button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

