/*
    React Component that looks for a script in a document's <head>
    and parses a JSON in order to get data containing shop order details
 */

import React, { Component, PropTypes } from 'react';
import { Route, Switch } from 'react-router-dom';
import { jsonToObject, setPageTitle } from 'utils';
import SuccessRoute from '../routes/Success';
import ErrorRoute from '../routes/Error';

class OrderView extends Component {
    state = {
        order  : null,
        status : null,
    };

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillReceiveProps() {
        if (this._isMounted && !this.state.order) {
            const scriptNode = document.getElementById('orderResponse');
            if (scriptNode) {
                const data = jsonToObject(scriptNode.textContent);
                if (data) {
                    this.setState({
                        ...data,
                    });
                }
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { status } = this.state;
        if (!prevState.status && (prevState.status !== status)) {
            if (status === 1) {
                setPageTitle('Success');
            } else {
                setPageTitle('Error');
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div className='page page_order'>
                <Switch>
                    <Route
                        {...this.state}
                        exact
                        path='/:lang/order/success'
                        render={props => (
                            <SuccessRoute
                                {...props}
                                {...this.state}
                            />
                        )}
                    />
                    <Route
                        {...this.state}
                        exact
                        path='/:lang/order/error'
                        render={props => (
                            <ErrorRoute
                                {...props}
                                {...this.state}
                            />
                        )}
                    />
                </Switch>
            </div>
        );
    }
}

OrderView.propTypes = {
    match : PropTypes.shape({
        params : PropTypes.shape({
            lang : PropTypes.string,
        }),
    }),
};

export default OrderView;