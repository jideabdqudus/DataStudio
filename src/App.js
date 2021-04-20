import React, { Fragment } from "react";

import "./style.scss";

import FirstTicker from "./components/FirstTicker/index.jsx";

import AboutCoin from "./components/About/index";
import SymbolWidget from "./components/SymbolWidget/index.jsx";
import SocialButtons from "./components/SocialButtons/index.jsx";
import CryptoWidget from "./components/CryptoWidget/index.jsx";
import MiniChart from "./components/MiniChart/index.jsx";
import News from "./components/News/index.jsx";
import "./style.scss";
import Binance from "./assets/Binance.png";
import Kraken from "./assets/Kraken.png";

import { Col, Row } from "antd";

const titleDataStudio = (
  <Fragment>
    <h1 className="heading-text">Data Studio</h1>
  </Fragment>
);

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      from: "BTC",
      to: "USD",
      exchangeName: "",
      exchangeQuotes: [
        "BNB",
        "BTC",
        "USDT",
        "WIN",
        "ETH",
        "HOT",
        "TRX",
        "NEO",
        "UNI",
        "CAKE",
      ],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeTo = this.handleChangeTo.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSearchTo = this.onSearchTo.bind(this);
  }

  decideLogo(exchange) {
    if ((exchange = "binance")) {
      return <img src={Binance} width="20px" alt="Binance" />;
    } else if ((exchange = "kraken")) {
      return <img src={Kraken} width="20px" alt={"Kraken"} />;
    } else {
      return null;
    }
  }

  handleChange(value) {
    this.setState({
      from: value,
    });
  }

  handleChangeTo(value) {
    this.setState({
      to: value,
    });
  }

  onSearch(value) {
    this.setState({
      from: value,
    });
  }

  onSearchTo(value) {
    this.setState({
      to: value,
    });
  }

  render() {
    const { from, to, exchangeName, exchangeQuotes } = this.state;

    return (
      <div className="container">
        <Fragment>
          <Fragment>
            {titleDataStudio}
            <div>
              <div className={"margin-bottom-20"}>
                {" "}
                <div className={"block-display"}>
                  <h4 className={"small-text"}>Top movers</h4>
                  <FirstTicker />
                </div>
              </div>

              <Fragment>
                <SymbolWidget
                  from={from}
                  to={to}
                  exchangeName={exchangeName}
                  exchangeQuotes={exchangeQuotes}
                  decideLogo={this.decideLogo}
                  handleChange={this.handleChange}
                  handleChangeTo={this.handleChangeTo}
                  handleSelectedExchange={this.handleSelectedExchange}
                  onSearch={this.onSearch}
                  onSearchTo={this.onSearchTo}
                />
              </Fragment>

              <Row>
                <Col xs={{ span: 24 }} lg={{ span: 18 }}>
                  <AboutCoin />
                  <Fragment>
                    <SocialButtons />
                  </Fragment>
                  <div className={"margin-bottom-20"}>
                    <h1 className={"sub-heading"}>Watchlist</h1>
                    <Row>
                      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                        <MiniChart exchangeName={exchangeName} />
                      </Col>
                    </Row>
                  </div>
                  <div style={{ marginTop: "30px" }}>
                    <h1 className="sub-heading">Today's Prices</h1>
                    <CryptoWidget />
                  </div>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 5 }}>
                  <Row>
                    <div
                      label="News"
                      className="infotab-list-active"
                      style={{
                        height: "35px",
                        marginBottom: "10px",
                        fontSize: "20px",
                        fontWeight: "600",
                        textAlign: "center",
                        marginTop: "20px",
                      }}
                    >
                      News
                    </div>
                    <News />
                  </Row>
                </Col>
              </Row>
            </div>
          </Fragment>
        </Fragment>
        <code style={{ color: "white", textAlign: "center", alignItems:"center" }}>
          {" "}
          Built by{" "}
          <a href="https://abdulqudus.com" target="__blank">
            Jide Abdul-Qudus
          </a>
        </code>
      </div>
    );
  }
}

export default App;
