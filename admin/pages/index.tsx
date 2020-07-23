import { EmptyState, Page, Layout } from '@shopify/polaris';
import React from 'react';
import store from 'store-js';

class Index extends React.Component {

    render() {
        return (
            <Page>
                <Layout>
                    <EmptyState
                        heading="Manage your guaranty"
                        action={{content: 'Add Product'}}
                        secondaryAction={{content: 'Learn more', url: 'https://help.shopify.com'}}
                        image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
                    >
                        <p>Track all product that are apply guarantee</p>
                    </EmptyState>
                </Layout>
            </Page>
        )
    }
}

export default Index;
