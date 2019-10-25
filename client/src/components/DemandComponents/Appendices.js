import React, { Component } from "react";

export default class Appendices extends Component {
  // Then we add our constructor which receives our props
  constructor(props) {
    super(props);

    this.state = {
      appendices: this.props.appendices
    };
  }

  render() {
    return (
      <>
        <h6 className="bold">References</h6>
        {this.state.appendices.length > 0 ? (
          <ul>
            {this.state.appendices.map(function(item) {
              return (
                <React.Fragment key={item.id}>
                  <li className="appendice">
                    <a href={item.href}>{item.title}</a>
                    <div>
                      {item.source}, {item.date}
                    </div>
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        ) : (
          <ul>
            <li>Add references here</li>
          </ul>
        )}
      </>
    );
  }
}