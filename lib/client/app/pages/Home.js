import React from "react";
import Webcam from "react-webcam";
import axios from "axios";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webcam: false,
      data: { categories: { name: "test" } }
      recycle: {
        glass: false,
        metal: false,
        plastic: false,
        organic: false,
        paper: false,
        domestic: false,
      }
    };
    this.capture = this.capture.bind(this);
    this.setWebcam = this.setWebcam.bind(this);
    this.recommendation = this.recommendation.bind(this);
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

  recommendation() {
    
  }

  render() {
    return (
      <div className="hello-world">
        <h1>Hello World</h1>
        <p>Welcome to my world bopi</p>
        <Webcam ref={this.setWebcam} screenshotFormat="image/jpeg" />
        <button onClick={this.capture}>Capture photo</button>
        <div>Recommendation: {this.recommendation()}</div>
        <div>Result: {this.state}</div>

      </div>
    );
  }
}

export default Home;
