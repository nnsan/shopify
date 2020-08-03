import gql from 'graphql-tag';

export const PRODUCT_CREATE = gql`
    mutation importProduct($input: ProductInput!, $media: [CreateMediaInput!]) {
        productCreate(input: $input, media: $media) {
            product {
              id
              title
            }
        }
    }
`;
