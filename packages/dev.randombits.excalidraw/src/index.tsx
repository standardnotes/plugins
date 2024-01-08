import React from 'react';

import './index.css';
import {createRoot} from "react-dom/client";
import {EditorProvider} from "./providers/EditorProvider";
import ComponentRelay from "@standardnotes/component-relay";
import {AppDataField} from "@standardnotes/models";

let currentNote;

const componentRelay = new ComponentRelay({
  targetWindow: window,
  options: {
    coallesedSaving: true,
    coallesedSavingDelay: 400,
    debug: false
  }
});

const root = createRoot(document.getElementById('root'));
componentRelay.streamContextItem((note) => {
  currentNote = note;
  // Only update UI on non-metadata updates.
  if (note.isMetadataUpdate) {
    return;
  }
  const text = note.content?.text || '';
  const isLocked = componentRelay.getItemAppDataValue(note, AppDataField.Locked);

  root.render(
    <React.StrictMode>
      <EditorProvider text={text} save={save} isLocked={isLocked}/>
    </React.StrictMode>
  );
});

const save = (data: any) => {
  componentRelay.saveItemWithPresave(currentNote, () => {
    currentNote.content.text = JSON.stringify(data);
    currentNote.content.preview_plain = '';
  });
};
