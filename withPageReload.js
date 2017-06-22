/**
 * @param {string} slug - page slug
 * @param {Object} CustomComponent - custom React Component or stateless function
 * Simple decorator that extends component functionality so the data
 * is retrieved from REST api upon each locale or slug change
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import pages from 'store/pages';
import { setPageTitle } from 'utils';
import { FETCH_SLUG, SUCCESS } from 'static/constants';
import { fetchPageBySlug } from 'redux/modules/pages';

export default slug => CustomComponent => connect((state, { match : { params } }) => ({
    page       : state.pages.getIn(['entities', params.lang, pages.getIn([slug, params.lang])]),
    isFetching : state.pages.get('isFetching'),
    lang       : state.locale.currentLocale,
}), {
    fetchPageBySlug,
})(class WithPageReload extends Component {

    static propTypes = {
        page            : PropTypes.objectOf(PropTypes.any),
        history         : PropTypes.objectOf(PropTypes.any),
        lang            : PropTypes.string,
        fetchPageBySlug : PropTypes.func,
    };

    componentDidMount() {
        const { page, lang, fetchPageBySlug } = this.props;
        if (!page) {
            fetchPageBySlug(pages.getIn([slug, lang]))
                .then(this.setTitleFromResponse);
        } else {
            setPageTitle(page.get('title'));
        }
    }

    componentWillReceiveProps(nextProps) {
        const { lang, fetchPageBySlug, page, history } = this.props;
        const { lang: nextLang } = nextProps;
        const translates = page ? page.get('translations') : null;
        if (lang && nextLang !== lang && translates) {
            if (translates) history.push(`${translates.get(nextLang)}`);
            fetchPageBySlug(pages.getIn([slug, nextLang]))
                .then(this.setTitleFromResponse);
        }
    }

    setTitleFromResponse = (response) => {
        if (response && response.type === FETCH_SLUG + SUCCESS) {
            setPageTitle(response.payload[0].title);
        }
    };

    render() {
        return (
            <CustomComponent
                setPageTitle={this.setTitleFromResponse}
                {...this.props}
            />
        );
    }
});