import App from 'next/app';
import Head from 'next/head';
import React from 'react';
import { AppProvider } from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';
import Cookies from 'js-cookie';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import '@shopify/polaris/dist/styles.css';

const client = new ApolloClient({
    fetchOptions: {
        credentials: "include"
    }
});
const { SHOPIFY_API_KEY } = process.env;

class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props;
        const config = { apiKey: SHOPIFY_API_KEY, shopOrigin: Cookies.get("shopOrigin"), forceRedirect: true };

        return (
            <React.Fragment>
                <Head>
                    <title>Nashtech global Training</title>
                    <meta charSet="utf-8" />
                </Head>
                <AppProvider i18n={translations}>
                    <ApolloProvider client={client}>
                        <Component {...pageProps} />
                    </ApolloProvider>
                </AppProvider>
            </React.Fragment>
        );
    }
}

export default MyApp;
