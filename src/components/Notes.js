import * as React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import ItemTypes from '../helpers/ItemTypes';
import Note from './Note';
import SortableNote from './SortableNote';
import update from 'immutability-helper';

let arr = [{
        "title": "First Note",
        "body": "Lorem Ipsum",
        "order": 0,
        "active": false,
    },{
        "title": "Second Note",
        "body": "Lorem Ipsum",
        "order": 1,
        "active": false          
    },{
        "title": "Third Note",
        "body": "Lorem Ipsum",
        "order": 3,
        "active": false  
    },{
        "title": "Fourth Note",
        "body": "Lorem Ipsum",
        "order": 2,
        "active": false          
    },{
        "title": "Fifth Note",
        "body": "Lorem Ipsum",
        "order": 5,
        "active": false  
    },{
        "title": "Sixth Note",
        "body": "Lorem Ipsum",
        "order": 4,
        "active": false          
    }];

   
class Notes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reorder: false,
            rows: arr,
            notes: [],
            selected: [],
            mode: 1 //Types of Modes (1 => OPEN, 2 => EDIT, 3 => REMOVE)
        };
        this.moveNote = this.moveNote.bind(this);
        this.interactedWithNote = this.interactedWithNote.bind(this);
        this.iterateNotes = this.iterateNotes.bind(this);
        this.checkIfActive = this.checkIfActive.bind(this);
        this.displayNotes = this.displayNotes.bind(this);
        this.toggleReorder = this.toggleReorder.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.toggleRemove = this.toggleRemove.bind(this);
        this.toggleCreate = this.toggleCreate.bind(this);
        this.selectedNotes = this.selectedNotes.bind(this);

        let rows = [];
        this.state.rows.map( (note, index) => {
            rows.push(<Note key={index} onClick={this.interactedWithNote} onCheckboxClick={this.onCheckboxClick} 
            value={index} data={note} moveCard={this.moveNote}/>);
        });
        this.state.notes = rows;
    };
    interactedWithNote = (value) => {
        this.selectedNotes(value);
    };
    checkIfActive = (value) => {
        const arrs = this.state.rows;
        for(let i = 0 ; i < arrs.length; i++) {  
            if(i === value && arrs[i].active === true) {
                arrs[i].active = false;
            } else if(i === value) {
                arrs[i].active = true;
            } else {
                arrs[i].active = false;
            }      
        }
        this.setState(update(this.state.rows, {
            $set: {arrs}
        }), this.iterateNotes);
        //this.setState({rows: arrs}, this.iterateNotes);
    };
    reorderByOrderProperty() {
        const rows = this.state.rows;
        for(let i = 0; i < rows.length; i++) {
            for(let j = 0; j < rows.length; j++) {
                if(j + 1 !== rows.length && rows[j].order > rows[j + 1].order) {
                    let tempArr = rows[j];
                    rows[j] = rows[j + 1];
                    rows[j + 1] = tempArr;
                }
            }
        }
        this.setState({rows: rows}, this.iterateNotes);    
    }
    moveNote(dragIndex, hoverIndex) {
        const cards = this.state.rows;
        const tempOrder = cards[dragIndex].order;
        cards[dragIndex].order = cards[hoverIndex].order;
        cards[hoverIndex].order = tempOrder;
        this.setState(update(this.state.rows, {
            dragIndex: {$set: {order: cards[hoverIndex].order }},
            hoverIndex: {$set: {order: tempOrder}}
        }), this.reorderByOrderProperty);
    }
    iterateNotes() { 
        let rows = [];
        this.state.rows.map( (note, index) => {
            if(this.state.reorder == false) {
                rows.push(<Note key={index} onClick={this.interactedWithNote} onCheckboxClick={this.onCheckboxClick} 
                    value={index} data={note} moveCard={this.moveNote} />);
            } else if(this.state.reorder == true) {
                rows.push(<SortableNote key={index} onClick={this.interactedWithNote} onCheckboxClick={this.onCheckboxClick} 
                    value={index} data={note} moveCard={this.moveNote} />);
            }
 
        });
        this.setState({notes: rows}, this.displayNotes);     
    } 
    displayNotes() {
        return this.state.notes;
    }
    toggleReorder() {
        this.reorderByOrderProperty();
        //console.log("Reorder", this.state.reorder);
        switch(this.state.reorder) {
            case true:
                this.setState({reorder: false}, this.iterateNotes);
            break;
            case false:
                this.setState({reorder: true}, this.iterateNotes);
            break;
        }        
    }
    toggleEdit() {
        const notes = this.selectedNotes();
    }
    toggleRemove() {
        const notes = this.selectedNotes();
    }
    toggleCreate() {

    }
    findWithinArray(value) {
        for(let i = 0; this.state.selected.length; i++) {
            if(this.state.selected[i] == value) {
                return i;
            }
        }
        return false;
    }
    selectedNotes(value) {
        const selectedArr = this.state.selected;
        const posInArr = this.findWithinArray(value);
        if(posInArr !== false) {
            selectedArr.splice(posInArr, 1);
        } else {
            selectedArr.push(value);
        }
        this.setState({selected: selectedArr}, this.actionClick);
    }
    actionClick() {
        console.log("Action Click", this.state.mode, this.state.selected);
        switch(this.state.mode) {
            case 1:
                console.log(this.state.selected);
                this.checkIfActive(this.state.selected[0]);
            break;
            case 2:

            break;
            case 3:

            break;
        }
    }
  render() {
    const Notes = [];
    this.state.rows.map( (note, index) => {
        Notes.push(<Note key={index} onClick={this.interactedWithNote} onCheckboxClick={this.onCheckboxClick} 
        value={index} data={note} moveCard={this.moveNote} />);
    });

    return (
     <div className="App">
        <header className="App-header">
            <div className="container">
                <div class="row">
                    <div class="col col-xs-12 col-sm-8">
                        <h2>Notes</h2> 
                    </div>
                    <div class="col col-xs-12 col-sm-4">
                        <div class="button-holder float-right">
                            <button type="button" class="btn btn-warning" onClick={this.toggleReorder}>Reorder</button>&nbsp;
                            <button type="button" class="btn btn-danger" onClick={this.toggleRemove}>Remove</button>&nbsp;
                            <button type="button" class="btn btn-success" onClick={this.toggleCreate}>Create</button>&nbsp;
                            <button type="button" class="btn btn-primary" onClick={this.toggleEdit}>Edit</button>                    
                        </div>
                    </div>
                </div>                      
            </div>
        </header>
        <section className="notes body">
            <div className="container">
                <div class="container-drag">
                    <div className="dropable">
                        { this.displayNotes() }
                    </div>
                </div>
            </div>
        </section>
      </div> 
    );
  }
}

export default DragDropContext(HTML5Backend)(Notes);
