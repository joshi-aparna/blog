---
title: Service Mesh and Micro Services
date: 2021-11-21 00:00:00-05:30
description: # Add post description (optional)
img: ./service_mesh.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [tech] # add tag
---

Service Mesh is not new. But it continues to be a buzz word. It sounds quite complex for someone new. So, I intend to break it down (for my own understanding as well :wink:). 

# Do you need a service mesh?
- When you use a service mesh, all requests to-and-from your service go through it. That is, the service mesh acts as both forward proxy and reverse proxy. It adds two extra network hops. If this is not a trade-off you can do (may be because your network capacity is small), then consider other solutions. 
- On Kubernetes, service meshes run on side cars. Thefore, the number of containers in your system doubles. It consumes CPU and memory (though service meshes are very light weight and super fast, this is something you should consider).

# What does a service mesh do? 
On a high level, service mesh is used by one service to talk to another. You will eliminate from your service features around service-to-service communication that are non-functional such as telemetry, whitelisting, error handling (such as retries, circuit breaking, etc). 

If I had to summarize the most popular features of service mesh, I'd choose the following
- Service Discovery: You are no longer needed to configure the IP of the service you are contacting. Service mesh gives an abstraction to map service names to IP addresses. Therefore, your service needs to understand that it is contacting the "login" service, for example, and need not worry about what is the IP or the domain of that service. 
- Security, reliability and Observability: You can configure service-to-service authentication, user authorization, and telemetry on service mesh. 
- Connectivity: Some service meshes provice load balancing. They can help with canary testing or A/B testing new features by routing a portion of the incoming/outgoing traffic through different deployments. 


# Examples of Service Mesh
I came across a few blog where they use "Service Mesh" and "Istio" interchangably. However, Istio is only one of the examples for Service Mesh. A few other famous examples include [Linkerd](https://linkerd.io/), HashiCorp's [Consul](https://www.consul.io/), AWS [App Mesh](https://aws.amazon.com/app-mesh), [NGINX service mesh](https://www.nginx.com/products/nginx-service-mesh/).

# Where do you start?
I'd encourage to setup a service mesh locally and get your hands dirty. Istio has a pretty good sample project that you can deploy locally on minikube. You can find the documentation [here](https://istio.io/latest/docs/setup/getting-started/)

Once you deploy, you can run the following commands to understand the setup better
```
kubectl describe  pod/productpage-<<complete-pod-name>>

// Observe that the pod contains two containers
// 1. productpage
// 2. istio-proxy
```

Checkout the code for the sample that you deployed and see the code for service-to-service calls [here](https://github.com/istio/istio/tree/release-1.12/samples/bookinfo/src)

# Resources
I found a pretty descriptive blog on Service Mesh and is a pretty good place to start. I have linked it [here](https://www.infoq.com/articles/service-mesh-ultimate-guide-2e/)


