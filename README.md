# shopify

## Tool and Docs

1. Development tool [link](https://shopify.dev/tools)

## themes

[The example online store](https://nashtechglobal.myshopify.com/)

### Requirement

1. Environment Variables: **THEMEKIT_PASSWORD**=<the private app password>, **THEMEKIT_THEME_ID**=102946209957 , **THEMEKIT_STORE**=nashtechglobal.myshopify.com
1. If using Mac and run `source .env` to set temporary variable
1. Install Theme Kit - Command line tool as `theme`

### Main task

1. Custom the product detail page to show specific content base on **product tags**
1. Demo for how [themekit](https://shopify.github.io/themekit/) tool work

### Technical

1. [liquid](https://shopify.dev/docs/themes/liquid/reference/basics) template language
1. jquery
1. css

## storefront

### api

This is nodejs server using koa and koa-router to configure api.

Server start at port 3001

#### Require

1. MongoDB
1. node v12.16.3

#### Main tasks

1. Import example data if not existed
1. Get all products **GET /product**
1. Get all register products of a shop **GET /shop-product/:shopName** 
1. Register products of a shop **POST /shop-product**

#### Technical

1. nodejs
1. koa and koa-router
1. mongoose
1. inversify 

### anvy_shop

This is the web build by angular universal. This use to illustrate the scenario custom storefront.

Condition: We already have the web that content the introduce of our company and production and it's recognized by many people.
Requirement: Now we want to integrate the current web with the shopify buy/checkout process.

#### Main tasks

1. The web page launch at http://localhost:4000
1. There is some pages that show the product and company information
1. User can click on the Product to buy

#### Technical

1. angular and angular-universal
1. [Shopify JS Buy SDK](https://shopify.github.io/js-buy-sdk/)
1. bootstrap
1. scss

## admin

This is shopify custom application. That's used to illustrate how to setup an application

[Shopify example link](https://shopify.dev/tutorials/build-a-shopify-app-with-node-and-react/listen-for-store-events-with-webhooks)

### Requirement

1. Run `npm run dev` to start local server at port 3000
1. Using ngrok to forward the https request `ngrok http 3000`
1. Using [Authentication url](https://7a227be88e39.ngrok.io/auth?shop=nashtechglobal.myshopify.com) to install the custom application to specify store

### Main tasks

1. Create a web server as shopify application
1. Allow to import product automatically
1. Allow pick some products and add the special tag to them
1. Handle webhook event for PRODUCT_CREATE and ORDER_CREATE

### Technical

1. shopify - graph, webhook, app-bridge-react, polaris
1. koa, koa-router
1. reactjs - next
1. graphql - react-apollo

