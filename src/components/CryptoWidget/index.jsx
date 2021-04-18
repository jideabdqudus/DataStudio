import React from "react";
class CryptoWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    this._ref = React.createRef();
  }
  componentDidMount() {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "798",
      defaultColumn: "overview",
      screener_type: "crypto_mkt",
      displayCurrency: "BTC",
      colorTheme: "dark",
      locale: "uk",
      isTransparent: true,
    });
    document.getElementById("myContainer5").appendChild(script);
    this._ref.current.appendChild(script);
  }
  render() {
    return (
      <div id="myContainer5" style={{ marginRight: "20px" }}>
        <div className="tradingview-widget-container" ref={this._ref}></div>
      </div>
    );
  }
}
export default CryptoWidget;
