---
title: Authentication in Azure Arc-Enabled Servers
date: 2025-10-02 00:00:00-05:30
description: # Add post description (optional)
img: ./arc_auth.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [tech] # add tag
---

I recently ran into a situation where I couldn’t use the usual `DefaultAzureCredential` magic from the `Azure.Identity` library to authenticate my .NET app to Azure. I had to manually generate a token and include it in the HTTP request header. That’s when I discovered something interesting—**Arc-enabled servers have a slightly different authentication mechanism compared to Azure VMs**.

This post is a quick walkthrough of what I learned, how Arc-enabled servers handle managed identity, and how it all works under the hood.

---

## Azure VMs: The Classic Case

When your app runs on an Azure VM with a system-assigned or user-assigned managed identity, Azure injects a local endpoint into the VM (usually at `http://169.254.169.254/metadata/identity/oauth2/token`). This endpoint is backed by the Azure Instance Metadata Service (IMDS), which handles token issuance.

Your app (or the `Azure.Identity` library) makes a request to this endpoint, and voila—you get a token scoped to the resource you asked for (like Azure Key Vault or Azure Resource Manager).

---

## Arc-Enabled Servers: The Hybrid Twist

Arc-enabled servers are *not* running inside Azure. They could be on-prem, in another cloud, or even under your desk. So how do they authenticate using managed identity?

Here’s the trick: Arc-enabled servers use a **local agent** that acts as a bridge between your machine and Azure. When you enable system-assigned managed identity on an Arc server, the agent:

1. Registers the server with Azure AD.
2. Sets up a local token service (similar to IMDS, but not the same).
3. Handles token requests from your app.

The local endpoint is usually at `http://localhost:40342/metadata/identity/oauth2/token` (discover it using $env:IDENTITY_ENDPOINT), and it behaves similarly to the Azure VM IMDS endpoint—but under the hood, it’s the Arc agent doing the heavy lifting.

---

## The Challenge-Response Dance

Unlike Azure VMs, where the token endpoint is always trusted, Arc-enabled servers add an extra layer of security using a **challenge-response mechanism**.

Here’s how it works:

1. Your app sends a request to the local Arc token endpoint.
2. The Arc agent responds with a `401 Unauthorized` and includes a `WWW-Authenticate` header (something like `Basic realm=KEY_FILE_PATH`).
3. This header contains a path to a **secret key file** on disk (usually something like `C:\ProgramData\AzureConnectedMachineAgent\Tokens\8af777f4-2190-4b12-aafc-2543e26b4a7f.key`).
4. Your app (or the `Azure.Identity` library) reads the file, extracts the secret, and resends the request—this time with the secret in the `Authorization` header.
5. The Arc agent validates the secret and returns the access token.

### Watch-outs
1. On Windows, you must be a member of the local Administrators group or the Hybrid Agent Extension Applications group.
2. On Linux, you must be a member of the himds group.
3. The time duration allowed between the initial request to the local arc token endpoint and the second request that includes the secret key in header is only 60 seconds.

This mechanism ensures that only processes running on the machine (with access to the file system) can request tokens—adding a layer of local trust.

---

## Why Should You Care?

If you're using `DefaultAzureCredential`, you might not need to care—because it already knows how to detect and use the right endpoint, whether you're on a VM, Arc server, or even in GitHub Actions.

But if you're curious (like me), it's fascinating to see how Azure extends its identity model to hybrid environments. It’s also useful when debugging or building custom tooling that interacts with these endpoints directly.

For more details, check out the official docs on [Managed identity authentication on Arc-enabled servers](https://learn.microsoft.com/en-us/azure/azure-arc/servers/managed-identity-authentication)!
