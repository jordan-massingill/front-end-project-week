import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { MenuBar } from './components/universal/MenuBar';
import { Notes } from './components/notes-page/Notes';
import { NotePage } from './components/single-note-page/NotePage';
import NewNote from './components/new-note-page/NewNote';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';
import axios from 'axios';

const myNotes = [
  {
    id: 0,
    title: "Note 1",
    note: "Cat ipsum dolor sit amet, hide head under blanket so no one can see fish i must find my red catnip fishy fish but stuff and things. Damn that dog man running from cops stops to pet cats, goes to jail sit on the laptop so intently sniff hand claws in your leg, and attack feet. Ears back wide eyed i just saw other cats inside the house and nobody ask me before using my litter box or destroy the blinds. Sit on human they not getting up ever sleep everywhere, but not in my bed. Dead stare with ears cocked meow meow, i tell my human love and coo around boyfriend who purrs and makes the perfect moonlight eyes so i can purr and swat the glittery gleaming yarn to him (the yarn is from a $125 sweater). Poop in litter box, scratch the walls murf pratt ungow ungow lie in the sink all day. Hiss at vacuum cleaner love you, then bite you, yet sit on human they not getting up ever sit in box. Pretend you want to go out but then don't meow to be let in or with tail in the air for howl uncontrollably for no reason. Chase the pig around the house dream about hunting birds yet have a lot of grump in yourself because you can't forget to be grumpy and not be like king grumpy cat. I'm going to lap some water out of my master's cup meow scratch me there, elevator butt scratch at fleas, meow until belly rubs, hide behind curtain when vacuum cleaner is on scratch strangers and poo on owners food and stuff and things but destroy house in 5 seconds claws in your leg or eat an easter feather as if it were a bird then burp victoriously, but tender. Meoooow cereal boxes make for five star accommodation yet kick up litter wack the mini furry mouse so find something else more interesting, curl into a furry donut cat fur is the new black . Sleep on dog bed, force dog to sleep on floor scream for no reason at 4 am so plays league of legends spot something.",
    editing: false
  },
  {
    id: 1,
    title: "Note 2",
    note: "Meoooow show belly hide head under blanket so no one can see step on your keyboard while you're gaming and then turn in a circle , i cry and cry and cry unless you pet me, and then maybe i cry just for fun for hiss at vacuum cleaner. With tail in the air attack the child, lick butt, for licks paws. Shake treat bag mark territory. Murf pratt ungow ungow slap owner's face at 5am until human fills food dish yet the fat cat sat on the mat bat away with paws or flex claws on the human's belly and purr like a lawnmower i shredded your linens for you. Eat a plant, kill a hand. Hunt by meowing loudly at 5am next to human slave food dispenser. Suddenly go on wild-eyed crazy rampage experiences short bursts of poo-phoria after going to the loo. Be a nyan cat, feel great about it, be annoying 24/7 poop rainbows in litter box all day the dog smells bad twitch tail in permanent irritation. Stare at imaginary bug tuxedo cats always looking dapper eat all the power cords meow go back to sleep owner brings food and water tries to pet on head, so scratch get sprayed by water because bad cat or kitten is playing with dead mouse find empty spot in cupboard and sleep all day so step on your keyboard while you're gaming and then turn in a circle . Eat grass, throw it back up sit by the fire.",
    editing: false
  }
]

const AppContainer = styled.div `
  display: flex;
  max-width: 890px;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  border: 1px solid black;
`;

class App extends Component {
  constructor (props) {
    super(props);
    this.state= {
      notes: [],
      newTitle: '',
      newNote: '',
      modal: false
    }
  }

  componentDidMount() {
    axios.get('http://localhost:8700/notes').then(response => {
      this.setState({ notes: response.data, number: response.data.length });
    }).catch(err => {
      console.error(err);
    })
  }

  onChangeHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  deleteNoteHandler = async (id) => {
    const noteId = parseInt(id);
    axios.delete(`http://localhost:8700/notes/${noteId}`).then(response => {
      const notes = await axios.get('http://localhost:8700/notes');
      this.setState({ notes: notes.data, modal: false })
    }).catch(err => {
      console.error(err);
    })
  }

  addNewNoteHandler = (props) => {
    const myNewNote = {
      title: this.state.newTitle,
      note: this.state.newNote,
    };
    axios.post('http://localhost:8700/notes', myNewNote).then(response => {
      const notes = await axios.get('http://localhost:8700/notes');
      this.setState({ notes: notes.data })
    }).catch();
    this.setState({ notes: dummyNotes, newTitle: '', newNote: '', number: myNewNote.id + 1 });
  }

  beginEditNoteHandler = (id) => {
    const dummyNotes = this.state.notes;
    let selectedNote = dummyNotes.find(note => note.id.toString() === id);
    const index = dummyNotes.indexOf(selectedNote);
    selectedNote.editing = !selectedNote.editing;
    dummyNotes[index] = selectedNote;
    this.setState({ newTitle: selectedNote.title, newNote: selectedNote.note, notes: dummyNotes })
  }

  submitEditedNote = (id) => {
    const dummyNotes = this.state.notes;
    let selectedNote = dummyNotes.find(note => note.id.toString() === id);
    selectedNote.title = this.state.newTitle;
    selectedNote.note = this.state.newNote;
    selectedNote.editing = false;
    const index = dummyNotes.indexOf(selectedNote);
    dummyNotes[index] = selectedNote;
    this.setState({ newTitle: '', newNote: '', notes: dummyNotes });
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal })
  }

  render() {
    return (
      <AppContainer className="App">
        <Route path='/' component={MenuBar} />
        <Route exact path='/' render={() =>
          this.state.notes.length === 0 ? <h1>Add a note!</h1>
          : <Notes notes={this.state.notes} />
        } />
        <Route path='/notes/:id' render={(props) => <NotePage {...props} editComplete={this.submitEditedNote} editStart={this.beginEditNoteHandler} change={this.onChangeHandler} notes={this.state.notes} delete={this.deleteNoteHandler} title={this.state.newTitle} note={this.state.newNote} toggle={this.toggle} modal={this.state.modal} />} />
        <Route path='/new-note' render={(props) => <NewNote {...props} addNote={this.addNewNoteHandler} title={this.state.newTitle} note={this.state.newNote} change={this.onChangeHandler} />} />
      </AppContainer>
    );
  }
}

export default App;
