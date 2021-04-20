import React, { useEffect } from "react";
import axios from "axios";

const AboutCoin = () => {
  const [data, setData] = React.useState("");

  useEffect(() => {
    axios
      .get(
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=212064d6-fbec-42b3-948a-21a37d2c442f"
      )
      .then((response) => setData(response.data.data[0].quote.USD));
  }, []);
  function numberWithCommas(n) {
    const rounded = Math.round(n * 100 + Number.EPSILON) / 100;
    var parts = rounded.toString().split(".");
    let stringate =
      parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
      (parts[1] ? "." + parts[1] : "");
    return stringate;
  }

  if (Math.sign(data.percent_change_24h) === -1) {
    return (
      <div className={"about-bitcoin"}>
        <h1 className="sub-heading">About Bitcoin</h1>
        <p className="bitcoin-text">
          Bitcoin price today is{" "}
          <span className="purple-text">
            ${numberWithCommas(`${data.price}`)}
          </span>{" "}
          with a 24-hour trading volume of{" "}
          <span className="purple-text">
            ${numberWithCommas(`${data.volume_24h}`)}{" "}
          </span>
          . BTC price is down{" "}
          <span className="purple-text">
            {numberWithCommas(`${data.percent_change_24h}`)}%
          </span>{" "}
          in the last 24 hours.
        </p>
      </div>
    );
  } else if (Math.sign(data.percent_change_24h) === 1) {
    return (
      <div className={"about-bitcoin"}>
        <h1 className="sub-heading">About Bitcoin</h1>
        <p className="bitcoin-text">
          Bitcoin price today is{" "}
          <span className="purple-text">
            ${numberWithCommas(`${data.price}`)}
          </span>{" "}
          with a 24-hour trading volume of{" "}
          <span className="purple-text">
            ${numberWithCommas(`${data.volume_24h}`)}{" "}
          </span>
          . BTC price is up{" "}
          <span className="purple-text">
            {numberWithCommas(`${data.percent_change_24h}`)}%
          </span>{" "}
          in the last 24 hours.
        </p>
      </div>
    );
  } else {
    return null;
  }
};

export default AboutCoin;
