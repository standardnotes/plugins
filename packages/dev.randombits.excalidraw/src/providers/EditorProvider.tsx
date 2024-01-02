import React, {createContext, useContext, useEffect, useState} from 'react';
import Unsupported from "../components/Unsupported";
import Editor from "../components/Editor";
import {createNewData, parseEditorData} from "../utils";

interface IEditorContext {
  data: any;
  saveNote: () => void;
  saveNoteAndRefresh: () => void;
  isLocked: boolean;
}

const EditorContext = createContext<IEditorContext>({
  data: null,
  saveNote: null,
  saveNoteAndRefresh: null,
  isLocked: false
});

export const useEditor = () => useContext(EditorContext);

export const EditorProvider = ({text, save, isLocked}) => {
  const [data, setData] = useState(null);
  const [unsupported, setUnsupported] = useState(false);

  const eraseDataAndStartNewNote = () => {
    setUnsupported(false);
    const newData = createNewData();
    setData(newData);
    saveNote(newData);
  };

  const saveNote = (dataToSave = data) => {
    save(dataToSave);
  };

  const saveNoteAndRefresh = () => {
    setData({...data});
    saveNote();
  };

  useEffect(() => {
    if (text) {
      const parsedData = parseEditorData(text);
      if (parsedData) {
        // data that matches our extension
        setData(parsedData);
        setUnsupported(false);
      } else {
        // invalid data
        setData(null);
        setUnsupported(true);
      }
    } else {
      // new note
      const newData = createNewData();
      setData(newData);
      setUnsupported(false);
      saveNote(newData);
    }
  }, [text]);

  const renderContent = () => {
    if (data) {
      return <Editor/>;
    } else if (unsupported) {
      return <Unsupported eraseFn={eraseDataAndStartNewNote}></Unsupported>;
    } else {
      return <div>Loading...</div>
    }
  };

  return (
    <EditorContext.Provider value={{data, saveNote, saveNoteAndRefresh, isLocked}}>
      {renderContent()}
    </EditorContext.Provider>
  );
};
