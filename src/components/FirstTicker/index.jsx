import React from 'react';

class FirstTicker extends React.PureComponent {
  constructor(props) {
    super(props);
    this._ref = React.createRef();
  }
  componentDidMount() {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        {
          proName: 'FOREXCOM:SPXUSD',
          title: 'S&P 500',
        },
        {
          proName: 'FOREXCOM:NSXUSD',
          title: 'Nasdaq 100',
        },
        {
          proName: 'FX_IDC:EURUSD',
          title: 'EUR/USD',
        },
        {
          proName: 'BITSTAMP:BTCUSD',
          title: 'BTC/USD',
        },
        {
          proName: 'BITSTAMP:ETHUSD',
          title: 'ETH/USD',
        },
      ],
      showSymbolLogo: true,
      colorTheme: 'dark',
      width: '100%',
      height: '100%',
      isTransparent: true,
      displayMode: 'regular',
      locale: 'uk',
    });
    document.getElementById('myContainer1').appendChild(script);
    this._ref.current.appendChild(script);
  }
  render() {
    return (
      <div id='myContainer1' className={'block-display'}>
        <div className='tradingview-widget-container' ref={this._ref}></div>
      </div>
    );
  }
}
export default FirstTicker;
