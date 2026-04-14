import './style.css';

// ── Content ─────────────────────────────────────────────────────────────────

const CONTENT = {
  docker: {
    label: 'Docker',
    steps: [
      {
        concept: 'The Problem Docker Solves',
        terminal: [
          { t: 'codelab', text: 'You: "It works on my machine!"' },
          { t: 'codelab', text: 'Server: "cool, what do I do with this folder of files?"' },
          { t: 'blank' },
          { t: 'dim', text: '# Every server environment is different:' },
          { t: 'dim', text: '# Ubuntu 18, Python 3.8, Node 14, libpng-dev v1.6.34...' },
          { t: 'dim', text: '# Production: Debian 12, Python 3.11, Node 20, different libpng' },
          { t: 'blank' },
          { t: 'accent', text: 'Docker: package your ENTIRE environment into a portable image.' },
          { t: 'accent', text: 'Works exactly the same on your laptop, server, and cloud.' },
        ],
        diagram: 'problem',
        explanation: `<strong>The core problem:</strong> software depends on libraries, versions, system configs. Your laptop has Python 3.11 with 50 packages. The server has Python 3.8 and 5 packages. <code>pip install -r requirements.txt</code> breaks things. <strong>Docker solves this</strong> by packaging your app <em>and</em> all its dependencies into a sealed unit called a <strong>container image</strong>. The image contains everything needed to run your app — Python, npm, your code, all the .so files.`,
      },
      {
        concept: 'Your First Dockerfile',
        terminal: [
          { t: 'codelab', text: '# First, create a Dockerfile in your project root' },
          { t: 'cmd', text: 'cat > Dockerfile << \'EOF\'' },
          { t: 'out', text: 'FROM node:20-alpine' },
          { t: 'out', text: 'WORKDIR /app' },
          { t: 'out', text: 'COPY package*.json ./' },
          { t: 'out', text: 'RUN npm ci --production' },
          { t: 'out', text: 'COPY . .' },
          { t: 'out', text: 'EXPOSE 3000' },
          { t: 'out', text: 'CMD ["node", "server.js"]' },
          { t: 'out', text: 'EOF' },
          { t: 'blank' },
          { t: 'ok', text: '[Dockerfile created — 9 lines]' },
        ],
        diagram: 'dockerfile',
        explanation: `<strong>FROM node:20-alpine</strong> — starts from a pre-built image with Node.js already installed. Alpine means minimal OS (5MB base vs 700MB for Ubuntu). <strong>COPY</strong> copies files. <strong>RUN</strong> executes commands at build time. <strong>EXPOSE</strong> documents which port the app uses. <strong>CMD</strong> is what runs when the container starts. Think of <code>EXPOSE</code> as a label — it doesn\'t actually publish the port.`,
      },
      {
        concept: 'Build the Image',
        terminal: [
          { t: 'cmd', text: 'docker build -t myapp:latest .' },
          { t: 'blank' },
          { t: 'dim', text: 'Sending build context to Docker daemon   2.34kB' },
          { t: 'dim', text: 'Step 1/7 : FROM node:20-alpine' },
          { t: 'dim', text: '  --> Pulling from library/node' },
          { t: 'ok', text: '  --> a1b2c3d4e5f6' },
          { t: 'dim', text: 'Step 2/7 : WORKDIR /app' },
          { t: 'ok', text: '  --> Using cache' },
          { t: 'dim', text: 'Step 3/7 : RUN npm ci' },
          { t: 'ok', text: '  --> Running in 12.4s' },
          { t: 'blank' },
          { t: 'ok', text: 'Successfully built a1b2c3d4e5f6' },
          { t: 'ok', text: 'Successfully tagged myapp:latest' },
        ],
        diagram: 'build',
        explanation: `<strong>docker build</strong> runs each <code>RUN</code>/<code>COPY</code> instruction and caches the result as a <strong>layer</strong>. If you change only your <code>server.js</code> (step 7), steps 1–6 use the cache — builds are fast. The final image is a read-only stack of layers. Each layer records <em>what changed</em> from the previous layer. This is why Docker images are small for apps built on Alpine — shared base layers are shared across all images on the host.`,
      },
      {
        concept: 'Run Your Container',
        terminal: [
          { t: 'cmd', text: 'docker run -d --name web -p 3000:3000 myapp:latest' },
          { t: 'ok', text: 'a1b2c3d4e5f6' },
          { t: 'blank' },
          { t: 'cmd', text: 'docker ps' },
          { t: 'out', text: 'CONTAINER ID  IMAGE         STATUS      PORTS' },
          { t: 'out', text: 'a1b2c3d4     myapp:latest  Up 3 secs   0.0.0.0:3000->3000/tcp' },
          { t: 'blank' },
          { t: 'cmd', text: 'curl localhost:3000' },
          { t: 'out', text: '{"status":"ok","uptime":3}' },
        ],
        diagram: 'run',
        explanation: `<strong>-d</strong> = detached (runs in background). <strong>--name web</strong> gives it a memorable name instead of random adjectives. <strong>-p 3000:3000</strong> maps host port 3000 → container port 3000. The container has its own <em>network namespace</em> — it can\'t see your host\'s other processes directly. Only exposed ports are reachable. <code>docker ps</code> shows running containers. The container is an <strong>isolated process</strong> — it shares the kernel with the host but has its own filesystem, network, and process tree.`,
      },
      {
        concept: 'Containers vs VMs',
        terminal: [
          { t: 'dim', text: '# Traditional VM:' },
          { t: 'dim', text: '┌──────────────────────────────────┐' },
          { t: 'dim', text: '│  Hardware                        │' },
          { t: 'dim', text: '│  ┌────────┐  ┌────────┐        │' },
          { t: 'dim', text: '│  │ Guest  │  │ Guest  │        │' },
          { t: 'dim', text: '│  │ OS +   │  │ OS +   │        │' },
          { t: 'dim', text: '│  │ App    │  │ App    │        │' },
          { t: 'dim', text: '│  │ ~GB    │  │ ~GB    │        │' },
          { t: 'dim', text: '│  └────────┘  └────────┘        │' },
          { t: 'blank' },
          { t: 'accent', text: '# Container (Docker):' },
          { t: 'accent', text: '┌──────────────────────────────────┐' },
          { t: 'accent', text: '│  Hardware + Host OS (Linux)      │' },
          { t: 'accent', text: '│  ┌────────────┐ ┌────────────┐  │' },
          { t: 'accent', text: '│  │ Container 1│ │ Container 2│  │' },
          { t: 'accent', text: '│  │ App        │ │ App        │  │' },
          { t: 'accent', text: '│  │ ~MB        │ │ ~MB        │  │' },
          { t: 'accent', text: '│  └────────────┘ └────────────┘  │' },
          { t: 'blank' },
          { t: 'hl', text: 'VMs: heavy, slow to start, full isolation' },
          { t: 'hl', text: 'Containers: lightweight, instant start, shared kernel' },
        ],
        diagram: 'vmvcontainer',
        explanation: `VMs emulate hardware and run a full OS — slow to boot (minutes), large (GB), and the hypervisor (VirtualBox, VMware) adds overhead. Containers use <strong>Linux namespaces</strong> (pid, net, mount, user) to isolate processes while sharing the host kernel — they\'re basically just processes with their own filesystem view. Start in <strong>milliseconds</strong>, size in <strong>megabytes</strong>. Docker on Mac/Windows actually runs a lightweight Linux VM — but you don\'t notice because Docker Desktop manages it.`,
      },
      {
        concept: 'Volumes: Persisting Data',
        terminal: [
          { t: 'cmd', text: '# Without volume: data vanishes when container is removed' },
          { t: 'cmd', text: 'docker run -d -p 5432:5432 postgres:16' },
          { t: 'ok', text: '3e4f5g6h7i8j' },
          { t: 'blank' },
          { t: 'cmd', text: 'docker run -d -p 5432:5432 \\' },
          { t: 'cmd', text: '  -v pgdata:/var/lib/postgresql/data \\' },
          { t: 'cmd', text: '  postgres:16' },
          { t: 'ok', text: '7k8l9m0n1o2p' },
          { t: 'blank' },
          { t: 'cmd', text: 'docker volume ls' },
          { t: 'out', text: 'DRIVER    VOLUME NAME' },
          { t: 'out', text: 'local     pgdata' },
          { t: 'blank' },
          { t: 'warn', text: '# The data survives: stop, rm, run again' },
        ],
        diagram: 'volume',
        explanation: `A <strong>volume</strong> is a directory on the host that Docker manages, mapped into the container\'s filesystem. When the container writes to <code>/var/lib/postgresql/data</code>, it\'s actually writing to <code>/var/lib/docker/volumes/pgdata/_data</code> on the host. <code>-v pgdata:/path</code> creates a named volume. <code>-v /host/path:/container/path</code> mounts a specific host directory. Volumes survive container deletion — essential for databases like Postgres, MySQL, Redis.`,
      },
      {
        concept: 'Docker Networks',
        terminal: [
          { t: 'cmd', text: 'docker network create mynet' },
          { t: 'ok', text: '9a8b7c6d5e4f' },
          { t: 'blank' },
          { t: 'cmd', text: 'docker run -d --network mynet --name db postgres:16' },
          { t: 'ok', text: '1x2y3z4a5b6c' },
          { t: 'blank' },
          { t: 'cmd', text: 'docker run -d --network mynet --name api myapp:latest' },
          { t: 'ok', text: '7d8e9f0a1b2c' },
          { t: 'blank' },
          { t: 'cmd', text: 'docker exec api psql -h db -U postgres -c "\\l"' },
          { t: 'out', text: 'List of databases' },
          { t: 'out', text: '  Name    |  Owner   | Encoding |' },
          { t: 'out', text: ' postgres | postgres | UTF8     |' },
          { t: 'blank' },
          { t: 'warn', text: '# Containers on same network reach each other by name as hostname' },
        ],
        diagram: 'network',
        explanation: `Docker\'s internal DNS resolves container names to their IP addresses on the same network. The <code>api</code> container can reach <code>db</code> simply by connecting to <code>host=db</code> — no IP addresses needed. Containers on the <strong>bridge network</strong> (default) can\'t reach each other by name — they\'re on an isolated Docker-managed bridge. <strong>Custom networks</strong> (created with <code>docker network create</code>) give you this DNS-based service discovery for free.`,
      },
      {
        concept: 'Docker for a Real Website',
        terminal: [
          { t: 'cmd', text: '# nginx serves static files, node runs the API' },
          { t: 'cmd', text: 'docker run -d --name nginx -p 80:80 nginx:alpine' },
          { t: 'ok', text: 'abc123' },
          { t: 'blank' },
          { t: 'cmd', text: 'docker run -d --name api -p 3000:3000 myapp:latest' },
          { t: 'ok', text: 'def456' },
          { t: 'blank' },
          { t: 'cmd', text: '# nginx proxies /api/* → api:3000' },
          { t: 'cmd', text: 'docker run -d -p 80:80 \\' },
          { t: 'cmd', text: '  -v ./nginx.conf:/etc/nginx/nginx.conf:ro \\' },
          { t: 'cmd', text: '  --network mynet nginx:alpine' },
          { t: 'ok', text: 'ghi789' },
          { t: 'blank' },
          { t: 'hl', text: '→ User hits your server IP on port 80' },
          { t: 'hl', text: '→ nginx receives the request' },
          { t: 'hl', text: '→ /api/* → api container; /* → static files' },
        ],
        diagram: 'realwebsite',
        explanation: `This is the actual architecture for most production websites. <strong>nginx</strong> is the public-facing web server: it terminates TLS (SSL), serves static files (HTML/CSS/JS), and proxies API requests to your Node/Python/etc app. Users never connect directly to your app — only to nginx. This means you can restart/update your API container without dropping connections: nginx buffers requests during the brief downtime. This pattern scales — just add more API containers behind nginx.`,
      },
    ],
  },

  compose: {
    label: 'Compose',
    steps: [
      {
        concept: 'Why docker-compose exists',
        terminal: [
          { t: 'dim', text: '# Running a real app needs multiple containers:' },
          { t: 'cmd', text: 'docker run -d --name db -v pgdata:/var/lib/postgresql/data \\' },
          { t: 'cmd', text: '  -e POSTGRES_PASSWORD=secret postgres:16' },
          { t: 'cmd', text: 'docker run -d --name redis -v redisdata:/data redis:alpine' },
          { t: 'cmd', text: 'docker run -d --name api --network mynet -p 3000:3000 \\' },
          { t: 'cmd', text: '  -e DB_HOST=db -e REDIS_HOST=redis myapp:latest' },
          { t: 'cmd', text: 'docker run -d --name nginx -p 80:80 \\' },
          { t: 'cmd', text: '  -v ./nginx.conf:/etc/nginx/nginx.conf:ro \\' },
          { t: 'cmd', text: '  --network mynet nginx:alpine' },
          { t: 'blank' },
          { t: 'err', text: '# 4 containers, 3 networks, 2 volumes, 6 env vars...' },
          { t: 'err', text: '# How do you start them in order? How do you stop them?' },
          { t: 'blank' },
          { t: 'accent', text: 'docker-compose.yml: define it all in one file' },
        ],
        diagram: 'composeintro',
        explanation: `Once you need more than one container, <code>docker run</code> commands become unmanageable — long strings of flags, hard to remember, impossible to version control. <strong>docker-compose</strong> (now just <code>docker compose</code> v2) lets you declare all your services, networks, volumes, and environment variables in a single YAML file. You can <code>docker compose up</code> everything in one command, <code>docker compose down</code> to clean up, and commit the file to git.`,
      },
      {
        concept: 'Your First docker-compose.yml',
        terminal: [
          { t: 'cmd', text: 'cat > docker-compose.yml << \'EOF\'' },
          { t: 'out', text: 'services:' },
          { t: 'out', text: '  api:' },
          { t: 'out', text: '    build: .' },
          { t: 'out', text: '    ports:' },
          { t: 'out', text: '      - "3000:3000"' },
          { t: 'out', text: '    environment:' },
          { t: 'out', text: '      - DB_HOST=db' },
          { t: 'out', text: '      - REDIS_HOST=redis' },
          { t: 'out', text: '    depends_on:' },
          { t: 'out', text: '      - db' },
          { t: 'out', text: '      - redis' },
          { t: 'out', text: '  db:' },
          { t: 'out', text: '    image: postgres:16' },
          { t: 'out', text: '    volumes:' },
          { t: 'out', text: '      - pgdata:/var/lib/postgresql/data' },
          { t: 'out', text: '  redis:' },
          { t: 'out', text: '    image: redis:alpine' },
          { t: 'out', text: 'volumes:' },
          { t: 'out', text: '  pgdata:' },
          { t: 'out', text: 'EOF' },
          { t: 'blank' },
          { t: 'ok', text: '[docker-compose.yml created]' },
        ],
        diagram: 'composeyml',
        explanation: `<strong>services:</strong> defines each container. <strong>build:</strong> means "build from Dockerfile in this dir" (for your app). <strong>image:</strong> means "pull this pre-built image" (for Postgres/Redis). <strong>depends_on:</strong> ensures containers start in the right order (db before api). Docker auto-creates a default network — containers can reach each other by service name (<code>db</code>, <code>redis</code>). No <code>docker network create</code> needed.`,
      },
      {
        concept: 'docker compose up',
        terminal: [
          { t: 'cmd', text: 'docker compose up -d' },
          { t: 'blank' },
          { t: 'dim', text: '[+] Running 3/3' },
          { t: 'ok', text: '[+] Running 3/3' },
          { t: 'ok', text: '[+] Running 3/3' },
          { t: 'ok', text: '[+] Running 3/3' },
          { t: 'ok', text: '[+] Running 3/3' },
          { t: 'ok', text: '[+] Running 3/3' },
          { t: 'ok', text: '[+] Running 3/3' },
          { t: 'blank' },
          { t: 'cmd', text: 'docker compose ps' },
          { t: 'out', text: 'NAME     IMAGE         STATUS    PORTS' },
          { t: 'out', text: 'api-1    myapp:latest Up         0.0.0.0:3000->3000/tcp' },
          { t: 'out', text: 'db-1     postgres:16  Up         5432/tcp' },
          { t: 'out', text: 'redis-1  redis:alpine  Up         6379/tcp' },
          { t: 'blank' },
          { t: 'cmd', text: 'docker compose logs --follow api' },
          { t: 'dim', text: 'api-1  | Server listening on port 3000' },
        ],
        diagram: 'composeup',
        explanation: `<code>docker compose up -d</code> starts all services in the background. Compose prefixes container names with the project name (<code>api-1</code>, <code>db-1</code>). <code>docker compose logs -f api</code> tails logs for the api service. <code>docker compose down</code> stops and removes everything. <code>docker compose restart api</code> restarts just the API. When you edit code, <code>docker compose up --build api</code> rebuilds and restarts only that service. This is your entire dev environment — one command to rule them all.`,
      },
      {
        concept: 'Dev vs Prod Compose',
        terminal: [
          { t: 'dim', text: '# docker-compose.yml (base config for all environments)' },
          { t: 'dim', text: '# Overrides with: docker compose -f base.yml -f prod.yml up' },
          { t: 'blank' },
          { t: 'cmd', text: '# --- prod.yml ---' },
          { t: 'out', text: 'services:' },
          { t: 'out', text: '  api:' },
          { t: 'out', text: '    restart: always' },
          { t: 'out', text: '    deploy:' },
          { t: 'out', text: '      replicas: 3' },
          { t: 'out', text: '  nginx:' },
          { t: 'out', text: '    image: nginx:alpine' },
          { t: 'out', text: '    ports:' },
          { t: 'out', text: '      - "80:80"' },
          { t: 'out', text: '      - "443:443"' },
          { t: 'blank' },
          { t: 'accent', text: '# In dev you get: one API replica, hot reload' },
          { t: 'accent', text: '# In prod you get: 3 API replicas, auto-restart on crash' },
        ],
        diagram: 'composediff',
        explanation: `The <code>-f</code> flag lets you layer compose files — a base config plus environment-specific overrides. In <strong>development</strong>: bind mounts for hot reload, no restart policy, single replica. In <strong>production</strong>: no bind mounts (built into image), <code>restart: always</code>, multiple replicas, resource limits. Compose profiles (<code>--profile</code>) let you toggle optional services (Redis queue, mail server) per environment.`,
      },
      {
        concept: 'How This Scales',
        terminal: [
          { t: 'cmd', text: '# Scale API horizontally (but docker compose load-balances!' },
          { t: 'cmd', text: 'docker compose up -d --scale api=3' },
          { t: 'blank' },
          { t: 'dim', text: 'WARN: Found a conflict for port 3000.' },
          { t: 'dim', text: '    Not attaching the port.' },
          { t: 'ok', text: '[+] Running 5/5' },
          { t: 'blank' },
          { t: 'cmd', text: 'docker compose ps api' },
          { t: 'out', text: 'NAME      IMAGE         STATUS' },
          { t: 'out', text: 'api-1     myapp:latest Up' },
          { t: 'out', text: 'api-2     myapp:latest Up' },
          { t: 'out', text: 'api-3     myapp:latest Up' },
          { t: 'blank' },
          { t: 'warn', text: '# WARNING: Docker compose doesn\'t do true load balancing!' },
          { t: 'warn', text: '# For real scaling, nginx upstream or Kubernetes (next tab)' },
        ],
        diagram: 'scalesimple',
        explanation: `<code>--scale api=3</code> runs 3 API containers. But here\'s the catch: Docker Compose <strong>doesn\'t provide built-in load balancing</strong> across replicas. Without an explicit upstream config in nginx, requests might all hit one container. For real horizontal scaling you need either nginx as a load balancer in front of your containers, or a proper orchestrator. This is exactly the gap Kubernetes fills.`,
      },
    ],
  },

  kube: {
    label: 'Kubernetes',
    steps: [
      {
        concept: 'The Scaling Problem',
        terminal: [
          { t: 'dim', text: '# Docker Compose on one server works great...' },
          { t: 'dim', text: '# until:' },
          { t: 'blank' },
          { t: 'err', text: '✗ Server goes down → all 5 services go down' },
          { t: 'err', text: '✗ Traffic spike → one server can\'t handle it' },
          { t: 'err', text: '✗ Need more CPU/RAM → must reprovision the whole server' },
          { t: 'err', text: '✗ Deploy with zero downtime → complex bash scripting' },
          { t: 'blank' },
          { t: 'accent', text: '# Kubernetes = orchestration layer across multiple servers' },
          { t: 'accent', text: '# A cluster of machines acts as ONE unified deployment target' },
          { t: 'blank' },
          { t: 'hl', text: 'If you\'re running 5 containers on 1 server → Docker Compose' },
          { t: 'hl', text: 'If you\'re running hundreds of containers on 10+ servers → K8s' },
        ],
        diagram: 'k8swhy',
        explanation: `Kubernetes (K8s) is an orchestration system — it manages containers across <strong>multiple machines</strong> (called nodes). It handles: spreading containers across nodes for reliability, restarting crashed containers automatically, scaling containers up/down based on load, rolling updates without downtime, and service discovery across a large cluster. You describe your desired state in YAML; K8s continuously works to maintain it. If a node fails, K8s reschedules its containers on healthy nodes automatically.`,
      },
      {
        concept: 'The Core Abstractions',
        terminal: [
          { t: 'dim', text: '# K8s builds on Docker — concepts map 1:1' },
          { t: 'blank' },
          { t: 'dim', text: 'Docker                    Kubernetes' },
          { t: 'dim', text: '─────────────────────────────────────────────' },
          { t: 'out', text: 'Container                 Pod (1+ containers, shared network)' },
          { t: 'out', text: 'docker run                 Deployment (declarative pod management)' },
          { t: 'out', text: '--network mynet           Service (stable IP, load balancing)' },
          { t: 'out', text: '-p 8080:80                Ingress (external access + TLS)' },
          { t: 'out', text: '-v pgdata:/path            PersistentVolumeClaim (persistent storage)' },
          { t: 'out', text: 'docker-compose.yml         Deployment + Service + Ingress YAMLs' },
          { t: 'blank' },
          { t: 'ok', text: '# K8s adds: auto-restart, scaling, rolling updates, scheduling' },
        ],
        diagram: 'k8sconcepts',
        explanation: `<strong>Pod</strong>: the smallest unit — one or more containers that always run together on the same node, sharing the same network namespace (can reach each other via localhost). <strong>Deployment</strong>: declaratively manages Pod replicas — says "I want 3 copies of this Pod running" and keeps it true. <strong>Service</strong>: stable network endpoint that load-balances across Pod replicas. <strong>Ingress</strong>: HTTP(S) entry point, handles routing and TLS termination.`,
      },
      {
        concept: 'A Real Kubernetes Deployment',
        terminal: [
          { t: 'cmd', text: 'cat > deployment.yml << \'EOF\'' },
          { t: 'out', text: 'apiVersion: apps/v1' },
          { t: 'out', text: 'kind: Deployment' },
          { t: 'out', text: 'metadata:' },
          { t: 'out', text: '  name: api' },
          { t: 'out', text: 'spec:' },
          { t: 'out', text: '  replicas: 3' },
          { t: 'out', text: '  selector:' },
          { t: 'out', text: '    matchLabels:' },
          { t: 'out', text: '      app: api' },
          { t: 'out', text: '  template:' },
          { t: 'out', text: '    metadata:' },
          { t: 'out', text: '      labels:' },
          { t: 'out', text: '        app: api' },
          { t: 'out', text: '    spec:' },
          { t: 'out', text: '      containers:' },
          { t: 'out', text: '      - name: api' },
          { t: 'out', text: '        image: myapp:latest' },
          { t: 'out', text: '        ports: [{ containerPort: 3000 }]' },
          { t: 'out', text: 'EOF' },
          { t: 'blank' },
          { t: 'cmd', text: 'kubectl apply -f deployment.yml' },
          { t: 'ok', text: 'deployment.apps/api created' },
          { t: 'blank' },
          { t: 'cmd', text: 'kubectl get pods -l app=api' },
          { t: 'out', text: 'NAME            READY   STATUS    RESTARTS   AGE' },
          { t: 'out', text: 'api-7d8f9-abc   1/1     Running   0          12s' },
          { t: 'out', text: 'api-7d8f9-def   1/1     Running   0          12s' },
          { t: 'out', text: 'api-7d8f9-ghi   1/1     Running   0          12s' },
        ],
        diagram: 'k8sdeploy',
        explanation: `<code>kubectl apply -f</code> sends your YAML to the K8s API server, which schedules the Pods onto nodes. <code>kubectl get pods</code> shows you the pods. K8s immediately ensures your desired state (3 replicas) matches reality. If a node fails and one of these pods dies, K8s automatically creates a replacement. The pod names get random suffixes — they\'re <strong>ephemeral</strong>. If a pod dies and a new one replaces it, it gets a new IP. This is why we need Services.`,
      },
      {
        concept: 'Services: Stable Network Access',
        terminal: [
          { t: 'cmd', text: 'cat > service.yml << \'EOF\'' },
          { t: 'out', text: 'apiVersion: v1' },
          { t: 'out', text: 'kind: Service' },
          { t: 'out', text: 'metadata:' },
          { t: 'out', text: '  name: api-service' },
          { t: 'out', text: 'spec:' },
          { t: 'out', text: '  selector:' },
          { t: 'out', text: '    app: api' },
          { t: 'out', text: '  ports:' },
          { t: 'out', text: '  - port: 80' },
          { t: 'out', text: '    targetPort: 3000' },
          { t: 'out', text: '  type: ClusterIP' },
          { t: 'out', text: 'EOF' },
          { t: 'blank' },
          { t: 'cmd', text: 'kubectl apply -f service.yml' },
          { t: 'ok', text: 'service/api-service created' },
          { t: 'blank' },
          { t: 'cmd', text: 'kubectl get svc' },
          { t: 'out', text: 'NAME          TYPE       CLUSTER-IP      PORT(S)' },
          { t: 'out', text: 'api-service   ClusterIP  10.96.142.78    80/TCP' },
          { t: 'blank' },
          { t: 'ok', text: '# Other pods reach it at: http://api-service' },
          { t: 'ok', text: '# DNS name: api-service.default.svc.cluster.local' },
        ],
        diagram: 'k8sservice',
        explanation: `A <strong>Service</strong> gives pods a stable IP that doesn\'t change when pods die and restart. It also load-balances across all pods matching the <code>selector</code>. <code>ClusterIP</code> (default): only reachable inside the cluster. <code>LoadBalancer</code>: provisions cloud load balancer (AWS ELB, etc.) for external traffic. The Service\'s IP lives in the cluster\'s internal DNS — other pods reach your API just by the name <code>api-service</code>. K8s\'s kube-proxy handles the actual packet routing.`,
      },
      {
        concept: 'Ingress: External Traffic',
        terminal: [
          { t: 'cmd', text: 'cat > ingress.yml << \'EOF\'' },
          { t: 'out', text: 'apiVersion: networking.k8s.io/v1' },
          { t: 'out', text: 'kind: Ingress' },
          { t: 'out', text: 'metadata:' },
          { t: 'out', text: '  name: web-ingress' },
          { t: 'out', text: '  annotations:' },
          { t: 'out', text: '    nginx.ingress.kubernetes.io/rewrite-target: /$1' },
          { t: 'out', text: 'spec:' },
          { t: 'out', text: '  rules:' },
          { t: 'out', text: '  - host: mysite.com' },
          { t: 'out', text: '    http:' },
          { t: 'out', text: '      paths:' },
          { t: 'out', text: '      - path: /api' },
          { t: 'out', text: '        pathType: Prefix' },
          { t: 'out', text: '        backend:' },
          { t: 'out', text: '          service:' },
          { t: 'out', text: '            name: api-service' },
          { t: 'out', text: '            port: { number: 80 }' },
          { t: 'out', text: '      - path: /' },
          { t: 'out', text: '        backend:' },
          { t: 'out', text: '          service:' },
          { t: 'out', text: '            name: frontend-service' },
          { t: 'out', text: '            port: { number: 80 }' },
          { t: 'out', text: 'EOF' },
          { t: 'blank' },
          { t: 'cmd', text: 'kubectl apply -f ingress.yml' },
          { t: 'ok', text: 'ingress.networking.k8s.io/web-ingress created' },
        ],
        diagram: 'k8singress',
        explanation: `<strong>Ingress</strong> is K8s\'s way of saying "here\'s how external HTTP(S) traffic gets into the cluster." You configure routing rules (<code>/api</code> goes to the API service, <code>/</code> goes to the frontend). Most people use the <strong>NGINX Ingress Controller</strong> — it\'s an actual NGINX pod that runs inside the cluster and acts as the reverse proxy. The <code>annotations</code> field passes config to the NGINX controller. You can add TLS directly in the Ingress spec — K8s doesn\'t handle certs itself, but cert-manager can auto-provision Let\'s Encrypt certificates.`,
      },
      {
        concept: 'Rolling Updates (Zero Downtime)',
        terminal: [
          { t: 'cmd', text: '# Update the image, K8s rolls out gradually' },
          { t: 'cmd', text: 'kubectl set image deployment/api api=myapp:v2.0.0' },
          { t: 'ok', text: 'deployment.api image updated' },
          { t: 'blank' },
          { t: 'cmd', text: 'kubectl rollout status deployment/api' },
          { t: 'out', text: 'Waiting for deployment "api" to complete 1/3...' },
          { t: 'out', text: 'Waiting for deployment "api" to complete 2/3...' },
          { t: 'out', text: 'deployment "api" successfully rolled out' },
          { t: 'blank' },
          { t: 'cmd', text: '# Something broke? Roll back instantly' },
          { t: 'cmd', text: 'kubectl rollout undo deployment/api' },
          { t: 'ok', text: 'deployment.apps/api rolled back to previous revision' },
          { t: 'blank' },
          { t: 'hl', text: '→ Zero downtime. Old pod dies only after new one is healthy.' },
        ],
        diagram: 'rollingupdate',
        explanation: `The <strong>RollingUpdate</strong> strategy (default) replaces pods gradually: it spins up new pods, waits for them to be healthy, then kills old ones — one by one. Your users never see downtime. <code>kubectl rollout undo</code> reverts to the previous version instantly. <code>kubectl rollout history</code> shows all versions. This is where K8s massively outperforms docker-compose — imagine doing a zero-downtime deploy of a 50-pod service on 10 machines with compose and a bash script. With K8s it\'s one command.`,
      },
    ],
  },

  prod: {
    label: 'Production',
    steps: [
      {
        concept: 'The Actual Architecture',
        terminal: [
          { t: 'dim', text: '# For 90% of websites, here\'s the real answer:' },
          { t: 'blank' },
          { t: 'hl', text: 'Server ($6–$20/mo) + Docker Compose + Nginx + Certbot' },
          { t: 'blank' },
          { t: 'dim', text: '# The stack:' },
          { t: 'out', text: 'Hetzner / DigitalOcean Droplet (bare metal or cloud VM)' },
          { t: 'out', text: '  └─ Docker' },
          { t: 'out', text: '       ├─ nginx (reverse proxy + SSL)' },
          { t: 'out', text: '       ├─ your app (Node/Python/etc)' },
          { t: 'out', text: '       ├─ PostgreSQL' },
          { t: 'out', text: '       └─ Redis (caching/sessions)' },
          { t: 'blank' },
          { t: 'ok', text: '# This handles 10,000–100,000 daily users EASILY.' },
          { t: 'ok', text: '# You don\'t need K8s until you\'re hitting millions.' },
        ],
        diagram: 'realsetup',
        explanation: `Most production websites — even successful SaaS products — run on a single server with Docker Compose. You get: zero-cost certs via <strong>Certbot/Let's Encrypt</strong>, automatic HTTPS renewal, easy backups via volume snapshots, and horizontal scaling via nginx upstream if traffic spikes. The server costs <strong>$6–$20/month</strong> from Hetzner, DigitalOcean, or Slice. You don\'t need Kubernetes unless you\'re running dozens of microservices across multiple data centers with auto-scaling demands.`,
      },
      {
        concept: 'Nginx + Certbot = Free SSL',
        terminal: [
          { t: 'cmd', text: '# nginx config for your site' },
          { t: 'out', text: 'server {' },
          { t: 'out', text: '    listen 80;' },
          { t: 'out', text: '    server_name mysite.com;' },
          { t: 'out', text: '' },
          { t: 'out', text: '    location / {' },
          { t: 'out', text: '        proxy_pass http://localhost:3000;' },
          { t: 'out', text: '        proxy_set_header Host $host;' },
          { t: 'out', text: '        proxy_set_header X-Real-IP $remote_addr;' },
          { t: 'out', text: '    }' },
          { t: 'out', text: '}' },
          { t: 'blank' },
          { t: 'cmd', text: '# Get free SSL certificate' },
          { t: 'cmd', text: 'certbot --nginx -d mysite.com -d www.mysite.com' },
          { t: 'blank' },
          { t: 'ok', text: 'Successfully received certificate.' },
          { t: 'ok', text: 'Certificate is saved at: /etc/letsencrypt/live/mysite.com/' },
          { t: 'ok', text: ' Cert expires on: 2025-09-19' },
          { t: 'blank' },
          { t: 'ok', text: '# Certbot auto-renews before expiry. Zero maintenance.' },
        ],
        diagram: 'ssllife',
        explanation: `<strong>Certbot</strong> (from EFF) talks to Let's Encrypt, proves you own the domain (via HTTP or DNS challenge), and issues a free certificate valid for 90 days. Certbot\'s <code>--nginx</code> flag auto-edits your nginx config to add HTTPS. The <code>certbot renew</code> cron job runs twice daily — if your cert is within 30 days of expiring, it auto-renews. You get HTTPS for free, forever, with zero manual intervention. The nginx config gets a <code>listen 443 ssl</code> block and <code>ssl_certificate</code> directives.`,
      },
      {
        concept: 'Systemd: Start Docker on Boot',
        terminal: [
          { t: 'cmd', text: '# Create a systemd service for your compose project' },
          { t: 'cmd', text: 'sudo nano /etc/systemd/system/mysite.service' },
          { t: 'out', text: '[Unit]' },
          { t: 'out', text: 'Description=MySite App' },
          { t: 'out', text: 'After=docker.service' },
          { t: 'out', text: 'Requires=docker.service' },
          { t: 'out', text: '' },
          { t: 'out', text: '[Service]' },
          { t: 'out', text: 'Type=oneshot' },
          { t: 'out', text: 'RemainAfterExit=yes' },
          { t: 'out', text: 'WorkingDirectory=/opt/mysite' },
          { t: 'out', text: 'ExecStart=/usr/local/bin/docker compose up -d' },
          { t: 'out', text: 'ExecStop=/usr/local/bin/docker compose down' },
          { t: 'out', text: '' },
          { t: 'out', text: '[Install]' },
          { t: 'out', text: 'WantedBy=multi-user.target' },
          { t: 'blank' },
          { t: 'cmd', text: 'sudo systemctl enable mysite' },
          { t: 'ok', text: 'Created symlink /etc/systemd/system/multi-user.target.wants/mysite.service' },
          { t: 'blank' },
          { t: 'ok', text: '# Server reboots → Docker starts → containers start automatically' },
        ],
        diagram: 'systemd',
        explanation: `<strong>systemd</strong> is the Linux init system — it manages services. The unit file above tells systemd: "when Docker is ready, run <code>docker compose up -d</code> in <code>/opt/mysite</code>. When the server shuts down, run <code>docker compose down</code> first." This means your app survives server reboots without manual intervention. <code>systemctl status mysite</code> shows health. <code>journalctl -u mysite -f</code> tails logs. <code>systemctl restart mysite</code> to redeploy. This is the production-ready foundation — simple, reliable, battle-tested.`,
      },
      {
        concept: 'The Decision Spectrum',
        terminal: [
          { t: 'dim', text: '# What should you use? It depends on scale:' },
          { t: 'blank' },
          { t: 'out', text: '1 container, 1 server' },
          { t: 'out', text: '  → Plain docker run' },
          { t: 'blank' },
          { t: 'out', text: '3 containers, 1 server' },
          { t: 'out', text: '  → Docker Compose' },
          { t: 'blank' },
          { t: 'out', text: '10+ containers, 2-5 servers' },
          { t: 'out', text: '  → Docker Swarm (built into Docker, simpler than K8s)' },
          { t: 'blank' },
          { t: 'out', text: '50+ containers, 10+ servers, auto-scaling, multi-region' },
          { t: 'out', text: '  → Kubernetes' },
          { t: 'blank' },
          { t: 'accent', text: 'Most indie projects: $20/mo VPS + Docker Compose + nginx' },
          { t: 'accent', text: 'Most startups: managed K8s (EKS/GKE) once you hit ~100k users' },
          { t: 'blank' },
          { t: 'hl', text: 'Start simple. Complicate only when you have evidence you must.' },
        ],
        diagram: 'spectrum',
        explanation: `<strong>Docker Compose</strong> runs on a single server and works for most indie projects and early-stage startups. <strong>Docker Swarm</strong> is built into Docker itself — no extra install, supports multi-host networking and rolling updates, much simpler than K8s for teams of 1-5. <strong>Kubernetes</strong> shines when you need: true auto-scaling (HPA — Horizontal Pod Autoscaler), multi-node high availability, fine-grained resource control, or you\'re running 10+ microservices that teams independently deploy. The most common mistake: engineers adopting K8s for a 3-container app because it feels impressive.`,
      },
      {
        concept: 'Your Next Step',
        terminal: [
          { t: 'dim', text: '# Here\'s exactly what to do to get real experience:' },
          { t: 'blank' },
          { t: 'cmd', text: '# 1. Install Docker on your laptop' },
          { t: 'dim', text: '   → docker.com/get-started (Docker Desktop)' },
          { t: 'blank' },
          { t: 'cmd', text: '# 2. Dockerize a real project you care about' },
          { t: 'dim', text: '   → Any Node/Python/Go project. Write the Dockerfile.' },
          { t: 'dim', text: '   → Struggle through the build. Break things. Fix them.' },
          { t: 'blank' },
          { t: 'cmd', text: '# 3. Rent a $6/mo Hetzner server' },
          { t: 'dim', text: '   → Install Docker. Deploy your container. SSH in.' },
          { t: 'dim', text: '   → This is where it gets real.' },
          { t: 'blank' },
          { t: 'cmd', text: '# 4. Add docker-compose.yml to it' },
          { t: 'dim', text: '   → Run your app + postgres. One command.' },
          { t: 'blank' },
          { t: 'cmd', text: '# 5. Set up nginx + certbot' },
          { t: 'dim', text: '   → Point a domain at it. Get free SSL. Feel the progress.' },
          { t: 'blank' },
          { t: 'accent', text: 'You will understand containers 100x better after step 3.' },
          { t: 'accent', text: 'Not because you read about it. Because you typed real commands.' },
        ],
        diagram: 'nextsteps',
        explanation: `<strong>The only way to actually learn this is by doing.</strong> Reading about Dockerfiles doesn\'t teach you; writing one for a real project does. Getting a real server — even a $6/month one — forces you to understand networking, DNS, firewalls, SSH, and the actual production stack. Heroku/Render/Vercel are great, but they hide the infrastructure. A $6 Hetzner server and a weekend will teach you more than ten tutorials. After that, Kubernetes becomes obvious — you\'ll hit its constraints on your own and understand why it exists.`,
      },
    ],
  },
};

// ── Diagrams ──────────────────────────────────────────────────────────────────

const DIAGRAMS = {
  problem: `
    <div class="layer">
      <div class="layer-label user">YOU</div>
      <div class="box-row"><div class="box user">Your Laptop</div></div>
      <div class="flow-tag">Node 20, Python 3.11, macOS 14</div>
    </div>
    <div class="arrow">↓ "works here!"</div>
    <div class="layer">
      <div class="layer-label server">SERVER</div>
      <div class="box-row"><div class="box server">Production Server</div></div>
      <div class="flow-tag">Node 18, Python 3.9, Ubuntu 22.04 ← version mismatch</div>
    </div>
    <div class="arrow">↓ breaks</div>
    <div class="layer active">
      <div class="layer-label container">DOCKER SOLUTION</div>
      <div class="box-row">
        <div class="box app">your app</div>
        <div class="box app">node:20-alpine</div>
      </div>
      <div class="flow-tag">Packages exact versions. Same everywhere.</div>
    </div>`,

  dockerfile: `
    <div class="layer">
      <div class="layer-label container">DOCKERFILE</div>
      <div class="box-row">
        <div class="box nginx">FROM</div>
        <div class="box nginx">WORKDIR</div>
        <div class="box nginx">COPY</div>
        <div class="box nginx">RUN</div>
        <div class="box nginx">EXPOSE</div>
        <div class="box nginx">CMD</div>
      </div>
      <div class="flow-tag">Instructions — executed top to bottom at build time</div>
    </div>
    <div class="arrow">docker build ↓</div>
    <div class="layer">
      <div class="layer-label container">CONTAINER IMAGE</div>
      <div class="box-row">
        <div class="box app">alpine base</div>
        <div class="box app">node binary</div>
        <div class="box app">npm packages</div>
        <div class="box app">your code</div>
      </div>
      <div class="flow-tag">Immutable. Read-only layers. Shared across images.</div>
    </div>`,

  build: `
    <div class="layer">
      <div class="layer-label server">YOUR SERVER / LAPTOP</div>
      <div class="box-row">
        <div class="box server">Docker Daemon</div>
      </div>
      <div class="arrow">build context ↓</div>
      <div class="layer">
        <div class="layer-label container">LAYER CACHE</div>
        <div class="box-row">
          <div class="box app">FROM node:20  →  CACHED</div>
          <div class="box app">COPY package*.json  →  CACHED</div>
          <div class="box app">RUN npm ci  →  CACHED</div>
          <div class="box app">COPY .  →  REBUILD</div>
        </div>
      </div>
      <div class="flow-tag">Only changed layers rebuild. Fast.</div>
    </div>`,

  run: `
    <div class="layer">
      <div class="layer-label server">HOST</div>
      <div class="box-row">
        <div class="box server">Port 3000</div>
        <div class="box server">eth0 / wlan0</div>
      </div>
    </div>
    <div class="arrow">-p 3000:3000</div>
    <div class="layer active">
      <div class="layer-label container">CONTAINER</div>
      <div class="box-row">
        <div class="box app">your app</div>
        <div class="box app">port 3000</div>
      </div>
      <div class="flow-tag">Isolated process. Own network namespace. Own filesystem.</div>
    </div>`,

  vmvcontainer: `
    <div class="layer">
      <div class="layer-label server">TRADITIONAL VM</div>
      <div class="box-row">
        <div class="box server">Hypervisor (VirtualBox)</div>
      </div>
      <div class="arrow">↓</div>
      <div class="layer">
        <div class="box-row">
          <div class="box server">VM: Ubuntu + App</div>
          <div class="box server">VM: Ubuntu + App</div>
          <div class="box server">VM: Ubuntu + App</div>
        </div>
        <div class="flow-tag">Full OS each. GB each. Minutes to boot.</div>
      </div>
    </div>
    <div class="layer">
      <div class="layer-label container">DOCKER CONTAINER</div>
      <div class="box-row">
        <div class="box app">App 1</div>
        <div class="box app">App 2</div>
        <div class="box app">App 3</div>
      </div>
      <div class="layer-label server">SHARED LINUX KERNEL</div>
      <div class="flow-tag">Just processes. MB each. Milliseconds to start.</div>
    </div>`,

  volume: `
    <div class="layer">
      <div class="layer-label server">HOST FILESYSTEM</div>
      <div class="box-row">
        <div class="box server">/var/lib/docker/volumes/pgdata/_data</div>
      </div>
    </div>
    <div class="arrow">-v pgdata:/var/lib/postgresql/data</div>
    <div class="layer">
      <div class="layer-label data">CONTAINER</div>
      <div class="box-row">
        <div class="box db">PostgreSQL writing data</div>
      </div>
      <div class="flow-tag">Data persists after container is removed</div>
    </div>`,

  network: `
    <div class="layer">
      <div class="layer-label server">DOCKER NETWORK (mynet)</div>
      <div class="box-row">
        <div class="box app">api container</div>
        <div class="box db">db container</div>
        <div class="box redis">redis container</div>
      </div>
      <div class="flow-tag">Internal DNS: api → 172.18.0.2, db → 172.18.0.3</div>
    </div>
    <div class="layer">
      <div class="layer-label server">HOST</div>
      <div class="box-row">
        <div class="box server">Docker bridge</div>
      </div>
    </div>`,

  realwebsite: `
    <div class="layer">
      <div class="layer-label user">USER</div>
      <div class="box-row">
        <div class="box user">Browser</div>
      </div>
      <div class="flow-tag">https://mysite.com</div>
    </div>
    <div class="arrow">:443 / HTTPS</div>
    <div class="layer">
      <div class="layer-label loadbalancer">NGINX</div>
      <div class="box-row">
        <div class="box proxy">SSL termination</div>
        <div class="box proxy">Static files</div>
        <div class="box proxy">/api → proxy to app</div>
      </div>
      <div class="flow-tag">Public internet face. Only this port is exposed.</div>
    </div>
    <div class="arrow">internal</div>
    <div class="layer">
      <div class="layer-label container">CONTAINERS (private network)</div>
      <div class="box-row">
        <div class="box app">Node API</div>
        <div class="box app">Node API</div>
        <div class="box app">Node API</div>
      </div>
      <div class="flow-tag">Never directly reachable from internet</div>
    </div>`,

  composeintro: `
    <div class="layer">
      <div class="layer-label container">WITHOUT COMPOSE</div>
      <div class="box-row" style="flex-direction:column;gap:4px;">
        <div class="box server">docker run db ... (long string of flags)</div>
        <div class="box server">docker run redis ... (another long string)</div>
        <div class="box server">docker run api -e DB_HOST=db ... (painful)</div>
        <div class="box server">docker run nginx ... (more flags)</div>
      </div>
    </div>
    <div class="layer">
      <div class="layer-label container">WITH COMPOSE</div>
      <div class="box-row" style="flex-direction:column;gap:4px;">
        <div class="box app">docker compose up -d</div>
        <div class="box app">docker compose down</div>
        <div class="box app">docker compose logs -f</div>
      </div>
    </div>`,

  composeyml: `
    <div class="layer">
      <div class="layer-label container">docker-compose.yml</div>
      <div class="box-row">
        <div class="box app">api (builds from Dockerfile)</div>
        <div class="box db">db (postgres:16 image)</div>
        <div class="box redis">redis (redis:alpine image)</div>
      </div>
      <div class="flow-tag">Auto-network: containers reach each other by name</div>
    </div>
    <div class="arrow">docker compose up ↓</div>
    <div class="layer">
      <div class="layer-label container">RUNNING CONTAINERS</div>
      <div class="box-row">
        <div class="box app">api-1</div>
        <div class="box db">db-1</div>
        <div class="box redis">redis-1</div>
      </div>
      <div class="flow-tag">Named containers. Shared network. Volumes mounted.</div>
    </div>`,

  composeup: `
    <div class="layer">
      <div class="layer-label container">SERVICES</div>
      <div class="box-row">
        <div class="box app">api</div>
        <div class="box db">db</div>
        <div class="box redis">redis</div>
      </div>
      <div class="flow-tag">docker compose ps | logs | restart | build --no-cache | pull</div>
    </div>
    <div class="arrow">one command to rule them all</div>`,

  composediff: `
    <div class="layer">
      <div class="layer-label container">docker-compose.yml (base)</div>
      <div class="box-row">
        <div class="box app">image + build config</div>
        <div class="box app">port mappings</div>
        <div class="box app">environment vars</div>
      </div>
    </div>
    <div class="layer">
      <div class="layer-label container">OVERRIDES</div>
      <div class="box-row">
        <div class="box proxy">dev: bind mount, debug port</div>
        <div class="box proxy">prod: replicas: 3, restart: always</div>
      </div>
      <div class="flow-tag">docker compose -f base.yml -f prod.yml up</div>
    </div>`,

  scalesimple: `
    <div class="layer">
      <div class="layer-label container">--scale api=3</div>
      <div class="box-row">
        <div class="box app">api-1</div>
        <div class="box app">api-2</div>
        <div class="box app">api-3</div>
      </div>
      <div class="flow-tag">Docker compose load balancing: basic, not production-grade</div>
    </div>
    <div class="arrow">use nginx upstream for real LB →</div>`,

  k8swhy: `
    <div class="layer">
      <div class="layer-label server">SERVER 1</div>
      <div class="box-row">
        <div class="box app">app</div>
        <div class="box db">db</div>
      </div>
    </div>
    <div class="arrow">if this dies → everything dies</div>
    <div class="layer active">
      <div class="layer-label container">KUBERNETES CLUSTER</div>
      <div class="box-row">
        <div class="box server">Node 1</div>
        <div class="box server">Node 2</div>
        <div class="box server">Node 3</div>
      </div>
      <div class="box-row">
        <div class="box app">app-pod</div>
        <div class="box app">app-pod</div>
        <div class="box app">app-pod</div>
        <div class="box db">db-pod</div>
        <div class="box db">db-pod</div>
      </div>
      <div class="flow-tag">Node dies → K8s reschedules pods to healthy nodes automatically</div>
    </div>`,

  k8sconcepts: `
    <div class="layer">
      <div class="layer-label container">POD</div>
      <div class="box-row">
        <div class="box app">app container</div>
        <div class="box app">sidecar container</div>
      </div>
      <div class="flow-tag">Smallest unit. Shared network (localhost). Co-located.</div>
    </div>
    <div class="arrow">managed by ↓</div>
    <div class="layer">
      <div class="layer-label container">DEPLOYMENT</div>
      <div class="box-row">
        <div class="box app">replicas: 3</div>
        <div class="box app">rolling update strategy</div>
        <div class="box app">restart policy</div>
      </div>
      <div class="flow-tag">Declarative: "always keep 3 pods running"</div>
    </div>
    <div class="arrow">exposes →</div>
    <div class="layer">
      <div class="layer-label container">SERVICE</div>
      <div class="box-row">
        <div class="box proxy">ClusterIP / LoadBalancer</div>
        <div class="box proxy">stable DNS name</div>
      </div>
    </div>
    <div class="arrow">ingress ↓</div>
    <div class="layer">
      <div class="layer-label loadbalancer">INGRESS</div>
      <div class="box-row">
        <div class="box proxy">nginx controller</div>
        <div class="box proxy">TLS termination</div>
        <div class="box proxy">routing rules</div>
      </div>
    </div>`,

  k8sdeploy: `
    <div class="layer">
      <div class="layer-label container">deployment.yml</div>
      <div class="box-row">
        <div class="box k8s">replicas: 3</div>
        <div class="box k8s">image: myapp:v1</div>
      </div>
    </div>
    <div class="arrow">kubectl apply →</div>
    <div class="layer">
      <div class="layer-label container">K8S CONTROL PLANE</div>
      <div class="box-row">
        <div class="box k8s">Scheduler</div>
        <div class="box k8s">Controller Manager</div>
        <div class="box k8s">API Server</div>
      </div>
    </div>
    <div class="arrow">schedule pods</div>
    <div class="layer">
      <div class="box-row">
        <div class="box pod">pod-a1b2</div>
        <div class="box pod">pod-c3d4</div>
        <div class="box pod">pod-e5f6</div>
      </div>
      <div class="flow-tag">K8s ensures 3 always running. Pod death = auto-replacement.</div>
    </div>`,

  k8sservice: `
    <div class="layer">
      <div class="layer-label container">SERVICE (api-service)</div>
      <div class="box-row">
        <div class="box proxy">ClusterIP: 10.96.142.78</div>
        <div class="box proxy">port: 80 → targetPort: 3000</div>
        <div class="box proxy">selector: app=api</div>
      </div>
      <div class="flow-tag">Stable IP. DNS name. Load-balances across all matching pods.</div>
    </div>
    <div class="arrow">routes to</div>
    <div class="layer">
      <div class="box-row">
        <div class="box pod">pod-a1b2 (10.0.0.1)</div>
        <div class="box pod">pod-c3d4 (10.0.1.2)</div>
        <div class="box pod">pod-e5f6 (10.0.2.3)</div>
      </div>
      <div class="flow-tag">Pods have ephemeral IPs. Service is the fixed address other pods use.</div>
    </div>`,

  k8singress: `
    <div class="layer">
      <div class="layer-label user">USER</div>
      <div class="box-row">
        <div class="box user">Browser</div>
      </div>
    </div>
    <div class="arrow">https://mysite.com</div>
    <div class="layer">
      <div class="layer-label loadbalancer">INGRESS (nginx controller)</div>
      <div class="box-row">
        <div class="box proxy">TLS termination</div>
        <div class="box proxy">/api → api-service:80</div>
        <div class="box proxy">/ → frontend-service:80</div>
      </div>
    </div>
    <div class="arrow">internal</div>
    <div class="layer">
      <div class="box-row">
        <div class="box pod">api-pod × 3</div>
        <div class="box pod">frontend-pod × 2</div>
      </div>
    </div>`,

  rollingupdate: `
    <div class="layer">
      <div class="layer-label container">kubectl set image deployment/api api=myapp:v2</div>
      <div class="flow-tag">K8s replaces pods one by one. Service always has healthy pods.</div>
    </div>
    <div class="arrow">v1 pods replaced gradually</div>
    <div class="layer">
      <div class="box-row">
        <div class="box app">v2 pod ✓</div>
        <div class="box app">v2 pod ✓</div>
        <div class="box app">v1 pod (still serving)</div>
      </div>
      <div class="flow-tag">Users never hit a downtime window</div>
    </div>`,

  realsetup: `
    <div class="layer">
      <div class="layer-label user">USER</div>
      <div class="box-row"><div class="box user">Browser</div></div>
    </div>
    <div class="arrow">:443</div>
    <div class="layer">
      <div class="layer-label loadbalancer">NGINX + CERTBOT</div>
      <div class="box-row">
        <div class="box proxy">Reverse proxy</div>
        <div class="box cert">SSL (Let's Encrypt)</div>
        <div class="box cert">Auto-renewal</div>
      </div>
    </div>
    <div class="arrow">proxy_pass</div>
    <div class="layer">
      <div class="layer-label container">DOCKER COMPOSE</div>
      <div class="box-row">
        <div class="box app">your app</div>
        <div class="box db">PostgreSQL</div>
        <div class="box redis">Redis</div>
      </div>
    </div>
    <div class="layer">
      <div class="layer-label server">$6–20/mo VPS</div>
      <div class="box-row"><div class="box server">Hetzner / DigitalOcean</div></div>
    </div>`,

  ssllife: `
    <div class="layer">
      <div class="layer-label user">BROWSER</div>
      <div class="box-row"><div class="box user">HTTPS request</div></div>
    </div>
    <div class="arrow">TLS handshake</div>
    <div class="layer">
      <div class="layer-label cert">CERTBOT</div>
      <div class="box-row">
        <div class="box cert">Issues cert (Let's Encrypt)</div>
        <div class="box cert">Auto-renews @ 90 days</div>
      </div>
    </div>
    <div class="arrow">ssl_certificate</div>
    <div class="layer">
      <div class="layer-label proxy">NGINX</div>
      <div class="box-row"><div class="box proxy">Proxies to app container</div></div>
    </div>`,

  systemd: `
    <div class="layer">
      <div class="layer-label server">LINUX (systemd)</div>
      <div class="box-row">
        <div class="box server">Server boots</div>
        <div class="box server">Docker starts</div>
        <div class="box server">mysite.service starts</div>
      </div>
    </div>
    <div class="arrow">ExecStart</div>
    <div class="layer">
      <div class="layer-label container">DOCKER COMPOSE</div>
      <div class="box-row">
        <div class="box app">app</div>
        <div class="box db">db</div>
        <div class="box redis">redis</div>
      </div>
    </div>
    <div class="flow-tag">systemctl enable mysite → starts on every boot</div>`,

  spectrum: `
    <div class="layer">
      <div class="box-row" style="justify-content:center;gap:16px;">
        <div class="box server" style="text-align:center;padding:12px 20px;">
          <div style="font-size:14px;font-weight:600;">Docker Compose</div>
          <div style="font-size:11px;margin-top:4px;">1–3 containers<br/>1 server</div>
        </div>
        <div class="box k8s" style="text-align:center;padding:12px 20px;">
          <div style="font-size:14px;font-weight:600;">Docker Swarm</div>
          <div style="font-size:11px;margin-top:4px;">5–30 containers<br/>2–5 servers</div>
        </div>
        <div class="box k8s" style="text-align:center;padding:12px 20px;">
          <div style="font-size:14px;font-weight:600;">Kubernetes</div>
          <div style="font-size:11px;margin-top:4px;">50+ containers<br/>10+ servers, auto-scale</div>
        </div>
      </div>
    </div>
    <div class="layer">
      <div class="flow-tag" style="text-align:center;">Most indie projects live here → ◀</div>
    </div>`,

  nextsteps: `
    <div class="layer">
      <div class="layer-label container">THE PATH</div>
      <div class="box-row" style="flex-direction:column;gap:8px;">
        <div class="box app">① Docker Desktop on laptop</div>
        <div class="box app">② Dockerize a real project</div>
        <div class="box app">③ Get a $6/mo Hetzner server + SSH</div>
        <div class="box app">④ Deploy with docker-compose</div>
        <div class="box app">⑤ nginx + certbot + domain</div>
        <div class="box app">⑥ Feel the pain of scaling → Kubernetes makes sense</div>
      </div>
      <div class="flow-tag" style="margin-top:8px;">You don\'t understand containers until you\'ve broken a prod server at 2am</div>
    </div>`,
};

// ── State ─────────────────────────────────────────────────────────────────────
let currentTab = 'docker';
let currentStep = 0;
let typingTimeout = null;
let cmdIndex = 0;

const tabs = ['docker', 'compose', 'kube', 'prod'];

// ── DOM ───────────────────────────────────────────────────────────────────────
const terminalOutput = document.getElementById('terminal-output');
const terminalTitle = document.getElementById('terminal-title');
const vizDiagram = document.getElementById('viz-diagram');
const vizExplanation = document.getElementById('viz-explanation');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const stepIndicator = document.getElementById('step-indicator');
const progressFill = document.getElementById('progress-fill');
const conceptName = document.getElementById('concept-name');

// ── Tab switching ─────────────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    if (tab === currentTab) return;
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTab = tab;
    currentStep = 0;
    cmdIndex = 0;
    renderStep();
  });
});

// ── Nav ───────────────────────────────────────────────────────────────────────
btnPrev.addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep--;
    renderStep();
  }
});

btnNext.addEventListener('click', () => {
  const steps = CONTENT[currentTab].steps;
  if (currentStep < steps.length - 1) {
    currentStep++;
    renderStep();
  }
});

// Keyboard nav
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    btnNext.click();
  } else if (e.key === 'ArrowLeft') {
    btnPrev.click();
  }
});

// ── Render ─────────────────────────────────────────────────────────────────────
function renderStep() {
  const tab = CONTENT[currentTab];
  const step = tab.steps[currentStep];
  const total = tab.steps.length;
  const pct = ((currentStep + 1) / total) * 100;

  // Update progress
  stepIndicator.textContent = `Step ${currentStep + 1} / ${total}`;
  progressFill.style.width = `${pct}%`;
  conceptName.textContent = step.concept;
  terminalTitle.textContent = `Terminal — ${tab.label}`;
  btnPrev.disabled = currentStep === 0;
  btnNext.disabled = currentStep === total - 1;

  // Clear and type terminal
  clearTimeout(typingTimeout);
  terminalOutput.innerHTML = '';
  cmdIndex = 0;
  typeLines(step.terminal);

  // Update diagram
  vizDiagram.innerHTML = `<div class="diagram-wrap">${DIAGRAMS[step.diagram] || ''}</div>`;

  // Update explanation
  vizExplanation.innerHTML = step.explanation;
}

// ── Typewriter ────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(r => { typingTimeout = setTimeout(r, ms); });
}

async function typeLines(lines) {
  for (const line of lines) {
    await sleep(line.delay || 180);

    if (line.t === 'blank') {
      const el = document.createElement('span');
      el.className = 't-line t-blank';
      el.innerHTML = '&nbsp;';
      terminalOutput.appendChild(el);
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
      continue;
    }

    const cls = {
      cmd: 't-line t-cmd',
      out: 't-line t-out',
      dim: 't-line t-dim',
      ok: 't-line t-ok',
      warn: 't-line t-warn',
      err: 't-line t-err',
      accent: 't-line t-accent',
      hl: 't-line t-hl',
      codelab: 't-line',
    }[line.t] || 't-line t-out';

    const span = document.createElement('span');
    span.className = cls;

    if (line.t === 'cmd') {
      // Animate command being typed
      cmdIndex++;
      const cmdId = `cmd-${cmdIndex}`;
      span.id = cmdId;
      span.textContent = line.text;
      terminalOutput.appendChild(span);
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    } else {
      span.textContent = line.text;
      terminalOutput.appendChild(span);
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────
renderStep();
