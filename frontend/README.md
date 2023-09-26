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
