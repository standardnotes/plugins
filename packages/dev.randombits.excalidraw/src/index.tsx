import React from 'react';

import './index.css';
import {createRoot} from "react-dom/client";
import {EditorProvider} from "./providers/EditorProvider";
import snApi from "sn-extension-api";

snApi.initialize({debounceSave: 400});

const root = createRoot(document.getElementById('root'));
snApi.subscribe(() => {
  root.render(
      <React.StrictMode>
        <EditorProvider/>
      </React.StrictMode>
  );
});
