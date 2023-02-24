import "./App.css";
import React, { Component } from "react";
import { find } from "lodash";
import { Slider } from "@mui/material";

const synth = window.speechSynthesis;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      voicelist: synth.getVoices(),
      value: "",
      rate: 0.4,
      pitch: 1,
    };

    //To get voices in beg. by manually firing event
    synth.onvoiceschanged = () => {
      const voices = synth.getVoices();
      this.setState({ voicelist: voices });
    };

    this.speakfnc = this.speakfnc.bind(this);
    this.textchange = this.textchange.bind(this);
    this.langchng = this.langchng.bind(this);
    this.onRateChange = this.onRateChange.bind(this);
    this.onPitchChange = this.onPitchChange.bind(this);
  }

  getVoices = () => {
    this.setState({ voicelist: synth.getVoices() });
  };

  speakfnc() {
    console.log("speakfnc called");
    const speakText = new SpeechSynthesisUtterance(this.state.value);
    speakText.voice = this.state.currLang;
    speakText.rate = this.state.rate;
    speakText.pitch = this.state.pitch;
    synth.speak(speakText);
  }

  speakfnckey = (event) => {
    if (event.key === "Enter") {
      const speakText = new SpeechSynthesisUtterance(this.state.value);
      speakText.voice = this.state.currLang;
      synth.speak(speakText);
    }
  };

  stopfnc() {
    console.log("stopfnc called");
    synth.cancel();
  }

  textchange(event) {
    this.setState({ value: event.target.value });
  }

  langchng(event) {
    var langName = event.target.value;
    let currLang = find(this.state.voicelist, { name: langName });

    // console.log(currLang);

    this.setState({ currLang: currLang });
  }

  onRateChange(e){
    console.log('rate ==>',e.target.value)
    this.setState({ rate: e.target.value })
  }

  onPitchChange(e){
    console.log('pitch ==>',e.target.value)
    this.setState({ pitch: e.target.value })
  }

  render() {
    // console.log(this.state.voicelist);
    return (
      <div className="parent">
        <h1 className="heading">Text-to-Speech Converter</h1>
        {/* Creating Drop Down Menu using State */}
        <select className="select" onChange={this.langchng}>
          {this.state.voicelist.map((item, index) => {
            // console.log(item);
            return <option key={`${index}_${item.name}`}> {item.name} </option>;
          })}
        </select>
        <Slider
          value={this.state.rate}
          onChange={this.onRateChange}
          size="medium"
          min={0}
          max={1}
          step={0.1}
          sx={{ width: "20%" }}
          aria-label="Default"
          valueLabelDisplay="auto"
          defaultValue={0.4}
        />
        <Slider
          value={this.state.pitch}
          onChange={this.onPitchChange}
          defaultValue={1}
          size="medium"
          step={0.1}
          min={0}
          max={2}
          sx={{ width: "20%" }}
          aria-label="Default"
          valueLabelDisplay="auto"
        />
        <textarea
          onKeyUp={this.speakfnckey}
          className="textarea"
          placeholder="Enter Text to Speak"
          onChange={this.textchange}
        ></textarea>

        <div className="btnparent">
          <button className="btn" onClick={this.speakfnc}>
            Speak
          </button>

          <button className="btn" onClick={this.stopfnc}>
            Stop
          </button>
        </div>
      </div>
    );
  }
}

export default App;
