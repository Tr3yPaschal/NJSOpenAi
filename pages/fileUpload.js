import React from "react";

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileContent: ""
    };
  }

  handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      this.setState({ fileContent: content });
      // Call the callback function passed from the parent component
      this.props.onFileContent(content);
    };

    reader.readAsText(file);
  };

  render() {
    return (
      <div>
        <input type="file" onChange={this.handleFileUpload} />
        <div>{this.state.fileContent}</div>
      </div>
    );
  }
}

export default FileUpload;