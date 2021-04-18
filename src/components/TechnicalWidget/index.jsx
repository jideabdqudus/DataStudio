import React from 'react';
class TechnicalWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      from: 'BTC',
      to: 'USD',
      exchangeName: '',
    };
  }

  componentDidUpdate() {
    this.setState({
      from: this.props.from,
      to: this.props.to,
      exchangeName: this.props.exchangeName,
    });
  }

  render() {
    const { from, to, exchangeName } = this.state;
    console.log(from, to, exchangeName);
    return (
      <div id='myContainer3' style={{ display: 'block' }}>
        <iframe
          scrolling='no'
          allowtransparency='true'
          frameBorder='0'
          title='iframe'
          key={`${this.props.from}${this.props.to}${this.props.exchangeName}`}
          src={`https://s.tradingview.com/embed-widget/technical-analysis/?locale=en#%7B%22interval%22%3A%221m%22%2C%22width%22%3A%22100%25%22%2C%22isTransparent%22%3Atrue%2C%22height%22%3A%22100%25%22%2C%22symbol%22%3A%22${exchangeName}%3A${from}${to}%22%2C%22showIntervalTabs%22%3Atrue%2C%22colorTheme%22%3A%22dark%22%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22technical-analysis%22%7D`}
          style={{ boxSizing: 'border-box', height: '400px', width: '100%' }}
        ></iframe>
      </div>
    );
  }
}
export default TechnicalWidget;
