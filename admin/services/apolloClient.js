import ApolloClient from 'apollo-boost';

class ApolloClientService {
    client = null;

    constructor() {
        this.client = new ApolloClient({
            uri: `/graphql`,
            fetchOptions: {
                credentials: "include"
            }
        });
    }

    query(gql, variables) {
        return new Promise((resolve, reject) => {
            this.client.query({
                query: gql,
                variables
            })
                .then(data => resolve(data))
                .catch(e => reject(e));
        });
    }
    mutate(gql, variables) {
        return new Promise((resolve, reject) => {
            this.client.mutate({
                mutation: gql,
                variables
            })
                .then(data => resolve(data))
                .catch(e => reject(e));
        });
    }
}

export default ApolloClientService;
