import React from 'react';
import PropTypes from 'prop-types';
import TasksManager from '@Lib/tasksManager';

export default class CreateTask extends React.Component {

  constructor(props) {
    super(props);
    this.state = { rawString: (this.props.unsavedTask || '') };
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.unsavedTask !== this.state.rawString;
  }

  componentDidUpdate(props) {
    this.setState({ rawString: props.unsavedTask });
  }

  componentDidMount() {
    if (!TasksManager.get().isMobile()) {
      this.input.focus();
    }
  }

  onTextChange = (event) => {
    // save this as the current 'unsaved' task if while we're not officially saving it as an actual task yet
    var rawString = event.target.value;
    this.props.onUpdate(rawString);
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      var rawString = event.target.value;
      if(rawString)
        this.submitTask(rawString);
    }
  }

  submitTask(value) {
    this.props.onSubmit(value);
  }

  render() {
    let placeholderText = '';

    if (TasksManager.get().showTutorial) {
      placeholderText = 'Type in your task, then press Enter.';
    }

    const { spellcheckEnabled } = TasksManager.get();

    return (
      <input
        className='create-task-input'
        ref={(ref) => {this.input = ref;}}
        placeholder={placeholderText}
        type='text'
        dir='auto'
        value={this.props.unsavedTask}
        onChange={this.onTextChange}
        onKeyPress={this.handleKeyPress}
        spellCheck={spellcheckEnabled}
        enterKeyHint={'go'}
      />
    );
  }

}

CreateTask.propTypes = {
  unsavedTask: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};
