---
title: How I fixed Startup-Order Problem in Kubernetes (with Windows Containers)
date: 2025-09-26 00:00:00-05:30
description: # Add post description (optional)
img: ./sidecar.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [tech] # add tag
---

Have you ever had two containers in the same Pod, but one absolutely needed to be running before the other could start?  

That was my situation with a workload in Kubernetes:

- Container A consumed logs to export to an external system using a custom exe.  
- Container B generated business logic that generates the logs.  

Container A needed a non-deterministic time to authenticate to the external system and start the log consumption service. If B started too early, logs were lost.

---

## What Didn’t Work
- Running two containers in the same pod does not guarantee the order of container creation.
- Using a regular initContainer → runs to completion, then exits. Not what I needed.  
- Adding sleeps or custom wait scripts in Container B → fragile and hard to maintain.  

I wanted something *native, reliable, and maintainable*.  

---

## The Solution: Init Container with restartPolicy: Always

Kubernetes provides a neat trick:

- Declare the dependency container as an *initContainer*.  
- Set restartPolicy: Always to keep it running alongside other containers. This concept is called a ["sidecar"](https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/). 
- Add a *startupProbe* to the initcontainer to ensure the log consumption process is ready before the main container starts.  

This approach works across Linux and Windows containers, though it’s especially helpful for Windows workloads where traditional shell-based probes or scripting hacks are harder.  

---

## YAML Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sampledeployment
  labels: 
    app: sample
    type: Deployment
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  replicas: 1
  selector:
    matchLabels:
      app: sample
  template:
    metadata:
      labels:
        app: sample
    spec:
      initContainers:
      - name: sidecar
        image: __SIDECAR_IMAGE_NAME__ #replaced at runtime
        restartPolicy: Always #MAGIC
        startupProbe:
          failureThreshold: 10
          periodSeconds: 30
          timeoutSeconds: 10
          exec:
            command:
              - powershell
              - -Command
              - |
                $process = Get-Process -Name "logconsumptionservice" -ErrorAction SilentlyContinue
                if ($process) { exit 0 } else { exit 1 }
      containers:
      - name: main
        image: __MAIN_IMAGE_NAME__ #replaced at runtime
        ports: 
        - containerPort: 80
        resources:
          requests:
            cpu: "300m"
            memory: "500Mi"
          limits:
            cpu: "400m"
            memory: "600Mi"
```
In this example, the "sidecar" container is started first because it is an "initcontainer". The main container is not started until the ["startup probe"](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/#startup-probe) returns a success. However, it checks only 10 times before failing the pod instead of waiting forever for the initcontainer to be started.
The magic ingredient here is the "restartPolicy" that continues to run the initcontainer as a sidecar. This is different from the normal behaviour where the initcontainer runs to completion.

Note that the main container is not even started (even the image is not pulled) until the init container is started successfully. This provides "true" sequence of execution.
Word of caution: Ensure that the sidecar feature is available for your K8 version.

## So what if my K8 version does not support sidecars?
I was also exploring ways to ensure process start sequence across two containers where sidecars are not available. The quick and dirty way to make this happen is to give a signal in Container A (log consumer) that the process is ready and wait for the signal in Container B (log generator) before starting the process. This way, you can allow K8 to download the images for the container and go ahead with the "entry point" code without having to wait. However, this is not clean code because the log generator needs to be aware of the container A.
If you really need to go this route, consider using ["postStart event"](https://kubernetes.io/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/) to wait for the log consumer service to start and then create signal. The signal can be something as crude as a file in a common mounted volume between both the containers.
