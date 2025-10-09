---
title: Fetch K8 Job Result without Persistent Storage
date: 2025-10-07 00:00:00-05:30
description: # Add post description (optional)
img: ./k8job.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [tech] # add tag
---

Kubernetes Jobs are great for one-off workloads — running tests, data processing, or batch scripts.  
But they come with a catch: as soon as the Job finishes, the pod is terminated.  
If you rely only on ephemeral storage, all your results disappear instantly.

So, what are the options? One reddit thread summarized this well here - https://www.reddit.com/r/kubernetes/comments/yls8jf/simplest_way_to_retrieve_job_results/
1. Push the results to a blob storage.
2. Mount a PVC and run another pod with same PVC to fetch the results later.
3. Expose a rest endpoint somewhere. Make the job push the results to the endpoint after completion.
4. Write the results to container logs.

But, 2 out of the 4 options (blob storage and PVC) need an external dependency in terms of storage. The next option requires maintenance of a server to receive the results when ready. The last option is not neat (in my opinion).
So, if I only have a CI/CD system that triggers the K8 job and I don't really care about peristing the results for later (I only need to evaluate the result and signal a pass/fail in the CI pipeline), what is the solution that does not have an overhead of external systems or extra storage?

That’s exactly the situation I found myself in.  
Here’s what I learned about publishing results from ephemeral Kubernetes Jobs without relying on persistent volumes.

## Typical Setup

A Kubernetes Job runs a container like this:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: test-runner
spec:
  template:
    spec:
      containers:
        - name: runner
          image: my-test-image
          command: ["./run-tests.sh"]
          volumeMounts:
            - name: temp
              mountPath: /results
      restartPolicy: Never
      volumes:
        - name: temp
          emptyDir: {}
```

Here, /results is an emptyDir volume — ephemeral, lost when the pod dies.

When the Job completes, both the pod and volume are deleted — leaving you no chance to copy out the test results.


## The Challenge

I needed a way to capture the results file (about 2 MB) without:

Persistent Volumes

Access to the node filesystem

External storage services (like S3 or Azure Blob)


And since the container terminated immediately, I couldn’t just kubectl cp the file out manually.

So the question became: How do I make the results "leave" the pod before it terminates?

##  What Worked For Me

In my setup, I used a sidecar container that stayed alive for a few minutes after the main container completed.

Here’s how it worked:
My setup already involved a side car doing some stuff (read about it here - https://joshi-aparna.github.io/blog/k8sidecar/). I had to take advantage of this fact.

The main container ran tests and wrote results to a shared emptyDir volume.

The sidecar used a preStop hook with a sleep delay — keeping it alive for about 5 minutes after the Job finished.

An external system (the CI system, in my case) continuously polled Kubernetes for Job status. Once it detected the main container had completed, it connected to the sidecar and pulled the results from the shared volume.

This approach let me reliably extract results without persistent storage or third-party services.

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: runner
      image: my-test-image
      command: ["./run-tests.sh"]
      volumeMounts:
        - name: shared
          mountPath: /results
    - name: sidecar
      image: busybox
      command: ["sh", "-c", "while true; do sleep 5; done"] # placeholder code
      lifecycle:
        preStop:
          exec:
            - powershell
            - -Command
            - |
              Write-Host 'preStop: allowing 5m for log flush'; Start-Sleep -Seconds 300
      volumeMounts:
        - name: shared
          mountPath: /results
  volumes:
    - name: shared
      emptyDir: {}
```

It was simple, self-contained, and resilient — even when job durations varied.
The five-minute grace period gave the external collector enough time to fetch results before Kubernetes cleaned up the pod.


## Key Takeaways

Ephemeral ≠ inaccessible — results can be retrieved with smart lifecycle control.

Use sidecars and preStop hooks to add a short grace period for collection.

What other approaches could work in a scenario like this?
