import { EmptyState, Page, Layout } from '@shopify/polaris';
import { TitleBar, ResourcePicker } from '@shopify/app-bridge-react';
import { Mutation } from 'react-apollo';
import React from 'react';
import Cookies from 'js-cookie';
import ResourceListWithProducts from '../components/resource-list';
import { PRODUCT_UPDATE, SEARCH_PRODUCTS_BY_TAG } from '../grapql-statements';
import ApolloClientService from '../services/apolloClient';

interface State {
    open: boolean,
    productIds: Array<string>
}

const FAST_DELIVERY = 'DELIVERY_IN_1_HOUR';

class Index extends React.Component<{}, State> {
    shopOrigin: string;
    apolloClient: ApolloClientService;

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            productIds: []
        };
        this.shopOrigin = Cookies.get("shopOrigin");
        this.apolloClient = new ApolloClientService();

        this.handleSelection = this.handleSelection.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {
        this.getSavedProducts().then((data: any) => {
            const productIds = (data && data.products && data.products.length > 0) ? data.products.map(p => p.id) : [];
            console.log(productIds);
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
                <Mutation mutation={PRODUCT_UPDATE}>
                    {(updateProductTags) => {
                        return (
                            <ResourcePicker
                                open={this.state.open}
                                resourceType="Product"
                                showVariants={false}
                                initialSelectionIds={productIds.map(p => ({id: p}))}
                                onSelection={(resource) => {
                                    this.handleSelection(resource, updateProductTags);
                                }}
                                onCancel={() => this.setState({ open: false })}
                            />
                        );
                    }}
                </Mutation>
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

    async handleSelection(resource, mutation) {
        await this.saveSelectedProducts(resource.selection);

        for (const product of resource.selection) {
            await mutation({
                variables: {
                    input: {
                        id: product.id,
                        tags: [...product.tags, FAST_DELIVERY]
                    }
                }
            });
        }
        this.setState({
            open: false,
            productIds: resource.selection.map(item => item .id)
        });
    }

    getSavedProducts() {
        return new Promise((resolve) => {
            this.apolloClient.query(SEARCH_PRODUCTS_BY_TAG, {
                query: `tag:${FAST_DELIVERY}`,
                first: 100
            }).then(result => {
                const products = result.data.products.edges;
                resolve({products: products.map(p => p.node)});

            }).catch(e => {console.log(e)});
        });
    }

    saveSelectedProducts(products) {
        // @ts-ignore
        return fetch(`${SERVER_API}/shop-product`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                shopOrigin: this.shopOrigin,
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
