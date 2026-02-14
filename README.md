# Hydrogen template: Skeleton

Hydrogen is Shopify’s stack for headless commerce. Hydrogen is designed to dovetail with [Remix](https://remix.run/), Shopify’s full stack web framework. This template contains a **minimal setup** of components, queries and tooling to get started with Hydrogen.

[Check out Hydrogen docs](https://shopify.dev/custom-storefronts/hydrogen)
[Get familiar with Remix](https://remix.run/docs/en/v1)

## What's included

- Remix
- Hydrogen
- Oxygen
- Vite
- Shopify CLI
- ESLint
- Prettier
- GraphQL generator
- TypeScript and JavaScript flavors
- Minimal setup of components and routes

## Getting started

**Requirements:**

- Node.js version 18.0.0 or higher

```bash
npm create @shopify/hydrogen@latest
```

## Building for production

```bash
npm run build
```

## Local development

```bash
npm run dev
```

## Development deployment (must choose the dev environment in the shopify cli)

```bash
npm run deploy
```

## Production deployment (must choose the production environment in the shopify cli)

### 1. Make sure the build works before deployment with production .env file

```bash
npm run build
npm run preview
```

### 2. Login to shopify cli and hydrogen cli

- use [faris@theandongroup.com] this email address
```bash
shopify auth login
shopify hydrogen login
```

### 3. Deploy from main branch 

```bash
npm run deploy
```
- select the production environment  - main branch

### 4. Check the url

[https://vicegolf.ae/](https://vicegolf.ae/)

### 5. Logut from shopify cli
```bash
shopify auth logout
shopify hydrogen logout
```

## Setup for using Customer Account API (`/account` section)

Follow step 1 and 2 of <https://shopify.dev/docs/custom-storefronts/building-with-the-customer-account-api/hydrogen#step-1-set-up-a-public-domain-for-local-development>

## Branches
- `main` - production with cicd pipeline - broken
- `dev` - development `npm run deploy` for deployment deployment (must choose the dev environment in the shopify cli)
- `versions prefix` - versions prefix for version control


## Export and Import data - Shopify 

- Used Altera shopify app for backup and restore
- Need to add metaobject definitions before importing meta fields
- follow below order for proper import and working
- The exported csv files are stored in the google drive
- Google drive backup link: <https://drive.google.com/drive/folders/1cuUNYzl5Qgv6Mp7vGhgJ9j8WxOjTssMG?usp=drive_link>

### Import Order for Data Migration  

#### 1. Redirects
   - Follow this specific order for proper import and functionality

#### 2. Metafield Definitions
   - Required for custom fields

#### 3. Metaobject Definitions
   - Must be imported before metaobjects

#### 4. Metaobjects
   - Requires definitions to be imported first

#### 5. Shop
   - Basic shop configuration

#### 6. Content
   - Blogs
   - Articles
   - Pages

#### 7. Products
   - Golf Balls
   - Other Products

#### 8. Catalogs
   - Product organization

#### 9. Collections
   - Smart Collections
   - Manual Collections

#### 10. Navigation
   - Menus

#### 11. Media
   - Files (note: may have import issues)

#### 12. Customer Data
   - Customers

#### 13. Order History
   - Orders (requires customers to be imported first)
   - Note: May have import issues

#### 14. Business Features
   - Companies

#### 15. Promotions
   - Discounts