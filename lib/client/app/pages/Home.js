import React from "react";
import Webcam from "react-webcam";
import axios from "axios";
import JSONPretty from "react-json-pretty";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webcam: false,
      data: {}
    };
    this.capture = this.capture.bind(this);
    this.setWebcam = this.setWebcam.bind(this);
  }

  capture() {
    console.log(this.state.webcam.getScreenshot());

    axios
      .post("/images/base64", {
        image: this.state.webcam.getScreenshot()
      })
      .then(response => {
        this.setState({ data: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  setWebcam(webcam) {
    this.setState({ webcam: webcam });
  }

  render() {
    return (
      <div className="hello-world">
        <h1>Hello World</h1>
        <p>Welcome to my world</p>
        <Webcam ref={this.setWebcam} screenshotFormat="image/jpeg" />
        <button onClick={this.capture}>Capture photo</button>

        <JSONPretty id="json-pretty" data={this.state.data}></JSONPretty>
      </div>
    );
  }
}

export default Home;