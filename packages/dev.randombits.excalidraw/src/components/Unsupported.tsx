import React from 'react';

type Props = {
  eraseFn: () => void;
}

const Unsupported = ({eraseFn}: Props) => {
  return (
    <div className="main">
      <p>The existing note is not compatible with this editor. You have two options:</p>
      <p>1. Switch to a different editor. Your data will be maintained.</p>
      <p>2. Click the "Erase and Continue" button below to erase your note data and start using this
        editor.</p>
      <p>
        <button onClick={eraseFn}>Erase and Continue</button>
      </p>
    </div>
  );
}

export default Unsupported
