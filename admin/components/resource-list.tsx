import { Query } from 'react-apollo';
import {
    Card,
    ResourceList,
    Stack,
    TextStyle,
    Thumbnail
} from '@shopify/polaris';
import React from 'react';

import { GET_PRODUCTS } from '../grapql-statements';

interface Props {
    productIds: Array<string>
}

class ResourceListWithProducts extends React.Component<Props, {}> {

    render() {
        const {productIds} = this.props;
        const twoWeeksFromNow = new Date(Date.now() + 12096e5).toDateString();

        return (
            <Query query={GET_PRODUCTS} variables={{ids: productIds}}>
                {(result) => {
                    if (result.loading) {
                        return <div>Loading...</div>
                    } else if (result.error) {
                        return <div>{result.error.message}</div>
                    }

                    const data = result.data;

                    return (
                        <Card>
                            <ResourceList
                                showHeader
                                resourceName={{singular: 'Product', plural: 'Products'}}
                                items={data.nodes}
                                renderItem={(item: any) => {
                                    const media = (
                                        <Thumbnail
                                            source={item.images.edges[0] ? item.images.edges[0].node.originalSrc : 0}
                                            alt={item.images.edges[0] ? item.images.edges[0].node.altText : 0}/>
                                    );

                                    const price = item.variants.edges[0].node.price;

                                    return (
                                        <ResourceList.Item
                                            id={item.id}
                                            media={media}
                                            accessibilityLabel={`View detail for item ${item.title}`}
                                            onClick={(id) => {
                                                console.log(id);
                                            }}
                                        >
                                            <Stack>
                                                <Stack.Item fill>
                                                    <h3>
                                                        <TextStyle variation={'strong'}>{item.title}</TextStyle>
                                                    </h3>
                                                </Stack.Item>
                                                <Stack.Item>
                                                    <p>VND{price}</p>
                                                </Stack.Item>
                                                <Stack.Item>
                                                    <p>Expires on {twoWeeksFromNow}</p>
                                                </Stack.Item>
                                            </Stack>
                                        </ResourceList.Item>
                                    )
                                }} />
                        </Card>
                    )
                }}
            </Query>
        );
    }
}

export default ResourceListWithProducts;
