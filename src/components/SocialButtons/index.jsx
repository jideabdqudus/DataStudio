import React, { Fragment } from 'react';
import External from '../../assets/external-link.png';
import Discord from '../../assets/discord.png';
import Telegram from '../../assets/telegram.png';
import Twitter from '../../assets/twitter.png';
import { Col, Row } from 'antd';

const SocialButtons = () => {
  return (
    <Fragment>
      <Row>
        <Col xs={{ span: 24 }} lg={{ span: 5 }}>
          <a href='https://bticoin.com' target='__blank'>
            <button className='ds-btn'>
              <img
                src={External}
                width='16'
                alt={'Bitcoin'}
                style={{ margin: '8px', paddingBottom: '3px' }}
              />{' '}
              bitcoin
            </button>
          </a>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 5 }}>
          <a href='https://twitter.com' target='__blank'>
            <button className='ds-btn'>
              {' '}
              <img
                src={Twitter}
                width='16'
                alt='Bitcoin Twitter'
                style={{ margin: '8px', paddingBottom: '3px' }}
              />
              Twitter
            </button>
          </a>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 5 }}>
          <a href='https://discord.com' target='__blank'>
            <button className='ds-btn'>
              {' '}
              <img
                src={Discord}
                width='16'
                alt={'Bitcoin Discord'}
                style={{ margin: '8px', paddingBottom: '3px' }}
              />
              Discord
            </button>
          </a>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 5 }}>
          <a href='https://telegram.com' target='__blank'>
            {' '}
            <button className='ds-btn'>
              {' '}
              <img
                src={Telegram}
                width='16'
                alt={'Bitcoin Telegram'}
                style={{ margin: '5px', paddingBottom: '3px' }}
              />
              Telegram
            </button>
          </a>
        </Col>
      </Row>
    </Fragment>
  );
};

export default SocialButtons;
