# DevOps Roadmap 2026 — Implementation Plan: Modules 10–20

This is the master build plan for the remaining 11 module pages. Follow it top to bottom. Do not ask questions; every convention is defined here.

---

## Global Conventions (apply to every module page)

**Template** — copy the structure of `module-09.html` exactly:
- `<head>`: same fonts, `style.css` + `module-page.css`, title `Module NN — <Name> | DevOps Roadmap 2026`
- Background divs (`bg-grid`, `bg-glow-1/2`), topbar with `MODULE NN / 20`, back link to `index.html#roadmap`
- Hero: level badge (`intermediate`/`advanced`/`pro` per roadmap card), phase label, `gradient-text` in h1, 5–7 `tech-tag`s
- Sidebar TOC (`toc-list`/`toc-link`) — every section id must exist; scroll-spy via the inline script
- Interview section: `interview-header` + `interview-grid` + `interview-card` → `interview-question`/`interview-answer` markup (onclick on the card)
- Footer nav: `module-footer-inner` + `footer-nav-btn prev-btn`/`next-btn`
- **Inline script at the bottom** (copy from module-09): `toggleInterview` + IntersectionObserver scroll-spy. **Never** `<script src="script.js">` — it crashes on module pages.

**Content style**:
- Annotated code blocks (`code-block` + `code-block-header` + spans: `command`, `comment`, `string`, `variable`, `keyword`, `output`, `function`) — every command gets an inline `#` comment
- ⭐ marks daily-use commands; `tip-box tip-pro` / `tip-warning` / `tip-danger` / `tip-success` for callouts (never a `danger-box` class — it doesn't exist)
- Tables via `content-table`; diagrams via `visual-box` + `visual-flow`/`flow-item`/`flow-arrow`
- Escape `<` `>` `&` in code blocks (`&lt;` `&gt;` `&amp;`)
- Explicit callbacks to earlier modules ("Module 02 payoff") and forward links; link the capstone `project1.html` where relevant
- Big modules get a 🔥 "Real-Time Incidents & Troubleshooting" section: symptom → investigation → root cause → fix → prevention
- Project walkthrough: `project-walkthrough` section, 6–8 `project-step` divs **with real code blocks inside**
- 6–8 interview cards; answers written as a strong candidate would speak them

**Wiring after each page is built**:
1. `index.html` dropdown: change `#module-N` → `module-NN.html`, add `live` class + `<span class="di-badge">FULL PAGE</span>`
2. `index.html` roadmap card: add `<p style="margin-top: 12px;"><a href="module-NN.html">📖 Open the full module — notes, diagrams &amp; interview questions →</a></p>` inside the project-card
3. Previous module's footer next-btn → this page (module-09's next currently points to `index.html#roadmap` — update it when 10 exists, and so on down the chain)
4. Module 20's next-btn → `project1.html` (title "🏆 Capstone Project")

**Also fix**: hero stat `data-target="16"` in index.html → `20` (site has 20 modules).

**Final audit after all pages** (run the checks used for modules 01–09):
- Every TOC href resolves to a section id; no duplicate ids
- No undefined CSS classes (diff against style.css + module-page.css)
- `<pre>`/`<div>`/`<section>` open/close counts match
- `function toggleInterview` present in every page that uses it; no `script.js` references
- All `module-*.html` links point to existing files; prev/next chain 01→…→20→capstone is unbroken

---

## Module 10 — Introduction to Cloud & AWS (Intermediate, Phase 3)

**Thesis**: Everything so far ran on VMs you own. The cloud is the same Linux/networking/Docker knowledge — rented by the second, with an API. Every M04 concept (subnets, NAT, firewalls, LB) reappears here with an AWS name on it.

**Sections**:
1. **Cloud Computing — IaaS/PaaS/SaaS** — responsibility-split table (who patches the OS?); CapEx→OpEx; the big three (AWS/Azure/GCP) and why this roadmap uses AWS
2. **Regions & AZs** — region = geography, AZ = independent datacenter; latency/data-residency; the capstone runs multi-AZ — why (one AZ can die)
3. **IAM** — users/groups/roles/policies; annotated policy JSON (reuse M09's ECR policy as the example); roles vs access keys (instance roles = no keys on disk); MFA + root-account lockdown ritual; least-privilege thread from M06/07/09
4. **EC2** — instance types decoded (t3.micro anatomy); AMIs, key pairs (M02 SSH payoff), Security Groups = stateful firewall (M04 table callback), Elastic IPs; launch via console once, then CLI; user-data script = your M02 server-setup.sh runs at boot
5. **VPC** — the capstone VPC built by hand: 10.0.0.0/16, public/private subnets across 2 AZs, IGW, NAT GW, route tables (M04 subnetting payoff — decode every CIDR); diagram matching project1.html §6
6. **S3** — buckets/objects, versioning, lifecycle policies (→ Nexus cleanup-policy analogy from M06); static website hosting; presigned URLs; the "public bucket" horror tip box
7. **ECR** — already met in M09; now the full picture: lifecycle policies for old images, scan-on-push teaser (M18)
8. **AWS CLI** — install/configure, profiles, `--query` + JMESPath with jq alternative (M02 payoff); ⭐ daily commands: `describe-instances`, `s3 sync`, `logs tail`
9. **ELB + RDS + CloudWatch (intro trio)** — ALB + target groups + health checks (M04/M09 LB concepts land here); RDS Multi-AZ + snapshots (capstone data layer); CloudWatch metrics/alarms as "Prometheus-lite" (M16 teaser)

**Incidents**: (1) surprise bill — forgot NAT GW + unattached EIPs; investigation via Cost Explorer/billing alarm, prevention = budgets + tags; (2) "can't SSH to instance" — SG vs NACL vs route table vs key, the M04 layered-debug ladder applied; (3) "access denied" IAM debugging — policy simulator, `aws sts get-caller-identity` ⭐

**Project (from roadmap card)**: Deploy Dockerized App on AWS — VPC from scratch (2 AZ, public/private) → IGW/NAT/routes → ALB + target group → EC2 in private subnets via user-data installing Docker + running the M08 image from ECR → IAM instance role for ECR pull (no keys) → S3 for static assets → smoke test through the ALB DNS name → teardown checklist (bill hygiene). Include CLI code for every step.

**Interviews**: region vs AZ · SG vs NACL · IAM role vs user+keys · why private subnets + NAT · how does an ALB health check work · S3 versioning vs lifecycle · debug "access denied"

---

## Module 11 — Container Orchestration with Kubernetes (Advanced, Phase 3)

**Thesis**: M09 ended at Compose's ceiling — one host, downtime-gap deploys, manual rollback. Kubernetes is the answer to "what if the server dies?" — desired-state reconciliation instead of imperative scripts.

**Sections**:
1. **Why Orchestration** — the four problems Docker alone can't solve (multi-host scheduling, self-healing, rolling updates, service discovery at scale); "you already felt this pain in M09 §6"
2. **Architecture** — control plane (API server, etcd, scheduler, controller-manager) vs worker nodes (kubelet, kube-proxy, containerd — M08 OCI callback); the reconciliation-loop diagram: *you declare, controllers converge*
3. **Local Setup** — minikube start; kubectl config/contexts; `kubectl get/describe/logs/exec` ⭐ mapped to their docker equivalents in a table
4. **Pods** — smallest unit; why pods not containers (shared network/volumes, sidecars); YAML anatomy fully annotated — apiVersion/kind/metadata/spec (this is the "decode `ls -l`" moment of the module)
5. **Deployments** — ReplicaSets under the hood; rolling update walkthrough with `kubectl rollout status/history/undo` ⭐ — *the M09 zero-downtime promise, delivered natively*
6. **Services** — ClusterIP/NodePort/LoadBalancer table; labels & selectors as the glue; kube-dns service discovery (M08 network-name callback)
7. **Ingress** — one LB, many services; nginx-ingress (M04 reverse-proxy payoff); TLS termination; annotated Ingress YAML
8. **ConfigMaps & Secrets** — externalized config (M08/M09 env_file lineage); base64 ≠ encryption danger box (M02 base64 callback); envFrom vs volume mounts
9. **Namespaces, Volumes, StatefulSets** — namespaces for isolation (capstone's three); PV/PVC/StorageClass flow diagram; StatefulSets vs Deployments (stable identity, ordered rollout) — run MongoDB properly
10. **Helm** — templates + values.yaml; `helm install/upgrade/rollback` ⭐; chart structure; "Compose file → Helm chart" mapping table
11. **Requests, Limits & HPA** — QoS classes; OOMKilled = M08 exit-137 callback; HPA YAML + load-test demo (capstone scaling section link)

**Incidents**: (1) `CrashLoopBackOff` — logs → previous logs (`-p`) → missing env var (M09 incident 6 reborn); (2) `ImagePullBackOff` — typo/private registry/imagePullSecrets; (3) `OOMKilled` — limits too low, `kubectl top` ⭐; (4) Pod `Pending` forever — insufficient resources / unschedulable, `describe` events reading

**Project (roadmap card)**: microservices app on Minikube — Deployments + Services for frontend/API/MongoDB (StatefulSet + PVC) → Ingress with host rules → ConfigMaps/Secrets → package as Helm chart with per-env values → HPA + `minikube` load test → chaos drill: kill pods and watch self-healing → portfolio repo with chart + README.

**Interviews**: pod vs container vs deployment · what happens when you `kubectl apply` (full path: API→etcd→scheduler→kubelet) · ClusterIP vs NodePort vs LoadBalancer vs Ingress · CrashLoopBackOff debug · requests vs limits · why StatefulSet for DBs · rolling update vs recreate

---

## Module 12 — Kubernetes on AWS: EKS (Advanced, Phase 3)

**Thesis**: Minikube taught concepts; EKS is where they meet production — and where Kubernetes meets IAM. The capstone's cluster is born in this module.

**Sections**:
1. **Why Managed K8s** — what AWS runs for you (control plane, etcd, upgrades) vs what's still yours (nodes, add-ons, workloads); EKS vs self-managed vs Fargate cost/effort table
2. **Creating a Cluster** — `eksctl` annotated YAML config (region, AZs from the M10 VPC, managed node group); what eksctl actually creates (CloudFormation under the hood); ~$0.10/h + nodes cost warning box
3. **Node Groups** — managed vs self-managed vs Fargate; spot node groups (capstone FinOps link); taints/labels preview
4. **kubectl to EKS** — `aws eks update-kubeconfig`; how auth works: aws-auth ConfigMap + IAM authenticator flow diagram — *"kubectl access denied" is an IAM problem, not a K8s problem*
5. **Deploy + ECR** — the M11 app on EKS; no imagePullSecrets needed — node role pulls from ECR (M10 instance-role payoff)
6. **Networking** — VPC CNI: pods get real VPC IPs (subnet-exhaustion callback from M10 plan); AWS Load Balancer Controller: Ingress → ALB, Service type LB → NLB (capstone's NLB explained)
7. **IRSA** — pod-level IAM without node-wide permissions; OIDC provider + service account annotation flow; the capstone security table's IRSA row, delivered
8. **CI/CD → EKS** — Jenkins deploy stage swaps `ssh deploy.sh` for `aws eks update-kubeconfig && helm upgrade --install`; kubeconfig credentials in Jenkins; automatic image-tag bumping via `helm --set image.tag=$IMAGE_TAG` (M09 §4 tags reach their destination)

**Incidents**: (1) "kubectl: You must be logged in" — aws-auth mapping missing for the CI role; (2) pods stuck Pending — subnet IP exhaustion (VPC CNI) → prefix delegation/bigger subnets; (3) ALB never provisions — controller not installed / missing subnet tags; (4) bill shock — forgotten cluster + NAT — teardown discipline

**Project (roadmap card)**: production pipeline → EKS: eksctl cluster in the M10 VPC → install ALB controller + metrics-server → Jenkins pipeline: build → ECR push (M09 shared lib reused) → `helm upgrade` to EKS with the new tag → smoke test via ALB DNS → rollback drill with `helm rollback` → teardown script. Full Jenkinsfile + eksctl YAML included.

**Interviews**: what does EKS manage for you · how does kubectl auth to EKS work · IRSA vs node role · why do pods get VPC IPs and what breaks · Ingress → ALB flow · how would CI deploy to EKS safely

---

## Module 13 — Infrastructure as Code with Terraform (Advanced, Phase 4)

**Thesis**: Modules 10–12 clicked and typed infrastructure into existence — unrepeatable and undocumented. Terraform makes infrastructure a Git artifact: reviewed, versioned, reproducible — the capstone's `techitfactory-infra` repo is this module.

**Sections**:
1. **IaC Concepts** — the M12 teardown/rebuild pain as motivation; declarative vs imperative; idempotency (Ansible comparison teaser M15)
2. **Architecture** — providers/resources/state triangle; the plan→apply reconciliation loop (deliberate K8s-controller analogy from M11)
3. **HCL Syntax** — annotated main.tf: provider, resource, variable (+types/defaults/validation), output, data source; `terraform.tfvars`; string interpolation
4. **Core Workflow** — `init` (providers, backend) → `fmt`/`validate` → `plan` (read the diff like a PR!) → `apply` → `destroy` ⭐; plan-output decoding block (`+`/`-`/`~`/`-/+` forces replacement — the scary one)
5. **State** — what's in tfstate (secrets warning — never commit it, M03 .gitignore callback); remote state: S3 backend + DynamoDB locking annotated config; why locking (two engineers, one apply)
6. **Provisioning AWS** — the M10 manual VPC rebuilt in ~80 lines of HCL: VPC, subnets, IGW, NAT, routes, SG, EC2 with user-data; side-by-side "console clicks vs code" payoff moment
7. **Modules** — inputs/outputs/source; refactor §6 into `modules/vpc`; registry modules (terraform-aws-modules/vpc) — when to write vs reuse; capstone repo-structure mirror
8. **Provisioners** — remote-exec/local-exec, and the honest verdict: last resort — user-data or Ansible (M15) instead
9. **Workspaces & Environments** — workspaces vs directory-per-env (capstone uses environments/dev+prod dirs — say why: explicitness beats magic)
10. **EKS via Terraform** — the eksctl cluster from M12 as `terraform-aws-modules/eks` code; one `apply` = capstone infra
11. **Terraform in CI** — Jenkins/GitHub Actions pipeline: fmt-check → validate → plan (posted to PR) → manual approval gate (M07 `input` payoff) → apply; OIDC to AWS — no stored keys (M09 GH-Actions teaser fulfilled, capstone auth model)

**Incidents**: (1) state lock stuck after killed run — `force-unlock` protocol; (2) drift — someone clicked in the console; `plan` shows it, import or revert decision tree; (3) the accidental `destroy` — prevent with `prevent_destroy`, plan-file discipline, approval gates; (4) "state file deleted" — S3 versioning saves you (backup thread from M06/07)

**Project (roadmap card)**: full AWS infra + EKS via modules — repo `techitfactory-infra` structure (bootstrap/modules/environments, matching the capstone) → S3+DynamoDB backend bootstrap → vpc + eks modules → dev/prod environments with tfvars → Jenkins pipeline with plan-approval gate → drift drill (hand-edit an SG, watch plan catch it) → post-mortem tradition continues.

**Interviews**: what is state and why remote+locked · plan vs apply · module design · how do you handle two envs · drift handling · secret handling in TF (state warning!) · what does `-/+` in a plan mean

---

## Module 14 — Programming & Automation with Python (Advanced, Phase 4)

**Thesis**: Bash (M02) is the glue; Python is the tool you reach for when glue isn't enough — APIs, JSON, AWS SDKs, anything over ~50 lines. Taught DevOps-first: every example manipulates infrastructure, not toy math.

**Sections**:
1. **Python Basics for Bash Speakers** — variables/types/f-strings; a Bash↔Python Rosetta table (`$1`→`sys.argv[1]`, `$(cmd)`→`subprocess.run`, `[ -f ]`→`os.path.exists`)
2. **Control Flow** — if/for/while with infra examples (iterate servers, retry loops — the M09 smoke-test retry rewritten in Python)
3. **Functions, Modules, Errors** — try/except done right (catch specific exceptions); why error handling matters more in automation than in app code; venv + requirements.txt (M05 payoff)
4. **Files: JSON/YAML/CSV** — parse a K8s manifest with PyYAML, patch it, write it back (this is what CI tag-bumping really is — M17 teaser); json module with the M02 jq comparison
5. **Key Libraries** — os/sys/subprocess (run kubectl/terraform from Python, check returncode — M02 exit-code discipline), requests (call any API), pathlib
6. **REST APIs** — requests + auth headers + pagination; GitHub API example: list open PRs older than 7 days → Slack nag message
7. **boto3** — session/client/resource; paginators; EC2 inventory, S3 ops, start/stop schedulers; IAM = the M10 credentials chain (env → profile → instance role)
8. **Automation Patterns** — the three classic scripts, each with full annotated code: health check with auto-recovery (restart Docker container via subprocess, alert Slack), log parser (M02's awk pipeline as Python with regex + Counter), backup rotation
9. **Scheduling** — cron (M02 payoff) + logging module instead of print; lock files to prevent overlap

**Project (roadmap card)**: the 3-script automation suite with complete code — (1) `aws_inventory.py`: boto3 EC2+S3 inventory → CSV + cost-tag audit; (2) `app_monitor.py`: health check loop, Slack webhook alert, docker restart auto-recovery, cooldown logic; (3) `log_report.py`: Nginx log parsing (regex), top IPs/status/URLs, HTML report generation. Cron-scheduled, venv-packaged, portfolio repo with README.

**Interviews**: when Python over Bash · subprocess safely (no shell=True with user input) · handle API pagination/rate limits · what boto3 credentials chain does · parse-and-patch YAML use case · how would you write an auto-remediation script and its risks (flapping, cooldowns)

---

## Module 15 — Configuration Management with Ansible (Advanced, Phase 4)

**Thesis**: Terraform builds the house (M13); Ansible furnishes it — and unlike your M02 Bash scripts, it's idempotent: run it twice, converge once. The M02→M09 server-setup scripts get their final form here.

**Sections**:
1. **Why Config Management** — the config-drift story (10 hand-configured servers, all different); idempotency vs Bash scripts (declarative "ensure installed" vs imperative "install")
2. **Architecture** — agentless over SSH (M02 keys payoff — Ansible is "SSH in a for-loop with a brain"); control node/managed nodes; how it compares to Chef/Puppet in one table
3. **Inventory** — static INI/YAML, groups, host/group vars; `ansible all -m ping` first-contact ritual
4. **Ad-hoc vs Playbooks** — ad-hoc for one-offs (`-m shell`, `-m service`) ⭐; playbooks for anything repeated
5. **Playbooks Deep-Dive** — annotated playbook: hosts/become/vars/tasks/handlers/notify; Jinja2 templates (nginx.conf.j2 — the M04 config, templated); when/loop/register/failed_when
6. **Modules** — apt/copy/file/service/user (the M02 server-setup.sh as a playbook — side-by-side!), docker_container, k8s
7. **Roles** — `ansible-galaxy init` structure; refactor the playbook into roles (common/docker/nginx/monitoring); role dependencies; Galaxy reuse judgment (M13 module-reuse parallel)
8. **Vault** — encrypt secrets in Git safely; `ansible-vault create/edit`; vault password in CI (Jenkins credential, M07)
9. **The Trio: TF + Ansible + K8s** — who does what table (provision vs configure vs orchestrate); TF outputs → Ansible inventory handoff; k8s module for manifest application
10. **AWS Dynamic Inventory** — `aws_ec2` plugin YAML, tag-based groups (`tag_role_web`); no more hardcoded IPs (elastic infra reality)

**Incidents**: (1) playbook works on one host, fails on another — drift the playbook itself now fixes (gather_facts conditionals); (2) hung task — SSH prompt/sudo password (M02/M09 non-interactive lineage) → `-K`, pipelining; (3) vault password leaked in CI log — masking + rotation protocol (series tradition)

**Project (roadmap card)**: TF provisions 3 EC2s (M13) → dynamic inventory picks them up by tag → roles: docker (install+compose deploy of M08 app), nginx (templated reverse proxy, M04), node-exporter (M16 setup!) → Vault-encrypted secrets → one `ansible-playbook site.yml` converges everything → idempotency proof (second run: changed=0 screenshot) → portfolio repo.

**Interviews**: Ansible vs Terraform · idempotency with example · handlers vs tasks · how dynamic inventory works · Vault in CI · agentless pros/cons · roles structure

---

## Module 16 — Monitoring & Observability (Advanced, Phase 4)

**Thesis**: Every incident in modules 02–15 was found by *looking*. Monitoring is how systems tell you first. This module builds the capstone's entire observability stack — and closes the M09 "notify on state change" thread properly.

**Sections**:
1. **Observability Pillars** — metrics/logs/traces table with "question each answers"; monitoring vs observability; SLO teaser (M19)
2. **Prometheus Architecture** — pull-based scraping diagram (server, exporters, pushgateway, alertmanager); why pull (targets discoverable, down-detection built in); TSDB + retention (the disk-full lineage continues!)
3. **Install on K8s** — kube-prometheus-stack Helm chart (M11 Helm payoff); what the operator gives you (ServiceMonitors, CRDs — M20 teaser); port-forward first look
4. **PromQL** — counters vs gauges vs histograms with real queries built stepwise: `rate(http_requests_total[5m])` decoded word by word; top-5 queries every engineer needs ⭐ (CPU, memory, pod restarts, request rate, error ratio)
5. **Node Exporter** — server metrics (the M02 health-report.sh, industrialized — explicit callback); installed via the M15 Ansible role
6. **Monitoring K8s** — kube-state-metrics vs cAdvisor vs metrics-server (what each measures table); the "pod OOMKilled" alert built from scratch (M11 incident, now auto-detected)
7. **Grafana** — data sources, panels, variables (`$namespace` dropdowns); import community dashboards (node-exporter #1860) then customize; dashboard-as-code JSON in Git (M03 discipline)
8. **Custom Dashboards** — the capstone's three (cluster/node/application) built panel by panel; RED method (Rate/Errors/Duration) for the app dashboard
9. **AlertManager** — alert rules YAML annotated (`for:` duration — no flapping); routing tree → Slack; grouping/inhibition/silences; **alert-fatigue doctrine**: every alert must be actionable, page vs ticket severity split (M09 notify thread fulfilled)
10. **App Metrics** — instrument the M08 Node app with prom-client (counter + histogram); `/metrics` endpoint; ServiceMonitor to scrape it
11. **Centralized Logging** — EFK vs Loki+Promtail comparison (capstone uses Loki — say why: cost, Grafana-native); LogQL basics mapped to the M02 grep/awk pipelines

**Incidents**: (1) Prometheus disk full — cardinality explosion (a label with user IDs); detect with `topk` on series counts, fix with relabeling — the retention-policy pattern's final boss; (2) alert storm at 3am — one node down fires 200 alerts → grouping + inhibition; (3) "metrics gap" — Prometheus OOM/restart, requests/limits (M11 payoff); (4) dashboard says fine, users say down — you monitored infra but not the user path → RED method + blackbox exporter

**Project (roadmap card)**: full stack on EKS via Helm → node-exporter via Ansible (M15) → instrument the app → three Grafana dashboards (JSON in Git) → alert rules: pod crash-loop, node CPU, p95 latency, error ratio → route to Slack with severity split → chaos validation: kill a pod, watch alert fire → post-mortem tradition.

**Interviews**: pull vs push · counter vs gauge vs histogram · explain `rate()` · how do you avoid alert fatigue · cardinality — why labels can kill Prometheus · metrics vs logs vs traces · how would you monitor a new service from scratch (RED/USE)

---

## Module 17 — GitOps with ArgoCD (Pro, Phase 5)

**Thesis**: M09/M12 pipelines *push* to clusters — CI holds cluster credentials and drift goes undetected. GitOps inverts it: the cluster *pulls* from Git, continuously reconciling. This is the capstone's deployment model, and the "Git is the source of truth" thread (M03) reaching its destination.

**Sections**:
1. **GitOps Principles** — declarative/versioned/pulled/reconciled; push vs pull diagram with the security argument (no cluster creds in CI); drift detection as continuous `terraform plan` for K8s (M13 analogy)
2. **Architecture** — application controller / repo server / API server / Redis (the capstone §9 components explained); reconciliation loop — the third time this diagram appears (K8s M11, TF M13, now ArgoCD): *convergence is THE pattern of modern ops*
3. **Install** — Helm/manifests into `argocd` namespace; CLI + UI first login; connect the repo
4. **Applications** — annotated Application YAML: source/destination/syncPolicy; manual → auto-sync → self-heal + prune progression (each step's risk/reward); sync waves & hooks (db-migration ordering)
5. **ArgoCD + Helm** — app repo vs config repo split (the capstone's three-repo model §5 — finally justified in full); Helm values per env; **the CI handoff**: Jenkins builds+pushes image, then commits the new tag to the config repo — ArgoCD does the rest (M09 pipeline's final form, one diagram)
6. **Multi-Environment** — dev auto-sync, prod manual-sync approval (capstone §14 governance); overlays/values layout; promotion = PR from dev values to prod values (deployment review = code review)
7. **App of Apps** — root app managing child apps (capstone §9 pattern); bootstrap a whole cluster from one YAML; disaster recovery story: new cluster + one apply = everything back (M13/M06 backup thread closure)
8. **RBAC & SSO** — projects as tenancy boundaries; read-only for devs, sync rights for leads; SSO note

**Incidents**: (1) app stuck `OutOfSync` — someone kubectl-edited live (drift!); self-heal demo reverting it in seconds; (2) sync fails with immutable-field error — delete/recreate strategies, `Replace=true`; (3) secret in the config repo — sealed-secrets/SOPS (M18 bridge) — the leak-protocol's GitOps chapter; (4) ArgoCD shows Healthy but app broken — health checks vs readiness (M09 smoke-test lesson, GitOps edition)

**Project (roadmap card)**: GitOps pipeline GitHub→ArgoCD→EKS — install ArgoCD on the M12 cluster → create `techitfactory-gitops` config repo (capstone structure: apps/base/environments) → Applications for the M11 app per env → Jenkins pipeline updates image tag in config repo (yq — M02/M14 payoff) → auto-sync dev, manual prod → App of Apps root → drift drill + rollback via `git revert` (the ultimate payoff: rollback is a Git operation) → post-mortems.

**Interviews**: GitOps vs traditional CD · pull vs push security argument · what happens when someone kubectl-edits directly · app repo vs config repo and why · how do rollbacks work in GitOps · App of Apps use case · how do secrets work in GitOps

---

## Module 18 — DevSecOps (Pro, Phase 5)

**Thesis**: Security threads have run through every module (leaked keys M03, credential scopes M07/M09, non-root M08, IRSA M12). This module makes them systematic: security as pipeline stages, not an audit at the end. Time to uncomment that Trivy stage from M09.

**Sections**:
1. **Shift-Left** — cost-of-fix curve; the pipeline gets guard stages diagram (each tool below = one stage); DevSecOps ≠ a security team's job
2. **SAST — SonarQube/SonarCloud** — what static analysis catches (SQLi, hardcoded secrets, bugs); Jenkins stage + quality gate that fails the build; triaging false positives honestly
3. **DAST — OWASP ZAP** — testing the *running* app (baseline scan in CI against the staging deploy); SAST vs DAST table (white-box vs black-box)
4. **Image Scanning — Trivy** — **uncomment the M09 stage** (the promised moment); scan output triage: CRITICAL gate, `.trivyignore` with justification comments; scan base images too (Alpine callback M08); ECR scan-on-push (M10)
5. **Dependency Scanning** — npm audit / pip-audit (M05 seed grown); lockfile discipline recap; Dependabot/Renovate auto-PRs; log4shell/left-pad war stories
6. **Secrets Management — Vault & AWS SM** — the graduation from Jenkins credentials: central store, dynamic short-lived creds, audit trail; External Secrets Operator for K8s (closes M17 incident 3); gitleaks pre-commit + CI stage (the M03 leak protocol, finally automated)
7. **Kubernetes Security** — NetworkPolicies (default-deny + allow rules — M04 firewall thinking inside the cluster), Pod Security Standards (non-root M08 payoff, readOnlyRootFilesystem), RBAC least-privilege (M06/07 thread)
8. **Supply Chain** — image signing with cosign (M09 §8 promise), SBOM generation (syft), verify-before-deploy admission
9. **Policy as Code — OPA/Kyverno** — "no :latest tags, no root, required labels" as cluster-enforced policy; policy = the platform's guardrails (M19 bridge)

**Incidents**: (1) build suddenly fails on CVE in a base image you didn't change — triage: exploitable? patch/pin/ignore-with-expiry decision tree; (2) gitleaks fires on a historical commit — history rewrite vs rotate reality (M03 answer still true); (3) NetworkPolicy breaks prod DNS — always allow kube-dns egress; test policies in staging (M04 debugging ladder inside the cluster)

**Project (roadmap card)**: the secure pipeline — Jenkins stages: gitleaks → SonarQube gate → npm audit → build → **Trivy (uncommented!)** → push signed image (cosign) → deploy via ArgoCD → ZAP baseline vs staging; Vault (or AWS SM + ESO) replaces raw K8s secrets; NetworkPolicies + PSS on the cluster; Kyverno policy blocking :latest; evidence table in README (each control → what it blocked in testing).

**Interviews**: SAST vs DAST vs image scan · what happens when Trivy finds a CRITICAL in prod's base image · secrets: Jenkins creds vs Vault — why graduate · default-deny NetworkPolicy rollout without breaking things · what is an SBOM and why · how do you prevent secrets in Git (layers: pre-commit/CI/rotation)

---

## Module 19 — SRE & Platform Engineering (Pro, Phase 5)

**Thesis**: You can now build and secure everything. SRE asks: how reliable should it be — and what does that cost? Platform engineering asks: how do 50 teams do all this without 50 snowflakes? The post-mortems you've written since M07 were SRE practice all along.

**Sections**:
1. **SLI/SLO/SLA & Error Budgets** — definitions with the capstone app as the example (SLI: p95 latency, success ratio — the M16 RED metrics reborn); SLO 99.9% table (43min/month budget); error budget = permission to ship vs freeze; SLA = contract with penalties
2. **Incident Management** — severity levels, roles (IC/comms/ops), the incident timeline; runbooks (your M02–M18 incident playbooks *are* runbooks — formalize them); blameless post-mortems (the series tradition, now with the industry template + "5 whys")
3. **Chaos Engineering** — hypothesis-driven failure injection; LitmusChaos on K8s: pod-delete and network-latency experiments with annotated YAML; blast radius + abort conditions (chaos ≠ breaking prod for fun)
4. **Toil Reduction** — toil definition (manual/repetitive/automatable/no-enduring-value); toil audit of everything in this roadmap you automated (the M14 scripts, M15 roles); the 50% rule
5. **Platform Engineering & IDPs** — the Jenkins shared library (M07/M09) was your first platform product; golden paths: "deploy a new service" = one template, not 12 tickets; platform-as-product mindset (devs are customers)
6. **Backstage** — service catalog, software templates, TechDocs; what it solves (discoverability, ownership — "who owns this service?" answered); awareness-level setup walkthrough
7. **FinOps** — the capstone §22 expanded: tagging discipline, right-sizing from M16 metrics, spot for stateless (M12), budget alerts (M10 incident 1 institutionalized); cost as a non-functional requirement
8. **Multi-Cloud & Cloud-Agnostic** — the honest take: K8s/Terraform/Ansible skills transfer, but chasing full agnosticism costs more than it saves for most orgs; when multi-cloud is real (regulation, acquisition)

**Project (roadmap card)**: SRE dashboard + chaos experiment — define 3 SLIs/SLOs for the capstone app → Grafana error-budget dashboard (burn rate panels, M16 payoff) → burn-rate alert → LitmusChaos pod-kill experiment: hypothesis → run → observe (did the M11 self-healing + M16 alerts behave?) → runbook for the failure mode → full post-mortem → portfolio: the SRE folder (SLOs, dashboard JSON, experiment YAML, runbook, post-mortem).

**Interviews**: SLI vs SLO vs SLA · error budget in practice (what happens when it's spent) · walk me through your incident process · what is toil, example you eliminated · what is an IDP and why platform-as-product · chaos engineering safely · how do you reduce cloud spend without hurting reliability

---

## Module 20 — AI in DevOps, Advanced Topics & Career Mastery (Pro, Phase 5)

**Thesis**: The victory lap with three jobs: see over the horizon (AI, mesh, operators), consolidate the portfolio you've been building since M01, and convert it into a job. Half technology, half career playbook — and it ends by pointing at the capstone.

**Sections**:
1. **AIOps** — anomaly detection vs threshold alerts (M16 limitation addressed); predictive scaling; log clustering; honest hype filter: AIOps assists triage, humans own judgment
2. **AI-Assisted DevOps** — LLMs for pipeline generation, K8s manifest review, incident summarization, PromQL/regex authoring; the golden rules: never paste secrets, review like a junior engineer's PR, you own what you ship
3. **Service Mesh — Istio/Linkerd** — what it adds over Ingress (mTLS everywhere, retries/timeouts, traffic splitting, golden metrics for free — M16/M18 connections); sidecar vs ambient; when you actually need one (and when it's over-engineering)
4. **Advanced K8s — CRDs & Operators** — you've been using operators all along (Prometheus M16, ArgoCD M17, Litmus M19) — now the pattern is named; CRD + controller = teach K8s new nouns; reconciliation loop, one last time
5. **Runtime Security — Falco** — the missing piece after M18's build-time scanning: detect at runtime (shell in a container, unexpected outbound); rule anatomy; alerts → the M16 pipeline
6. **CI/CD Landscape** — Jenkins vs GitHub Actions vs GitLab CI vs Tekton/Argo Workflows comparison table; concepts transfer (M07's promise, final form); how to answer "which CI is best?" like a senior (fit, not fashion)
7. **Portfolio** — the audit: by now the repos are — linux-automation (M02), git-workflow (M03), build-pipeline (M05), Nexus (M06), CI/CD (M07/09), dockerized app (M08), K8s+Helm (M11/12), techitfactory-infra (M13), python-suite (M14), ansible-roles (M15), monitoring (M16), gitops (M17), secure-pipeline (M18), SRE folder (M19); README standards, pinned repos, the post-mortem collection as the differentiator
8. **Resume & LinkedIn** — impact bullets formula (action + tech + measurable outcome) with before/after rewrites drawn from the roadmap's projects; ATS keywords; LinkedIn headline/about
9. **Interview Prep** — the question map: every common question → the module that answers it (table); system-design answer framework (requirements → architecture → deep-dive → tradeoffs) using the capstone as your worked example; STAR stories from your post-mortems
10. **Certifications** — CKA, AWS DevOps Pro, Terraform Associate, CKS roadmap table (what each proves, when it's worth it, prep pointers from these modules)

**Project**: Capstone assembly — the roadmap's final project *is* the capstone: link prominently to `project1.html`; checklist mapping every capstone section to the module that taught it (the full-circle table); final portfolio review checklist; "you are ready" close.

**Interviews**: how do you use AI tools responsibly in ops · service mesh vs ingress — when · what is an operator · Falco vs Trivy (runtime vs build-time) · walk me through your portfolio in 2 minutes · design a CI/CD platform for 50 teams (the everything-question)

**Special wiring**: next-btn → `project1.html`, label "🏆 Capstone Project".

---

## Build Order & Definition of Done

1. Build modules in order 10 → 20 (each references earlier ones)
2. After each: wire dropdown + roadmap card + previous module's next-btn
3. After module 20: fix hero stat 16→20, run the full audit, fix anything found
4. Done = audit clean + every dropdown item shows FULL PAGE + chain 01→20→capstone unbroken
