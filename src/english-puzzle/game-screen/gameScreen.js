import React, { Component } from 'react';
import s from './gameScreen.module.css'
import { Link } from 'react-router-dom';

import EpHeader from "../ep-header/epHeader";
import ButtonSettings from './buttonSettings/buttonSettings'
import RowSentences from './rowSentences/rowSentences'
//import { updateUserMiniStatistic } from '../../app-stats/statisticApi';
export default class GameScreen extends Component {
    state = {
        level: +localStorage.getItem('level') || 0,
        page: +localStorage.getItem('page') || 0,
        sentencesArray: [], 
        sentencesTranslateArray: [], 
        currentSentencesIndex: 0, 
        currentSentences: '', 
        currentSentencesArray: [], 
        promptAlwaysPronunciation :localStorage.getItem('promptAlwaysPronunciation') ? JSON.parse(localStorage.getItem('promptAlwaysPronunciation')) : true,
        pronounceAfterSuccessful : localStorage.getItem('pronounceAfterSuccessful') ? JSON.parse(localStorage.getItem('pronounceAfterSuccessful')) : true, 
        offerTranslation : localStorage.getItem('offerTranslation') ? JSON.parse(localStorage.getItem('offerTranslation')) : true, 
        isCheckButton: false, 
        isContinueButton: false,
        isIgnoranceButton: true,
        isResultButton: false,
        sentencesArrayBoard:[], 
        statistic: {falseSentences: [] ,trueSentences: []},
        audioArray: [],
        seriesVictoriesSentencesArray: [],
        seriesVictoryCountArray: []
    }

    getRequest =  async (level,page) => {
        await this.getWords(level,page);
        const array = this.state.sentencesArray;
        const currentIndex = this.state.currentSentencesIndex; 

        this.setState({currentSentences:  array[currentIndex]}); 

        const currentSentences = array[currentIndex];

        let wordShuffleArray = currentSentences.split(' ').sort(function() {
            return 0.5 - Math.random();
        });
        this.setState({currentSentencesArray: wordShuffleArray}); 

        let collectedArray = [];
        let colorArray = [];
        wordShuffleArray.forEach(()=>{
            collectedArray.push('');
            colorArray.push('common');
        })  

        const board  = [...this.state.sentencesArrayBoard]

        board[currentIndex] = {
            wordArray: collectedArray, 
            colorArray: colorArray 
        }
        this.setState({sentencesArrayBoard: board})

        const statistic = {...this.state.statistic}
        statistic.falseSentences = []
        statistic.trueSentences = []
        this.setState({statistic: statistic})
    }

    async componentDidMount() {
        await this.getRequest(this.state.level,this.state.page);
    }

    getWords = async (level,page) => {
        const url = `https://afternoon-falls-25894.herokuapp.com/words?group=${level}&page=${page}&wordsPerExampleSentenceLTE=10&wordsPerPage=10`;
        const res = await fetch(url);
        const data = await res.json();

        const sentences = [];
        const sentencesTranslate = [];
        const audioArray = [];

        data.forEach(item => {
            sentences.push(item.textExample
                .replace('<b>', '')
                .replace('</b>', ''));
            sentencesTranslate.push(item.textExampleTranslate)
            audioArray.push(item.audioExample)
        });

        this.setState({sentencesArray: sentences})  
        this.setState({sentencesTranslateArray:sentencesTranslate}) 
        this.setState({audioArray:audioArray}) 
    }

    changeGameParam = async () => {
        this.setState({sentencesArray: []}) 
        this.setState({sentencesTranslateArray:[]}) 
        this.setState({currentSentencesIndex: 0}) 
        this.setState({sentencesArrayBoard: []})
        localStorage.setItem('level', this.state.level);
        localStorage.setItem('page', this.state.page);
        await this.getRequest(this.state.level,this.state.page); 
    }

    levelChange = (event) => {
        this.setState({level: +event.target.value})
    }   
    
    pageChange = (event) => {
        this.setState({page: +event.target.value})
    }  

    saySentences = (sentences) => {
        const audio = new Audio(`https://raw.githubusercontent.com/wimmind/rslang-data/master/${sentences}`);
        audio.play();
    }

    switchPromptAlwaysPronunciation = () => {  
        this.setState({promptAlwaysPronunciation: !this.state.promptAlwaysPronunciation})
        localStorage.setItem('promptAlwaysPronunciation', !this.state.promptAlwaysPronunciation )
    }

    pronounceAfter = () => { 
        this.setState({pronounceAfterSuccessful: !this.state.pronounceAfterSuccessful})
        localStorage.setItem('pronounceAfterSuccessful', !this.state.pronounceAfterSuccessful)
    }

    promptPronunciation = (sentences) => {  
        if (this.state.promptAlwaysPronunciation) {
            this.saySentences(sentences)
        }
    }

    disableTranslation = () => {
        this.setState({offerTranslation: !this.state.offerTranslation})
        console.log(this.state.offerTranslation)
        localStorage.setItem('offerTranslation', !this.state.offerTranslation)
    }

    onResult = () => {
        if (this.state.level === 5 && this.state.page === 9 && this.state.currentSentencesIndex === 9){
            localStorage.setItem('level', 0);
            localStorage.setItem('page', 0);
        } else {
            if (this.state.page === 9 && this.state.currentSentencesIndex === 9 ){
                const level = this.state.level;
                localStorage.setItem('level', level + 1);
                localStorage.setItem('page', 0);
            } else {
                const page = this.state.page;
                localStorage.setItem('level', this.state.level);
                localStorage.setItem('page', +page+1);
            }
        }
   
    }

    onContinue = async () => {

        if (this.state.level === 5 && this.state.page === 9 && this.state.currentSentencesIndex === 9){
            this.setState({sentencesArrayBoard: []})
            this.setState({currentSentencesIndex: 0})
            this.setState({level: 0})
            this.setState({page: 0})
            localStorage.setItem('level', 0);
            localStorage.setItem('page', 0);
            await this.getRequest(0,0);
        } else {
            if (this.state.page === 9 && this.state.currentSentencesIndex === 9 ){
                const level = this.state.level;
                this.setState({sentencesArrayBoard: []})
                this.setState({currentSentencesIndex: 0})
                this.setState({page: 0})
                localStorage.setItem('level', level + 1);
                localStorage.setItem('page', 0);
                await this.getRequest(level + 1,0);
                this.setState({level: level + 1})
            }
            else {
                if ( this.state.currentSentencesIndex === 9 ){
                    const page = this.state.page;
                    this.setState({sentencesArrayBoard: []})
                    this.setState({currentSentencesIndex: 0})
                    localStorage.setItem('level', this.state.level);
                    localStorage.setItem('page', +page+1);
                    await this.getRequest(this.state.level,page+1);
                    this.setState({page: +page + 1})
                }
                else {
                    const currentIndex = this.state.currentSentencesIndex;
        
                    this.setState({currentSentencesIndex: currentIndex+ 1})
                    
                    const currentSentences = this.state.sentencesArray[currentIndex + 1];
                    this.setState({currentSentences:  currentSentences});
        
                    let wordShuffleArray = currentSentences.split(' ').sort(function() {
                        return 0.5 - Math.random();
                    });
                    this.setState({currentSentencesArray: wordShuffleArray});
                    
                    let collectedArray = [];
                    let colorArray = []
                    wordShuffleArray.forEach(()=>{
                        collectedArray.push('')
                        colorArray.push('common')
                    })
        
                    const board  = [...this.state.sentencesArrayBoard]
                    board[currentIndex+1] = {
                        wordArray: collectedArray, 
                        colorArray: colorArray 
                    }
                    this.setState({sentencesArrayBoard: board})
                }
            }
        }
        this.setState({isCheckButton: false})
        this.setState({isContinueButton: false})
        this.setState({isResultButton: false})
        this.setState({isIgnoranceButton: true})
    }

    onCheck = () => {
        let currentArray = this.state.currentSentences.split(' ');
        const board  = [...this.state.sentencesArrayBoard]
        const currentIndex = this.state.currentSentencesIndex; 

        let collectedArray = board[currentIndex].wordArray;

        let colorArray = [];

        currentArray.forEach((item,i)=>{
            if (item === collectedArray[i]){
                colorArray.push('success')
            }
            else {
                colorArray.push('error')
            }
        })
        board[currentIndex].colorArray = colorArray;

        this.setState({sentencesArrayBoard: board})

        if (!colorArray.includes('error')){
            
            if (!this.isSeriesVictories(this.state.currentSentences)){
                
                let seriesVictoriesSentencesArray = this.state.seriesVictoriesSentencesArray;

                seriesVictoriesSentencesArray.push(this.state.currentSentences);
                this.setState({seriesVictoriesSentencesArray: seriesVictoriesSentencesArray})
               
            }

            this.setState({isContinueButton: true})
            if (this.state.currentSentencesIndex === 9){
                this.setState({isResultButton: true})
            }
            if (this.state.pronounceAfterSuccessful){
                this.saySentences(this.state.audioArray[this.state.currentSentencesIndex])
            }
            let statistic = {...this.state.statistic};

            if (!this.isCollectedSentences(this.state.currentSentences)){
                statistic.trueSentences.push({
                    sentences: this.state.currentSentences,
                    audio: this.state.audioArray[this.state.currentSentencesIndex]
                }); 
                this.setState({statistic: statistic})
            }

        }
        else {
            this.setState({isIgnoranceButton: true})
        }
    }

    isSeriesVictories = (sentences) => {
        let isCollected = false;
        let seriesVictories = this.state.seriesVictoriesSentencesArray;
        seriesVictories.forEach((item)=>{
            if (sentences === item){
             isCollected = true;
            }
        })
        return isCollected;
    }


    isCollectedSentences = (sentences) =>{
        let isCollected = false;
        let statistic = {...this.state.statistic};

        statistic.trueSentences.forEach((item)=>{
           if (sentences === item.sentences){
            isCollected = true;
           }
        })
        statistic.falseSentences.forEach((item)=>{
            if (sentences === item.sentences){
             isCollected = true;
            }
         })
         return isCollected;
    }


    onSwapWordsForPuzzles = (index,arr) => { 
        const board  = [...this.state.sentencesArrayBoard]
        const currentIndex = this.state.currentSentencesIndex; 

        const collectedArray = board[currentIndex].wordArray;

        for (let i = 0; i<collectedArray.length; i++){
            if (collectedArray[i] === ''){
                collectedArray[i] = arr[index];
                break;
            }
        }

        this.setState({sentencesArrayBoard: board});

        const currentArray = this.state.currentSentencesArray; 
        currentArray[index] = '';
        this.setState({currentSentencesArray: currentArray}) 

        if (!collectedArray.includes('')){  
            this.setState({isCheckButton: true})
            this.setState({isIgnoranceButton: false})
        }
    }

    onSwapWordsForBoard = (index, arr) => { 
        const board  = [...this.state.sentencesArrayBoard]
        const currentIndex = this.state.currentSentencesIndex; 

        const collectedArray = this.state.currentSentencesArray;
        for (let i = 0; i<collectedArray.length; i++){
            if (collectedArray[i] === ''){
                collectedArray[i] = arr[index];
                break;
            }
        }
        this.setState({currentSentencesArray: collectedArray})

        board[currentIndex].wordArray[index] = ''; 
        
        this.setState({isCheckButton: false}) 
        this.setState({isContinueButton: false}) 
        this.setState({isIgnoranceButton: true}); 

        let colorArray = []
        collectedArray.forEach(()=>{
            colorArray.push('common')
        }) 
        board[currentIndex].colorArray = colorArray; 

        this.setState({sentencesArrayBoard: board})
 
    }

    collectSentences = () => {  

        const collectedArray = this.state.currentSentences.split(' ');
        const index = this.state.currentSentencesIndex; 
        
        const board  = [...this.state.sentencesArrayBoard]
        board[index].wordArray = collectedArray;

        let colorArray = [];
        let currentArray = [];
        collectedArray.forEach(()=>{
            currentArray.push('')
            colorArray.push('success')
        })

        this.setState({currentSentencesArray: currentArray})

        board[index].colorArray = colorArray; 

        this.setState({sentencesArrayBoard: board})

        this.setState({isContinueButton: true}) 

        let countArray = this.state.seriesVictoryCountArray;
        countArray.push(this.state.seriesVictoriesSentencesArray.length)
        this.setState({seriesVictoriesSentencesArray: []})
        
        const statistic = {...this.state.statistic};

        if (!this.isCollectedSentences(this.state.currentSentences)){
            statistic.falseSentences.push({
                sentences: this.state.currentSentences,
                audio: this.state.audioArray[this.state.currentSentencesIndex]
            });  
            this.setState({statistic: statistic})
        }

        if (this.state.currentSentencesIndex === 9){
            this.setState({isResultButton: true})
        }
        if (this.state.pronounceAfterSuccessful){
            this.saySentences(this.state.audioArray[index])
        }
    }

    swapPuzzles = (fromArray,toArray) => {

        const board  = [...this.state.sentencesArrayBoard]
        const currentIndex = this.state.currentSentencesIndex; 
        const collectedArray = board[currentIndex].wordArray;
        const currentArray = this.state.currentSentencesArray; 
      
        if (fromArray.arr === 'currentSentences' && toArray.arr === 'currentSentences'){
            const firstWord = currentArray[fromArray.index]
            const secondWord = currentArray[toArray.index]
            currentArray[fromArray.index] = secondWord
            currentArray[toArray.index] = firstWord
        }
        if (fromArray.arr === 'boardSentences' && toArray.arr === 'boardSentences'){
            const firstWord = collectedArray[fromArray.index]
            const secondWord = collectedArray[toArray.index]
            collectedArray[fromArray.index] = secondWord
            collectedArray[toArray.index] = firstWord
            
            let colorArray = []
            collectedArray.forEach(()=>{
                colorArray.push('common')
            }) 
            board[currentIndex].colorArray = colorArray; 
            this.setState({isContinueButton: false}) 

        }
        if (fromArray.arr === 'currentSentences' && toArray.arr === 'boardSentences'){
            const firstWord = currentArray[fromArray.index]
            const secondWord = collectedArray[toArray.index]
            currentArray[fromArray.index] = secondWord
            collectedArray[toArray.index] = firstWord
            
        }
        if (fromArray.arr === 'boardSentences' && toArray.arr === 'currentSentences'){
            const firstWord = collectedArray[fromArray.index]
            const secondWord = currentArray[toArray.index]
            collectedArray[fromArray.index] = secondWord
            currentArray[toArray.index] = firstWord

            this.setState({isCheckButton: false}) 
            this.setState({isContinueButton: false}) 
            this.setState({isIgnoranceButton: true}); 

            let colorArray = []
            collectedArray.forEach(()=>{
                colorArray.push('common')
            }) 
            board[currentIndex].colorArray = colorArray; 
        }

        if (!collectedArray.includes('')){  
            this.setState({isCheckButton: true})
            this.setState({isIgnoranceButton: false})
        }

        this.setState({sentencesArrayBoard: board});
        this.setState({currentSentencesArray: currentArray});
    }

    handleDrop = (index,arr) => event => {
        event.preventDefault();
        let fromArray = JSON.parse(event.dataTransfer.getData("dragContent"));
        const toArray = {
            arr: arr,
            index: index
        }
        this.swapPuzzles(fromArray, toArray);
        return false;
    };

    handleDragOver = (data,arr) => event => {
        event.preventDefault();
        return false;
    };

    handleDragStart = (index,arr) => event => {
        const word = {
            arr: arr,
            index: index
        }
        let fromArray = JSON.stringify(word);
        event.dataTransfer.setData("dragContent", fromArray);
    };


    render () {
        const { 
            level, 
            page, 
            sentencesTranslateArray, 
            currentSentencesIndex, 
            currentSentencesArray,
            isCheckButton,
            isContinueButton,
            isIgnoranceButton,
            sentencesArrayBoard,
            offerTranslation,
            isResultButton,
            audioArray,
            pronounceAfterSuccessful,
            promptAlwaysPronunciation
        } = this.state;

        const settingButton = s.setting_button;  


        let megafon = settingButton + ' ' + s.megafon_btn;

        if (!pronounceAfterSuccessful) {
            megafon = settingButton + ' ' + s.megafon_btn + ' ' + s.non_active_btn;
        }

        let translate = settingButton + ' ' + s.translate_btn;

        if (!offerTranslation) {
            translate = settingButton + ' ' + s.translate_btn + ' ' + s.non_active_btn;
        }

        let song = settingButton + ' ' + s.song_btn;

        let speaker_btn = s.game_speaker;

        if (!promptAlwaysPronunciation) {
            song = settingButton + ' ' + s.song_btn + ' ' + s.non_active_btn;
            speaker_btn = s.game_speaker + ' ' + s.vis_hidden;
        }

        const chooseButton = settingButton+ ' ' + s.chose_btn;
        const takePuzzles = s.take_puzzles + ' ' + s.game_words;

        let translateSentence = s.game_sentence;

        if (!offerTranslation) {
            translateSentence = s.game_sentence + ' ' + s.vis_hidden;
        }
        
        const onSwapWordsForBoard = this.onSwapWordsForBoard;

        let collectButton = s.game_button; 
        let checkButton = s.drag_word +' '+s.display_none; 
        let continueButton = s.drag_word +' '+s.display_none;

        if (!isIgnoranceButton) {
            collectButton = s.game_button +' '+ s.display_none;
        }

        if (isCheckButton){
            checkButton = s.game_button;
        }

        if (isContinueButton){
            checkButton = s.display_none;
            collectButton = s.display_none;
            continueButton = s.game_button;
        }

        let resultButton = s.game_button
        if (!isResultButton){
            resultButton = s.game_button +' '+ s.display_none;
        }

        return (
            <div>
                 <div className={s.background}>
                </div>
                <div className={s.mainBase}> 
                    <EpHeader/>
    
                    <div className={s.menu_wrapper}>  
                        <div className={s.menu_select_level}> 
                            <select className={s.choose_level} value={level} onChange={this.levelChange}>
                                    <option value={0}>1</option>
                                    <option value={1}>2</option>
                                    <option value={2}>3</option>
                                    <option value={3}>4</option>
                                    <option value={4}>5</option>
                                    <option value={5}>6</option>
                            </select>
                            <select className={s.choose_level} value={page} onChange={this.pageChange}>
                                    <option value={0}>1</option>
                                    <option value={1}>2</option>
                                    <option value={2}>3</option>
                                    <option value={3}>4</option>
                                    <option value={4}>5</option>
                                    <option value={5}>6</option>
                                    <option value={6}>7</option>
                                    <option value={7}>8</option>
                                    <option value={8}>9</option>
                                    <option value={9}>10</option>
                            </select>
                            <ButtonSettings label = {'GO'} classNameBtn={chooseButton} clickBtn={this.changeGameParam}/>
                        </div>
                        <a href={`https://github.com/Wimmind`} className={s.github_link}>
                            <span className={s.github_ico}></span>Wimmind github account
                        </a>
                        <div className={s.menu_settings}>
                            <ButtonSettings classNameBtn={megafon} clickBtn={this.pronounceAfter} help={'pronounce the sentence after assembly'}/>
                            <ButtonSettings classNameBtn={translate} clickBtn={this.disableTranslation} help={'show offer translation'}/>
                            <ButtonSettings classNameBtn={song} clickBtn={this.switchPromptAlwaysPronunciation} help={'display pronunciation button'}/>
                        </div>
                    </div>

                   

                    <div className={s.game_wrapper}>
                        <div className={s.game_group}>
                            <div className={s.game_settings}>
                                <h3 className={translateSentence}>{sentencesTranslateArray[currentSentencesIndex]}</h3>
                                <ButtonSettings classNameBtn={speaker_btn} clickBtn={()=>this.promptPronunciation(audioArray[currentSentencesIndex])} help={'pronunciation button'}/>
                            </div>
                        </div>

                        <div className={s.game_container}>
                            <div className={s.game_numbering}>
                            {Array.from({ length: 10 }, () => null).map((field, i) => (
                                <div key={i.toString() + 'num'} className={s.game_numbering_item }>{i+1}</div> 
                                ))}
                            </div>
      
                            <div className={s.game_board}>
                                {sentencesArrayBoard.map((field,i) => (
                                    <RowSentences 
                                        key={i.toString() + 'd2'}  
                                        array={field.wordArray} 
                                        classNameRow = {s.game_words} 
                                        classNameWord = {field.colorArray}
                                        boardLength = {sentencesArrayBoard.length}
                                        currentRow = {i} 
                                        func={onSwapWordsForBoard}
                                        dragStartFunc = {this.handleDragStart}
                                        dragOverFunc = {this.handleDragOver} 
                                        dragDropFunc = {this.handleDrop}  
                                    />
                                ))}
                            </div>

                        </div>

                        <div className={takePuzzles}>
                            {currentSentencesArray.map((word, i) => (
                                <div
                                    draggable={word.length ? 'true' : 'false'}
                                    onDragStart={this.handleDragStart(i,'currentSentences')}
                                    onDragOver={this.handleDragOver(i,'currentSentences')}
                                    onDrop={this.handleDrop(i,'currentSentences')}
                                    
                                    className={s.drag_word} 
                                    key={i.toString() + 'd1'}
                                    onClick={()=>this.onSwapWordsForPuzzles(i,currentSentencesArray)}
                                >
                                   <span>{word}</span>
                                </div>
                            ))}
                        </div>

                        <div className={s.game_buttons}>
                            <ButtonSettings label = {'I don`t know'} classNameBtn={collectButton} clickBtn={this.collectSentences}/>
                            <ButtonSettings label = {'Check'} classNameBtn={checkButton} clickBtn={this.onCheck}/>
                            <ButtonSettings label = {'Continue'} classNameBtn={continueButton} clickBtn={this.onContinue}/>
                            <Link to={
                            {
                                pathname: '/statistic',
                                state: {
                                    statistic: this.state.statistic,
                                    level: this.state.level,
                                    page: this.state.page
                                }
                            }
                            }><button className={resultButton} onClick = {this.onResult}>Result</button>
                            </Link>
                        </div> 
                    </div>
    
                </div>
            </div>
        )
    }
}
