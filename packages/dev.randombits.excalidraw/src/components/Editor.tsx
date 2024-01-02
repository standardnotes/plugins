import React, {useRef} from 'react';
import {Excalidraw, getSceneVersion} from "@excalidraw/excalidraw";
import {useEditor} from "../providers/EditorProvider";

const Editor = () => {
  const {data, saveNote, isLocked} = useEditor();
  const el = useRef();
  let lastVersion = getSceneVersion(data.elements);
  let libraryCnt = data.libraryItems?.length || 0;

  const UIOptions = {
    canvasActions: {
      toggleTheme: true
    },
  };

  const onChange = (elements, appState, files) => {
    const newVersion = getSceneVersion(elements);
    if (newVersion > lastVersion) {
      lastVersion = newVersion;
      data.elements = elements;
      if (Object.keys(files).length !== 0) {
        //non empty files
        data.files = files;
      } 

      // if (Object.keys(appState).length !== 0) {
      //   //non empty appState
      //   data.appState = appState;
      // } 
      saveNote();
    }
  };

  const onLibraryChange = (libraryItems) => {
    const newCtn = libraryItems.length;
    if (newCtn !== libraryCnt) {
      libraryCnt = newCtn;
      data.libraryItems = libraryItems;
      saveNote();
    }
  };

  return (
    <div className="main">
      <Excalidraw ref={el} key={Math.random()} initialData={data} theme={'dark'} onChange={onChange} onLibraryChange={onLibraryChange}
                  viewModeEnabled={isLocked} UIOptions={UIOptions}/>
    </div>
  );
}

export default Editor
