import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import "./coolquiz.html";
import "./coolquiz.css";

class Question extends React.Component {
  state = {
    state: "question",
    value: "",
  };

  render() {
    const id = `q-${Math.floor(Math.random() * Math.pow(10, 8))}`;
    return (
      <div className={`${this.props.style}-style-question`}>
        {(() => {
          switch (this.state.state) {
            case "question":
              return (
                <form onSubmit={this.handleSubmit}>
                  <label htmlFor={id}>
                    <span className="question-num">
                      question {this.props.i}:{" "}
                    </span>
                    <span className="question-text">{this.props.question}</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id={id}
                      onChange={this.handleChange}
                      value={this.state.value}
                      autoFocus
                      autoComplete="off"
                    />
                  </div>
                </form>
              );
            case "wrong":
              return <p className="wrong-answer">{this.props.wrong}</p>;
            case "correct":
              return <p className="correct-answer">{this.props.correct}</p>;
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
      this.setState({ state: "correct" });
    } else {
      this.setState({ state: "wrong" });
    }
  };
}

class Question1 extends React.Component {
  render() {
    return (
      <Question
        i={1}
        question="Do you watch flight of the conchords?"
        style="terminal"
        wrong="Only cool people would know the right answer."
        correct="That's right you do"
        onSubmit={this.props.onSubmit}
      />
    );
  }
}

function Question2(props) {
  return (
    <Question
      i={2}
      question="Do you stay up past 10 pm?"
      style="modern"
      wrong="Only lame-o people go to bed early"
      correct="Damn straight"
      onSubmit={props.onSubmit}
    />
  );
}

function Question3(props) {
  return (
    <Question
      i={3}
      question="Are you ready to party?"
      style="party"
      wrong="Only party people can get past this question"
      correct="Party on"
      onSubmit={props.onSubmit}
    />
  );
}

function Question4(props) {
  return (
    <Question
      i={4}
      question="Are you free May 26th, 2019?"
      style="big"
      wrong="That's a bummer, I guess you're not cool."
      correct="Damn right you do"
      onSubmit={props.onSubmit}
    />
  );
}

class Quiz extends React.Component {
  state = {
    q1: " ",
    q2: " ",
    q3: " ",
    q4: " ",
  };

  render() {
    // no fragments with babel 6 :(
    return [
      <Question1 key="q1" onSubmit={this.handleSubmitQ1} />,
      this.state.q1 && <Question2 key="q2" onSubmit={this.handleSubmitQ2} />,
      this.state.q2 && <Question3 key="q3" onSubmit={this.handleSubmitQ3} />,
      this.state.q3 && <Question4 key="q4" onSubmit={this.handleSubmitQ4} />,
    ];
  }

  handleSubmitQ1 = value => {
    this.setState({ q1: value });
  };

  handleSubmitQ2 = value => {
    this.setState({ q2: value });
  };

  handleSubmitQ3 = value => {
    this.setState({ q3: value });
  };

  handleSubmitQ4 = value => {
    this.setState({ q4: value });
  };
}

ReactDOM.render(<Quiz />, document.getElementById("root"));
