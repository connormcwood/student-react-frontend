import React, { Component } from 'react';
import NoteHelper from '../helpers/NoteHelper'

class Note extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: props.value,
            active: props.data.active,
            title: props.data.title,
            body: props.data.body,
            selected: props.data.selected,
            defaultClass: "flex-one note-outer-body",
            classList: "flex-one note-outer-body",
            priorityClass: "priority-container priority-" + props.data.priority.id,
            priority: props.data.priority
        };
        
        this.state.selectedCss = (this.state.selected === true)?"selected":"";
        this.state.defaultClass += this.state.selectedCss;
        this.state.classList += this.state.selectedCss
        this.getActive = this.getActive.bind(this);
        //this.click = this.click.bind(this);
    }
    click() {
        this.props.onClick(this.state.key);
    }
    isActive() {
        switch(this.state.active) {
            case true:
                this.setState({classList: this.state.defaultClass + " active" });
            break;
            default:
                this.setState({classList: this.state.defaultClass});
            break;
        }
    }
    getActive() {
        return this.state.active;
    }
    componentWillReceiveProps(props) {
        const {title, active, key, body} = this.props;
        if(props.data.active !== active) {     
            this.setState(props.data, this.isActive)
        }
    }
  render() {
        return (
            <NoteHelper data={this.state} active={this.state.active} onClick={this.click.bind(this)} />
            );
  }
}
export default Note;
