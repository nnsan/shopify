import gql from 'graphql-tag';

export const PRODUCT_UPDATE = gql`
    mutation updateProductTags($input: ProductInput!) {
        productUpdate(input: $input) {
            product {
              id
              tags
            }
        }
    }
`;
