# Overview

This is source code for Shopify training. It includes 3 web applications and 1 shopify theme source.

The training have 4 sections which is: 

1. Shopify Overview
1. Set up a store (demo theme structure and modify product liquid)
1. Migrate to Shopify (demo the custom app and using it to import product to Shopify system)
1. Custom Storefront (demo the angular website using storefront API to get data from Shopify)


## themes (contains the theme resource of the store)

[The example online store](https://nashtechglobal.myshopify.com/)

We will use the themekit tool to handle the theme resource and make some tasks like: download, deploy and publish.

With themekit tool the config file values can be overridden by **environment variable** and environment variables can be overridden by command line flags

###For setup environment variables we can set as below.
`THEMEKIT_PASSWORD` take the password value

`THEMEKIT_THEME_ID` take the theme id value
  
`THEMEKIT_STORE` take the store url value
 
`THEMEKIT_IGNORE_FILES` take the ignore files value. Use a ‘:’ as a pattern separator.

For more information please refer this [link](https://shopify.github.io/themekit/configuration/)


### To use the themekit tool to get store theme we need to set up some requirement value as below:

1. Environment Variables: `NASHTECH_PASSWORD`, `NASHTECH_THEME_ID` , `NASHTECH_STORE`
1. If using Mac and run `source .env` to set temporary variable
1. Install Theme Kit - Command line tool as `theme`

### Example code

1. In product-template.liquid file. I already modify the product detail page to show specific content base on **product tags**

### Technical using in example

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

#### Referral
1. [Component Style](https://angular.io/guide/component-styles)
1. [CSS unit in media query px & em & rem](https://zellwk.com/blog/media-query-units/)
1. [Angular Universal](https://angular.io/guide/universal)

## admin

This is shopify custom application. That's used to illustrate how to setup an application

[Shopify example link](https://shopify.dev/tutorials/build-a-shopify-app-with-node-and-react/listen-for-store-events-with-webhooks)

### Requirement

1. Run `npm run dev` to start local server at port 3000
1. Using ngrok to forward the https request `ngrok http 3000`
1. Using [Authentication url](https://4336a0c4567f.ngrok.io/auth?shop=nashtechglobal.myshopify.com) to install the custom application to specify store

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

