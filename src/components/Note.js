import React, { Component } from 'react';

class Note extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: props.value,
            active: props.data.active,
            title: props.data.title,
            body: props.data.body,
            selected: props.data.selected,
            defaultClass: "col col-xs-12 note-outer-body",
            classList: "col col-xs-12 note-outer-body"
        };
        
        this.state.selectedCss = (this.state.selected === true)?"selected":"";
        this.state.defaultClass += this.state.selectedCss;
        this.state.classList += this.state.selectedCss
        this.click = this.click.bind(this);
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
    componentWillReceiveProps(props) {
        const {title, active, key, body} = this.props;
        if(props.data.active !== active) {     
            this.setState(props.data, this.isActive)
        }
    }
  render() {
        return (
            <div className={this.state.classList} onClick={this.click}>
                <div className="row above-fold">
                    <div className="col-xs-12">
                        <h3>{this.state.title}</h3>
                    </div>
                </div>
               <div className="row below-fold">
                <div className="col col-xs-12 col-sm-12" dangerouslySetInnerHTML={{ __html: this.state.body}}>

                </div>
              </div> 
            </div>
            );
  }
}
export default Note;
