import React from "react";
import ReactDOM from "react-dom";
import "./coolquiz.html";
import "./coolquiz.css";

class Question1 extends React.Component {
  state = {
    value: "",
  };

  render() {
    return (
      <form className="question-1" onSubmit={this.handleSubmit}>
        <label htmlFor="q-1">
          Question 1: Do you listen to flight of the conchords?
        </label>
        <div class="input-wrapper">
          <input
            id="q-1"
            onChange={this.handleChange}
            value={this.state.value}
            autoFocus
          />
        </div>
      </form>
    );
  }

  handleChange = ev => {
    this.setState({ value: ev.target.value });
  };

  handleSubmit = () => {
    console.log({ question1: this.state.value });
  };
}

function Quiz() {
  return <Question1 />;
}

ReactDOM.render(<Quiz />, document.getElementById("root"));
