---
title: Azure Webjobs - Docker Image and ARM Template
date: 2025-02-21 00:00:00-05:30
description: Creating docker image containing Azure WebJob project and deploying to Azure WebApp using ARM Template
img: ./atomic_habits.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [technology] # add tag
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

### Add a test html file (optional)
I do this to make it easy to test the project. The project came with a WeatherForecastController that you could use to test your deployed project as well.

![htmlfileinwebapp](https://github.com/user-attachments/assets/906b0cec-341a-4b2d-9238-424f95cda1d7)

### Create another console project in the same solution
Create a dotnet core console project to act as your webjob. My solution tree and project structure look like this:

![Solution structure](https://github.com/user-attachments/assets/9a1ddba9-8c08-4213-925b-9d9fab8cc655)

![Folder View](https://github.com/user-attachments/assets/479f2f4b-542b-41aa-ad53-1528d52d478b)

### Write code for webjob
Follow the official document to write the code for the webjob using the [WebJobs SDK](https://learn.microsoft.com/en-us/azure/app-service/webjobs-sdk-get-started).
Link to an example Program.cs:
Link to an example Function.cs:

### Add a run.cmd and settings.job file to the webjob project
The run.cmd file is executed by the Azure Webjob. The content of this file will simply hold the command to execute the project.
`
@echo off
dotnet BotBuilderIndexer.dll
`
The settings.job file holds the configuration for the webjob, such as the schedule. Read more [here](https://learn.microsoft.com/en-us/azure/app-service/webjobs-dotnet-deploy-vs#settingsjob-reference). My settings.job file looks like this:
`
{
  "schedule": "0 0 0 * * *"
}
`
**Ensure to include both these files in your project!**




