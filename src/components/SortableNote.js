import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ItemTypes from '../helpers/ItemTypes';
import { findDOMNode } from 'react-dom'
import {
	DragSource,
	DropTarget,
	ConnectDropTarget,
	ConnectDragSource,
	DropTargetMonitor,
	DropTargetConnector,
	DragSourceConnector,
	DragSourceMonitor,
} from 'react-dnd'
import { XYCoord } from 'dnd-core'
import flow from 'lodash/flow'

const cardSource = {
    beginDrag(props) {
        return {
            key: props.value,
            active: props.data.active,
            title: props.data.title,
            body: props.data.body, 
        };
    }
};

function collect(connect, monitor) {
    const item = monitor.getItem();
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      item: item,
      isDragging: !!item,
    };
  }

const propTypes = {
    //isDragging: PropTypes.bool.isRequired,
    //connectDragSource: PropTypes.func.isRequired
};
const cardTarget = {
    hover(props, monitor, component) {
      const dragIndex = monitor.getItem().key;
      const hoverIndex = props.value;
        
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
  
      // Determine rectangle on screen
      const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()
  
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
  
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
  
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
  
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
  
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
  
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
  
      // Time to actually perform the action
      props.moveCard(dragIndex, hoverIndex)
  
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().key = hoverIndex
    },
  }

class SortableNote extends Component {
    constructor(props) {
        super(props);
        console.log("Generated", props.value);
        this.state = {
            key: props.value,
            active: props.data.active,
            title: props.data.title,
            body: props.data.body,
            defaultClass: "col col-xs-12 note-outer-body sortable",
            classList: "col col-xs-12 note-outer-body sortable"
        };
        this.click = this.click.bind(this);
    }
    click() {
        this.props.onClick(this.state.key);
    }
    isActive() {
        if(this.state.active === true) {
            this.setState({classList: this.state.defaultClass + " active" });
        } else {
            this.setState({classList: this.state.defaultClass});
        }
    }
    /*componentWillUpdate(nextProps, nextState) {
        console.log("Note upd: ", nextProps, nextState);
    }*/
    componentWillReceiveProps(props) {
        const {title, active, key, body} = this.props;
        if(props.data.active !== active) {        
            this.setState(props.data, this.isActive)
        }
    }
  render() {
    const { isDragging, connectDragSource, connectDropTarget } = this.props;
        return connectDragSource(connectDropTarget(
            <div className={this.state.classList} onClick={this.click}>
                <div className="row above-fold">
                    <div className="col-xs-12">
                        <h3>{this.state.title}</h3>
                    </div>
                </div>
               <div className="row below-fold">
                <div className="col col-xs-12 col-sm-8">
                    <p>{this.state.body}</p>
                </div>
                <div className="col col-xs-12 col-sm-4">
                    <p>Right</p>
                </div>
              </div> 
            </div>
            ));
  }
}
export default flow([
    DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    })),
    DropTarget(ItemTypes.CARD, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
    }))
])(SortableNote);
