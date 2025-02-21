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
