# Automated Smart Contract Tester - Web Frontend (Client Application)

This application relies on [Automated Smart Contract Tester](https://github.com/erdenbatuhan/automated-smart-contract-tester) as its backend. Prior to proceeding, please ensure you have followed the setup instructions outlined in its [README](https://github.com/erdenbatuhan/automated-smart-contract-tester/blob/master/README.md). It should be up and running!

## Contents

- [Local Development](#local-development)
  - [Setup](#setup)
  - [Starting the Application](#starting-the-application)
  - [Running Lint Checks](#running-lint-checks)
- [Running the Application with Docker](#running-the-application-with-docker)
  - [Start Docker Containers](#start-docker-containers)
  - [Stop Docker Containers](#stop-docker-containers)
  - [Clean Up Docker Resources](#clean-up-docker-resources)
- [Tips for Production Deployment](#tips-for-production-deployment)
- [(Optional) Modifying Environment Variables](#optional-modifying-environment-variables)

## Local Development

**Note:** Ensure you configure port bindings for local development in the backend service. Specifically, uncomment the port binding for the `services` service within the [docker/docker-compose.production.yml](https://github.com/erdenbatuhan/automated-smart-contract-tester/blob/master/docker/docker-compose.production.yml) file, found in the [Automated Smart Contract Tester](https://github.com/erdenbatuhan/automated-smart-contract-tester) repository, before building and running the service.

### Setup

```bash
npm install
```

### Starting the Application

```bash
npm run serve
```

### Running Lint Checks

```bash
npm run lint
```

## Running the Application with Docker

### Start Docker Containers

To start Docker containers for the application, use the following command:

```bash
make start ENV=production ARGS=-d # Start containers in the background for production
```

Utilize the `ENV` argument to define the environment with the options below:

- **Development:** `development`.
  - **Note:** Before building and running the backend service in the development environment, ensure to uncomment the port binding for the `services` service. Find the necessary configuration within the [docker/docker-compose.production.yml](https://github.com/erdenbatuhan/automated-smart-contract-tester/blob/master/docker/docker-compose.production.yml) file in the [Automated Smart Contract Tester](https://github.com/erdenbatuhan/automated-smart-contract-tester) repository.
- **Production:** `production`.

Executing this command will halt any active containers related to this application before initializing new ones.

### Stop Docker Containers

To stop all Docker containers related to this application, use the following command:

```bash
make stop
```

### Clean Up Docker Resources

To clean up Docker resources, including removing containers, images, and volumes, use the following command:

This command will remove images, containers, volumes (e.g., dangling volumes such as dangling Docker volumes such as _0c18b ... 362cf_), networks, and orphaned containers.

```bash
make clean
```

## Tips for Production Deployment

When transitioning to a production environment, it’s crucial to adjust the backend host, as it will no longer default to `localhost`.

**Configure Environment Variables:** Create a `.env.production.local` file on the deployed machine. Depending on your production domain name, set the following variables in accordance with your host machine's configuration:

```bash
PORT=80 # No need to reassign if it matches the .env.production file

# Vue App Environment Variables (Utilized by the Vue.js application)
VUE_APP_BACKEND_HOST=http://<YOUR_DOMAIN_NAME_OR_IP>:${PORT}
```

Ensure `<YOUR_DOMAIN_NAME_OR_IP>` is replaced with your actual domain name or IP address, ensuring the Vue.js application can accurately reference the backend service in a production setting.

## (Optional) Modifying Environment Variables

Customization of specific environment variables specified in the `.env` file can be achieved by creating an additional `.env.local` file or an environment-specific `.env.[ENV].local` file (for instance, `.env.production.local` for a production environment). This adaptation should correspond with the configuration of the host machine where the application is being run.

For effective variable overriding, ensure that `.env.local` is imported subsequent to `.env`. Note that this order is already configured in the `Makefile`.
