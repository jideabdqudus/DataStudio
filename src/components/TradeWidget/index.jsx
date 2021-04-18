import React, { useState } from 'react';
import { Select } from 'antd';

const TradeWidget = () => {
  const [from, setFrom] = useState('BITSTAMP%3ABTC');
  const [to, setTo] = useState('USD');

  const onChange = (e) => {
    setFrom(e.target.value);
  };

  const onChangeTo = (e) => {
    setTo(e.target.value);
  };

  return (
    <div>
      <select onChange={onChange} className='select-button'>
        <option value='BITSTAMP%3ABTC'>NAIRA</option>
        <option value='BITBAY%3ABTC'>BTC</option>
        <option value='HITBTC%3ACVC'>CVC</option>
      </select>
      <span style={{ fontSize: '30px', color: 'white', fontWeight: '600' }}>/</span>
      <select onChange={onChangeTo} className='select-button'>
        <option value='USD'>USD</option>
        <option value='EUR'>EUR</option>
      </select>

      <Select
        className={`ruleMainCurrencyChoose__dropdown`}
        title='Change'
        defaultValue={'BITSTAMP%3ABTC'}
        onChange={onChange}
      >
        <option value='BITSTAMP%3ABTC'>NAIRA</option>
        <option value='BITBAY%3ABTC'>BTC</option>
        <option value='HITBTC%3ACVC'>CVC</option>
        {/* {stores.info.baseCurrencies.map((currency) => (
            <Option value={currency} key={currency}>
              {currency}
            </Option>
          ))} */}
      </Select>

      <iframe
        id='tradingview_3ebab'
        title='iframe'
        src={`https://www.tradingview.com/widgetembed/?frameElementId=tradingview_3ebab&symbol=${from}${to}&interval=D&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=www.tradingview.com&utm_medium=widget_new&utm_campaign=chart&utm_term=BITSTAMP%3ABTCUSD`}
        style={{ width: '100%', height: '300px', margin: 0, padding: '0' }}
        frameborder='0'
        allowtransparency='false'
        scrolling='no'
        allowfullscreen=''
      ></iframe>
    </div>
  );
};

export default TradeWidget;
