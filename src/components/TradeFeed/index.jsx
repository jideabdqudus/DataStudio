import React from 'react';
import {  Divider } from 'antd';
const TradeFeed = () => {
  return (
    <div label='Trade Feed'>
      <p
        style={{
          color: '#F2F5F7',
          fontSize: '12px',
          marginTop: '6px',
          lineHeight: '1.7em',
          marginBottom: '2px',
          fontWeight: 'light',
        }}
      >
        A strategy bought 2.32 ETH ($2000) with the BTC wallet. The trader used the template
        Portfolio Stop Loss and Re-buy
      </p>
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <span
          style={{
            color: '#F2F5F7',
            marginRight: '10px',
            fontSize: '11px',
            fontWeight: 'light',
          }}
        >
          9 hours ago
        </span>
        <span
          style={{
            color: '#768AFF',
            textDecoration: 'underline',
            marginRight: '10px',
            fontSize: '11px',
            fontWeight: 'bold',
          }}
        >
          View Strategy
        </span>
      </div>
      <Divider />
    </div>
  );
};

export default TradeFeed;
