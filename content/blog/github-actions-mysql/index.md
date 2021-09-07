---
title: Github Actions - Using Services with MySQL as Example
date: 2021-09-06 00:00:00-05:30
description: # Add post description (optional)
img: ./actions-mysql-title.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [tech, github-actions, mysql] # add tag
---

Github Actions provides a way to automate your software workflows. The most common usage I have come across is the CI and CD pipeline. Continuous Integration also includes unit tests and integration tests. Sometimes, we require dependent services temporarily to run integration tests, such as databases, caches and other dependencies. This is made easier with the usage of docker containers. As we know, every workflow run happens in an isolated environment called a "Runner". The Runner server can install a container of your choice and make it available through out the job. You can read about it in the official documentation [here](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idservices). The containers thus created are removed at the end of the job by the Runner. 

Let us walk through an example to understand more. In our example scenario, let us say that we need a MySQL database to run integration tests. Therefore, before the step to run tests, we need a MySQL service created. To create the database, we will use the image available on [Docker Hub](https://hub.docker.com/_/mysql). Checkout the image name and available tags here. Another important thing to observe here is the Environment Variables, particularly the mandatory ones. These environment variables need to be set in the workflow for the container to work as expected. 

For MySQL, we see that for the latest version (8.0.26), the only mandatory parameter is `MYSQL_ROOT_PASSWORD`. However, let us also create a database after server creation. Let us also create another user with password and grant all privileges to this user on the created database. 
```
services:
      mysql:
        image: mysql:latest
        env:
          MYSQL_ROOT_PASSWORD: ${{ env.MYSQL_ROOT_PASSWORD }}
          MYSQL_DATABASE: ${{ env.MYSQL_DB }}
          MYSQL_USER: ${{ env.MYSQL_USER }}
          MYSQL_PASSWORD: ${{ env.MYSQL_PASSWORD }}
```

We need to wait for the service to come up before we start with the test cases. If you are familiar with [docker create options](https://docs.docker.com/engine/reference/commandline/create/#options), Github provides a way to input these options to docker create command. Let us use that to set health check commands. This is because the image we are using does not come with a health check on its own. Let us use the `ping` command to check if the database is up and running.
```
services:
      mysql:
        image: mysql:latest
        env:
          MYSQL_ROOT_PASSWORD: ${{ env.MYSQL_ROOT_PASSWORD }}
          MYSQL_DATABASE: ${{ env.MYSQL_DB }}
          MYSQL_USER: ${{ env.MYSQL_USER }}
          MYSQL_PASSWORD: ${{ env.MYSQL_PASSWORD }}
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3
```
Once the service is running, we need a way to connect to it. We will make the service container expose a port so that we will be able to connect to the database from outside the container. This is done by providing the value to [`ports`](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idservicesservice_idports) param. For MySQL, let us expose the port 3306. This can be set in multiple ways. If you are okay with a random container port, you can set the port to `3306/tcp`. The container port is randomly assigned to a free port. You can later find out the port assinged during run-time using the variable `${{job.services.<service_name>.ports['3306']}}`. See full example [here](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idservices). 

```
services:
      mysql:
        image: mysql:latest
        env:
          MYSQL_ROOT_PASSWORD: ${{ env.MYSQL_ROOT_PASSWORD }}
          MYSQL_DATABASE: ${{ env.MYSQL_DB }}
          MYSQL_USER: ${{ env.MYSQL_USER }}
          MYSQL_PASSWORD: ${{ env.MYSQL_PASSWORD }}
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3
```

That is it. Now your MySQL service is up and running. You can connect to it with `--host=127.0.0.1`. The port in our example is the default 3306. Let us run a small debug step to find out what permissions are set to the user that we set during service creation. I have set the username, password, etc in [env](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idenv) map so that I can reuse it here.

```
steps:
      - name: Debug
        run: |
          mysql --host=127.0.0.1 --user=${{ env.MYSQL_USER }} --password=${{ env.MYSQL_PASSWORD }} ${{ env.MYSQL_DB }} <<MY_QUERY
          SHOW GRANTS;
          MY_QUERY
```

The output of this MySQL query was this:
```
Run mysql --host=127.0.0.1 --user=testuser --*** sample_mysql_test <<MY_QUERY
Warning: arning] Using a password on the command line interface can be insecure.
Grants for testuser@%
GRANT USAGE ON *.* TO `testuser`@`%`
GRANT ALL PRIVILEGES ON `sample\\_mysql\\_test`.* TO `testuser`@`%`
```
There is a warning for the usage of password on CLI. This is expected :wink:

The full workflow thus:

```

name: MYSQL
on: [push]

jobs:
  debug:
    runs-on: ubuntu-latest
    env:
      MYSQL_USER: testuser
      MYSQL_DB: sample_mysql_test
      MYSQL_PASSWORD: ${{ secrets.TEST_DB_PASSWORD }}
      MYSQL_ROOT_PASSWORD: ${{ secrets.TEST_DB_ROOT_PASSWORD }}
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: ${{ env.MYSQL_ROOT_PASSWORD }}
          MYSQL_DATABASE: ${{ env.MYSQL_DB }}
          MYSQL_USER: ${{ env.MYSQL_USER }}
          MYSQL_PASSWORD: ${{ env.MYSQL_PASSWORD }}
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3
    steps:
      - name: Debug
        run: |
          mysql --host=127.0.0.1 --user=${{ env.MYSQL_USER }} --password=${{ env.MYSQL_PASSWORD }} ${{ env.MYSQL_DB }} <<MY_QUERY
          SHOW GRANTS;
          MY_QUERY

```