import gql from 'graphql-tag';

export const SEARCH_PRODUCTS_BY_TAG = gql`
    query searchProductByTag($query: String, $first: Int) {
        products (query: $query, first: $first) {
            edges {
                node {
                    title
                    tags
                    id
                }
            }
            pageInfo {
                hasNextPage
            }
        }
    }`;
