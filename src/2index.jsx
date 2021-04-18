import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';

import './style.scss';

import MobileMenu from '../../components/MobileMenu';
import MobileFooter from '../../components/MobileFooter';
import GlobalWrapper from '../../components/GlobalWrapper';
import GlobalContent from '../../components/GlobalContent';
import GlobalSidebar from '../../components/GlobalSidebar';
import BackIcon from './BackIcon.js/index.js';
import FirstTicker from './FirstTicker/index.jsx';

import AboutCoin from './About/index';
import SymbolWidget from './SymbolWidget/index.jsx';
import SocialButtons from './SocialButtons/index.jsx';
import TechnicalWidget from './TechnicalWidget/index.jsx';
import CryptoWidget from './CryptoWidget/index.jsx';
import MiniChart from './MiniChart/index.jsx';
import News from './News/index.jsx';
import stores from '../../stores/';
import IconLoading from 'components/Loading/IconLoading';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import Binance from '../../assets/images/datastudio/Binance.png';
import Kraken from '../../assets/images/datastudio/Kraken.png';

import { Col, Row } from 'antd';

const titleDataStudio = (
  <Fragment>
    <h1 className='heading-text'>Data Studio</h1>
  </Fragment>
);

let exDetails;
@observer
export class DataStudioPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      from: 'BTC',
      to: 'USD',
      exchangeName: '',
      exchangeQuotes: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeTo = this.handleChangeTo.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSearchTo = this.onSearchTo.bind(this);
    this.handleSelectedExchange = this.handleSelectedExchange.bind(this);
  }

  componentDidMount() {
    stores.info.getLists().then((authorized) => stores.app.unauthorized(authorized));
    stores.userInfo.getExchanges().then((authorized) => stores.app.unauthorized(authorized));
  }

  decideLogo(exchange) {
    // TODO: add logos for all exchanges, look into ExchangesPage component, there should already be something
    if ((exchange = 'binance')) {
      return <img src={Binance} width='20px' alt='Binance' />;
    } else if ((exchange = 'kraken')) {
      return <img src={Kraken} width='20px' alt={'Kraken'} />;
    } else {
      return null;
    }
  }

  handleChange(value) {
    this.setState({
      from: value,
    });
  }

  handleChangeTo(value) {
    this.setState({
      to: value,
    });
  }

  handleSelectedExchange(e) {
    const exchangeValue = e.target.value.toLowerCase();
    const exchangeName = e.target.value.toUpperCase();
    exDetails = toJS(stores.info.exchanges.filter((ex) => ex.uid === exchangeValue)[0]);
    const exchangeCoins = exDetails.quote_coins;
    this.setState({
      exchangeQuotes: exchangeCoins,
      exchangeName: exchangeName,
    });
  }

  onSearch(value) {
    this.setState({
      from: value,
    });
  }

  onSearchTo(value) {
    this.setState({
      to: value,
    });
  }

  render() {
    const { from, to, exchangeName, exchangeQuotes } = this.state;
    console.log('userInfo', toJS(stores.userInfo));
    console.log('Info', toJS(stores.info));
    console.log('user', toJS(stores.user));
    console.log('exchangeInfo', toJS(stores.exchangeInfo));
    return (
      <Fragment>
        <GlobalWrapper>
          <MobileMenu />
          <GlobalSidebar extraClass={`globalWrapper__sidebar`} />

          {/* {stores.userInfo.isLoadedExchanges && stores.info.isLoaded ? ( */}
          {!stores.userInfo.isLoadingExchanges ? (
            <GlobalContent extraClass={`wrapperBody`}>
              <Fragment>
                <BackIcon to='/rule' title={titleDataStudio} />
                <div>
                  <div className={'margin-bottom-20'}>
                    {' '}
                    <div className={'block-display'}>
                      <h4 className={'small-text'}>Top movers</h4>
                      <FirstTicker />
                    </div>
                  </div>

                  <Fragment>
                    <SymbolWidget
                      from={from}
                      to={to}
                      exchangeName={exchangeName}
                      exchangeQuotes={exchangeQuotes}
                      decideLogo={this.decideLogo}
                      handleChange={this.handleChange}
                      handleChangeTo={this.handleChangeTo}
                      handleSelectedExchange={this.handleSelectedExchange}
                      onSearch={this.onSearch}
                      onSearchTo={this.onSearchTo}
                    />
                  </Fragment>

                  <Row>
                    <Col xs={{ span: 24 }} lg={{ span: 18 }}>
                      <AboutCoin />
                      <Fragment>
                        <SocialButtons />
                      </Fragment>
                      <div className={'margin-bottom-20'}>
                        <h1 className={'sub-heading'}>Watchlist</h1>
                        <Row>
                          <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                            <MiniChart exchangeName={exchangeName} />
                          </Col>
                        </Row>
                      </div>
                      <div style={{ marginTop: '30px' }}>
                        <h1 className='sub-heading'>Today's Prices</h1>
                        <CryptoWidget />
                      </div>
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 5 }}>
                      <Row>
                        <div
                          label='News'
                          className='infotab-list-active'
                          style={{
                            height: '35px',
                            marginBottom: '10px',
                            fontSize: '20px',
                            fontWeight: '600',
                            textAlign: 'center',
                            marginTop: '20px',
                          }}
                        >
                          News
                        </div>
                        <News />
                      </Row>
                    </Col>
                  </Row>
                </div>
              </Fragment>
            </GlobalContent>
          ) : (
            <Fragment>
              <IconLoading />
            </Fragment>
          )}

          <MobileFooter />
        </GlobalWrapper>
      </Fragment>
    );
  }
}

export default withRouter(DataStudioPage);
