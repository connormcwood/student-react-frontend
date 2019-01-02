import * as React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Note from './Note';
import SortableNote from './SortableNote';
import update from 'immutability-helper';
import NewModalNote from './modals/NewModalNote';
import NotesRequest from './../requests/Notes';
import PrioritiesRequest from './../requests/Priorities';

class Notes extends React.Component {
    constructor(props) {
        super(props);

        NotesRequest
        .getNotes()
        .then((result) => {
            let rows = [];
            for(let i = 0; i < result.length; i++) {
                let item = result[i];
                item.active = false;
                item.body = item.content;
                item.order = i;
                rows[i] = item;
            }
            this.setState({ rows: rows}, this.iterateNotes);
        })
        .catch((err) => {
            console.log(err);
        });

        this.state = {
            reorder: false,
            rows: [],
            notes: [],
            selected: [],
            mode: 1, //Types of Modes (1 => OPEN, 2 => EDIT, 3 => REMOVE)
            modalIsOpen: false,
            modal_type: {
                create: false,
                remove: false,
                edit: false,
                reorder: false
            },
            priorities: []
        };
        this.moveNote = this.moveNote.bind(this);
        this.interactedWithNote = this.interactedWithNote.bind(this);
        this.iterateNotes = this.iterateNotes.bind(this);
        this.checkIfActive = this.checkIfActive.bind(this);
        this.displayNotes = this.displayNotes.bind(this);
        this.toggleReorder = this.toggleReorder.bind(this);
        this.toggleRead = this.toggleRead.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.toggleRemove = this.toggleRemove.bind(this);
        this.toggleCreate = this.toggleCreate.bind(this);
        this.selectedNotes = this.selectedNotes.bind(this);

        this.actionRemove = this.actionRemove.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.getModalType = this.getModalType.bind(this);      

        let rows = [];
        this.state.rows.map( (note, index) => {
            rows.push(<Note key={index} onClick={this.interactedWithNote} onCheckboxClick={this.onCheckboxClick} 
            value={index} data={note} moveCard={this.moveNote}/>);
        });
        this.state.notes = rows;

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    };
 
    getPriorities() {
        return this.state.priorities;
    }

    openModal() {
      this.setState({modalIsOpen: true});
    }
  
    afterOpenModal() {
      // references are now sync'd and can be accessed.
      this.subtitle.style.color = '#f00';
    }
  
    closeModal() {
      this.setState({modalIsOpen: false});
    }

    componentDidMount() {        
        this.reorderByOrderProperty();

        PrioritiesRequest
        .getPriorities()
        .then( (result) => {
            this.setState({priorities: result}, this.getPriorities);
        })
        .catch( (err) => {
            console.log(err);
        });

    }

    interactedWithNote = (value) => {
        this.selectedNotes(value);
    };
    checkIfActive = (value) => {
        let arrs = this.state.rows;
        for(let i = 0 ; i < arrs.length; i++) {
            if(this.findWithinArray(i, value) !== false && value[0] === i) {
                switch(arrs[i].active) {
                    case true:
                        arrs[i].active = false;
                    break;
                    case false:
                        arrs[i].active = true;
                    break;
                }
            } else {
                arrs[i].active = false;
            } 
        }
        this.setState(update(this.state.rows, {
            $set: {arrs}
        }), this.iterateNotes);
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
                    value={index} data={note} moveCard={this.moveNote}/>);
            } else if(this.state.reorder == true) {
                rows.push(<SortableNote key={index} onClick={this.interactedWithNote} onCheckboxClick={this.onCheckboxClick} 
                    value={index} data={note} moveCard={this.moveNote} />);
            } 
        });
        return rows;
    } 
    displayNotes() {
        return this.state.notes;
    }
    toggleReorder() {
        this.reorderByOrderProperty();
        switch(this.state.reorder) {
            case true:
                this.setState({reorder: false}, this.iterateNotes);
            break;
            case false:
                this.setState({reorder: true}, this.iterateNotes);
            break;
        }        
    }
    toggleRead(selected) {
        if(selected > 1) {            
            this.setState({selected: selected.slice(selected.length - 1, 1)}, () => this.checkIfActive(this.state.selected));
        } else {
            this.checkIfActive(selected);
        }
        
    }
    toggleEdit() {
        this.setState({mode: 2}, () => this.toggleModal("edit"));
    }
    toggleRemove() {
        this.setState({mode: 3}, () => this.toggleModal("delete"));
    }
    toggleCreate() {
        this.setState({mode: 1}, () => this.toggleModal("create"));
    }

    actionRemove() {
        console.log(this.state.selected);
    }

    toggleModal(type) {
        let modal_type = this.state.modal_type;
        console.log("Toggle Modal", this.state.modal_type);
        modal_type[type] = !this.state.modal_type[type];
        this.setState({modal_type: modal_type}, this.getModalType);
    }

    getModalType() {
        console.log("Get Modal Type", this.state.modal_type.create);
        return this.state.modal_type.create;
    }

    findWithinArray(value, array) {
        if(array.length > 0) {
            for(let i = 0; i < array.length; i++) {
                if(array[i] === value) {
                    return i;
                }
            }
        }
        return false;
    }
    selectedNotes(value) {
        let selectedArr = this.state.selected;
        const posInArr = this.findWithinArray(value, selectedArr);
        if(posInArr !== false) {
            selectedArr.splice(posInArr, 1);
        } else {            
            if(this.state.mode === 1 && selectedArr.length > 0) {
                selectedArr.pop();   
            }
            selectedArr.push(value);
        }

        this.setState({selected: selectedArr}, () => {
            this.highlightSelected();
            this.actionClick()         
        });
    }
    highlightSelected() {
        let selected = this.state.selected;
        let data = this.state.rows;
        for(let i = 0; i < data.length; i++) {
            if(this.findWithinArray(i, selected)) {
                data[i].selected = true;
            } else {
                data[i].selected = false;
            }
        }
        this.setState({rows: data}, this.iterateNotes);
    }
    actionClick() {
        console.log("Action Click", this.state.mode, this.state.selected);
        switch(this.state.mode) {
            case 1:
                this.toggleRead(this.state.selected);
            break;
            default:

            break;
        }
    }
    createButtons(mode) { //Types of Modes (1 => OPEN, 2 => EDIT, 3 => REMOVE)
        return (
        <div class="button-holder float-right">
        <button type="button" className={(mode === 4)?"btn btn-warning active":"btn btn-warning"} onClick={this.toggleReorder}>Reorder</button>&nbsp;
        <button type="button" className={(mode === 3)?"btn btn-danger active":"btn btn-danger"} onClick={this.toggleRemove}>Remove</button>&nbsp;
        <button type="button" className={(mode === 1)?"btn btn-success active":"btn btn-success"} onClick={this.toggleCreate}>Create</button>&nbsp;
        <button type="button" className={(mode === 2)?"btn btn-primary active":"btn btn-primary"} onClick={this.toggleEdit}>Edit</button>                    
        </div> );
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
                            {this.createButtons(this.state.mode)}                 
                        </div>
                    </div>
                </div>                      
            </div>
        </header>
        <section className="notes body">
            <div className="container">
                <div class="container-drag">
                    <div className="dropable">
                        { this.iterateNotes() }
                    </div>
                </div>
            </div>
        </section>
        <NewModalNote status={this.state.modal_type.create} getPriorities={this.getPriorities} data={this.state} toggleStatus={this.toggleCreate} />
      </div> 
    );
  }
}

export default DragDropContext(HTML5Backend)(Notes);
