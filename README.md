# Installation

The application was developed on MacBook Air M1 with node v20.17.0.

If you have [volta](https://volta.sh) you can install this node version with:

```
volta install node
```

Install dependencies:

```
npm install
```

# Running the application

Server will run on http://localhost:4200/.

```
npm start
```

# Application's overview

The Application is a workout logging app. Application used to refresh my angular knowledge.

# Project structure

The app is based on architecture described in [Angular enterprise architecture](https://angularexperts.io/products/ebook-angular-enterprise-architecture).

    app
        core - business logic used by multiply features
        features - business features, contains components and specific business logic
        layout - components used for application layout
        ui - generic components
