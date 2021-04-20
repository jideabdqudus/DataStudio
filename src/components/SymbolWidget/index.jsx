import React, { Fragment } from "react";
import { Select, Row, Col } from "antd";
import DropDown from "../../assets/dropdown_icon.png";
import Binance from "../../assets/Binance.png";
import Kraken from "../../assets/Kraken.png";
import Tabs from "../Tabs/index.jsx";
import ExchangeTab from "../Tabs/ExchangeTab.jsx";
import TechnicalWidget from "../TechnicalWidget/index";

const { Option } = Select;

const callBinance = (
  <Fragment>
    <img src={Binance} width="20px" alt="Binance" /> <span>Binance</span>
  </Fragment>
);
const callKraken = (
  <Fragment>
    <img src={Kraken} width="20px" alt="Kraken" /> <span>Kraken</span>
  </Fragment>
);
class SymbolWidget extends React.Component {
  render() {
    const {
      from,
      to,
      exchangeName,
      exchangeQuotes,
      decideLogo,
      handleChange,
      handleChangeTo,
      onSearch,
      onSearchTo,
    } = this.props;

    const dropIcon = <img src={DropDown} alt="DropDown" height="10" />;
    return (
      <Row>
        <Col xs={{ span: 24 }} lg={{ span: 17 }}>
          <Select
            className={`dataStudioDropdown`}
            defaultValue={"BTC"}
            style={{ background: "none", width: 110 }}
            bordered={false}
            dropdownClassName={"droppie"}
            defaultActiveFirstOption={true}
            suffixIcon={dropIcon}
            showSearch
            optionFilterProp="children"
            onChange={handleChange}
            onSearch={onSearch}
          >
            {exchangeQuotes.map((coin) => (
              <Option className={"droppieOption"} key={coin} value={coin}>
                {coin}
              </Option>
            ))}
          </Select>
          <Select
            className={`dataStudioDropdown`}
            defaultValue={"USD"}
            style={{ background: "none", width: 110 }}
            onChange={handleChangeTo}
            bordered={false}
            dropdownClassName={"droppie"}
            defaultActiveFirstOption={true}
            suffixIcon={dropIcon}
            onSearch={onSearchTo}
            optionFilterProp="children"
            showSearch
          >
            {exchangeQuotes.reverse().map((coin) => (
              <Option className={"droppieOption"} key={coin} value={coin}>
                {coin}
              </Option>
            ))}
          </Select>
          <div className="top-margin">
            <div style={{ width: "100%" }}>
              <div
                key={"Binance"}
                label={
                  <span>
                    {decideLogo(Binance)} {"Binance"}
                  </span>
                }
              ></div>
            </div>{" "}
            <div>
              <ExchangeTab>
                <div label={callBinance}></div>
                <div label={callKraken}></div>
              </ExchangeTab>
            </div>
            <Tabs>
              <div label="Simple">
                <iframe
                  id="tradingview_70ff2"
                  title="iframe"
                  src={`https://www.tradingview.com/mediumwidgetembed/?symbols=BINANCE%3A${from}${to}%7C12M&locale=en&trendLineColor=%231976d2&underLineColor=rgba(55%2C%20166%2C%20239%2C%200.15)&fontColor=%23787b86&gridLineColor=%232a2e39&width=100%25&height=100%25&colorTheme=dark&isTransparent=1&utm_source=www.tradingview.com&utm_medium=widget_new&utm_campaign=symbol-overview`}
                  style={{
                    boxSizing: "border-box",
                    height: "300px",
                    width: "100%",
                  }}
                  frameBorder="0"
                  allowtransparency="true"
                  scrolling="no"
                ></iframe>
              </div>
              <div label="Advanced">
                <iframe
                  id="tradingview_3ebab"
                  title="iframe"
                  src={`https://www.tradingview.com/widgetembed/?frameElementId=tradingview_3ebab&symbol=${exchangeName}%3A${from}${to}&interval=D&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=www.tradingview.com&utm_medium=widget_new&utm_campaign=chart&utm_term=BITSTAMP%3ABTCUSD`}
                  style={{
                    width: "100%",
                    height: "300px",
                    margin: 0,
                    padding: "0",
                  }}
                  frameBorder="0"
                  allowtransparency="false"
                  scrolling="no"
                  allowfullscreen=""
                ></iframe>
              </div>
            </Tabs>
          </div>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 7 }} className="tw-margin">
          <TechnicalWidget from={from} to={to} exchangeName={exchangeName} />
        </Col>
      </Row>
    );
  }
}

export default SymbolWidget;
