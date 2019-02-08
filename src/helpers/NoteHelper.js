import React, { Component } from 'react';

let activeClassName;

class NoteHelper extends Component {
    constructor(props) {
        super(props);
        console.log("HERE: ", this.props);
        this.state = {
            active: false,
            key: this.props.data.key,
            data: this.props.data,
            defaultClass: this.props.data.defaultClass,
            classList: this.props.data.classList,
            priorityClass: "priority-container priority-" + props.data.priority.id,
        }
        if(typeof props.additionalCss !== "undefined") {
            this.state.defaultClass = this.state.defaultClass + " " + props.additionalCss
            this.state.classList = this.state.classList + " " + props.additionalCss
        }


        this.click = this.click.bind(this);
        this.getClassName = this.getClassName.bind(this);
    }
    componentWillReceiveProps(props) {
        if(this.state.active === true) {
            props.data.classList = this.state.defaultClass + " active";
        } else {
            props.data.classList = this.state.defaultClass;
        }
        this.setState(props.data, () => {
            this.setState({active: props.active}, this.getClassName)
        });
    
    }
    getClassName() {
        return this.state.classList;
    }
    click() {
        this.props.onClick(this.state.key);
    }

    render() {
        return (
            <div className={this.getClassName()} onClick={this.click}>
            <div className="flex-grid vertical-flex above-fold">
                <div className="flex-one relative">
                    <span className={this.state.data.priorityClass}>
                        {this.state.data.priority.title}
                    </span>
                    <h3>{this.state.data.title}</h3>
                </div>
            </div>
            <div className="flex-grid vertical-flex below-fold">
                <div className="flex-one container-padding" dangerouslySetInnerHTML={{ __html: this.state.data.body}}>
                
                </div>
            </div> 
        </div>
        )
    }    
}

export default NoteHelper;