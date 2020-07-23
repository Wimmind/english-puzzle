import React, {Component} from 'react';
import s from './rowSentences.module.css'

export default class RowSentences extends Component {
    render() {
        const {
            array,
            classNameRow,
            classNameWord,
            func,
            currentRow,
            boardLength,
            dragStartFunc,
            dragOverFunc,
            dragDropFunc,
        } = this.props;

        for (let i = 0; i < classNameWord.length; i++){  
            if (classNameWord[i] === 'common'){
                classNameWord[i] = s.drag_word ;
            } else {
                if (classNameWord[i] === 'success'){
                    classNameWord[i] = s.success_color;
                } 
                if (classNameWord[i] === 'error'){
                    classNameWord[i] = s.error_color;
                } 
            }
        }
        
        const draggable = (currentRow+1) < boardLength ? true : false;
        return (
            <div className={classNameRow}>
                {array.map((word, i) => (

                    <div
                        draggable={(!word.length || draggable) ? 'false' : 'true'}
                        onDragStart={dragStartFunc(i,'boardSentences')}
                        onDragOver={dragOverFunc(i,'boardSentences')}
                        onDrop={dragDropFunc(i,'boardSentences')}

                        className={classNameWord[i]}
                        key={i.toString() + 'd'} 
                        onClick={()=>{
                            if ((currentRow+1) === boardLength){
                                func(i,array)
                            }
                        }}
                    >
                        <span>{word}</span>
                    </div>

                ))}
            </div> 
        )
    } 
}


