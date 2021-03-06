import gql from 'graphql-tag';

export const GET_PRODUCTS = gql`
    query getProducts($ids: [ID!]!) {
        nodes(ids: $ids) {
            ... on Product {
                title
                handle
                descriptionHtml
                id
                tags
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


