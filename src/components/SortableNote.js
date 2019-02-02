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
import NoteHelper from '../helpers/NoteHelper'

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
    drop(props, monitor, component) {
        if (monitor.didDrop()) {
            // If you want, you can check whether some nested
            // target already handled drop
            return;
          }
          console.log("ELEMENT DROPPEd");
          props.endReorder();
          return { moved: true };
    }
  }

class SortableNote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: props.value,
            active: props.data.active,
            title: props.data.title,
            body: props.data.body,
            defaultClass: "flex-one note-outer-body sortable",
            classList: "flex-one note-outer-body sortable",
            priorityClass: "priority-container priority-" + props.data.priority.id,
            priority: props.data.priority
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
    componentDidUpdate(prevProps) {
        console.log(prevProps);
        if (!prevProps.isOver && this.props.isOver) {
            // You can use this as enter handler
          }
      
          if (prevProps.isOver && !this.props.isOver) {
            // You can use this as leave handler
          }
      
          if (prevProps.isOverCurrent && !this.props.isOverCurrent) {
            // You can be more specific and track enter/leave
            // shallowly, not including nested targets
          }
    }
    componentWillReceiveProps(props) {
        const {title, active, key, body} = this.props;
        if(props.data.active !== active) {        
            this.setState(props.data, this.isActive)
        }
    }
  render() {
    const { isDragging, connectDragSource, connectDropTarget } = this.props;
        return connectDragSource(connectDropTarget(
            <div>
            <NoteHelper data={this.state} onClick={this.onClick} />
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
