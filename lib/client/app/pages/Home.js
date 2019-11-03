import React from "react";
import Webcam from "react-webcam";
import axios from "axios";
import JSONPretty from "react-json-pretty";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';



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

    const useStyles = makeStyles(theme => ({
      root: {
        flexGrow: 1,
      },
      paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      },
    }));

    this.capture = this.capture.bind(this);
    this.setWebcam = this.setWebcam.bind(this);
    this.recommendation = this.recommendation.bind(this);
  }


  capture() {
    axios
      .post("/images/base64", {
        image: this.state.webcam.getScreenshot()
      })
      .then(response => {
        this.setState({ data: response.data }, () => {
          this.recommendation();
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  setWebcam(webcam) {
    this.setState({ webcam: webcam });
  }

  recommendation() {
    const tagFinder = (...tags) => {
      const azureTags = this.state.data.tags.map(tag => tag.name);
      return tags.filter(tag => azureTags.includes(tag));
    };

    this.setState({
      recycle: {
        glass: tagFinder(
          "jar", 
          "wine", 
          "wine bottle", 
          "mason jar"
        ), 
        plastic: tagFinder(
          "water bottle",
          "plastic bottle",
          "plastic",
          "bottled water"
        ),
        organic: tagFinder(
          "fruit",
          "peel",
          "banana",
          "vegetable",
          "natural food",
          "apple",
          "produce"
        ),
        paper: tagFinder(
          "newspaper", 
          "handwriting"
        ),
        metal: tagFinder(
          "tin",
          "can",
          "aluminum",
          "tin",
          "tin can",
          "aluminum can",
          "beverage can"
        ),
        domestic: tagFinder(
          "plastic bag"
        )
      }
    });
  }

  render() {
    const videoConstraints = {
      facingMode: "environment"
    };


    return (
      <div className="hello-world">
        <Webcam
          onClick={this.capture}
          ref={this.setWebcam}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
          <Button variant="contained" color="primary" onClick={this.capture}>
            Hello World
          </Button>
        <button onClick={this.capture}>Capture photo</button>

        <h2>Decision: </h2>
        <JSONPretty id="json-pretty" data={this.state.recycle}></JSONPretty>

        <h2>Azure Output</h2>
        <JSONPretty id="json-pretty" data={this.state.data}></JSONPretty>
        </div>
    );
  }
}

export default Home;
