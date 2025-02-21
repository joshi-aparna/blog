---
title: Azure Webjobs - Docker Image and ARM Template
date: 2025-02-21 00:00:00-05:30
description: Creating docker image containing Azure WebJob project and deploying to Azure WebApp using ARM Template
img: ./azurewebjob.jpeg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [tech] # add tag
---
I was set out to add a [Azure WebJob](https://learn.microsoft.com/en-us/azure/app-service/webjobs-create?tabs=windowscode) to my dotnet core project. I already had a dotnet core project that deployed to Azure Webapp using a docker image. I had a docker file that would get deployed to an Azure Container Registry (or any other docker registry). I also had an ARM template that would then deploy the docker image to an Azure WebApp using ARM template.

Here is the catch! The official documentation for Azure Webjobs cover the steps to create and deploy the webjobs using visual studio and for dotnet framework console apps. My requirement was to deploy the webjob using a docker image and as a dotnet core console app. At the time of writing this document, there was a warning on the official page that read:
`
.NET Core Web Apps and/or .NET Core WebJobs can't be linked with web projects. If you need to deploy your WebJob with a web app, create your WebJobs as a .NET Framework console app.
`

So, I set out to figure a way out. Here is how I would set things up for a brand new dotnet core project. 

### Prerequisites
1. Docker Desktop should be running
2. The example here uses Visual Studio

### Create a new Dotnet Core project 
![newdotnetcorewebproject](https://github.com/user-attachments/assets/af753581-0a1a-4ccc-bfcb-df5324f1de95)

### Create another console project in the same solution
Create a dotnet core console project to act as your webjob. My solution tree and project structure look like this:

![Solution structure](https://github.com/user-attachments/assets/9a1ddba9-8c08-4213-925b-9d9fab8cc655)

![Folder View](https://github.com/user-attachments/assets/479f2f4b-542b-41aa-ad53-1528d52d478b)

### Write code for webjob
Follow the official document to write the code for the webjob using the [WebJobs SDK](https://learn.microsoft.com/en-us/azure/app-service/webjobs-sdk-get-started). Additionally, add a Nuget reference to Microsoft.Extensions.Logging.Console for console logging in your webjob.

Link to an example Program.cs: https://github.com/joshi-aparna/AzureWebAppWithWebJob/blob/master/webjob/Program.cs
Link to an example Function.cs: https://github.com/joshi-aparna/AzureWebAppWithWebJob/blob/master/webjob/Functions.cs

### Add a run.cmd and settings.job file to the webjob project
The run.cmd file is executed by the Azure Webjob. The content of this file will simply hold the command to execute the project.
`
@echo off
dotnet webjob.dll
`
The settings.job file holds the configuration for the webjob, such as the schedule. Read more [here](https://learn.microsoft.com/en-us/azure/app-service/webjobs-dotnet-deploy-vs#settingsjob-reference). My settings.job file looks like this:
`
{
  "schedule": "0 0 0 * * *"
}
`
**Ensure to include both these files in your project!**

### Let's dockerize!
I have ensured in my project structure that the solution file is in the parent folder of both the webapp and webjob projects. Right click on the webapp project -> Add -> Docker support.
Ensure that you have docker desktop app running.

**Improtant! Set the "Docker Build Context" to the parent folder containing both the webapp and webjob projects**

![image](https://github.com/user-attachments/assets/ba80da0b-a548-47c5-94c0-956b7ee1bdaf)

### Add webjob build and deploy steps to the docker file
Since the docker build context is set to a folder containing both webapp and webjob projects, you can build and publish the webjob project in the same docker file. Ensure that the webjob project is published to the path `app_data/jobs/triggered/webjob` for triggered webjobs and `app_data/jobs/continuous/webjob` for continuous webjob. Here `webjob` is the name of the webjob.

After the publish stage of the dotnet core api project, add the following lines
```
# This stage is used to build the webjob project
FROM publish AS publishwebjob
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["webjob/webjob.csproj", "webjob/"]
RUN dotnet restore "./webjob/webjob.csproj"
COPY . .
WORKDIR "/src/webjob"
RUN dotnet publish "./webjob.csproj" -c %BUILD_CONFIGURATION% -o /app/publish/app_data/jobs/triggered/webjob /p:UseAppHost=false
```

### Copy the webjob files to app_data on before service start
[This official document](https://learn.microsoft.com/en-us/azure/app-service/webjobs-create?tabs=windowscode#continuous-vs-triggered-webjobs) says that the files for the webjob need to be in the \site\wwwroot\app_data\Jobs path. In our docker file, we have set our work directory as /app.
`WORKDIR /app`
So, before starting the application, let us move the webjob files to the required path. To do this, create a file called `startup.cmd` in your webapi project with the following content. 
```
@echo off
xcopy /s /e /y "C:\app\app_data" "C:\home\site\wwwroot\App_data\"
```

Then, in the dockerfile, change the entry point to the following.
**Notice that the COPY stage is using the "publishwebjob" stage for the `from` parameter.**
```
FROM base AS final
WORKDIR /app
COPY --from=publishwebjob /app/publish .
ENTRYPOINT ["cmd", "/c", "startup.cmd && dotnet coreapp.dll"]
```

### Publish the coreapp project
Right click on the webapi project and select 'Publish'. In this example, I am publishing the image to Azure Container Registry. (Azure -> Azure Container Registry). 

### ARM template
I use the following ARM template to deploy the webapp along with the webjob. 
Link to the ARM template: https://github.com/joshi-aparna/AzureWebAppWithWebJob/blob/master/coreapp/deployment/deploy.json
(Note: In the linked ARM template, replace the placeholder values with the right values for your project)

A few things to remember:
1. Set WEBSITES_ENABLE_APP_SERVICE_STORAGE to true
2. Set WEBJOBS_IDLE_TIMEOUT appropriately. In my example, I set it to 86400.
3. Set "alwaysOn" to true

I create a new resource group on Azure and start deployment of the ARM template using the following command:
 `az deployment group create --name MyWebAppWithWebjobDeployment --resource-group coreapptest --template-file .\deploy.json`

Navigate to your resouce group -> webapp -> settings -> webjobs to find the deployed webjob. Hit "Run" to get started :) Happy coding :)
![image](https://github.com/user-attachments/assets/3b51e5a0-0553-49c7-a8ad-504fb7812cdf)


