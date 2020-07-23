import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Card } from '@shopify/polaris';
import React from 'react';

const GET_PRODUCTS_BY_ID = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        descriptionHtml
        id
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
  }
`;

class ResourceListWithProducts extends React.Component {
    render() {
        return (
            <Query query={GET_PRODUCTS_BY_ID}>
                {(result) => {
                    console.log(result);
                    return (
                        <Card><p>abc</p></Card>
                    )
                }}
            </Query>
        );
    }

}

export default ResourceListWithProducts;
