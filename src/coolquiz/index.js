import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import Confetti from "./confetti";
import "./coolquiz.html";
import "./coolquiz.css";

// no fragments with babel 6 :(

const yesRegex = /\b(y|sure)/i;
const noRegex = /\b(n)/i;

class Question extends React.Component {
  state = {
    state: "question",
    value: "",
  };

  buttonRef = React.createRef();

  componentDidUpdate() {
    if (this.buttonRef.current) {
      this.buttonRef.current.focus();
    }
  }

  render() {
    const id = `q-${Math.floor(Math.random() * Math.pow(10, 8))}`;
    return (
      <div
        className={`${this.props.style || "terminal"}-style-question`}
        data-state={this.state.state}
      >
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
              return [
                <p className="wrong-answer" key="message">
                  {this.props.wrong}
                </p>,
                <p key="try-again">
                  <a href="" ref={this.buttonRef}>
                    try again
                  </a>
                </p>,
              ];
            case "correct":
              return [
                <p className="correct-answer" key="message">
                  {this.props.correct}
                </p>,
                <p key="continue">
                  <button
                    className="continue"
                    ref={this.buttonRef}
                    onClick={this.handleContinue}
                  >
                    continue
                  </button>
                </p>,
              ];
          }
        })()}
      </div>
    );
  }

  handleChange = ev => {
    this.setState({ value: ev.target.value });
  };

  handleContinue = ev => {
    ev.preventDefault();
    this.props.onContinue();
  };

  handleSubmit = ev => {
    ev.preventDefault();
    if ((this.props.test || yesRegex).test(this.state.value.toLowerCase())) {
      if (this.props.skipContinue) {
        this.props.onContinue();
      } else {
        this.setState({ state: "correct" });
      }
    } else {
      this.setState({ state: "wrong" });
    }
  };
}

class Quiz extends React.Component {
  state = {
    question: 0,
  };

  questions = [
    {
      question: "Do you watch flight of the conchords?",
      wrong: "Only a cool person would know the right answer",
      correct: "That's right you do",
    },
    {
      question: "Do you stay up past 10 pm?",
      wrong: "Only lame-o people go to bed early",
      correct: "Damn straight",
    },
    {
      question: "“reason maple speed trash”?",
      wrong: "There is no internet connection",
      correct: "ajaboi",
      test: noRegex,
    },
    {
      question: "Are you free May 26th, 2019?",
      wrong: "That's a bummer, I guess you're not cool",
      correct: "Good",
    },
    {
      style: "terminal-party",
      question: "Are you ready to party?",
      wrong: "Only party people can get past this question",
      correct: "Party on",
    },
    {
      question: "Will you be my groomsman?",
      style: "final",
      wrong: "Wrong answer",
    },
  ];

  componentDidUpdate() {
    if (this.state.question >= this.questions.length) {
      setTimeout(() => {
        window.location.href = `mailto:cheers@ourlittlewedding.love?subject=${encodeURIComponent(
          "I'm in!",
        )}`;
      }, 2000);
    }
  }

  render() {
    if (this.state.question < this.questions.length) {
      return (
        <Question
          key={this.state.question}
          i={this.state.question + 1}
          onContinue={this.handleContinue}
          skipContinue={this.state.question === this.questions.length - 1}
          {...this.questions[this.state.question]}
        />
      );
    } else {
      return (
        <div className="complete">
          <Confetti>
            <h1>Woo hoo!</h1>
          </Confetti>
        </div>
      );
    }
  }

  handleContinue = value => {
    this.setState(({ question }) => ({ question: question + 1 }));
  };
}

ReactDOM.render(<Quiz />, document.getElementById("root"));
