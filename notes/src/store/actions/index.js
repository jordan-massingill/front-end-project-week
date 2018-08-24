import React from 'react';
import { FETCHING_NOTES, NOTES_FETCHED, FETCHING_NOTE, NOTE_FETCHED, EDIT_NOTE, SAVING_NOTE, NOTE_SAVED, DELETING_NOTE, NOTE_DELETED, ADD_NOTE, ERROR } from '../action-types';
import axios from 'axios';

export const loadPage = () => {
  return function(dispatch) {
  dispatch({type: FETCHING_NOTES, message: 'Loading notes...'});
  axios.get('https://killer-notes.herokuapp.com/note/get/all')
  .then(response => {
      dispatch({type: NOTES_FETCHED, payload: response.data});
      console.log(response.data);
    })
  .catch(error => {
    dispatch({type: ERROR, message: 'Oops! We couldn\'t retrieve your notes :('})
  })
  }
};

export const singleNoteView = (id) => {
  return function(dispatch) {
    dispatch({type: FETCHING_NOTE, payload: id, message: 'Loading your note...'});
    axios.get(`https://killer-notes.herokuapp.com/note/get/${id}`)
    .then(response => {
      console.log(response);
      if (response === undefined) {
        dispatch({type: ERROR, message: 'Oops! We couldn\'t retrieve your notes :('})
    } else {
      dispatch({type: NOTE_FETCHED, payload: response})
    }
  })
  .catch(error => {
    dispatch.catch(error => {
      dispatch({type: ERROR, message: 'Oops! We couldn\'t retrieve your note :('})
    })
  })
}
}

export const editNote = (note) => {
  return function(dispatch) {
    dispatch({type: EDIT_NOTE, payload: note});
  }
}

export const saveNewNote = (note) => {
  return function(dispatch) {
    dispatch({type: SAVING_NOTE, payload: note, message: 'Saving your note...'});
    axios.post('https://killer-notes.herokuapp.com/note/create', note)
    .then(response => {
      dispatch({type: NOTE_SAVED, payload: response, message: `Your note was saved with the following id number: ${response}. Taking you home...`});
    })
  }
}

export const saveEditedNote = (note) => {
  return function(dispatch) {
    dispatch({type: SAVING_NOTE, payload: note, message: 'Saving your changes...'});
    axios.put(`https://killer-notes.herokuapp.com/note/edit/${note._id}`, note)
    .then(response => {
      dispatch({type: NOTE_SAVED, payload: response, message: `Changes to your note \"${response.title}\" have been saved! Taking you home...`});
    })
  }
}

export const deleteNote = (note) => {
  return function(dispatch) {
    dispatch({type: DELETING_NOTE, payload: note, message: `Sending \"${note.title}\" to the garbage...`});
    axios.delete(`https://killer-notes.herokuapp.com/note/delete/${note._id}`)
    .then(response => {
      dispatch({type: NOTE_DELETED, message: 'Your note is toast! Taking you home...'});
    })
  }
}

export const addNote = () => {
  return function(dispatch) {
    dispatch({type: ADD_NOTE})
  }
}