---
title: Working with SMB and Containers on Windows
date: 2026-02-28 00:00:00-05:30
description: # Add post description (optional)
img: ./smb_reparse.png # Add image post (optional)
fig-caption: An open door revealing a dim interior with layered, intertwined shapes, symbolizing hidden indirection behind an apparently simple entry point.
tags: [tech] # add tag
---
# SMB Works… but My Container Won’t Start

I hit a confusing problem.
I could connect to an SMB share.  
Windows said everything was fine.

But my Windows container failed to start with errors like:

> `failed to eval symlinks`  
> `The system cannot find the path specified`

This post explains **why that happens**, in simple terms.

***

## What is SMB?

**SMB** is how computers share folders over a network.

When you see a path like:

`\\servername\path`

it means:

> “This folder lives on another computer, but I can use it.”

SMB is used everywhere for network drives and shared folders.

***

## Why `net use` is misleading

When something fails, people usually try:
`net use \\ComputerName\SharedFolder`

If it works, we assume:

*   The share exists
*   Permissions are correct
*   SMB is working

And we think:

> “The problem must be containers.”

That assumption is often wrong.

***

## Humans vs containers

Here’s the key idea:

> **Containers are stricter than humans.**

When *you* access a folder:

*   Windows helps you
*   Shortcuts are followed silently
*   Weird paths are tolerated

When a *container* accesses a folder:

*   No guessing
*   No shortcuts
*   Everything must be exact and safe

***

## How containerd resolves paths

Windows containers use a program called **containerd**.

Before mounting a folder, containerd tries to find the **real, final path**.

It uses a function called `filepath.EvalSymlinks()` which:

*   Follows any shortcuts or redirects
*   Finds where the folder actually lives
*   Fails if something blocks the way

If containerd can't resolve the full path, it stops with an error.

***

## Reparse points: folders that lie

A **reparse point** is a folder that looks real but secretly redirects somewhere else.

Think of it like:

> A door that looks normal but opens into a hidden tunnel

Windows is fine with this.  
`net use` is fine with this.

**Containers are not.**

***

## Why things break

This is why debugging is so painful:

| Test            | Result    |
| --------------- | --------- |
| `net use`       | ✅ Works   |
| Folder exists   | ✅ Yes     |
| Permissions     | ✅ Correct |
| Container start | ❌ Fails   |

Why?

Because:

*   `net use` checks **access**
*   containerd checks **the real path**

If the folder is a reparse point that can't be fully resolved, containerd says:

> "I can't figure out where this actually goes."

***

## How to check a folder

Windows lets you check whether a folder is hiding something:

`fsutil reparsepoint query C:\Your\Folder`

If Windows says the folder is **not** a reparse point:
✅ Containers can use it.

If Windows shows a redirect to another volume:
❌ Containers may fail.

***

## The takeaway

> **A folder that works for humans may not work for containers.**

*   `net use` tests access
*   containerd resolves the full path

Once you understand that difference, these errors finally make sense.
