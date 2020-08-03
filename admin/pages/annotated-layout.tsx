import React from 'react';
import {
    Page,
    Layout,
    Card,
    Button,
    Form,
    FormLayout,
    TextField,
    Stack,
    SettingToggle,
    TextStyle,
    InlineError,
    Spinner
} from '@shopify/polaris';

import { Mutation } from 'react-apollo';
import { PRODUCT_CREATE } from '../grapql-statements';


interface State {
    guarantee: string,
    enabled: boolean,
    total: number,
    isLoading: boolean
}

class AnnotatedLayout extends React.Component<{}, State> {

    constructor(props) {
        super(props);
        this.state = {
            guarantee: 'Change of defective products for free within one month of purchase',
            enabled: true,
            total: 10,
            isLoading: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleImportProduct = this.handleImportProduct.bind(this);
        this.handleTotalProductChange = this.handleTotalProductChange.bind(this);
    }

    render() {
        const {guarantee, enabled, total, isLoading} = this.state;
        const status = enabled ? 'enabled': 'disabled';
        const doAction = enabled ? 'Disable': 'Enable';

        return (
            <React.Fragment>
                <Page>
                    <Layout>
                        <Layout.AnnotatedSection
                            title="The brief content of guarantee"
                            description="Add product to this App, it will display the guarantee description on Product Detail Page"
                        >
                            <Card sectioned>
                                <Form onSubmit={this.handleSubmit}>
                                    <FormLayout>
                                        <TextField
                                            label="Guarantee Description"
                                            value={guarantee}
                                            onChange={this.handleChange()}
                                            type="text"
                                            autoFocus={true}
                                        />
                                        <Stack distribution="trailing">
                                            <Button submit primary>Save</Button>
                                        </Stack>
                                    </FormLayout>
                                </Form>
                            </Card>
                        </Layout.AnnotatedSection>
                        <Layout.AnnotatedSection
                            title="Guaranty Update"
                            description="Temporarily disable all Product Guaranty"
                        >
                            <SettingToggle
                                action={{
                                    content: doAction,
                                    onAction: this.handleToggle
                                }}
                                enabled={enabled}
                            >
                                This setting is {' '} <TextStyle variation="strong">{ status }</TextStyle>
                            </SettingToggle>
                        </Layout.AnnotatedSection>
                        <Mutation mutation={PRODUCT_CREATE}>
                            {(importProduct) => {
                                return (
                                    <Layout.AnnotatedSection
                                        title="Import example product"
                                        description="Get the example product form the local server"
                                    >
                                        <Card sectioned>
                                            <Form onSubmit={() => {
                                                this.handleImportProduct(importProduct)
                                            }}>
                                                <FormLayout>
                                                    <TextField
                                                        id="totalProduct"
                                                        label="Total Product"
                                                        type="number"
                                                        value={`${total}`}
                                                        step={1}
                                                        min={1}
                                                        max={100}
                                                        onChange={this.handleTotalProductChange()}
                                                    />
                                                    {total != 0 && !total &&
                                                    <InlineError message="Total product is required" fieldID="totalProduct"/>
                                                    }

                                                    <Stack distribution="trailing" alignment="center" spacing="tight">
                                                        {isLoading &&
                                                        <Spinner
                                                            accessibilityLabel="Loading"
                                                            color="teal"
                                                            size="small"/>
                                                        }
                                                        <Button primary submit disabled={isLoading}>Import</Button>
                                                    </Stack>
                                                </FormLayout>
                                            </Form>
                                        </Card>
                                    </Layout.AnnotatedSection>
                                );
                            }}
                        </Mutation>
                    </Layout>
                </Page>
            </React.Fragment>
        )
    }

    handleSubmit() {
        this.setState({
            guarantee: this.state.guarantee
        });
        console.log('Submission', this.state);
    }

    handleChange() {
        return (value) => {this.setState({ guarantee: value})}
    }

    handleToggle() {
        this.setState(({ enabled }) => ({ enabled: !enabled }))
    }

    handleImportProduct(importProduct) {
        this.setState({isLoading: true});
        const {total} = this.state;
        this.fetchExampleData().then(async (products: Array<any>) => {
            for (let i = 0, len = products.length; i < total && i < len -1; i++) {
                const item = products[i];
                await importProduct({
                    variables: {
                        input: {
                            title: item.name,
                            descriptionHtml: item.description,
                            images: item.images.map(img => ({
                                src: img.src,
                                altText: img.type
                            })),
                            productType: 'Food',
                            variants:[{
                                sku: `FOOD-${i}`,
                                price: item.price,
                                taxable: false,
                                weight: 0.1,
                                weightUnit: 'KILOGRAMS',
                                inventoryItem: {
                                    tracked: true,
                                    cost: item.price - (item.price * 0.1)
                                },
                                inventoryQuantities: [{
                                    availableQuantity: 10,
                                    locationId: 'gid://shopify/Location/48914759845'
                                }]
                            }]
                        },
                        media: []
                    }
                });

                this.setState({isLoading: false});
            }
        });
    }

    handleTotalProductChange() {
        return (value) => { this.setState({ total: parseInt(value)}) }
    }

    fetchExampleData() {
        // @ts-ignore
        return fetch(`${SERVER_API}/product`).then((response) => {
            if (response.status >= 400) {
                throw new Error('Bad response from server');
            }

            return response.json()
        });
    }
}

export default AnnotatedLayout;
