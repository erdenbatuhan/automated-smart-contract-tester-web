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

### (Optional) Overriding Application Properties

You can customize certain environment variables defined in `application.properties` by creating a `.env` file based on the configuration of the host machine where you're running this application. To ensure successful overrides, it's important to import `.env` after `application.properties` (This is already how it is set up in the `Makefile`). Here's an example:

```bash
# .env
PORT=8080 # The port to which the application will be exposed.
```
