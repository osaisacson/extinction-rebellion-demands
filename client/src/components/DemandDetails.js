import React, { Component } from "react";
import axios from "axios";

import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

import References from "./DemandComponents/References";
import Description from "./DemandComponents/Description";
import Header from "./DemandComponents/Header";

import Voting from "./Voting";

import { TwitterHashtagButton } from "react-twitter-embed";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faBookOpen,
  faHashtag,
  faFistRaised,
  faCheck,
  faWrench
} from "@fortawesome/free-solid-svg-icons";

export default class DemandDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      demand: "",
      isLoading: true,
      actions: [],
      currentDemandId: props.match.params.id,
      isSuggested: props.isSuggested,
      isSent: props.isSent,
      showDemandSection: false,
      showReferencesSection: false,
      showRebelSection: false
    };

    this.handleDemandClick = this.handleDemandClick.bind(this);
    this.handleReferencesClick = this.handleReferencesClick.bind(this);
    this.handleRebelClick = this.handleRebelClick.bind(this);
  }

  componentDidMount() {
    this.getDemand();
    this.getActions();
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    let demandId = this.props.match.params.id;
    axios
      .all([
        axios.get(`http://localhost:3001/api/demands/${demandId}`),
        axios.get("http://localhost:3001/api/actions")
      ])
      .then(
        axios.spread((demand, actions) => {
          const actionsArray = actions.data;
          const criteria = this.state.currentDemandId;
          const demandActions = actionsArray.filter(
            item => item.demandId === criteria
          );
          this.setState({
            demand: demand.data,
            actions: demandActions,
            isLoading: false
          });
        })
      )
      .catch(err => console.log("error in DemandDetails.js:getData()", err));
  }

  render() {
    const { isSuggested, demand } = this.state;

    let cardBackgroundType = demand.isBeingDefined ? "suggested" : "sent";

    return (
      <>
        {/* Back, edit, delete */}
        <Link className="btn grey" to={"/"}>
          Back
        </Link>
        <Link className="btn" to={`/demands/edit/${demand.id}`}>
          Edit
        </Link>
        <button className="btn red light">Delete</button>

        {/* Details for item */}
        <div className={`card-wrapper ${cardBackgroundType}`} key={demand.id}>
          {/* Section with votes, appears outside toggle so can use the voting functionality */}
          <Voting votes={demand.votes} isSent={demand.isSent} />

          <Accordion defaultActiveKey="0">
            <Card>
              <div className="demand-header">
                {/* Status */}
                {!isSuggested && demand.status ? (
                  <p className={`pill ${demand.isRebel ? "red" : "darkblue"}`}>
                    {demand.status}
                  </p>
                ) : null}
                {/* Country */}
                <h6>
                  {demand.city}, <span className="bold">{demand.country}</span>
                </h6>

                {/* Main card header */}
                <h5>{demand.title}</h5>
              </div>
              <div className="separator"></div>

              {/* TRIGGERS */}
              <div className="card-stats-section flex-spread">
                {/* Show full demand */}
                <Accordion.Toggle
                  as={Card.Header}
                  eventKey="0"
                  className="icon-section"
                  onClick={this.handleDemandClick}
                >
                  {demand.isSent ? (
                    <>
                      <FontAwesomeIcon icon={faBook} />
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="green-color icon-margin-left"
                      />
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faBookOpen} />

                      <FontAwesomeIcon
                        icon={faWrench}
                        className="icon-margin-left"
                      />
                    </>
                  )}
                </Accordion.Toggle>

                {/* Show references */}
                <Accordion.Toggle
                  as={Card.Header}
                  eventKey="1"
                  className="icon-section"
                  onClick={this.handleReferencesClick}
                >
                  <FontAwesomeIcon icon={faHashtag} />
                </Accordion.Toggle>
                {/* Show rebel actions */}
                <Accordion.Toggle
                  as={Card.Header}
                  eventKey="2"
                  className="icon-section"
                  onClick={this.handleRebelClick}
                >
                  <h6>{this.state.actions ? this.state.actions.length : 0}</h6>
                  <FontAwesomeIcon icon={faFistRaised} />
                </Accordion.Toggle>
              </div>

              {/* CONTENT */}

              {/* Demand section */}
              {this.state.showDemandSection ? (
                <>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <div>
                        {/* Summary section*/}

                        {isSuggested ? (
                          <>
                            <div className="tight-header">
                              <h6>Being defined. Edit and add below.</h6>
                            </div>
                            <div className="separator"></div>
                          </>
                        ) : null}
                      </div>
                      <p>Disabled for a sec while hooking up real data.</p>
                      {/* <Header
                    postedBy={demand.postedBy}
                    representative={demand.representative}
                    timeSent={demand.timeSent}
                  />
                  <div className="separator"></div>
                  <Description card={demand} /> */}
                    </Card.Body>
                  </Accordion.Collapse>
                </>
              ) : null}

              {/* References section */}
              {this.state.showReferencesSection && demand.id ? (
                <>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>
                      <h6>
                        To add references that support this demand:
                        <TwitterHashtagButton
                          tag={demand.id}
                          options={{
                            size: "large",
                            screenName: null,
                            buttonHashtag: null
                          }}
                        />
                        Your tweet will automatically be pulled into the feed
                        below.
                      </h6>
                      <References hashtag={demand.id} />
                    </Card.Body>
                  </Accordion.Collapse>
                </>
              ) : null}

              {/* Action section */}
              {this.state.showRebelSection ? (
                <>
                  <Accordion.Collapse eventKey="2">
                    <Card.Body>
                      {this.state.actions ? (
                        <>
                          <h6>
                            Join by indicating so on the right, you'll get sent
                            a telegram invitation with more info.
                          </h6>
                          {this.state.actions.map(action => {
                            return (
                              <div className="rebel-card" key={action.id}>
                                {/* Joined people */}
                                <Voting
                                  showAsRebel={true}
                                  votes={action.joined ? action.joined : 0}
                                ></Voting>
                                <div className="rebel-content">
                                  <div>
                                    <h6 className="bold">
                                      {action.date}, {action.time}
                                    </h6>
                                    <h6>{action.details}</h6>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      ) : null}
                      {!this.state.actions ? (
                        <>
                          <br></br>
                          <h6>There are no actions yet, start one below</h6>
                        </>
                      ) : null}
                      <div className="separator"></div>
                      <br></br>
                      <h6>
                        Create new action. Handle all communication for this
                        action via telegram, so start by{" "}
                        <a href="https://blog.en.uptodown.com/how-to-create-groups-and-channels-telegram/">
                          creating a group on telegram
                        </a>{" "}
                        and adding the name of it below.
                      </h6>
                      <form action="/" method="post">
                        <div className="flex-spread">
                          <div className="form-group">
                            <label htmlFor="date"></label>
                            <input
                              type="text"
                              className="form-control"
                              id="date"
                              placeholder="Date"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="time"></label>
                            <input
                              type="text"
                              className="form-control"
                              id="time"
                              placeholder="Time"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="where"></label>
                          <input
                            type="text"
                            className="form-control"
                            id="where"
                            placeholder="Where"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="description"></label>
                          <input
                            type="text"
                            className="form-control"
                            id="notes"
                            placeholder="Notes"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="telegram"></label>
                          <input
                            type="text"
                            className="form-control"
                            id="telegram"
                            placeholder="Telegram"
                          />
                        </div>
                      </form>
                      <br></br>
                      <h5>Add new action</h5>
                      <br></br>
                    </Card.Body>
                  </Accordion.Collapse>
                </>
              ) : null}
            </Card>
          </Accordion>
        </div>
      </>
    );
  }

  handleDemandClick() {
    this.setState({
      showDemandSection: true,
      showReferencesSection: false,
      showRebelSection: false
    });
  }

  handleReferencesClick() {
    this.setState({
      showDemandSection: false,
      showReferencesSection: true,
      showRebelSection: false
    });
  }

  handleRebelClick() {
    this.setState({
      showDemandSection: false,
      showReferencesSection: false,
      showRebelSection: true
    });
  }
}