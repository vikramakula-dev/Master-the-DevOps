# Production-Grade E-Commerce Platform on AWS EKS

## End-to-End DevOps Engineering Project Documentation

**Author:** Vikram Akula
**Role:** DevOps Engineer / Platform Engineer
**Version:** 1.0
**Cloud Platform:** AWS
**Container Platform:** Kubernetes (Amazon EKS)
**Deployment Strategy:** GitOps with ArgoCD
**Infrastructure as Code:** Terraform

---

# 1. Executive Summary

This project demonstrates the design, implementation, automation, deployment, monitoring, security, and operations of a Production-Grade E-Commerce Platform running on AWS.

The platform is built using modern DevOps, Platform Engineering, and GitOps principles to provide:

- Automated Infrastructure Provisioning
- Secure Cloud Architecture
- Kubernetes-based Container Orchestration
- Continuous Integration and Continuous Deployment
- Centralized Monitoring and Logging
- Security and Compliance Controls
- Production Deployment Governance

The objective is to create a real-world enterprise platform similar to what is used in large organizations such as Amazon, Netflix, Walmart, Reliance Jio, and Fortune 500 companies.

---

# 2. Business Requirement

The business requires a scalable E-Commerce platform capable of handling:

- User Registration
- Product Catalog Management
- Shopping Cart Operations
- Order Processing
- Authentication & Authorization
- Monitoring & Alerting
- Continuous Deployment

The platform must support:

- High Availability
- Scalability
- Security
- Cost Optimization
- Disaster Recovery
- Production Operations

---

# 3. Solution Overview

The solution is built using a cloud-native architecture on AWS.

## High-Level Architecture

```text
Users
   │
Internet
   │
Route53
   │
NGINX Ingress (NLB)
   │
Frontend
   │
API Gateway
   │
├── User Service
├── Product Service
├── Cart Service
├── Order Service
└── Payment Service
```

The entire platform runs on Kubernetes managed through Amazon EKS.

---

# 4. Technology Stack

## Cloud Platform

| Technology | Purpose            |
| ---------- | ------------------ |
| AWS        | Cloud Provider     |
| VPC        | Networking         |
| EKS        | Kubernetes         |
| ECR        | Container Registry |
| Route53    | DNS                |
| ACM        | SSL Certificates   |
| IAM        | Security           |
| CloudWatch | Cloud Monitoring   |

---

## Infrastructure as Code

| Tool           | Purpose                     |
| -------------- | --------------------------- |
| Terraform      | Infrastructure Provisioning |
| AWS CLI        | AWS Management              |
| GitHub Actions | Automation                  |

---

## Containerization

| Tool   | Purpose         |
| ------ | --------------- |
| Docker | Container Build |
| ECR    | Image Storage   |

---

## Container Orchestration

| Tool       | Purpose                 |
| ---------- | ----------------------- |
| Kubernetes | Container Orchestration |
| EKS        | Managed Kubernetes      |
| Helm       | Package Management      |

---

## GitOps

| Tool              | Purpose               |
| ----------------- | --------------------- |
| ArgoCD            | Continuous Deployment |
| GitOps Repository | Source of Truth       |

---

## Monitoring

| Tool         | Purpose            |
| ------------ | ------------------ |
| Prometheus   | Metrics Collection |
| Grafana      | Visualization      |
| AlertManager | Alerting           |

---

## Logging

| Tool     | Purpose        |
| -------- | -------------- |
| Loki     | Log Storage    |
| Promtail | Log Collection |
| Grafana  | Log Analysis   |

---

## Security

| Tool               | Purpose                |
| ------------------ | ---------------------- |
| GitHub OIDC        | Authentication         |
| IAM Roles          | Authorization          |
| IRSA               | Pod Authentication     |
| Trivy              | Vulnerability Scanning |
| SonarCloud         | Code Quality           |
| Kubernetes Secrets | Secret Management      |

---

# 5. Repository Architecture

The platform follows a Three Repository Model.

```text
GitHub
│
├── techitfactory-infra
│
├── techitfactory-app
│
└── techitfactory-gitops
```

---

## Infrastructure Repository

```text
techitfactory-infra
│
├── bootstrap
├── modules
│   ├── vpc
│   ├── iam
│   ├── ecr
│   ├── eks
│   ├── monitoring
│   └── security
│
└── environments
    ├── dev
    └── prod
```

Responsibilities:

- Infrastructure Deployment
- Terraform Modules
- Networking
- IAM
- EKS

---

## Application Repository

```text
techitfactory-app
│
├── services
│   ├── frontend
│   ├── api-gateway
│   ├── user-service
│   ├── product-service
│   ├── order-service
│   └── cart-service
│
└── .github
```

Responsibilities:

- Application Code
- Dockerfiles
- Unit Testing
- Build Pipelines

---

## GitOps Repository

```text
techitfactory-gitops
│
├── apps
├── base
└── environments
    ├── dev
    └── prod
```

Responsibilities:

- Kubernetes Manifests
- ArgoCD Applications
- Environment Configuration

---

# 6. Infrastructure Architecture

## AWS VPC

```text
10.0.0.0/16
```

---

## Public Subnets

```text
10.0.1.0/24
10.0.2.0/24
```

Used for:

- NAT Gateway
- NLB

---

## Private Subnets

```text
10.0.11.0/24
10.0.12.0/24
```

Used for:

- EKS Nodes
- Application Pods

---

## Network Components

### Internet Gateway

Provides internet access.

### NAT Gateway

Allows private resources to access internet.

### Route Tables

Control network routing.

### Security Groups

Firewall at instance level.

---

# 7. Kubernetes Architecture

## Amazon EKS

```text
EKS Cluster
│
├── Control Plane
│
└── Managed Node Groups
```

---

## Kubernetes Components

### Namespace

```text
argocd
monitoring
techitfactory
```

### Deployments

Manage pods.

### Services

Expose applications.

### Ingress

Provides external access.

### ConfigMaps

Store configuration.

### Secrets

Store sensitive information.

---

# 8. Application Architecture

## Frontend

Technology:

- NGINX
- HTML
- CSS
- JavaScript

Responsibilities:

- User Interface
- Product Display

---

## API Gateway

Responsibilities:

- Central Entry Point
- Authentication
- Request Routing

---

## User Service

Responsibilities:

- User Management
- JWT Authentication

---

## Product Service

Responsibilities:

- Product Catalog

---

## Cart Service

Responsibilities:

- Cart Management

---

## Order Service

Responsibilities:

- Order Processing

---

## Data Layer

| Store               | Used By                     | Purpose                        |
| ------------------- | --------------------------- | ------------------------------ |
| PostgreSQL (RDS)    | User, Product, Order Service | Persistent relational data     |
| Redis (ElastiCache) | Cart Service                | Fast in-memory cart & sessions |

Data practices:

- RDS Multi-AZ for High Availability
- Automated Daily Snapshots
- Credentials stored in AWS Secrets Manager
- Databases in Private Subnets only

---

# 9. GitOps Architecture

## ArgoCD Components

```text
ArgoCD Server
ArgoCD Repo Server
Application Controller
Redis
```

---

## App of Apps Pattern

```text
Root App
│
├── Frontend
├── API Gateway
├── User Service
├── Product Service
├── Order Service
├── Cart Service
└── Monitoring
```

Benefits:

- Single Source of Truth
- Automatic Sync
- Drift Detection
- Rollback

---

# 10. CI/CD Architecture

## Infrastructure Pipeline

```text
Git Push
   │
Terraform Validate
   │
Terraform Plan
   │
Terraform Apply
   │
AWS
```

---

## Application Pipeline

```text
Developer
   │
Git Push
   │
GitHub Actions
   │
Unit Test
   │
SonarCloud
   │
Docker Build
   │
Trivy Scan
   │
ECR Push
   │
GitOps Update
   │
ArgoCD
   │
EKS
```

---

# 11. Monitoring Architecture

## Prometheus

Collects:

- CPU Usage
- Memory Usage
- Pod Metrics
- Node Metrics

---

## Grafana

Dashboards:

- Cluster Dashboard
- Node Dashboard
- Application Dashboard

---

## AlertManager

Alerts:

- High CPU
- High Memory
- Pod Crash
- Node Failure

---

# 12. Logging Architecture

```text
Application Pods
      │
      ▼
Promtail
      │
      ▼
Loki
      │
      ▼
Grafana
```

Capabilities:

- Centralized Logging
- Log Search
- Error Investigation

---

# 13. Security Architecture

## Authentication

### GitHub OIDC

```text
GitHub
   │
OIDC
   │
IAM Role
```

No Access Keys required.

---

## Authorization

### IAM

Controls AWS Access.

### IRSA

Controls Pod Access.

### RBAC

Controls Kubernetes Access.

---

## Image Security

### Trivy

Scans Docker Images.

### ECR Scan

Scans Container Images.

---

## Secrets

Stored in:

- Kubernetes Secrets
- AWS Secrets Manager

---

# 14. Production Deployment Strategy

## Development

Automatic Deployment

```text
Push
 │
CI
 │
Build
 │
Deploy
```

---

## Production

Controlled Deployment

```text
Release
 │
Approval
 │
GitOps Update
 │
ArgoCD Sync
```

---

# 15. Observability Strategy

## Metrics

Prometheus

## Dashboards

Grafana

## Logs

Loki

## Alerts

AlertManager

---

# 16. Scalability Strategy

## Horizontal Pod Autoscaler

```text
Min Pods = 2
Max Pods = 10
```

Scales based on:

- CPU
- Memory

---

## Cluster Autoscaler

Automatically:

- Adds Nodes
- Removes Nodes

---

# 17. Disaster Recovery

## Infrastructure Recovery

Terraform State

```text
S3 Backend
```

---

## Kubernetes Recovery

Backup:

- Deployments
- Services
- ConfigMaps
- Secrets

---

## Recovery Objectives

### RTO

30 Minutes

### RPO

15 Minutes

---

# 18. Operational Runbook

## Cluster Health

```bash
kubectl get nodes
kubectl get pods -A
```

---

## ArgoCD

```bash
argocd app list
argocd app sync APP_NAME
```

---

## Logs

```bash
kubectl logs POD
```

---

## Metrics

```bash
kubectl top nodes
kubectl top pods
```

---

# 19. DevOps Best Practices Implemented

✅ Infrastructure as Code

✅ GitOps

✅ Continuous Integration

✅ Continuous Deployment

✅ Automated Security Scanning

✅ Centralized Monitoring

✅ Centralized Logging

✅ Container Security

✅ Non-Root Containers

✅ Network Policies

✅ Production Approval Gates

✅ Disaster Recovery

✅ Autoscaling

---

# 20. Key Skills Demonstrated

### AWS

- VPC
- IAM
- EKS
- ECR
- Route53
- ACM

### Terraform

- Modules
- Remote State
- Workspaces

### Kubernetes

- Deployments
- Services
- Ingress
- HPA
- RBAC

### DevOps

- GitHub Actions
- CI/CD
- GitOps

### Observability

- Prometheus
- Grafana
- Loki

### Security

- OIDC
- Trivy
- IRSA
- RBAC

---

# 21. Rollback Strategy

## Application Rollback

```text
Bad Deployment Detected (Alerts / Health Checks)
   │
ArgoCD Rollback to Previous Git Revision
   │
Kubernetes Rolling Update Back to Last Image
```

- Every deployment is a Git commit — rollback = revert commit
- Kubernetes keeps previous ReplicaSets for instant rollback
- Database changes use backward-compatible migrations

---

# 22. Cost Optimization (FinOps)

| Strategy               | Implementation                              |
| ---------------------- | ------------------------------------------- |
| Right-Sizing           | Resource requests/limits tuned from metrics |
| Autoscaling            | HPA + Cluster Autoscaler — pay for demand   |
| Spot Instances         | Non-critical node groups on EC2 Spot        |
| Single NAT Gateway     | Dev environment cost reduction              |
| ECR Lifecycle Policies | Auto-delete old container images            |
| Monitoring             | CloudWatch billing alarms + cost tags       |

---

# 23. Performance & Load Testing

Tools:

- k6 for HTTP load testing
- Grafana dashboards during test runs

Validated:

- Application behavior under 500+ concurrent users
- HPA scale-out and scale-in under load
- p95 latency within SLO before production release

---

# Project Outcome

Successfully designed and implemented a complete production-grade Kubernetes platform using AWS, Terraform, GitHub Actions, ArgoCD, Prometheus, Grafana, Loki, and EKS. The platform supports automated infrastructure provisioning, GitOps-based deployments, centralized monitoring and logging, security controls, autoscaling, and production deployment governance, providing a real-world DevOps and Platform Engineering implementation suitable for enterprise environments.
