import React from 'react';
import { c } from 'ttag';

type Props = {
  eraseFn: () => void;
}

const Unsupported = ({eraseFn}: Props) => {
  return (
    <div className="main">
      <p>{c('Plugins.Excalidraw.Info').t`The existing note is not compatible with this editor. You have two options:`}</p>
      <p>{c('Plugins.Excalidraw.Info').t`1. Switch to a different editor. Your data will be maintained.`}</p>
      <p>
        {c('Plugins.Excalidraw.Info')
          .t`2. Click the "Erase and Continue" button below to erase your note data and start using this editor.`}
      </p>
      <p>
        <button onClick={eraseFn}>{c('Plugins.Excalidraw.Action').t`Erase and Continue`}</button>
      </p>
    </div>
  );
}

export default Unsupported
