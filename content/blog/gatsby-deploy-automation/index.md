---
title: Gatsby - How to automate deployment using Github Actions
date: 2021-09-01 00:00:00-05:30
description: # Add post description (optional)
img: ./gatsby-gh-actions-deployment-title.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [tech, github-actions, gatsby] # add tag
---
I decided to write this blog with Gatsby and run it on Github Pages because I am on a quest to learn markdown and I like the idea of having version control over the articles. Some times I have too many ideas for the articles. Sometimes I am not able to finish the entire article at once and might need to jump between multiple posts. So, I usually start a new article on a new git branch. My articles so far have been unrelated, so I merge the finished articles to the master branch in different orders as and when they are ready. 

One of the goals I have set for myself is to be consistant at writing. This means I will have to frequently publish the articles. For the first few posts, I did manual deployments from my laptop. Now, I have automated the process. As soon as I merge a post to the master branch, a deployment script will publish the website. I have achieved this using [Github Actions](https://github.com/features/actions). 

Setting up the automated deployment involved writing a `workflow`. A workflow is nothing but a sequence of jobs, each involving a sequence of steps. I kept my workflow simple. It consists of a single job with a few steps. 

#### Checkout the code

The first step, of course, is to checkout the master branch. This is done using the [actions/checkout](https://github.com/actions/checkout) action, which is a pretty standard action everyone uses. 

#### Setup Node

Next, I have to build the source code. For that I need NodeJS setup in the machine where the job is running. The [runner](https://docs.github.com/en/actions/learn-github-actions/introduction-to-github-actions#runners) is simply a blank server at the time of creation (of course it has the "runner" software needed to run the workflow). I use the Github-hosted runner. The default Ubuntu server that Github provides is sufficient for my usecase. I digress. On the runner server, I setup NodeJs using the action [setup-node](https://github.com/actions/setup-node). This, again, is a fairly common action. It takes as input the node version you need. I use version 14.x

#### Install dependencies

The next step is pretty obvious. It is to install the library that the application needs using the command `npm ci`. If you are wondering why I did not use `npm install`, [this](https://www.geeksforgeeks.org/difference-between-npm-i-and-npm-ci-in-node-js/) article might help.

#### Build the project and Deploy to Github Pages

Yay! we are at the last step. In the [package.json](https://github.com/joshi-aparna/blog/blob/ba5ae29eaff4932eae3442e83897d7d72e240713/package.json#L57) file of the project, I have defined a script for deployment. This script is a combination of two commands; `gatsby build --prefix-paths` (read about it [here](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)) and `gh-pages -d public` (read about it [here](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/how-gatsby-works-with-github-pages/)). In the last step of the workflow, I run this command by running the following shell script.
```
git remote set-url origin https://git:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git
npm run deploy -- -u "github-actions-bot <support+actions@github.com>"
```
Before running the `npm` command, I have to set the remote url of the repository, which requires a secret _GITHUB_TOKEN_. This is a secret that is automatically created for you when you enable Github Actions on your repository. Also, the `npm` command needs the information of the user running it. We provide it using the param `-u`. Read about it [here](https://www.npmjs.com/package/gh-pages)

You can find the full workflow [here](https://github.com/joshi-aparna/blog/blob/master/.github/workflows/deploy-ghpage.yaml).

And that's it! Everytime I make a change to the master branch, my website is deployed automatically. It helps a lot when all I want to do sometimes is change the "Read", "Watch" or "Listen" links in the sidebar of the blog. By the way, have you checked these out, yet? 