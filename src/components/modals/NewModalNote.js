import React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Modal from 'react-modal';
import { Row, Container, Dropdown, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import Select from 'react-select';
import DataConverter from '../../helpers/DataConverter';
import MyEditor from '../MyEditor';
import NotesRequest from '../../requests/Notes';

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        minHeight             : '320px',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};    

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ];

Modal.setAppElement("#root");

class NewModalNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            selectedOption: null,
            priorities: [],
            formData: [],
            options: DataConverter.optionsGenerator(props.priorities, "key", "title")
        };

        this.toggleStatus = props.toggleStatus;      
        this.retrieveNotes = props.getNotes; 
        this.closeModal = this.closeModal.bind(this);
        this.returnPriorities = this.returnPriorities.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.submitForm = this.submitForm.bind(this);
    };

    handleChange(prop, target) {
        let value;
        switch(prop) {
            case "title": 
                value = target.target.value;
            break;
            case "priorities":
                value = target.value;
            break;
            default:

            break;
        }
        let formData = this.state.formData;
        formData[prop] = value;
        this.setState({formData: formData}, console.log(this.state.formData)); 
    }

    updateContent(value) {
        let formData = this.state.formData;
        formData.content = value;
        this.setState({formData: formData}, console.log(this.state.formData));
    }

    componentWillReceiveProps(newProps) {
        if(newProps.status !== this.state.isOpen) {
            this.setState({isOpen: newProps.status});
        } 
        if(typeof newProps.data.priorities !== 'undefined' && newProps.data.priorities.length > 0) {
            let options = DataConverter.optionsGenerator(newProps.data.priorities, "id", "title");
            this.setState({ priorities: options });
        }    
    }

    returnPriorities() {
        return this.state.priorities;
    }

    componentWillUnmount() {
        this.toggleStatus();
    }

    submitForm() {
        NotesRequest
        .postNotes(this.state.formData)
        .then( (result) => {
            console.log("Submitted Form");            
            this.closeModal();
            return this.retrieveNotes();
        })
        .catch( (error) => {
            console.log(error);
        });
    }


    closeModal() {
        this.setState({isOpen: false});
    }

  render() {
      const { selectedOption } = this.state;
    return (
        <Modal
        isOpen={this.state.isOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        >

        <a className="close-button" onClick={() => this.toggleStatus()} >X</a>

        <Container>
            <Row>
                <Col sm={9}>
                    <Input type="text" name="title" onChange={(e) => this.handleChange("title", e) } placeholder="Title" />
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <Select 
                        value={selectedOption}
                        onChange={(e) => this.handleChange("priorities", e) }
                        options={this.state.priorities}
                    />
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <MyEditor updateContent={this.updateContent} />
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <div className="">
                        <button onClick={this.submitForm} className="submit">Submit</button>
                    </div>
                </Col>
            </Row>

        </Container>

        </Modal>
    );
  }
}

export default DragDropContext(HTML5Backend)(NewModalNote);
