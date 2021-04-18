import React, { useState, useEffect, Fragment } from 'react';
import { Modal, Divider } from 'antd';
import './style.scss';
import ClosingIcon from '../../assets/close.png';

import axios from 'axios';

const News = () => {
  const [api, setApi] = useState('');

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          ' https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fcointelegraph.com%2Ffeed&api_key=tzuwk5jwld7wvcjlovgfphku4gcw8bgi3hliu6vq&order_dir=asc&count=5'
        )
        .then((response) => setApi(response.data.items))

        .catch(function (error) {
          console.error(error.response.data);
        });
    };
    fetchData();
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Fragment>
      {api.length === 0 ? (
        <div>Loading</div>
      ) : (
        api.map((news) => {
          return (
            <div key={news.thumbnail} className='newsStyling'>
              <div className={'news-cover'}>
                <img src={news.thumbnail} className='newsImg' alt={news.title} />
                {/* <div className='text-overlay'>
                  <div className='info-news-text'>Read more</div>
                </div> */}
              </div>
              <div style={{ paddingLeft: '5px', paddingRight: '5px' }}>
                <a
                  style={{
                    color: '#F2F5F7',
                    fontSize: '14px',
                    marginTop: '6px',
                    lineHeight: '1.2em',
                    marginBottom: '2px',
                    fontWeight: '600px',
                  }}
                  href='#!'
                  onClick={showModal}
                >
                  {news.title}
                </a>
                <div style={{ marginTop: '10px', paddingBottom: '10px' }}>
                  <span
                    style={{
                      color: '#F2F5F7',

                      marginRight: '10px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                    }}
                  >
                    {news.author}
                  </span>
                  <span
                    style={{
                      color: '#F2F5F7',

                      marginRight: '10px',
                      fontSize: '11px',
                      fontWeight: 'light',
                    }}
                  >
                    {24 - parseInt(`${news.pubDate}`.substring(11).slice(0, -6))} hours ago
                  </span>
                </div>
              </div>
              <Divider style={{ backgroundColor: '#40434a', marginTop: '0px' }} />
              <Modal
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                centered={true}
                closeIcon={<img src={ClosingIcon} alt='Close Icon' />}
                className='PaymentGate'
                bodyStyle={{
                  backgroundColor: '#1C2237',
                  height: '100%',
                  marginTop: '50px',
                }}
              >
                <h1 style={{ float: 'left', color: 'white', fontWeight: '600', fontSize: '18px' }}>
                  <React.Fragment>Coinrule News</React.Fragment>
                </h1>
                <iframe
                  src={news.link}
                  key={news.title}
                  title='iframe'
                  style={{ width: '100%', height: '600px' }}
                ></iframe>
                <div
                  style={{
                    height: '50px',
                    backgroundColor: '#1C2237',
                    padding: '0px',
                    marginBottom: '20px',
                  }}
                ></div>
              </Modal>
            </div>
          );
        })
      )}
    </Fragment>
  );
};

export default News;
