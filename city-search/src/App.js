import React, { Component } from "react";
import "./App.css";

function ZipCode(props) {
  const cityComponents = [];
  // console.log(props.cityArray);
  for (let i = 0; i < props.cityArray.length; i++) {
    const currentCity = props.cityArray[i];
    // console.log(currentCity);
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
    <div className="zipCodeContainer">
      <div className="zipcode">Zipcode: {props.zipCode}</div>

      {cityComponents}
    </div>
  );
}

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
    <div className="citySearch">
      <label htmlFor="searchInput" id="searchLabel">
        City:{" "}
      </label>
      <input
        type="text"
        id="searchInput"
        value={props.value}
        onChange={props.onChange}
        placeholder="Try NYC"
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
    const currentCity = event.target.value;
    // const currentZip = "10016";
    this.setState({
      value: currentCity,
    });

    const url = "/city/";
    const myRequest = url + currentCity.toUpperCase();
    let zipCodeArray = [];
    let promiseArray = [];
    let zipCodeArrayStates = [];
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
        // console.log(data);
        // this.setState({
        //   results: data,
        // })
        zipCodeArray = data;
        for (let i = 0; i < zipCodeArray.length; i++) {
          const url = "/zip/";
          const myRequest = url + zipCodeArray[i];
          //console.log(myRequest);
          promiseArray.push(
            fetch(myRequest).then((response) => {
              const contentType = response.headers.get("content-type");
              if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Oops, we haven't got JSON!");
              }
              return response.json();
            })
          );
        }
        return Promise.all(promiseArray);
      })
      .then((data) => {
        //  console.log(data);
        let results = [];
        for (let i = 0; i < data.length; i++) {
          results.push([]);
        }
        this.setState({
          results: data,
        });
      })
      .catch((error) => {
        // console.error(error)
        this.setState({
          results: [],
        });
      });
  }
  render() {
    const results = this.state.results;
    //console.log(results);
    const zipComponents = [];
    for (let i = 0; i < results.length; i++) {
      const currentZip = results[i];
      zipComponents.push(
        <ZipCode
          key={i}
          zipCode={results[i][0]["Zipcode"]}
          cityArray={results[i]}
        />
      );
    }
    // console.log(zipComponents);
    return (
      <div className="App">
        <div className="App-header">
          <h2>City Search</h2>
        </div>
        <ZipSearchField
          value={this.state.value}
          onChange={(event) => this.handleChange(event)}
        />
        <div className="cityContainer">
          {zipComponents.length === 0 ? (
            <div className="noResults">No Results</div>
          ) : (
            <div>{zipComponents}</div>
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
