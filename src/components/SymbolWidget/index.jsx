import React, { useState, Fragment, useEffect } from 'react';
import { Select, Button, Row, Col } from 'antd';
import DropDown from '../../../assets/images/datastudio//dropdown_icon.png';
import Binance from '../../../assets/images/datastudio/Binance.png';
import Kraken from '../../../assets/images/datastudio/Kraken.png';
import Tabs from '../Tabs/index.jsx';
import ExchangeTab from '../Tabs/ExchangeTab.jsx';
import stores from '../../../stores';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import OneThing from './OneThing.js';
import { reverse } from 'dns';
const { Option } = Select;
import TechnicalWidget from '../TechnicalWidget/index';

let exDetails;
@observer
class SymbolWidget extends React.Component {
  componentDidMount() {
    stores.info.getLists().then((authorized) => stores.app.unauthorized(authorized));
    stores.userInfo.getExchanges().then((authorized) => stores.app.unauthorized(authorized));
  }

  // TODO: create a map of stores.info.exchanges.uid values => trading view values
  // TODO: when component is mounted, load stores.exchangeInfo.getAssets(), also you do that when you change an exchange
  // TODO: the same with stores.userInfo.getExchanges() and stores.info.getLists()
  // TODO: "About Bitcoin" section... use dynamic data you get from stores.exchangeInfo.assets - for each coin there is its name, price, volume, price growth
  // TODO: when exchange or coin changes, you should also re-render the technical analysis chart (on right side)

  // TODO: dropdown 2: use stores.info.exchanges[].quote_coins as list of coins, remember it's dynamic
  // TODO: dropdown 1: use stores.exchangeInfo.assets (check if it's loaded)
  // TODO: if you switch to Kraken and BTC is selected, convert to XBT (and backwards) (nice to have)
  render() {
    const {
      from,
      to,
      exchangeName,
      exchangeQuotes,
      decideLogo,
      handleChange,
      handleChangeTo,
      handleSelectedExchange,
      onSearch,
      onSearchTo,
    } = this.props;

    const dropIcon = <img src={DropDown} alt='DropDown' height='10' />;
    return (
      <Row>
        <Col xs={{ span: 24 }} lg={{ span: 17 }}>
          <div>
            <Select
              className={`dataStudioDropdown`}
              defaultValue={'BTC'}
              style={{ background: 'none', width: 110 }}
              bordered={false}
              dropdownClassName={'droppie'}
              defaultActiveFirstOption={true}
              suffixIcon={dropIcon}
              showSearch
              optionFilterProp='children'
              onChange={handleChange}
              onSearch={onSearch}
            >
              {exchangeQuotes.map((coin) => (
                <Option className={'droppieOption'} key={coin} value={coin}>
                  {coin}
                </Option>
              ))}
            </Select>
            <Select
              className={`dataStudioDropdown`}
              defaultValue={'USD'}
              style={{ background: 'none', width: 110 }}
              onChange={handleChangeTo}
              bordered={false}
              dropdownClassName={'droppie'}
              defaultActiveFirstOption={true}
              suffixIcon={dropIcon}
              onSearch={onSearchTo}
              optionFilterProp='children'
              showSearch
            >
              {exchangeQuotes.reverse().map((coin) => (
                <Option className={'droppieOption'} key={coin} value={coin}>
                  {coin}
                </Option>
              ))}
            </Select>
          </div>
          <div className='top-margin'>
            <div style={{ width: '100%' }}>
              <div
                key={'Binance'}
                label={
                  <span>
                    {decideLogo(Binance)} {'Binance'}
                  </span>
                }
              ></div>
            </div>
            {stores.userInfo.exchanges.slice(1).map((exchange) => {
              if (!stores.info.exchanges.length) {
                return null;
              }
              exDetails = toJS(stores.info.exchanges.filter((ex) => ex.id === exchange.id)[0]);

              return (
                <div>
                  <Button
                    className='exchangeBtn'
                    key={exchange ? exchange.id : 1}
                    value={exDetails.name}
                    onClick={handleSelectedExchange}
                  >
                    {decideLogo(exDetails.name)}
                    <span style={{ marginLeft: '5px' }}>{exDetails.name}</span>
                  </Button>
                </div>
              );
            })}
            <Tabs>
              <div label='Simple'>
                <iframe
                  id='tradingview_70ff2'
                  title='iframe'
                  src={`https://www.tradingview.com/mediumwidgetembed/?symbols=${exchangeName}%3A${from}${to}%7C12M&locale=en&trendLineColor=%231976d2&underLineColor=rgba(55%2C%20166%2C%20239%2C%200.15)&fontColor=%23787b86&gridLineColor=%232a2e39&width=100%25&height=100%25&colorTheme=dark&isTransparent=1&utm_source=www.tradingview.com&utm_medium=widget_new&utm_campaign=symbol-overview`}
                  style={{ boxSizing: 'border-box', height: '300px', width: '100%' }}
                  frameBorder='0'
                  allowtransparency='true'
                  scrolling='no'
                ></iframe>
              </div>
              <div label='Advanced'>
                <iframe
                  id='tradingview_3ebab'
                  title='iframe'
                  src={`https://www.tradingview.com/widgetembed/?frameElementId=tradingview_3ebab&symbol=${exchangeName}%3A${from}${to}&interval=D&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=www.tradingview.com&utm_medium=widget_new&utm_campaign=chart&utm_term=BITSTAMP%3ABTCUSD`}
                  style={{ width: '100%', height: '300px', margin: 0, padding: '0' }}
                  frameBorder='0'
                  allowtransparency='false'
                  scrolling='no'
                  allowfullscreen=''
                ></iframe>
              </div>
            </Tabs>
          </div>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 7 }} className='tw-margin'>
          <TechnicalWidget from={from} to={to} exchangeName={exchangeName} />
        </Col>
      </Row>
    );
  }
}

export default SymbolWidget;
