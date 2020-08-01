import { EmptyState, Page, Layout } from '@shopify/polaris';
import { TitleBar, ResourcePicker } from '@shopify/app-bridge-react';
import React from 'react';

class Index extends React.Component {
    state = {open: false};

    constructor(props) {
        super(props);
        this.handleSelection = this.handleSelection.bind(this);
    }


    render() {
        return (
            <Page>
                <TitleBar
                    title="Nashtech Training"
                    primaryAction={{content: 'Select Products'}}
                />
                <ResourcePicker
                    open={this.state.open}
                    resourceType="Product"
                    showVariants={false}
                    onSelection={(resource) => this.handleSelection(resource)}
                    onCancel={() => this.setState({ open: false })}
                />
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
            </Page>
        )
    }

    handleSelection(resource) {
        this.setState({open: false});
    }
}

export default Index;
