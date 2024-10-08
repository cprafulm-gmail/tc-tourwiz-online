import React from "react";

export default class FileBase64 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    };
  }

  handleChange(e) {
    // get the files
    let files = e.target.files;

    // Process each file
    var allFiles = [];
    for (var i = 0; i < files.length; i++) {
      let file = files[i];

      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        let fileInfo = {
          name: file.name,
          type: file.type,
          size: Math.round(file.size / 1000) + " kB",
          base64: reader.result,
          file: file
        };

        // Push it to the state
        allFiles.push(fileInfo);

        // If all files have been proceed
        if (allFiles.length === files.length) {
          // Apply Callback function
          if (this.props.multiple) this.props.onDone(allFiles);
          else this.props.onDone(allFiles[0]);
        }
      };
    }
  }

  render() {
    let culture = "custom-file-label " + localStorage.getItem("lang");
    return (
      <div
        className={
          "form-group col-lg-9 pull-left w-75 p-0 " +
          this.props.name +
          " " +
          this.props.className
        }
      >
        <label htmlFor={this.props.name}>{this.props.label}</label>
        {this.props.msg && <label style={{
          float: "right", fontSize: "12px",
          paddingTop: "6px",
          fontWeight: "600",
          color: "#5e6266"
        }}>{this.props.msg}</label>}
        <div className="custom-file">
          <input
            className="custom-file-input w-100"
            type="file"
            onChange={this.handleChange.bind(this)}
            multiple={this.props.multiple}
            lang="es"
          />
          {/* <input type="file" className="custom-file-input" id="customFileLang" lang="es" /> */}
          <label className={culture} htmlFor="customFileLang">
            {this.props.placeholder}
          </label>
        </div>
      </div>
    );
  }
}

FileBase64.defaultProps = {
  multiple: false
};
