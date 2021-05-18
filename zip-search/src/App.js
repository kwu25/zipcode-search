import React, { Component } from "react";
import "./App.css";

function City(props) {
  const name = titleCase(props.city) + ", " + props.state;
  return (
    <div className="city">
      <div className="cityName">{name}</div>
      <div className="cityDetails">
        <ul>
          <li>State: {props.state}</li>
          <li>Location: {props.location}</li>
          <li>Population: {props.population}</li>
          <li>Total Wages: {props.totalWages}</li>
        </ul>
      </div>
    </div>
  );
}

function ZipSearchField(props) {
  return (
    <div className="zipSearch">
      <label htmlFor="searchInput" id="searchLabel">
        Zip Code:
      </label>
      <input
        type="text"
        id="searchInput"
        value={props.value}
        onChange={props.onChange}
        placeholder="Try 10016"
      ></input>
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      results: [],
    };
  }
  handleChange(event) {
    const currentZip = event.target.value;
    // const currentZip = "10016";
    this.setState({
      value: currentZip,
    });

    if (currentZip.length !== 5) {
      return;
    } else {
      const url = "/zip/";
      const myRequest = url + currentZip;
      fetch(myRequest)
        .then((response) => {
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Oops, we haven't got JSON!");
          }
          return response.json();
        })
        .then((data) => {
          /* process your data further */
          console.log(data);
          this.setState({
            results: data,
          });
        })
        .catch((error) => {
          console.error(error);
          this.setState({
            results: [],
          });
        });
    }
  }
  render() {
    const results = this.state.results;
    const cityComponents = [];
    for (let i = 0; i < results.length; i++) {
      const currentCity = results[i];
      cityComponents.push(
        <City
          key={i}
          city={currentCity["City"]}
          state={currentCity["State"]}
          location={currentCity["Lat"] + ", " + currentCity["Long"]}
          population={currentCity["EstimatedPopulation"]}
          totalWages={currentCity["TotalWages"]}
        />
      );
    }

    return (
      <div className="App">
        <div className="App-header">
          <h2>Zip Code Search</h2>
        </div>
        <ZipSearchField
          value={this.state.value}
          onChange={(event) => this.handleChange(event)}
        />
        <div className="cityContainer">
          {cityComponents.length === 0 ? (
            <div className="noResults">No Results</div>
          ) : (
            cityComponents
          )}
        </div>
      </div>
    );
  }
}

function titleCase(str) {
  str = str.toLowerCase().split(" ");
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

export default App;
