import React from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { NavLink } from 'react-router-dom';
import { Switch, Select } from 'antd';
import MediaQuery from 'react-responsive';

import './style.scss';
import stores from '../../../stores';
import {
  localizedNumber,
  formatNumber,
  shortcutFormatNumber,
  getDataLocalStorage,
  convertStringToClassName,
} from '../../../helpers/utils';
import Help, { Container } from '../../../components/Help';
import history from '../../../helpers/history';
// import { showAddRuleTourAgain } from '../../../helpers/tour';
import TemplatesList from '../../AddRulePage/TemplatesList';
import Popover from '../../../components/Popover';
import { getCoinValue, getCoinLogo } from '../../AddRulePage/ShowCoinsValue';
import { EXCHANGES_TYPE } from '../../../constants/exchanges';

const Option = Select.Option;
const analytics = window.mixpanel;
const walletUpdater = [];

@observer
class OneThing extends React.Component {
  state = {
    allWallets: false,
    allPositions: false,
    blockPrompted: false,
    baseCurrencyChanging: false,
    baseCurrency:
      this.props.currency === stores.user.user.user.baseCurrency ? '' : this.props.currency,
  };

  isLeverage() {
    const exchangeType = stores.exchangeInfo.exchangeType[this.props.store.rule.ex];
    return exchangeType && exchangeType === EXCHANGES_TYPE.LEVERAGE;
  }

  componentDidMount() {
    if (
      this.props.store.editMode &&
      this.props.store.editedRuleId &&
      !stores.info.lastSelectedExchange
    ) {
      stores.info.updateLastSelectedExchange(this.props.store.rule.ex);
    }

    // if ([...stores.userInfo?.exchanges]?.length === 1) {
    //   this.handleExchangeChange(stores.userInfo?.exchanges?.[0]?.id);
    // }

    // console.log('toJS(stores.userInfo?.exchanges): ', toJS(stores.userInfo?.exchanges));
  }

  componentDidUpdate() {
    if (
      getDataLocalStorage('should_restore_rule') &&
      this.props.store.rule.ex &&
      !stores.info.lastSelectedExchange
    ) {
      stores.info.updateLastSelectedExchange(this.props.store.rule.ex);
      this.handleExchangeChange(this.props.store.rule.ex);
      this.props.store.checkOrderTypesOfExistingActions();
    }

    // Preselect DEMO exchange if no other exchanges connected
    if (
      stores.userInfo.exchanges.length === 1 &&
      this.props.store.rule.ex === undefined &&
      stores.info.RSIExchanges &&
      stores.info.MAExchanges
    ) {
      const currentExchange = toJS(stores.info.exchanges).filter(
        (ex) => ex.id === stores.userInfo.exchanges[0].id
      )[0];
      const { name: exchangeName = null } = currentExchange ? currentExchange : {};

      if (exchangeName) {
        this.handleExchangeChange(stores.userInfo?.exchanges?.[0]?.id);
      }
    }
  }

  componentWillUnmount() {
    // stores.ruleDetailsStore.toggleTemplatesList();
  }

  handleExchangeChange = (exchangeId) => {
    if (exchangeId) {
      stores.info.updateLastSelectedExchange(exchangeId); // this must be called before this.props.store.changeExchange() !!!
      this.props.store.changeExchange(exchangeId, this.state.baseCurrency);
      this.props.store.checkOrderTypesOfExistingActions();

      if (!this.state.blockPrompted) {
        this.props.parent.blockPage();
        this.setState({
          blockPrompted: true,
        });
      }

      if (walletUpdater.indexOf(exchangeId) < 0) {
        walletUpdater.push(exchangeId);
        this.walletUpdaterTimeout(exchangeId);
      }
      // this.props.store.seqInit.validationCoinAvailable();
      this.props.store.seqInit.checkIfExistiValidationCoinError();
      analytics.track('Changed exchange while creating a new rule', {
        'Exchange ID': exchangeId,
      });
    }
  };

  handleExpander = () => {
    this.setState({
      allWallets: !this.state.allWallets,
      allPositions: !this.state.allPositions,
    });
  };

  walletUpdaterTimeout(exchangeId) {
    if (exchangeId) {
      setTimeout(() => {
        stores.userInfo.getBalances(exchangeId, true).then((authorized) => {
          stores.app.unauthorized(authorized);

          if (authorized) {
            this.walletUpdaterTimeout(exchangeId);
          }
        });
      }, 300000); // 5min
    }
  }

  checkIfExchangeLoaded() {
    return (
      this.props.store.rule.ex &&
      stores.userInfo.balances[this.props.store.rule.ex + this.state.baseCurrency] &&
      stores.exchangeInfo.assets[this.props.store.rule.ex + this.state.baseCurrency] &&
      ((this.isLeverage() &&
        stores.exchangeInfo.instruments[this.props.store.rule.ex + this.state.baseCurrency]) ||
        stores.exchangeInfo.markets[this.props.store.rule.ex + this.state.baseCurrency])
    );
  }

  renderExchangeSelect() {
    let exDetails;

    const totalConnectedExchanges = toJS(stores.userInfo?.exchanges).length;
    const maxExchanges = stores.user.getUser().plan.numberOfExchanges;

    return (
      <>
        <Popover text='Select Exchange'>
          <Select
            onChange={this.handleExchangeChange}
            dropdownStyle={{ textTransform: 'uppercase' }}
            optionFilterProp='children'
            filterOption={(input, option) =>
              option.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            //disabled={this.props.editMode}
            dropdownClassName={`ruleCreateExchangeDropdown`}
            value={stores.info.exchanges.length ? this.props.store.rule.ex : 'Loading...'}
          >
            {stores.userInfo.exchanges.map((exchange) => {
              if (!stores.info.exchanges.length) {
                return null;
              }
              exDetails = toJS(stores.info.exchanges.filter((ex) => ex.id === exchange.id)[0]);
              
              return (
                <Option
                  key={exchange ? exchange.id : 1}
                  value={exchange ? exchange.id : 1}
                  className={`ruleCreateExchangeDropdown__option
                                    ruleCreateExchangeDropdown__option_${
                                      exDetails && exDetails.uid
                                    }`}
                >
                  <span
                    className={`ruleCreateExchangeDropdown__exchangeIcon
                                    ruleCreateExchangeDropdown__exchangeIcon_${
                                      exDetails && exDetails.uid
                                    }`}
                  >
                    &nbsp;
                  </span>
                  {exDetails && exDetails.name}
                </Option>
              );
            })}
          </Select>
        </Popover>

        {stores.user.user.plan.clearance === 0 && totalConnectedExchanges === maxExchanges && (
          <div
            className={`newRuleTitleTabs__leverageExchangesAdsLabel
                                    newRuleTitleTabs__leverageExchangesAdsLabel_positionedAbsolute`}
            onClick={() => {
              stores.addRule.setPaymentGateVisible('promo', true);
            }}
          >
            Add Exchange
          </div>
        )}

        {stores.user.user.plan.clearance === 0 && totalConnectedExchanges < maxExchanges && (
          <NavLink
            className={`newRuleTitleTabs__leverageExchangesAdsLabel
                                        newRuleTitleTabs__leverageExchangesAdsLabel_positionedAbsolute`}
            to={{ pathname: '/exchanges' }}
          >
            Add Exchange
          </NavLink>
        )}
      </>
    );
  }

  renderExchangesTabs() {

    return (
      <React.Fragment>
        {stores.userInfo.exchanges.map((exchange) => {
          const currentExchange = toJS(stores.info.exchanges).filter(
            (ex) => ex.id === exchange.id
          )[0];
          const { name: exchangeName = null, uid: exchangeUID = null } = currentExchange
            ? currentExchange
            : {};

          if (!exchangeName) {
            return null;
          }

          // newRuleTitleTabs__tab_ICON${convertStringToClassName(exchangeUID)}
          return (
            <div
              className={`newRuleTitleTabs__tab
                              newRuleTitleTabs__tab_ICONexchange
                              newRuleTitleTabs__tab_ICON${convertStringToClassName(exchangeUID)}
                              ${
                                exchange.id === this.props.store.rule.ex &&
                                'newRuleTitleTabs__tab_exchangeActive'
                              }
                              ${
                                exchange.id === this.props.store.rule.ex &&
                                'newRuleTitleTabs__tab_active'
                              }`}
              key={exchangeName}
              onClick={() => this.handleExchangeChange(exchange.id)}
            >
              {currentExchange.underMaintenance && (
                <span className='maintenanceAlert'>under maintenance</span>
              )}
              {exchangeName}
            </div>
          );
        })}
      </React.Fragment>
    );
  }

  renderExchangeDetails() {
    if (stores.userInfo.exchanges && stores.userInfo.exchanges.length > 0) {
      if (this.props.store.rule.ex) {
        if (
          !stores.info.lastSelectedExchange ||
          (stores.userInfo.isLoadingBalances &&
            stores.userInfo.isLoadedBalances.indexOf(
              this.props.store.rule.ex + this.state.baseCurrency
            ) < 0) ||
          !this.props.store.rule.ex ||
          (stores.exchangeInfo.isLoadingAssets &&
            stores.exchangeInfo.isLoadedAssets.indexOf(
              this.props.store.rule.ex + this.state.baseCurrency
            ) < 0) ||
          !this.checkIfExchangeLoaded()
        ) {
          return this.renderExchangeError(<div className='exerr'>Please wait...</div>);
        } else {
          return this.renderBalances();
        }
      } else {
        return this.renderExchangeError(
          <div className='exerr'>
            <i className='fa fa-exclamation-triangle'> </i>
            <strong>Please select exchange first</strong>
          </div>
        );
      }
    } else {
      if (stores.userInfo.isLoadingExchanges) {
        return this.renderExchangeError(<div className='exerr'>Please wait...</div>);
      } else {
        return this.renderExchangeError(
          <div className='exerr'>
            <i className='fa fa-exclamation-triangle'> </i>
            <strong>
              Please <NavLink to='/exchanges'>add your exchange keys</NavLink> first.
            </strong>
          </div>
        );
      }
    }
  }

  renderBalances() {
    const visibleLimit = 4;

    const visibleWallets = [],
      hiddenWallets = [],
      visiblePositions = [],
      hiddenPositions = [];
    let visibleWalletsHtml,
      visiblePositionsHtml,
      hiddenWalletsHtml,
      hiddenPositionsHtml,
      hiddenWalletsBtn,
      hiddenPositionsBtn;
    let balancesHtml, positionsHtml;
    let i, wallet, position, formattedCoin, formattedPosition;
    const fiats = stores.exchangeInfo.fiats[this.props.store.rule.ex + this.state.baseCurrency];
    const wallets =
      stores.userInfo.sortedBalances[this.props.store.rule.ex + this.state.baseCurrency] || [];
    const positions = stores.userInfo.openPositions[this.props.store.rule.ex]?.data || [];

    // console.log('===========================================================')
    // console.log('wallets: ', toJS(wallets));
    // console.log('stores.userInfo.sortedBalances: ', toJS(stores.userInfo.sortedBalances));
    // console.log('this.state.baseCurrency: ', this.state.baseCurrency);
    // console.log('stores.userInfo.sortedBalances[this.props.store.rule.ex + this.state.baseCurrency]: ',
    //               stores.userInfo.sortedBalances[this.props.store.rule.ex + this.state.baseCurrency]);

    // console.log('wallets: ', toJS(wallets));

    const walletsLen = wallets ? wallets.length : 0;
    if (walletsLen > 0) {
      for (i = 0; i < walletsLen; i++) {
        wallet = wallets[i];
        formattedCoin = this.renderCoinBalances(wallet, fiats);

        if (formattedCoin) {
          if (visibleWallets.length < visibleLimit) {
            visibleWallets.push(formattedCoin);
          } else {
            hiddenWallets.push(formattedCoin);
          }
        }
      }
    }

    const positionsLen = positions ? positions.length : 0;
    if (positionsLen > 0) {
      for (i = 0; i < positionsLen; i++) {
        position = positions[i];
        formattedPosition = this.renderPositions(position);

        if (formattedPosition) {
          if (visiblePositions.length < visibleLimit) {
            visiblePositions.push(formattedPosition);
          } else {
            hiddenPositions.push(formattedPosition);
          }
        }
      }
    }

    if (visibleWallets) {
      visibleWalletsHtml = <div className={`exchangeCoinsList`}>{visibleWallets}</div>;
    }

    if (visiblePositions) {
      visiblePositionsHtml = <div className={`exchangeCoinsList`}>{visiblePositions}</div>;
    }

    if (hiddenWallets.length > 0) {
      if (this.state.allWallets) {
        hiddenWalletsHtml = <div className={`exchangeCoinsList`}>{hiddenWallets}</div>;

        hiddenWalletsBtn = (
          <div className='expander' onClick={this.handleExpander}>
            <i className='fa fa-eye-slash'>&nbsp;</i>
            <span>Hide</span>
          </div>
        );
      } else {
        hiddenWalletsBtn = (
          <Popover text='Show more Coins' onClick={this.handleExpander}>
            <div className='expander'>
              <i className='fa fa-eye'>&nbsp;</i>
              <span>{hiddenWallets.length} more</span>
            </div>
          </Popover>
        );
      }
    }

    if (hiddenPositions.length > 0) {
      if (this.state.allPositions) {
        hiddenPositionsHtml = <div className={`exchangeCoinsList`}>{hiddenPositions}</div>;

        hiddenPositionsBtn = (
          <div className='expander' onClick={this.handleExpander}>
            <i className='fa fa-eye-slash'>&nbsp;</i>
            <span>Hide</span>
          </div>
        );
      } else {
        hiddenPositionsBtn = (
          <Popover text='Show more Positions' onClick={this.handleExpander}>
            <div className='expander'>
              <i className='fa fa-eye'>&nbsp;</i>
              <span>{hiddenPositions.length} more</span>
            </div>
          </Popover>
        );
      }
    }

    const btcPrice = getCoinValue('BTC', this.props.store.rule.ex).price;
    let btcBalance =
      stores.userInfo.totalBalances[stores.info.lastSelectedExchange.id + this.state.baseCurrency] /
      btcPrice;
    btcBalance = shortcutFormatNumber(btcBalance, true);

    balancesHtml = (
      <div className='input-grey'>
        {walletsLen > 0 ? (
          <label>
            {`Your coins on ${stores.info.lastSelectedExchange.name}`}
            <Popover text={'BTC: ' + btcBalance}>
              <span className={'coin-value'}>
                ≈ &nbsp;{' '}
                {stores.info.currencies && stores.info.currencies[this.props.currency]
                  ? formatNumber(
                      stores.userInfo.totalBalances[
                        stores.info.lastSelectedExchange.id + this.state.baseCurrency
                      ],
                      this.props.currency,
                      '',
                      false
                    )[0]
                  : formatNumber(
                      stores.userInfo.totalBalances[
                        stores.info.lastSelectedExchange.id + this.state.baseCurrency
                      ],
                      this.props.currency,
                      '',
                      false,
                      4
                    )[0]}
              </span>
            </Popover>
          </label>
        ) : (
          <label>
            {`You don't have any wallet or coins on ${stores.info.lastSelectedExchange.name}.`}
          </label>
        )}
      </div>
    );

    positionsHtml = (
      <div className='input-grey'>
        {positionsLen > 0 ? (
          <label>{`Your open positions on ${stores.info.lastSelectedExchange.name}`}</label>
        ) : (
          <label>{`You don't have any open positions on ${stores.info.lastSelectedExchange.name}.`}</label>
        )}
      </div>
    );

    return (
      <div className='allocate'>
        {this.isLeverage() ? positionsHtml : balancesHtml}
        {this.isLeverage() ? visiblePositionsHtml : visibleWalletsHtml}
        {this.isLeverage() ? hiddenPositionsHtml : hiddenWalletsHtml}
        {this.isLeverage() ? hiddenPositionsBtn : hiddenWalletsBtn}
      </div>
    );
  }

  renderPositions(position) {
    return (
      <div
        className={`openPositionCell
                        exchangeCoinsList__coinCell
                        exchangeCoinsList__coinCell_derivativePosition`}
        key={position.contract}
      >
        <div className={`openPositionCell__nameNposition`}>
          <div className={`openPositionCell__name`}>{position.contract}</div>

          <div className={`openPositionCell__position`}>
            <div className={`openPositionCell__size`}>
              <span className={`openPositionCell__positionTitle`}>Size:</span> {position.size}
            </div>
            <div className={`openPositionCell__side`}>
              <span className={`openPositionCell__positionTitle`}>Side:</span> {position.side}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderCoinBalances(coin, fiats) {
    // console.log('==============');
    // console.log('coin: ', toJS(coin));
    // console.log('fiats: ', toJS(fiats));
    let logo, name, fiatValue;
    let tryFiatOrAsset = true;
    const exId = this.props.store.rule.ex + this.state.baseCurrency;
    //console.log(toJS(coin), toJS(stores.exchangeInfo.instruments[this.props.store.rule.ex + this.state.baseCurrency]));

    if (this.isLeverage()) {
      if (stores.exchangeInfo.instruments[exId]) {
        if (
          stores.exchangeInfo.instruments[exId].some((a) => {
            return a.symbol === coin.asset;
          })
        ) {
          logo = getCoinLogo(coin.baseSymbol, this.props.store.rule.ex, coin.fiatValue);
          tryFiatOrAsset = false;
        }
      } else {
        return;
      }
    }

    if (tryFiatOrAsset) {
      if (fiats?.[coin.asset]) {
        logo = fiats[coin.asset].logo;
        name = fiats[coin.asset].name;
      } else if (
        stores.exchangeInfo.assets[this.props.store.rule.ex + this.state.baseCurrency]?.[coin.asset]
      ) {
        logo =
          stores.exchangeInfo.assets[this.props.store.rule.ex + this.state.baseCurrency]?.[
            coin.asset
          ].logo;
        name =
          stores.exchangeInfo.assets[this.props.store.rule.ex + this.state.baseCurrency]?.[
            coin.asset
          ].name;
      } else {
        return;
      }
    }

    name = !name || name === coin.asset ? coin.asset : `${coin.asset} ${name}`;

    if (logo) {
      logo = <img className={`exchangeCoinCell__logoImg`} src={logo} alt='' />;
    } else {
      logo = <img src={require('../../../assets/images/coins.png')} alt='' />;
    }

    if (coin.showFiatValue) {
      fiatValue = (
        <Popover text='Coin Balance' placement='bottom'>
          <sup className='coin-value'>
            ≈ &nbsp;
            {stores.info.currencies && stores.info.currencies[this.props.currency]
              ? formatNumber(coin.fiatValue, this.props.currency, '', false)[0]
              : formatNumber(coin.fiatValue, this.props.currency, '', false, 4)[0]}
          </sup>
        </Popover>
      );
    }

    return (
      <div
        className={`exchangeCoinCell
                        exchangeCoinsList__coinCell`}
        key={coin.asset}
      >
        <div className={`exchangeCoinCell__logo`}>{logo}</div>

        <div className={`exchangeCoinCell__nameNbalance`}>
          <div className={`exchangeCoinCell__name`}>{name}</div>

          <div className={`exchangeCoinCell__balance`}>
            <div className={`exchangeCoinCell__cryptoBalance`}>
              {localizedNumber(coin.roundedBalance)}
            </div>
            <div className={`exchangeCoinCell__fiatBalance`}>{fiatValue}</div>
          </div>
        </div>
      </div>
    );
  }

  renderExchangeError(content) {
    return <div className='allocate has-error'>{content}</div>;
  }

  renderBackupReminder() {
    if (
      this.props.editMode ||
      !this.props.isRuleNew ||
      !this.props.store.isBackup() ||
      this.props.store.backupUsed ||
      !stores.info.checkLastSelectedExchange() ||
      // || stores.info.lastSelectedExchange.id !== this.props.store.useDefaultRule().exchange_id // Not sure why this was here
      stores.templatesStore.isSelect
    ) {
      return null;
    }
    return (
      <div className='reminder'>
        It seems you have unfinished work here.{` `}
        <NavLink
          to='/renew'
          onClick={(event) => {
            event.preventDefault();
            this.props.store.applyBackup();
          }}
        >
          Continue
        </NavLink>
      </div>
    );
  }

  renderDetailsIfNotEditMode() {
    const help = (
      <Container className={`helpTooltip`}>
        <div className={`helpTooltip__title`}>Select An Exchange</div>
        <div>
          <p>
            You need to connect at least one exchange via an API Key before you can trade live with
            Coinrule.
          </p>
        </div>
        <div>
          <p>
            To read detailed guides on how to do this for each exchange, go to our{' '}
            <a
              href='https://coinrule.com/help/'
              target='_blank'
              rel='noopener noreferrer'
              onClick={() => {
                analytics.track('"Help Center" button clicked', {
                  page: 'Exchanges page',
                });
              }}
            >
              Help Center
            </a>
            .
          </p>
        </div>
        <div>
          Balances lower than 1 USD value are not shown and we don't consider them as holdings for
          trading purposes.
        </div>
      </Container>
    );

    //if (!this.props.editMode) {
    return (
      <div
        className={`content
                        newRuleFormSection`}
      >
        <div className={`newRuleFormSection__helpIcon`}>
          <Help message={help} />
        </div>
        {this.renderExchangeDetails()}
      </div>
    );
    //}

    //return null;
  }

  handleRuleRemove = (event) => {
    event.preventDefault();

    if (window.confirm('Do you want to move the rule to archive?')) {
      stores.userRules.deleteRule(this.props.store.rule.rule_id || this.props.store.editedRuleId);
      history.push('/');
    }
  };

  renderTelegramNotificationsButton() {
    if (!this.props.editMode) {
      return (
        <div className={`ruleActionsLinks__ruleTelegramNotificationsSwitch`}>
          <Switch checked={this.props.store.rule.tne} checkedChildren="on" unCheckedChildren="off" onChange={() => {
            this.props.store.rule.tne = !this.props.store.rule.tne
          }}/>
          <span>Telegram notifications</span>
        </div>
      );
    }
  }

  renderTemplatesButton() {
    if (!this.props.editMode) {
      return (
        <div
          className={`ruleActionsLinks__but
                          ${stores.templatesStore.isSelect && 'ruleActionsLinks__but_disabled'}
                          ruleActionsLinks__but_templates`}
          onClick={() => {
            stores.ruleDetailsStore.toggleTemplatesList();

            analytics.track('"Templates" button clicked');
          }}
        >
          <span>Templates</span>
        </div>
      );
    }
  }

  renderSmartGuideButton() {
    const isMobile = window.innerWidth <= 575;

    if (!this.props.editMode) {
      return (
        <div
          className={`ruleActionsLinks__but
                          ruleActionsLinks__but_smartGuide`}
          onClick={() => {
            stores.tourGuide.toggleRuleTour('show', true);
            analytics.track('"Smart guide" button clicked');
          }}
        >
          <span>{!isMobile && 'Smart'} Guide</span>
        </div>
      );
    }
  }

  renderBaseCurrencyDropdown() {
    const isMobile = window.innerWidth <= 575;

    return (
      <div
        className={`ruleMainCurrencyChoose
                        ruleActionsLinks__ruleMainCurrencyChoose`}
      >
        <div className={`ruleMainCurrencyChoose__title`}>
          {isMobile ? 'Prices in:' : 'View prices in:'}
        </div>
        <Select
          className={`ruleMainCurrencyChoose__dropdown`}
          title='Base currency'
          defaultValue={this.props.currency}
          onChange={(value) => this.baseCurrencyChanged(value)}
          loading={this.state.baseCurrencyChanging}
        >
          {stores.info.baseCurrencies.map((currency) => (
            <Option value={currency} key={currency}>
              {currency}
            </Option>
          ))}
        </Select>
      </div>
    );
  }

  async baseCurrencyChanged(value) {
    this.setState({
      baseCurrencyChanging: true,
    });

    await this.props.store.baseCurrencyChanged(false, value);
    this.props.changeCurrency(value);

    this.setState({
      baseCurrencyChanging: false,
      baseCurrency: value,
    });
  }

  renderRemoveButton() {
    if (!this.props.isRuleNew) {
      return (
        <div
          role='button'
          onClick={this.handleRuleRemove}
          className='ruleActionsLinks__but
                          ruleActionsLinks__but_remove'
        >
          <span>Delete</span>
        </div>
      );
    }

    return null;
  }

  render() {
    const totalConnectedExchanges = toJS(stores.userInfo?.exchanges).length;
    const maxExchanges = stores.user.getUser().plan.numberOfExchanges;

    return (
      <React.Fragment>
        <div
          className={`ruleActionsLinks
                        ${
                          !(window.location.href.search(/edit=1/) !== -1) &&
                          'ruleActionsLinks_editRule'
                        }`}
        >
          {this.renderTelegramNotificationsButton()}
          {this.renderTemplatesButton()}
          {this.renderSmartGuideButton()}
          {this.renderRemoveButton()}
          {this.renderBaseCurrencyDropdown()}
        </div>

        <div
          className='exchange'
          data-sequence={-1}
          id={`sequence-1`}
          onClick={() => stores.addRule.setSFPpendingSection(-1)}
        >
          <div className='rule-settings-block'>
            <div
              className='rsb-line
                          rsb-line_darkGray'
            >
              &nbsp;
            </div>
            <div className='rule-settings'>
              <Popover text='Select an Exchange to Trade on'>
                <div className='title-wrapper'>
                  <img src={require('../../../assets/images/exchange.svg')} alt='On' />
                  <div className='part-title title-darkGray'>On</div>
                </div>
              </Popover>
              <div className='settings'>
                <div
                  className={`newRuleTitleTabs
                                  newRuleTitleTabs_exchanges`}
                >
                  <MediaQuery maxWidth={1400}>
                    <div className={`newRuleTitleTabs__exchangesDropdown`}>
                      <div className={`title-select`}>
                        <div className='select-container select-green'>
                          {this.renderExchangeSelect()}
                        </div>
                      </div>
                    </div>
                  </MediaQuery>

                  <MediaQuery minWidth={1401}>
                    {this.renderExchangesTabs()}

                    {stores.user.user.plan.clearance <= 2 && (
                      <NavLink
                        className={`newRuleTitleTabs__leverageExchangesAdsLabel`}
                        to={
                          totalConnectedExchanges === maxExchanges ? {} : { pathname: '/exchanges' }
                        }
                        onClick={() => {
                          if (totalConnectedExchanges === maxExchanges) {
                            stores.addRule.setPaymentGateVisible('promo', true);
                          }
                        }}
                      >
                        Add Exchange
                      </NavLink>
                    )}
                  </MediaQuery>
                </div>

                {this.renderDetailsIfNotEditMode()}
              </div>
            </div>

            <TemplatesList
              store={this.props.store}
              parent={this.props.parent}
              isRuleNew={this.props.isRuleNew}
              shown={stores.ruleDetailsStore.showTemplatesList}
            />
          </div>
          {this.renderBackupReminder()}
        </div>
      </React.Fragment>
    );
  }
}

export default OneThing;
