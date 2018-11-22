import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class EditorButton extends Component {
  handleClick = e => {
    const command = this.props.command;
    const blockStyle =
      typeof(this.props.blockStyle) !== 'undefined' && this.props.blockStyle !== ''
      ? this.props.blockStyle
      : null;
    
    document.execCommand(command, false, blockStyle);
  };
  
  render() {
    return (
      <button
        className="btn toolbar-command"
        onMouseDown={this.handleClick}>
        <FontAwesomeIcon icon={this.props.icon} />
      </button>
    );
  }
}

export default EditorButton;
