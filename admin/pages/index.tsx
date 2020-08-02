import { EmptyState, Page, Layout } from '@shopify/polaris';
import { TitleBar, ResourcePicker } from '@shopify/app-bridge-react';
import React from 'react';
import Cookies from 'js-cookie';
import ResourceListWithProducts from '../components/resource-list';

interface State {
    open: boolean,
    productIds: Array<string>
}

class Index extends React.Component<{}, State> {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            productIds: []
        };

        this.handleSelection = this.handleSelection.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {
        this.getSavedProducts().then((data) => {
            const productIds = (data.products && data.products.length > 0) ? data.products.map(p => p.id) : [];
            this.setState({productIds: productIds});
        });
    }

    render() {
        const {productIds} = this.state;
        const emptyState = productIds.length == 0;

        return (
            <Page>
                <TitleBar
                    title="Manage Your Guaranty"
                    primaryAction={{
                        content: 'Select Products',
                        onAction: () => {this.setState({open: true})}
                    }}
                />
                <ResourcePicker
                    open={this.state.open}
                    resourceType="Product"
                    showVariants={false}
                    onSelection={(resource) => {
                        this.handleSelection(resource)
                    }}
                    onCancel={() => this.setState({ open: false })}
                />
                {
                    emptyState ? (
                        <Layout>
                            <EmptyState
                                heading="Manage your guaranty"
                                action={{
                                    content: 'Add Product',
                                    onAction: () => {
                                        this.setState({open: true})
                                    }
                                }}
                                secondaryAction={{content: 'Learn more', url: 'https://help.shopify.com'}}
                                image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
                            >
                                <p>Track all product that are apply guarantee</p>
                            </EmptyState>
                        </Layout>
                    ) : (
                        <ResourceListWithProducts productIds={productIds}/>
                    )
                }
            </Page>
        )
    }

    async handleSelection(resource) {
        await this.saveSelectedProducts(resource.selection);
        this.setState({open: false});
    }

    getSavedProducts() {
        const shopOrigin = Cookies.get("shopOrigin");
        // @ts-ignore
        return fetch(`${SERVER_API}/shop-product/${shopOrigin}`).then((response: any) => {
            if (response.status >= 400) {
                throw new Error('Bad response from server');
            }

            return response.json();
        });
    }

    saveSelectedProducts(products) {
        const shopOrigin = Cookies.get("shopOrigin");
        // @ts-ignore
        return fetch(`${SERVER_API}/shop-product`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                shopOrigin: shopOrigin,
                products: products.map(item => { return {id: item.id, title: item.title}})
            })
        }).then((response: any) => {
            if (response.status >= 400) {
                throw new Error('Bad response from server');
            }

            return response.json();
        });
    }
}

export default Index;
