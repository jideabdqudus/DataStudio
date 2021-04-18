import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.scss';
import { setDataLocalStorage } from '../../../helpers/utils';

class BackIcon extends Component {
  render() {
    // is user located on Rule Details page
    const isLocatedOnRuleDetailsPage =
      window.location.href.indexOf('/rule/') !== -1 &&
      window.location.href.indexOf('?edit=') === -1;
    const isLocatedOnRuleEditPage =
      window.location.href.indexOf('/rule/') !== -1 &&
      window.location.href.indexOf('?edit=') !== -1;

    return (
      <div className={`backIcon`}>
        <Link
          className={`backIcon__backLink`}
          to={this.props.to}
          onClick={() => {
            if (this.props.title === 'New Rule') {
              setDataLocalStorage('should_restore_rule', false);
            }
          }}
        >
          &nbsp;
        </Link>
        <h1
          className={`backIcon__h1
												${isLocatedOnRuleEditPage && 'backIcon__h1_reducedWidth'}
												${isLocatedOnRuleDetailsPage && 'backIcon__h1_fullWidth'}`}
        >
          {this.props.title && (
            <span className={`backIcon__darkGrayTitle`}>{this.props.title}</span>
          )}
          {this.props.title1 && (
            <span className={`backIcon__lightGrayTitle`}>{this.props.title1} </span>
          )}
          {this.props.title2 && (
            <span className={`backIcon__darkGrayTitle`}>{this.props.title2}</span>
          )}
        </h1>
      </div>
    );
  }
}

export default BackIcon;
