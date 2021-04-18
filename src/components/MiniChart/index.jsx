import { Row, Col } from 'antd';
import React from 'react';

export const MiniChart = () => {
  return (
    <div>
      <Row>
        <Col xs={{ span: 24 }} lg={{ span: 7 }}>
          <iframe
            id='one'
            title='iframe'
            allowtransparency='true'
            frameBorder='0'
            src='https://s.tradingview.com/embed-widget/mini-symbol-overview/?locale=en#%7B%22symbol%22%3A%22FX%3ABTCUSD%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22dateRange%22%3A%2212M%22%2C%22colorTheme%22%3A%22dark%22%2C%22trendLineColor%22%3A%22%2337a6ef%22%2C%22underLineColor%22%3A%22rgba(55%2C%20166%2C%20239%2C%200.15)%22%2C%22isTransparent%22%3Atrue%2C%22autosize%22%3Atrue%2C%22largeChartUrl%22%3A%22%22%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22mini-symbol-overview%22%7D'
            className='miniChart'
            style={{ boxSizing: 'border-box', height: 'calc(100% - 32px)', width: '100%' }}
          ></iframe>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 1 }}></Col>
        <Col xs={{ span: 24 }} lg={{ span: 7 }}>
          <iframe
            id='one'
            allowtransparency='true'
            title='iframe'
            frameBorder='0'
            src='https://s.tradingview.com/embed-widget/mini-symbol-overview/?locale=en#%7B%22symbol%22%3A%22FX%3AETHUSD%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22dateRange%22%3A%2212M%22%2C%22colorTheme%22%3A%22dark%22%2C%22trendLineColor%22%3A%22%2337a6ef%22%2C%22underLineColor%22%3A%22rgba(55%2C%20166%2C%20239%2C%200.15)%22%2C%22isTransparent%22%3Atrue%2C%22autosize%22%3Atrue%2C%22largeChartUrl%22%3A%22%22%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22mini-symbol-overview%22%7D'
            className='miniChart'
            style={{ boxSizing: 'border-box', height: 'calc(100% - 32px)', width: '100%' }}
          ></iframe>
        </Col>
      </Row>
    </div>
  );
};

export default MiniChart;
