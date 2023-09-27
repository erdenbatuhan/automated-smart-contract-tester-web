# Automated Smart Contract Tester - Web Frontend (Client Application)

This application relies on [Automated Smart Contract Tester](https://github.com/erdenbatuhan/automated-smart-contract-tester) as its backend. Prior to proceeding, please ensure you have followed the setup instructions outlined in its [README](https://github.com/erdenbatuhan/automated-smart-contract-tester/blob/master/README.md). It should be up and running!

### Start Docker Containers

To start Docker containers for the application, use the following command:

```bash
make start ENV=prod ARGS=-d # Start containers in the background for production
```

You can specify the environment using the `ENV` argument with the following options:

- **Development:** `dev`
- **Production:** `prod`

This command will also stop any existing containers associated with this application before launching new ones.

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

### (Optional) Overriding Environment Variables

You can customize certain environment variables defined in `.env` by creating a `.env.local` file based on the configuration of the host machine where you're running this application. To ensure successful overrides, it's important to import `.env.local` after `.env` (This is already how it is set up in the `Makefile`). Here's an example:

**Note:** If you plan to run the application locally without Docker using the `npm run serve` command, you have to follow these steps:

1. In your `.env.local` file, set the `VUE_APP_BACKEND_HOST` variable to the following value. If your backend is running on a different port other than _4000_, make sure to update the port accordingly. This will allow for seamless communication with the backend on your local environment, even without a Docker network.
2. Make sure to uncomment the port binding for the `services` service in the [docker-compose.prod.yml](https://github.com/erdenbatuhan/automated-smart-contract-tester/blob/master/docker-compose.prod.yml) file of the [Automated Smart Contract Tester](https://github.com/erdenbatuhan/automated-smart-contract-tester) application. This step is necessary to allow the frontend to communicate effectively with the backend on your local machine.

```bash
### ------------------------------ ###
###  File:         .env.local      ###
###  Description:  Overrides .env  ###
### ------------------------------ ###

# Frontend Application Configuration
PORT=8080

# Vue App Environment Variables (These variables are used by the Vue.js application)
VUE_APP_BACKEND_HOST=http://localhost:4000
```
