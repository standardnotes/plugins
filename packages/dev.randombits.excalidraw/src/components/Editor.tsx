import React from 'react';
import {Excalidraw, Footer, getSceneVersion, MainMenu} from "@excalidraw/excalidraw";
import {useEditor} from "../providers/EditorProvider";
import snApi from "sn-extension-api";

const Editor = () => {
  const [theme, setTheme] = React.useState(snApi.extensionMeta?.theme || 'dark');
  const {data, saveNote, isLocked} = useEditor();
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

  const setThemeAndSave = (theme) => {
    setTheme(theme);
    snApi.extensionMeta = {theme};
  };

  const renderThemeBtn = () => {
    if (theme === 'dark') {
      return <button
          className="theme-btn"
          onClick={() => setThemeAndSave('light')}
      >
        <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor"
             strokeLinecap="round" strokeLinejoin="round">
          <g stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <path
                d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM10 4.167V2.5M14.167 5.833l1.166-1.166M15.833 10H17.5M14.167 14.167l1.166 1.166M10 15.833V17.5M5.833 14.167l-1.166 1.166M5 10H3.333M5.833 5.833 4.667 4.667"></path>
          </g>
        </svg>

        <span>
            Light Mode
      </span>
      </button>;

    } else {
      return <button
          className="theme-btn"
          onClick={() => setThemeAndSave('dark')}
      >
        <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor"
             strokeLinecap="round" strokeLinejoin="round">
          <path clip-rule="evenodd" d="M10 2.5h.328a6.25 6.25 0 0 0 6.6 10.372A7.5 7.5 0 1 1 10 2.493V2.5Z"
                stroke="currentColor"></path>
        </svg>
        <span>
            Dark Mode
</span>
      </button>;
    }
  };

  return (
      <div className="main">
        <Excalidraw key={Math.random()} initialData={data} theme={theme} onChange={onChange}
                    onLibraryChange={onLibraryChange}
                    viewModeEnabled={isLocked} UIOptions={UIOptions}>
          <MainMenu>
            <MainMenu.DefaultItems.LoadScene/>
            <MainMenu.DefaultItems.Export/>
            <MainMenu.DefaultItems.SaveAsImage/>
            <MainMenu.DefaultItems.ClearCanvas/>
            <MainMenu.DefaultItems.Help/>
            <MainMenu.DefaultItems.ChangeCanvasBackground/>
            <div style={{'margin-top': '5px'}}>
              {renderThemeBtn()}
            </div>
          </MainMenu>
          <Footer>
            {renderThemeBtn()}
          </Footer>
        </Excalidraw>
      </div>
  );
};

export default Editor;
