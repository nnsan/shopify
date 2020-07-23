import gql from 'graphql-tag';

export const PRODUCT_CREATE = gql`
    mutation productCreate($input: ProductInput!, $media: [CreateMediaInput!]) {
        productCreate(input: $input, media: $media) {
            input {
            }
            media {
            }
        }
    }
`;
