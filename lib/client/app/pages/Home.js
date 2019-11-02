import React from "react";
import Webcam from "react-webcam";
import axios from "axios";
import JSONPretty from "react-json-pretty";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webcam: false,
      data: {},
      recycle: {
        glass: false,
        metal: false,
        plastic: false,
        organic: false,
        paper: false,
        domestic: false
      }
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
    const videoConstraints = {
      facingMode: "environment"
    };

    return (
      <div className="hello-world">
        <h1>Hello World</h1>
        <p>Welcome to my world</p>
        <Webcam
          onClick={this.capture}
          ref={this.setWebcam}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
        <button onClick={this.capture}>Capture photo</button>

        <JSONPretty id="json-pretty" data={this.state.data}></JSONPretty>
      </div>
    );
  }
}

export default Home;
