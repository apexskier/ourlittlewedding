import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import "./coolquiz.html";
import "./coolquiz.css";

class Question1 extends React.Component {
  state = {
    state: "question",
    value: "",
  };

  render() {
    return (
      <div className="question-1">
        {(() => {
          switch (this.state.state) {
            case "question":
              return (
                <form onSubmit={this.handleSubmit}>
                  <label htmlFor="q-1">
                    Question 1: Do you listen to flight of the conchords?
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="q-1"
                      onChange={this.handleChange}
                      value={this.state.value}
                      autoFocus
                      autoComplete="off"
                    />
                  </div>
                </form>
              );
            case "wrong":
              return <p>Only cool people would know the right answer.</p>;
            case "right":
              return <p>Damn right you do</p>;
          }
        })()}
      </div>
    );
  }

  handleChange = ev => {
    this.setState({ value: ev.target.value });
  };

  handleSubmit = ev => {
    ev.preventDefault();
    if (this.state.value.toLowerCase().startsWith("y")) {
      this.props.onSubmit(this.state.value);
      this.setState({ state: "right" });
    } else {
      this.setState({ state: "wrong" });
    }
  };
}

class Question2 extends React.Component {
  state = {
    state: "question",
    value: "",
  };

  render() {
    return (
      <div className="question-1">
        {(() => {
          switch (this.state.state) {
            case "question":
              return (
                <form onSubmit={this.handleSubmit}>
                  <label htmlFor="q-2">
                    Question 2: Do you like home brewing?
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="q-2"
                      onChange={this.handleChange}
                      value={this.state.value}
                      autoFocus
                      autoComplete="off"
                    />
                  </div>
                </form>
              );
            case "wrong":
              return <p>Only cool people would know the right answer.</p>;
            case "right":
              return <p>Damn right you do</p>;
          }
        })()}
      </div>
    );
  }

  handleChange = ev => {
    this.setState({ value: ev.target.value });
  };

  handleSubmit = ev => {
    ev.preventDefault();
    if (this.state.value.toLowerCase().startsWith("y")) {
      this.props.onSubmit(this.state.value);
      this.setState({ state: "right" });
    } else {
      this.setState({ state: "wrong" });
    }
  };
}

class Quiz extends React.Component {
  state = {
    q1: "",
    q2: "",
  };

  render() {
    // no fragments with babel 6 :(
    return [
      <Question1 key="q1" onSubmit={this.handleSubmitQ1} />,
      this.state.q1 && <Question2 key="q2" onSubmit={this.handleSubmitQ2} />,
    ];
  }

  handleSubmitQ1 = value => {
    this.setState({ q1: value });
  };

  handleSubmitQ2 = value => {
    this.setState({ q2: value });
  };
}

ReactDOM.render(<Quiz />, document.getElementById("root"));
