import './style.css';

// ── SVG Diagram Renderer ────────────────────────────────────────────────────────

const PALETTE = {
  user:      { fill: '#1a0d14', stroke: '#ff6b8a', text: '#ffb3c1', label: '#ff6b8a' },
  server:    { fill: '#0d1929', stroke: '#60a5fa', text: '#93c5fd', label: '#60a5fa' },
  container: { fill: '#100d26', stroke: '#7c6bff', text: '#c4b5fd', label: '#a89bff' },
  proxy:     { fill: '#1a1400', stroke: '#fbbf24', text: '#fcd34d', label: '#fbbf24' },
  db:        { fill: '#0d1a14', stroke: '#4ade80', text: '#86efac', label: '#4ade80' },
  volume:    { fill: '#0d1a14', stroke: '#4ade80', text: '#86efac', label: '#4ade80' },
  k8s:       { fill: '#0a1929', stroke: '#60a5fa', text: '#93c5fd', label: '#60a5fa' },
  cert:      { fill: '#0a1f14', stroke: '#4ade80', text: '#86efac', label: '#4ade80' },
  issue:     { fill: '#1f0d0d', stroke: '#f87171', text: '#fca5a5', label: '#f87171' },
  check:     { fill: '#0f1f0f', stroke: '#4ade80', text: '#86efac', label: '#4ade80' },
  cmd:       { fill: '#12121e', stroke: '#6b6b8a', text: '#e0e0f0', label: '#6b6b8a' },
  text:      { fill: 'transparent', stroke: 'transparent', text: '#6b6b8a', label: 'transparent' },
};

// Shadow filter applied once in defs
const SVG_SHADOW = `
  <filter id="nsh" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.5"/>
  </filter>
`;

const NODE_W = 160;
const NODE_H = 60;
const RX = 10;

function nodeShape(type, x, y, node) {
  const p = PALETTE[type] || PALETTE.server;
  const label = node.label || '';
  const sub = node.sub || '';
  const icon = node.icon || '';
  const w = node.w || NODE_W;
  const h = node.h || NODE_H;
  const cls = node.cls || '';

  const cy = y + h / 2;
  let shape = '';
  let iconEl = '';

  if (type === 'user') {
    // Person icon
    shape = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${RX}" fill="${p.fill}" stroke="${p.stroke}" stroke-width="1.5" filter="url(#nsh)"/>`;
    iconEl = `<circle cx="${x + 28}" cy="${y + h/2 - 5}" r="9" fill="none" stroke="${p.text}" stroke-width="1.5"/>
              <path d="M${x + 13} ${y + h - 14} Q${x + 13} ${y + h/2 + 4} ${x + 28} ${y + h/2 + 4} Q${x + 43} ${y + h/2 + 4} ${x + 43} ${y + h - 14}"
                    fill="none" stroke="${p.text}" stroke-width="1.5" stroke-linecap="round"/>`;
  } else if (type === 'db') {
    // Cylinder (database)
    const ell = 8;
    shape = `
      <rect x="${x}" y="${y + ell}" width="${w}" height="${h - ell}" rx="${RX}" fill="${p.fill}" stroke="${p.stroke}" stroke-width="1.5" filter="url(#nsh)"/>
      <ellipse cx="${x + w/2}" cy="${y + ell}" rx="${w/2}" ry="${ell}" fill="${p.fill}" stroke="${p.stroke}" stroke-width="1.5"/>
      <ellipse cx="${x + w/2}" cy="${y + h - ell}" rx="${w/2}" ry="${ell}" fill="${p.fill}" stroke="${p.stroke}" stroke-width="1.5" opacity="0.3"/>`;
  } else if (type === 'volume') {
    // Cube/volume icon
    shape = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${RX}" fill="${p.fill}" stroke="${p.stroke}" stroke-width="1.5" filter="url(#nsh)"/>`;
    iconEl = `<path d="M${x + 18} ${y + h/2} L${x + 28} ${y + 16} L${x + 28} ${y + h - 16} Z" fill="none" stroke="${p.text}" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M${x + 18} ${y + h/2} L${x + 38} ${y + h/2 - 8}" stroke="${p.text}" stroke-width="1.5"/>
              <path d="M${x + 28} ${y + 16} L${x + 48} ${y + 24}" stroke="${p.text}" stroke-width="1.5"/>
              <path d="M${x + 28} ${y + h - 16} L${x + 48} ${y + h/2 - 8}" stroke="${p.text}" stroke-width="1.5"/>`;
  } else if (type === 'cmd') {
    shape = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${RX}" fill="${p.fill}" stroke="${p.stroke}" stroke-width="1" stroke-dasharray="4 3" filter="url(#nsh)"/>`;
  } else {
    shape = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${RX}" fill="${p.fill}" stroke="${p.stroke}" stroke-width="1.5" filter="url(#nsh)"/>`;
  }

  // Highlight glow for active nodes
  if (node.active) {
    shape = shape.replace('stroke-width="1.5"', 'stroke-width="2"');
    shape = shape.replace('filter="url(#nsh)"', 'filter="url(#nsh)" stroke="#a89bff" stroke-width="2"');
  }

  // Label text
  const labelLines = label.split('\n');
  let labelEls = '';
  if (labelLines.length === 1) {
    labelEls = `<text x="${x + w/2}" y="${sub ? y + h/2 - 5 : y + h/2 + 5}" text-anchor="middle" fill="${p.text}" font-family="IBM Plex Mono,monospace" font-size="12" font-weight="600">${label}</text>`;
  } else {
    labelLines.forEach((l, i) => {
      labelEls += `<text x="${x + w/2}" y="${y + 18 + i * 15}" text-anchor="middle" fill="${p.text}" font-family="IBM Plex Mono,monospace" font-size="11" font-weight="500">${l}</text>`;
    });
  }

  const subEl = sub
    ? `<text x="${x + w/2}" y="${y + h - 12}" text-anchor="middle" fill="${p.label}" opacity="0.65" font-family="IBM Plex Mono,monospace" font-size="10">${sub}</text>`
    : '';

  const classEl = cls
    ? `<text x="${x + w - 10}" y="${y + 16}" text-anchor="end" fill="${p.stroke}" font-family="IBM Plex Mono,monospace" font-size="9" font-weight="700" letter-spacing="1">${cls}</text>`
    : '';

  const delay = (typeof idx !== 'number' ? 0 : idx * 0.07).toFixed(2);
  return `<g class="d-node" style="animation-delay:${delay}s">${shape}${iconEl}${labelEls}${subEl}${classEl}</g>`;
}

function verticalEdge(x1, y1, x2, y2, label, bidirectional, color) {
  const c = color || '#6b6b8a';
  const mid = (y1 + y2) / 2;
  const arrow = bidirectional
    ? `<polygon points="${x2},${y2} ${x2-5},${y2-10} ${x2+5},${y2-10}" fill="${c}" opacity="0.8"/>
       <polygon points="${x1},${y1} ${x1-5},${y1+10} ${x1+5},${y1+10}" fill="${c}" opacity="0.8"/>`
    : `<polygon points="${x2},${y2} ${x2-5},${y2-10} ${x2+5},${y2-10}" fill="${c}" opacity="0.8"/>`;

  const labelY = mid + 4;
  const labelEl = label
    ? `<text x="${x1 + 8}" y="${labelY}" fill="${c}" font-family="IBM Plex Mono,monospace" font-size="10" opacity="0.85">${label}</text>`
    : '';

  return `
    <path d="M${x1},${y1} L${x1},${mid} L${x2},${mid} L${x2},${y2}"
          stroke="${c}" stroke-width="1.5" fill="none" class="edge-path" opacity="0.9"/>
    ${arrow}${labelEl}`;
}

function horizontalEdge(x1, y1, x2, y2, label, bidirectional, color) {
  const c = color || '#6b6b8a';
  const mid = (x1 + x2) / 2;
  const arrow = bidirectional
    ? `<polygon points="${x2},${y2} ${x2-10},${y2-5} ${x2-10},${y2+5}" fill="${c}" opacity="0.8"/>
       <polygon points="${x1},${y1} ${x1+10},${y1-5} ${x1+10},${y1+5}" fill="${c}" opacity="0.8"/>`
    : `<polygon points="${x2},${y2} ${x2-10},${y2-5} ${x2-10},${y2+5}" fill="${c}" opacity="0.8"/>`;

  const labelEl = label
    ? `<text x="${mid}" y="${y1 - 8}" text-anchor="middle" fill="${c}" font-family="IBM Plex Mono,monospace" font-size="10" opacity="0.85">${label}</text>`
    : '';

  return `
    <path d="M${x1},${y1} L${mid},${y1} L${mid},${y2} L${x2},${y2}"
          stroke="${c}" stroke-width="1.5" fill="none" class="edge-path" opacity="0.9"/>
    ${arrow}${labelEl}`;
}

function bracketEdge(x1, y1, x2, y2, label, color) {
  const c = color || '#6b6b8a';
  const midY = (y1 + y2) / 2;
  return `
    <path d="M${x1},${y1} L${x1},${midY} L${x2},${midY} L${x2},${y2}"
          stroke="${c}" stroke-width="1.5" fill="none" class="edge-path" opacity="0.9"/>
    ${label ? `<text x="${(x1+x2)/2}" y="${midY - 6}" text-anchor="middle" fill="${c}" font-family="IBM Plex Mono,monospace" font-size="10" opacity="0.85">${label}</text>` : ''}`;
}

function edgeLabel(text, x, y, color) {
  const c = color || '#6b6b8a';
  return `<text x="${x}" y="${y}" text-anchor="middle" fill="${c}" font-family="IBM Plex Mono,monospace" font-size="10" opacity="0.9" font-style="italic">${text}</text>`;
}

function rowBox(nodes, y, colors) {
  // nodes: array of {type, label, sub}
  const total = nodes.length;
  const spacing = 175;
  const startX = (560 - (total - 1) * spacing) / 2;
  let els = '';
  nodes.forEach((n, i) => {
    const x = startX + i * spacing;
    els += nodeShape(n.type, x, y, n);
  });
  return els;
}

function Diagram(cfg) {
  const w = cfg.w || 560;
  const h = cfg.h || 440;
  const PAD = 8; // padding so edges/nodes don't clip at boundaries
  const nodes = cfg.nodes || [];
  const edges = cfg.edges || [];
  const groups = cfg.groups || [];

  let svg = `<svg class="diagram-svg" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="overflow:hidden;">
    <defs>${SVG_SHADOW}</defs>`;

  // Groups (background region labels)
  groups.forEach(g => {
    svg += `<rect x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" rx="8" fill="${g.fill || 'transparent'}" stroke="${g.stroke || '#252540'}" stroke-width="1" stroke-dasharray="${g.dash ? '4 3' : 'none'}" opacity="0.6"/>`;
    svg += `<text x="${g.x + 10}" y="${g.y + 14}" fill="${g.color || '#6b6b8a'}" font-family="IBM Plex Mono,monospace" font-size="9" font-weight="700" letter-spacing="1.5">${g.label}</text>`;
  });

  // Edges rendered first (behind nodes)
  edges.forEach(e => {
    const fromNode = nodes.find(n => n.id === e.from);
    const toNode = nodes.find(n => n.id === e.to);
    if (!fromNode || !toNode) return;

    const fw = fromNode.w || NODE_W;
    const fh = fromNode.h || NODE_H;
    const tw = toNode.w || NODE_W;
    const th = toNode.h || NODE_H;

    // Connection point: bottom-center of 'from', top-center of 'to'
    const fx = fromNode.x + fw / 2;
    const fy = fromNode.y + fh;
    const tx = toNode.x + tw / 2;
    const ty = toNode.y;

    const c = e.color || '#6b6b8a';

    if (Math.abs(fx - tx) < 20) {
      // Vertical
      svg += verticalEdge(fx, fy, tx, ty, e.label, e.bidirectional, c);
    } else if (Math.abs(fy - th/2 - (toNode.y + th/2)) < 20 && fromNode.x + fw < toNode.x) {
      // Horizontal: from is to the left, same vertical band
      svg += horizontalEdge(fromNode.x + fw, fromNode.y + fh/2, toNode.x, toNode.y + th/2, e.label, e.bidirectional, c);
    } else {
      // Diagonal — use L-shaped path
      svg += bracketEdge(fx, fy, tx, ty, e.label, c);
    }
  });

  // Custom text annotations (drawn as nodes with transparent fill)
  nodes.filter(n => n.type === 'text').forEach(n => {
    svg += `<text x="${n.x}" y="${n.y}" text-anchor="${n.align || 'middle'}" fill="${n.color || '#6b6b8a'}" font-family="IBM Plex Mono,monospace" font-size="${n.size || 11}" opacity="${n.opacity || 0.7}" ${n.bold ? 'font-weight="600"' : ''}>${n.label}</text>`;
  });

  // Regular nodes — staggered entrance animation via inline style
  nodes.filter(n => n.type !== 'text').forEach((n, i) => {
    svg += nodeShape(n.type, n.x, n.y, n, i);
  });

  svg += '</svg>';
  return svg;
}

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
        diagramKey: 'problem',
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
        diagramKey: 'dockerfile',
        explanation: `<strong>FROM node:20-alpine</strong> — starts from a pre-built image with Node.js already installed. Alpine means minimal OS (5MB base vs 700MB for Ubuntu). <strong>COPY</strong> copies files. <strong>RUN</strong> executes commands at build time. <strong>EXPOSE</strong> documents which port the app uses. <strong>CMD</strong> is what runs when the container starts. Think of <code>EXPOSE</code> as a label — it doesn\'t actually publish the port.`,
      },
      {
        concept: 'Build the Image',
        terminal: [
          { t: 'cmd', text: 'docker build -t myapp:latest .' },
          { t: 'blank' },
          { t: 'dim', text: 'Sending build context to Docker daemon   2.34kB' },
          { t: 'dim', text: 'Step 1/7 : FROM node:20-alpine' },
          { t: 'ok', text: '  --> Pulling from library/node' },
          { t: 'ok', text: '  --> a1b2c3d4e5f6' },
          { t: 'dim', text: 'Step 2/7 : WORKDIR /app' },
          { t: 'ok', text: '  --> Using cache' },
          { t: 'dim', text: 'Step 3/7 : RUN npm ci' },
          { t: 'ok', text: '  --> Running in 12.4s' },
          { t: 'blank' },
          { t: 'ok', text: 'Successfully built a1b2c3d4e5f6' },
          { t: 'ok', text: 'Successfully tagged myapp:latest' },
        ],
        diagramKey: 'build',
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
        diagramKey: 'run',
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
          { t: 'dim', text: '│  └────────┘  └────────┘        │' },
          { t: 'blank' },
          { t: 'accent', text: '# Container (Docker):' },
          { t: 'accent', text: '┌──────────────────────────────────┐' },
          { t: 'accent', text: '│  Hardware + Host OS (Linux)      │' },
          { t: 'accent', text: '│  ┌────────────┐ ┌────────────┐  │' },
          { t: 'accent', text: '│  │ Container 1│ │ Container 2│  │' },
          { t: 'accent', text: '│  └────────────┘ └────────────┘  │' },
          { t: 'blank' },
          { t: 'hl', text: 'VMs: heavy, slow to start, full isolation' },
          { t: 'hl', text: 'Containers: lightweight, instant start, shared kernel' },
        ],
        diagramKey: 'vmvcontainer',
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
        diagramKey: 'volume',
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
        diagramKey: 'network',
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
        diagramKey: 'realwebsite',
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
        diagramKey: 'composeintro',
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
        diagramKey: 'composeyml',
        explanation: `<strong>services:</strong> defines each container. <strong>build:</strong> means "build from Dockerfile in this dir" (for your app). <strong>image:</strong> means "pull this pre-built image" (for Postgres/Redis). <strong>depends_on:</strong> ensures containers start in the right order (db before api). Docker auto-creates a default network — containers can reach each other by service name (<code>db</code>, <code>redis</code>). No <code>docker network create</code> needed.`,
      },
      {
        concept: 'docker compose up',
        terminal: [
          { t: 'cmd', text: 'docker compose up -d' },
          { t: 'blank' },
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
        diagramKey: 'composeup',
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
        diagramKey: 'composediff',
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
        diagramKey: 'scalesimple',
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
        diagramKey: 'k8swhy',
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
        diagramKey: 'k8sconcepts',
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
        diagramKey: 'k8sdeploy',
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
        diagramKey: 'k8sservice',
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
        diagramKey: 'k8singress',
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
        diagramKey: 'rollingupdate',
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
        diagramKey: 'realsetup',
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
        diagramKey: 'ssllife',
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
        diagramKey: 'systemd',
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
        diagramKey: 'spectrum',
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
        diagramKey: 'nextsteps',
        explanation: `<strong>The only way to actually learn this is by doing.</strong> Reading about Dockerfiles doesn\'t teach you; writing one for a real project does. Getting a real server — even a $6/month one — forces you to understand networking, DNS, firewalls, SSH, and the actual production stack. Heroku/Render/Vercel are great, but they hide the infrastructure. A $6 Hetzner server and a weekend will teach you more than ten tutorials. After that, Kubernetes becomes obvious — you\'ll hit its constraints on your own and understand why it exists.`,
      },
    ],
  },
};

// ── SVG Diagrams ───────────────────────────────────────────────────────────────

const DIAGRAMS = {

  problem: Diagram({
    w: 560, h: 380,
    nodes: [
      { id: 'laptop', type: 'server', x: 200, y: 20, label: 'Your Laptop', sub: 'Node 20, Python 3.11, macOS', w: 160, h: 56 },
      { id: 'server', type: 'issue', x: 200, y: 148, label: 'Production Server', sub: 'Node 18, Python 3.9 — mismatch!', w: 160, h: 56 },
      { id: 'docker', type: 'check', x: 200, y: 276, label: 'Docker Image', sub: 'Exact env, runs anywhere', w: 160, h: 56 },
    ],
    edges: [
      { from: 'laptop', to: 'server', label: '"works here!" ✗', color: '#f87171' },
      { from: 'server', to: 'docker', label: '✓ portable', color: '#4ade80' },
    ],
  }),

  dockerfile: Diagram({
    w: 560, h: 380,
    groups: [
      { label: 'BUILD TIME (read top to bottom)', x: 8, y: 8, w: 544, h: 158, fill: 'rgba(124,107,255,0.04)', stroke: '#7c6bff', dash: true, color: '#7c6bff' },
      { label: 'IMAGE LAYERS (stacked, read-only)', x: 8, y: 182, w: 544, h: 190, fill: 'rgba(74,222,128,0.04)', stroke: '#4ade80', dash: true, color: '#4ade80' },
    ],
    nodes: [
      // Row 1: build instructions
      { id: 'from',    type: 'cmd', x: 24,  y: 36, label: 'FROM',        sub: 'node:20-alpine',    w: 130, h: 48 },
      { id: 'workdir', type: 'cmd', x: 164, y: 36, label: 'WORKDIR',     sub: '/app',              w: 120, h: 48 },
      { id: 'copy',    type: 'cmd', x: 294, y: 36, label: 'COPY',        sub: 'package*.json',     w: 120, h: 48 },
      { id: 'run',     type: 'cmd', x: 424, y: 36, label: 'RUN',         sub: 'npm ci --prod',     w: 112, h: 48 },
      // Row 2: more build + start
      { id: 'cmd2',    type: 'cmd', x: 24,  y: 96, label: 'COPY . .',    sub: 'your source code',  w: 130, h: 48 },
      { id: 'expose',  type: 'cmd', x: 164, y: 96, label: 'EXPOSE',     sub: '3000 (documents)',  w: 120, h: 48 },
      { id: 'start',   type: 'cmd', x: 294, y: 96, label: 'CMD',        sub: 'node server.js',    w: 120, h: 48 },
      // Image layers (stacked vertically, each builds on previous)
      { id: 'base',    type: 'container', x: 24,  y: 196, label: '① alpine base',    sub: '~5MB OS',  w: 160, h: 48 },
      { id: 'nodebin', type: 'container', x: 200, y: 196, label: '② node binary',    sub: '',         w: 150, h: 48 },
      { id: 'npmlib',  type: 'container', x: 24,  y: 254, label: '③ npm packages',    sub: '',         w: 160, h: 48 },
      { id: 'yourcode',type: 'container', x: 200, y: 254, label: '④ your code',      sub: '',         w: 150, h: 48 },
    ],
    edges: [
      { from: 'base',    to: 'nodebin', label: 'builds on', color: '#6b6b8a' },
      { from: 'nodebin', to: 'npmlib',  color: '#6b6b8a' },
      { from: 'npmlib',  to: 'yourcode',color: '#6b6b8a' },
    ],
  }),

  build: Diagram({
    w: 560, h: 360,
    groups: [
      { label: 'LAYER CACHE', x: 8, y: 8, w: 544, h: 300, fill: 'rgba(124,107,255,0.04)', stroke: '#7c6bff', dash: true, color: '#7c6bff' },
    ],
    nodes: [
      { id: 'from',    type: 'cmd', x: 24,  y: 36, label: 'FROM node:20',   sub: '→ CACHED ✓', w: 155, h: 42 },
      { id: 'copypkg', type: 'cmd', x: 195, y: 36, label: 'COPY package.json', sub: '→ CACHED ✓', w: 155, h: 42 },
      { id: 'npmci',   type: 'cmd', x: 366, y: 36, label: 'RUN npm ci',     sub: '→ CACHED ✓', w: 155, h: 42 },
      { id: 'codecopy',type: 'cmd', x: 24,  y: 108, label: 'COPY .',        sub: '→ REBUILD ⚡', w: 155, h: 42, active: true },
      { id: 'cmd',     type: 'cmd', x: 195, y: 108, label: 'CMD ["node",...]',sub: '',            w: 155, h: 42 },
      { id: 'daemon',  type: 'server', x: 140, y: 220, label: 'Docker Daemon', sub: 'builds layers', w: 260, h: 56 },
    ],
    edges: [
      { from: 'from',    to: 'daemon', label: 'uses cache', color: '#6b6b8a' },
      { from: 'copypkg', to: 'daemon', color: '#6b6b8a' },
      { from: 'npmci',   to: 'daemon', color: '#6b6b8a' },
      { from: 'codecopy',to: 'daemon', label: 'rebuilds', color: '#fbbf24' },
    ],
  }),

  run: Diagram({
    w: 560, h: 320,
    nodes: [
      { id: 'host',    type: 'server', x: 24,  y: 20, label: 'Host',        sub: 'port 3000, eth0', w: 155, h: 56 },
      { id: 'ctr',     type: 'container', x: 24, y: 190, label: 'Container', sub: 'your app :3000', w: 155, h: 56, active: true },
    ],
    edges: [
      { from: 'host', to: 'ctr', label: '-p 3000:3000', color: '#7c6bff' },
    ],
  }),

  vmvcontainer: Diagram({
    w: 560, h: 420,
    groups: [
      { label: 'TRADITIONAL VM', x: 8, y: 8, w: 260, h: 380, fill: 'rgba(96,165,250,0.04)', stroke: '#60a5fa', dash: true, color: '#60a5fa' },
      { label: 'DOCKER CONTAINER', x: 284, y: 8, w: 268, h: 380, fill: 'rgba(124,107,255,0.04)', stroke: '#7c6bff', dash: true, color: '#7c6bff' },
    ],
    nodes: [
      { id: 'hyper',  type: 'server',    x: 64,  y: 30,  label: 'Hypervisor',   sub: 'VirtualBox / VMware', w: 155, h: 50 },
      { id: 'vm1',    type: 'server',    x: 24,  y: 130, label: 'VM',           sub: 'Ubuntu + App (GB)', w: 100, h: 48 },
      { id: 'vm2',    type: 'server',    x: 140, y: 130, label: 'VM',           sub: 'Ubuntu + App (GB)', w: 100, h: 48 },
      { id: 'kernel', type: 'server',    x: 64,  y: 330, label: 'Linux Kernel', sub: 'shared', w: 155, h: 50 },
      { id: 'c1',     type: 'container', x: 300, y: 130, label: 'Container 1', sub: 'MB, ms start', w: 110, h: 48, active: true },
      { id: 'c2',     type: 'container', x: 425, y: 130, label: 'Container 2', sub: 'MB, ms start', w: 110, h: 48 },
      { id: 'dockkernel', type: 'server',x: 300, y: 330, label: 'Host Kernel',  sub: 'shared by all', w: 235, h: 50 },
    ],
    edges: [
      { from: 'hyper', to: 'vm1', color: '#60a5fa' },
      { from: 'hyper', to: 'vm2', color: '#60a5fa' },
      { from: 'vm1',   to: 'kernel', color: '#60a5fa' },
      { from: 'vm2',   to: 'kernel', color: '#60a5fa' },
      { from: 'c1',    to: 'dockkernel', color: '#7c6bff' },
      { from: 'c2',    to: 'dockkernel', color: '#7c6bff' },
    ],
  }),

  volume: Diagram({
    w: 560, h: 320,
    nodes: [
      { id: 'hostfs', type: 'server', x: 40,  y: 20, label: 'Host Filesystem', sub: '/var/lib/docker/volumes/', w: 220, h: 56 },
      { id: 'pgdata', type: 'volume', x: 60,  y: 140, label: 'pgdata volume', sub: 'persists forever', w: 180, h: 56 },
      { id: 'pgcont', type: 'db',     x: 300, y: 20, label: 'PostgreSQL', sub: 'writes to /var/lib/...', w: 200, h: 56 },
    ],
    edges: [
      { from: 'hostfs', to: 'pgdata', label: '-v pgdata', color: '#4ade80' },
      { from: 'pgcont', to: 'pgdata', label: 'volume mount', color: '#4ade80' },
    ],
  }),

  network: Diagram({
    w: 560, h: 340,
    nodes: [
      { id: 'api', type: 'container', x: 60,  y: 50, label: 'api', sub: 'connects to db:5432', w: 150, h: 56 },
      { id: 'db',  type: 'db',       x: 300, y: 50, label: 'db',  sub: 'postgres:16', w: 150, h: 56 },
      { id: 'redis',type: 'container',x: 60, y: 200, label: 'redis', sub: 'cache / sessions', w: 150, h: 56 },
      { id: 'bridge',type: 'server', x: 60, y: 310, label: 'Docker bridge (mynet)', sub: 'DNS: api→172.18.0.x, db→172.18.0.y', w: 390, h: 40 },
    ],
    edges: [
      { from: 'api',    to: 'db',     label: 'DB_HOST=db', color: '#4ade80' },
      { from: 'redis',  to: 'bridge', color: '#7c6bff' },
      { from: 'api',    to: 'bridge', color: '#7c6bff' },
      { from: 'db',     to: 'bridge', color: '#7c6bff' },
    ],
  }),

  realwebsite: Diagram({
    w: 560, h: 400,
    groups: [
      { label: 'PUBLIC INTERNET', x: 8, y: 8, w: 544, h: 60, fill: 'rgba(255,107,138,0.04)', stroke: '#ff6b8a', dash: true, color: '#ff6b8a' },
      { label: 'PRIVATE NETWORK (never exposed)', x: 8, y: 180, w: 544, h: 190, fill: 'rgba(124,107,255,0.04)', stroke: '#7c6bff', dash: true, color: '#7c6bff' },
    ],
    nodes: [
      { id: 'user',  type: 'user',   x: 200, y: 20, label: 'Browser', sub: 'https://mysite.com', w: 160, h: 50 },
      { id: 'nginx', type: 'proxy',  x: 200, y: 80, label: 'nginx',    sub: 'SSL termination, reverse proxy', w: 160, h: 58, active: true },
      { id: 'app1',  type: 'container', x: 60,  y: 200, label: 'Node API', sub: ':3000', w: 130, h: 50 },
      { id: 'app2',  type: 'container', x: 215, y: 200, label: 'Node API', sub: ':3000', w: 130, h: 50 },
      { id: 'app3',  type: 'container', x: 370, y: 200, label: 'Node API', sub: ':3000', w: 130, h: 50 },
      { id: 'pg',    type: 'db',     x: 60,  y: 310, label: 'PostgreSQL', sub: ':5432', w: 150, h: 50 },
      { id: 'rd',    type: 'db',     x: 300, y: 310, label: 'Redis', sub: ':6379', w: 150, h: 50 },
    ],
    edges: [
      { from: 'user',  to: 'nginx', label: ':443 / HTTPS', color: '#ff6b8a' },
      { from: 'nginx', to: 'app1',  label: '/api/*', color: '#7c6bff' },
      { from: 'nginx', to: 'app2',  color: '#7c6bff' },
      { from: 'nginx', to: 'app3',  color: '#7c6bff' },
      { from: 'app1',  to: 'pg',    label: 'SQL', color: '#4ade80' },
      { from: 'app1',  to: 'rd',    label: 'GET/SET', color: '#4ade80' },
    ],
  }),

  composeintro: Diagram({
    w: 560, h: 340,
    groups: [
      { label: 'WITHOUT COMPOSE (mess)', x: 8, y: 8, w: 260, h: 310, fill: 'rgba(248,113,113,0.05)', stroke: '#f87171', dash: true, color: '#f87171' },
      { label: 'WITH COMPOSE (clean)', x: 284, y: 8, w: 268, h: 310, fill: 'rgba(74,222,128,0.05)', stroke: '#4ade80', dash: true, color: '#4ade80' },
    ],
    nodes: [
      { id: 'd1', type: 'issue', x: 24, y: 50, label: 'docker run db ...', sub: '6 flags + env vars', w: 230, h: 42 },
      { id: 'd2', type: 'issue', x: 24, y: 110, label: 'docker run redis ...', sub: '4 flags', w: 230, h: 42 },
      { id: 'd3', type: 'issue', x: 24, y: 170, label: 'docker run api -e DB_HOST=db ...', sub: '10 flags', w: 230, h: 42 },
      { id: 'd4', type: 'issue', x: 24, y: 230, label: 'docker run nginx ...', sub: '5 flags', w: 230, h: 42 },
      { id: 'c1', type: 'check', x: 300, y: 50, label: 'docker compose up -d', sub: 'one command', w: 240, h: 42 },
      { id: 'c2', type: 'check', x: 300, y: 110, label: 'docker compose down', sub: 'clean up', w: 240, h: 42 },
      { id: 'c3', type: 'check', x: 300, y: 170, label: 'docker compose logs -f', sub: 'tail all logs', w: 240, h: 42 },
      { id: 'c4', type: 'check', x: 300, y: 230, label: 'docker compose restart api', sub: 'restart one service', w: 240, h: 42 },
    ],
    edges: [
      { from: 'd1', to: 'c1', color: '#6b6b8a' },
    ],
  }),

  composeyml: Diagram({
    w: 560, h: 340,
    nodes: [
      { id: 'yml',  type: 'cmd', x: 200, y: 20, label: 'docker-compose.yml', sub: 'declarative config', w: 200, h: 50 },
      { id: 'api',  type: 'container', x: 60,  y: 140, label: 'api', sub: 'builds from Dockerfile', w: 130, h: 56 },
      { id: 'db',   type: 'db',       x: 215, y: 140, label: 'db', sub: 'postgres:16 image', w: 130, h: 56 },
      { id: 'redis',type: 'container', x: 370, y: 140, label: 'redis', sub: 'redis:alpine image', w: 130, h: 56 },
      { id: 'net',  type: 'server',   x: 60, y: 260, label: 'auto-created network', sub: 'api → db by name', w: 390, h: 50 },
    ],
    edges: [
      { from: 'yml',  to: 'api',   label: 'up', color: '#7c6bff' },
      { from: 'yml',  to: 'db',    color: '#7c6bff' },
      { from: 'yml',  to: 'redis', color: '#7c6bff' },
      { from: 'api',  to: 'net',   color: '#6b6b8a' },
      { from: 'db',   to: 'net',   color: '#6b6b8a' },
    ],
  }),

  composeup: Diagram({
    w: 560, h: 260,
    nodes: [
      { id: 'cmd', type: 'cmd', x: 200, y: 20, label: 'docker compose up -d', sub: 'one command starts all', w: 200, h: 50 },
      { id: 'api',  type: 'container', x: 60,  y: 130, label: 'api-1', sub: 'Up', w: 130, h: 56 },
      { id: 'db',   type: 'db',       x: 215, y: 130, label: 'db-1',  sub: 'Up', w: 130, h: 56 },
      { id: 'rd',   type: 'container', x: 370, y: 130, label: 'redis-1', sub: 'Up', w: 130, h: 56 },
    ],
    edges: [
      { from: 'cmd', to: 'api', color: '#7c6bff' },
      { from: 'cmd', to: 'db',  color: '#7c6bff' },
      { from: 'cmd', to: 'rd',  color: '#7c6bff' },
    ],
  }),

  composediff: Diagram({
    w: 560, h: 300,
    groups: [
      { label: 'BASE (dev + prod)', x: 8, y: 8, w: 260, h: 270, fill: 'rgba(124,107,255,0.04)', stroke: '#7c6bff', dash: true, color: '#7c6bff' },
      { label: 'PROD OVERRIDE', x: 284, y: 8, w: 268, h: 270, fill: 'rgba(251,191,36,0.04)', stroke: '#fbbf24', dash: true, color: '#fbbf24' },
    ],
    nodes: [
      { id: 'b1', type: 'cmd', x: 24, y: 50, label: 'image + build config', sub: '', w: 230, h: 38 },
      { id: 'b2', type: 'cmd', x: 24, y: 100, label: 'port mappings', sub: '', w: 230, h: 38 },
      { id: 'b3', type: 'cmd', x: 24, y: 150, label: 'environment vars', sub: '', w: 230, h: 38 },
      { id: 'p1', type: 'proxy', x: 300, y: 50, label: 'restart: always', sub: 'auto-restart on crash', w: 240, h: 38 },
      { id: 'p2', type: 'proxy', x: 300, y: 100, label: 'replicas: 3', sub: 'horizontal scale', w: 240, h: 38 },
      { id: 'p3', type: 'proxy', x: 300, y: 150, label: 'bind mount → removed', sub: 'use image only', w: 240, h: 38 },
    ],
    edges: [],
  }),

  scalesimple: Diagram({
    w: 560, h: 280,
    nodes: [
      { id: 'cmd', type: 'cmd', x: 200, y: 20, label: '--scale api=3', sub: 'replicate the API', w: 160, h: 50 },
      { id: 'a1',   type: 'container', x: 60,  y: 130, label: 'api-1', sub: 'Up', w: 130, h: 56 },
      { id: 'a2',   type: 'container', x: 215, y: 130, label: 'api-2', sub: 'Up', w: 130, h: 56 },
      { id: 'a3',   type: 'container', x: 370, y: 130, label: 'api-3', sub: 'Up', w: 130, h: 56 },
      { id: 'warn', type: 'issue',    x: 24, y: 215, label: '⚠ No built-in load balancer — add nginx upstream', sub: 'for production traffic distribution', w: 440, h: 44 },
    ],
    edges: [
      { from: 'cmd', to: 'a1', color: '#7c6bff' },
      { from: 'cmd', to: 'a2', color: '#7c6bff' },
      { from: 'cmd', to: 'a3', color: '#7c6bff' },
    ],
  }),

  k8swhy: Diagram({
    w: 560, h: 400,
    groups: [
      { label: 'SINGLE SERVER (brittle)', x: 8, y: 8, w: 260, h: 160, fill: 'rgba(248,113,113,0.04)', stroke: '#f87171', dash: true, color: '#f87171' },
      { label: 'KUBERNETES CLUSTER (resilient)', x: 8, y: 188, w: 544, h: 200, fill: 'rgba(124,107,255,0.04)', stroke: '#7c6bff', dash: true, color: '#7c6bff' },
    ],
    nodes: [
      { id: 'ss',  type: 'server', x: 64, y: 30, label: 'Server 1', sub: 'if it dies → everything dies', w: 155, h: 54 },
      { id: 'ssa', type: 'container', x: 24, y: 100, label: 'app', sub: '', w: 90, h: 44 },
      { id: 'ssd', type: 'db',     x: 124, y: 100, label: 'db', sub: '', w: 90, h: 44 },
      { id: 'n1',  type: 'server', x: 24,  y: 208, label: 'Node 1', sub: '', w: 100, h: 48 },
      { id: 'n2',  type: 'server', x: 145, y: 208, label: 'Node 2', sub: '', w: 100, h: 48 },
      { id: 'n3',  type: 'server', x: 266, y: 208, label: 'Node 3', sub: '', w: 100, h: 48 },
      { id: 'p1',  type: 'container', x: 24,  y: 268, label: 'app-pod', sub: '', w: 90, h: 40 },
      { id: 'p2',  type: 'container', x: 145, y: 268, label: 'app-pod', sub: '', w: 90, h: 40 },
      { id: 'p3',  type: 'container', x: 266, y: 268, label: 'app-pod', sub: '', w: 90, h: 40 },
      { id: 'pd',  type: 'db', x: 376, y: 268, label: 'db-pod', sub: '', w: 90, h: 40 },
      { id: 'pd2', type: 'db', x: 376, y: 220, label: 'db-pod', sub: '', w: 90, h: 40 },
    ],
    edges: [
      { from: 'n1', to: 'p1', color: '#7c6bff' },
      { from: 'n2', to: 'p2', color: '#7c6bff' },
      { from: 'n3', to: 'p3', color: '#7c6bff' },
      { from: 'n1', to: 'pd', color: '#4ade80' },
      { from: 'n3', to: 'pd2', color: '#4ade80' },
    ],
  }),

  k8sconcepts: Diagram({
    w: 560, h: 440,
    groups: [
      { label: 'KUBERNETES OBJECT HIERARCHY', x: 8, y: 8, w: 544, h: 430, fill: 'rgba(96,165,250,0.04)', stroke: '#60a5fa', dash: true, color: '#60a5fa' },
    ],
    nodes: [
      { id: 'pod',   type: 'container', x: 24,  y: 30, label: 'POD', sub: '1+ containers, shared net, co-located', w: 180, h: 56 },
      { id: 'dep',   type: 'k8s',      x: 24,  y: 140, label: 'DEPLOYMENT', sub: 'replicas: 3, rolling update, restart', w: 180, h: 58 },
      { id: 'svc',   type: 'proxy',    x: 24,  y: 250, label: 'SERVICE', sub: 'stable IP, DNS name, load balances', w: 180, h: 58 },
      { id: 'ing',   type: 'proxy',   x: 24,  y: 360, label: 'INGRESS', sub: 'HTTPS entry, TLS, routing rules', w: 180, h: 58 },
      { id: 'p1',    type: 'container', x: 300, y: 30, label: 'app container', sub: '', w: 140, h: 50 },
      { id: 'p2',    type: 'container', x: 455, y: 30, label: 'sidecar', sub: '', w: 90, h: 50 },
      { id: 'r1',    type: 'k8s', x: 300, y: 148, label: 'replica 1', sub: 'pod-a1b2', w: 140, h: 44 },
      { id: 'r2',    type: 'k8s', x: 300, y: 200, label: 'replica 2', sub: 'pod-c3d4', w: 140, h: 44 },
      { id: 'r3',    type: 'k8s', x: 300, y: 252, label: 'replica 3', sub: 'pod-e5f6', w: 140, h: 44 },
      { id: 's1',    type: 'container', x: 300, y: 258, label: '10.96.x.x:80', sub: 'ClusterIP', w: 140, h: 44 },
      { id: 'i1',    type: 'proxy', x: 300, y: 368, label: 'nginx controller', sub: ':443 from internet', w: 220, h: 44 },
    ],
    edges: [
      { from: 'p1',   to: 'pod',  color: '#7c6bff' },
      { from: 'p2',   to: 'pod',  color: '#7c6bff' },
      { from: 'pod',  to: 'dep',  label: 'manages', color: '#60a5fa' },
      { from: 'dep',  to: 'svc',  label: 'exposes', color: '#60a5fa' },
      { from: 'svc',  to: 'ing',  label: 'behind', color: '#60a5fa' },
      { from: 'dep',  to: 'r1',   color: '#60a5fa' },
      { from: 'dep',  to: 'r2',   color: '#60a5fa' },
      { from: 'dep',  to: 'r3',   color: '#60a5fa' },
      { from: 'svc',  to: 's1',   color: '#fbbf24' },
      { from: 'ing',  to: 'i1',   color: '#fbbf24' },
    ],
  }),

  k8sdeploy: Diagram({
    w: 560, h: 380,
    nodes: [
      { id: 'yml',   type: 'cmd',  x: 24,  y: 20, label: 'deployment.yml', sub: 'replicas: 3, image: v1', w: 200, h: 54 },
      { id: 'api',   type: 'k8s', x: 24,  y: 130, label: 'K8s API Server', sub: 'control plane brain', w: 200, h: 54 },
      { id: 'sched', type: 'k8s', x: 24,  y: 230, label: 'Scheduler', sub: 'places pods on nodes', w: 200, h: 54 },
      { id: 'p1',    type: 'container', x: 300, y: 50, label: 'pod-a1b2', sub: 'Running ✓', w: 140, h: 50, active: true },
      { id: 'p2',    type: 'container', x: 300, y: 150, label: 'pod-c3d4', sub: 'Running ✓', w: 140, h: 50 },
      { id: 'p3',    type: 'container', x: 300, y: 250, label: 'pod-e5f6', sub: 'Running ✓', w: 140, h: 50 },
      { id: 'n1',    type: 'server', x: 300, y: 50, label: 'Node 1', sub: '', w: 140, h: 50 },
      { id: 'n2',    type: 'server', x: 300, y: 150, label: 'Node 2', sub: '', w: 140, h: 50 },
      { id: 'n3',    type: 'server', x: 300, y: 250, label: 'Node 3', sub: '', w: 140, h: 50 },
    ],
    edges: [
      { from: 'yml',   to: 'api',   label: 'kubectl apply', color: '#60a5fa' },
      { from: 'api',   to: 'sched', color: '#60a5fa' },
      { from: 'sched', to: 'p1',    label: 'schedule', color: '#7c6bff' },
      { from: 'sched', to: 'p2',   color: '#7c6bff' },
      { from: 'sched', to: 'p3',   color: '#7c6bff' },
    ],
  }),

  k8sservice: Diagram({
    w: 560, h: 340,
    nodes: [
      { id: 'svc',   type: 'proxy',    x: 200, y: 20, label: 'api-service', sub: 'ClusterIP 10.96.x.x:80 → :3000', w: 200, h: 58 },
      { id: 'sel',   type: 'text',     x: 24,  y: 100, label: 'selector: app=api', color: '#6b6b8a', size: 10, y: 90 },
      { id: 'p1',    type: 'container',x: 40,  y: 140, label: 'pod-a1b2', sub: '10.0.0.1', w: 130, h: 50 },
      { id: 'p2',    type: 'container',x: 215, y: 140, label: 'pod-c3d4', sub: '10.0.1.2', w: 130, h: 50 },
      { id: 'p3',    type: 'container',x: 390, y: 140, label: 'pod-e5f6', sub: '10.0.2.3', w: 130, h: 50 },
      { id: 'note',  type: 'text',     x: 200, y: 230, label: 'Pods have ephemeral IPs.\nService is the fixed address.', color: '#6b6b8a', size: 11, opacity: 0.7, bold: false },
    ],
    edges: [
      { from: 'svc', to: 'p1', label: 'load-balances', color: '#fbbf24' },
      { from: 'svc', to: 'p2', color: '#fbbf24' },
      { from: 'svc', to: 'p3', color: '#fbbf24' },
    ],
  }),

  k8singress: Diagram({
    w: 560, h: 360,
    groups: [
      { label: 'INTERNET', x: 8, y: 8, w: 544, h: 60, fill: 'rgba(255,107,138,0.04)', stroke: '#ff6b8a', dash: true, color: '#ff6b8a' },
      { label: 'K8S CLUSTER (private)', x: 8, y: 80, w: 544, h: 260, fill: 'rgba(124,107,255,0.04)', stroke: '#7c6bff', dash: true, color: '#7c6bff' },
    ],
    nodes: [
      { id: 'user',  type: 'user',  x: 200, y: 20, label: 'Browser', sub: '', w: 160, h: 50 },
      { id: 'ing',   type: 'proxy', x: 200, y: 100, label: 'Ingress (nginx)', sub: 'TLS termination, /api → api, / → frontend', w: 200, h: 58 },
      { id: 'ap',    type: 'container', x: 60,  y: 200, label: 'api pods × 3', sub: '', w: 150, h: 50 },
      { id: 'fp',    type: 'container', x: 300, y: 200, label: 'frontend pods × 2', sub: '', w: 190, h: 50 },
      { id: 'svc1',  type: 'proxy', x: 60,  y: 270, label: 'api-service', sub: '', w: 150, h: 44 },
      { id: 'svc2',  type: 'proxy', x: 300, y: 270, label: 'frontend-service', sub: '', w: 190, h: 44 },
    ],
    edges: [
      { from: 'user', to: 'ing',  label: 'https://mysite.com', color: '#ff6b8a' },
      { from: 'ing',  to: 'svc1', label: '/api/*', color: '#7c6bff' },
      { from: 'ing',  to: 'svc2', label: '/*', color: '#7c6bff' },
      { from: 'svc1', to: 'ap',   color: '#60a5fa' },
      { from: 'svc2', to: 'fp',  color: '#60a5fa' },
    ],
  }),

  rollingupdate: Diagram({
    w: 560, h: 320,
    nodes: [
      { id: 'cmd', type: 'cmd', x: 160, y: 20, label: 'kubectl set image deployment/api api=v2', sub: 'rolling update triggered', w: 280, h: 50 },
      { id: 'v2a', type: 'check', x: 40,  y: 130, label: 'v2 pod ✓', sub: 'new, healthy', w: 120, h: 50, active: true },
      { id: 'v2b', type: 'check', x: 180, y: 130, label: 'v2 pod ✓', sub: 'new, healthy', w: 120, h: 50, active: true },
      { id: 'v1',  type: 'container', x: 320, y: 130, label: 'v1 pod', sub: 'still serving', w: 120, h: 50 },
      { id: 'note', type: 'text', x: 280, y: 210, label: 'K8s keeps old pods alive\nuntil new ones are healthy.\nZero downtime.', color: '#6b6b8a', size: 11, opacity: 0.7, align: 'start', x: 300, y: 210 },
    ],
    edges: [
      { from: 'cmd', to: 'v2a', label: 'rollout', color: '#4ade80' },
      { from: 'cmd', to: 'v2b', color: '#4ade80' },
      { from: 'cmd', to: 'v1',  color: '#7c6bff' },
    ],
  }),

  realsetup: Diagram({
    w: 560, h: 400,
    groups: [
      { label: 'PUBLIC', x: 8, y: 8, w: 544, h: 60, fill: 'rgba(255,107,138,0.04)', stroke: '#ff6b8a', dash: true, color: '#ff6b8a' },
      { label: 'REVERSE PROXY', x: 8, y: 80, w: 544, h: 80, fill: 'rgba(251,191,36,0.04)', stroke: '#fbbf24', dash: true, color: '#fbbf24' },
      { label: 'CONTAINERS', x: 8, y: 172, w: 544, h: 120, fill: 'rgba(124,107,255,0.04)', stroke: '#7c6bff', dash: true, color: '#7c6bff' },
      { label: 'HARDWARE', x: 8, y: 304, w: 544, h: 70, fill: 'rgba(96,165,250,0.04)', stroke: '#60a5fa', dash: true, color: '#60a5fa' },
    ],
    nodes: [
      { id: 'user',  type: 'user',    x: 200, y: 18, label: 'Browser', sub: '', w: 160, h: 50 },
      { id: 'ng',    type: 'proxy',   x: 200, y: 90, label: 'nginx + certbot', sub: 'SSL termination, proxy_pass, auto-renew', w: 200, h: 62 },
      { id: 'app',   type: 'container',x: 60,  y: 190, label: 'your app', sub: 'Node/Python/Go', w: 130, h: 50 },
      { id: 'pg',    type: 'db',      x: 215, y: 190, label: 'PostgreSQL', sub: ':5432', w: 130, h: 50 },
      { id: 'rd',    type: 'db',      x: 370, y: 190, label: 'Redis', sub: ':6379', w: 130, h: 50 },
      { id: 'vps',   type: 'server',  x: 180, y: 314, label: '$6–20/mo VPS', sub: 'Hetzner / DigitalOcean', w: 200, h: 54 },
    ],
    edges: [
      { from: 'user', to: 'ng',  label: ':443 HTTPS', color: '#ff6b8a' },
      { from: 'ng',   to: 'app', label: 'proxy_pass', color: '#fbbf24' },
      { from: 'app',  to: 'pg',  color: '#4ade80' },
      { from: 'app',  to: 'rd',  color: '#4ade80' },
      { from: 'ng',   to: 'vps', color: '#60a5fa' },
    ],
  }),

  ssllife: Diagram({
    w: 560, h: 320,
    nodes: [
      { id: 'br',  type: 'user',   x: 200, y: 20, label: 'Browser', sub: 'HTTPS request', w: 160, h: 50 },
      { id: 'cb',  type: 'cert',   x: 200, y: 110, label: 'Certbot', sub: "Let's Encrypt, auto-renew", w: 200, h: 58 },
      { id: 'le',  type: 'text',   x: 24,  y: 190, label: 'ACME protocol challenge', color: '#6b6b8a', size: 11, opacity: 0.7 },
      { id: 'ng',  type: 'proxy',  x: 200, y: 210, label: 'nginx', sub: 'ssl_certificate, proxy_pass', w: 200, h: 58 },
    ],
    edges: [
      { from: 'br', to: 'cb', label: 'TLS handshake', color: '#ff6b8a' },
      { from: 'cb', to: 'ng', label: 'ssl cert installed', color: '#4ade80' },
    ],
  }),

  systemd: Diagram({
    w: 560, h: 320,
    groups: [
      { label: 'LINUX INIT (systemd)', x: 8, y: 8, w: 544, h: 80, fill: 'rgba(96,165,250,0.04)', stroke: '#60a5fa', dash: true, color: '#60a5fa' },
      { label: 'DOCKER', x: 8, y: 100, w: 544, h: 80, fill: 'rgba(124,107,255,0.04)', stroke: '#7c6bff', dash: true, color: '#7c6bff' },
    ],
    nodes: [
      { id: 'boot', type: 'server', x: 24, y: 20, label: 'Server boots', sub: '', w: 120, h: 44 },
      { id: 'dock', type: 'server', x: 165, y: 20, label: 'Docker starts', sub: '', w: 120, h: 44 },
      { id: 'svc',  type: 'server', x: 306, y: 20, label: 'mysite.service', sub: 'ExecStart', w: 120, h: 44 },
      { id: 'cu',   type: 'check',  x: 447, y: 20, label: 'enable', sub: 'starts on boot', w: 90, h: 44 },
      { id: 'cuup', type: 'cmd',    x: 306, y: 110, label: 'docker compose up -d', sub: 'ExecStart cmd', w: 170, h: 44 },
      { id: 'api',  type: 'container', x: 60,  y: 200, label: 'app', sub: '', w: 120, h: 50 },
      { id: 'db',   type: 'db',      x: 220, y: 200, label: 'db', sub: '', w: 120, h: 50 },
      { id: 'rd',   type: 'container', x: 380, y: 200, label: 'redis', sub: '', w: 120, h: 50 },
    ],
    edges: [
      { from: 'boot', to: 'dock', color: '#60a5fa' },
      { from: 'dock', to: 'svc',  color: '#60a5fa' },
      { from: 'svc',  to: 'cu',   color: '#60a5fa' },
      { from: 'svc',  to: 'cuup', label: 'ExecStart', color: '#fbbf24' },
      { from: 'cuup', to: 'api',  color: '#7c6bff' },
      { from: 'cuup', to: 'db',   color: '#7c6bff' },
      { from: 'cuup', to: 'rd',   color: '#7c6bff' },
    ],
  }),

  spectrum: Diagram({
    w: 560, h: 300,
    nodes: [
      { id: 'compose', type: 'container', x: 20,  y: 50, label: 'Docker Compose', sub: '1–3 containers\n1 server', w: 150, h: 80 },
      { id: 'swarm',   type: 'k8s',      x: 205, y: 50, label: 'Docker Swarm', sub: '5–30 containers\n2–5 servers', w: 150, h: 80 },
      { id: 'k8s',     type: 'k8s',      x: 390, y: 50, label: 'Kubernetes', sub: '50+ containers\n10+ servers', w: 150, h: 80 },
      { id: 'arrow',   type: 'text',      x: 280, y: 240, label: 'Most indie projects live here ◀', color: '#fbbf24', size: 12, opacity: 0.9, bold: true },
    ],
    edges: [
      { from: 'compose', to: 'swarm', label: 'more scale', color: '#6b6b8a' },
      { from: 'swarm',   to: 'k8s',   label: 'even more', color: '#6b6b8a' },
    ],
  }),

  nextsteps: Diagram({
    w: 560, h: 420,
    nodes: [
      { id: 's1', type: 'check', x: 24,  y: 20, label: '① Docker Desktop', sub: 'Install on your laptop', w: 240, h: 52 },
      { id: 's2', type: 'check', x: 24,  y: 90,  label: '② Dockerize a project', sub: 'Write a real Dockerfile', w: 240, h: 52 },
      { id: 's3', type: 'check', x: 24,  y: 160, label: '③ $6/mo Hetzner server', sub: 'SSH in. It gets real here.', w: 240, h: 52 },
      { id: 's4', type: 'check', x: 24,  y: 230, label: '④ docker-compose.yml', sub: 'One command. Full stack.', w: 240, h: 52 },
      { id: 's5', type: 'check', x: 24,  y: 300, label: '⑤ nginx + certbot', sub: 'HTTPS. A domain. Progress.', w: 240, h: 52 },
      { id: 's6', type: 'k8s',   x: 24,  y: 370, label: '⑥ Feel the pain → K8s makes sense', sub: 'Only then do you understand why', w: 240, h: 52 },
      { id: 'note', type: 'text', x: 300, y: 180, label: 'You don\'t understand containers\nuntil you\'ve broken a prod\nserver at 2am.', color: '#f87171', size: 12, opacity: 0.85, bold: false, align: 'start' },
    ],
    edges: [
      { from: 's1', to: 's2', color: '#4ade80' },
      { from: 's2', to: 's3', color: '#4ade80' },
      { from: 's3', to: 's4', color: '#4ade80' },
      { from: 's4', to: 's5', color: '#4ade80' },
      { from: 's5', to: 's6', color: '#4ade80' },
    ],
  }),

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
    e.preventDefault();
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

  stepIndicator.textContent = `Step ${currentStep + 1} / ${total}`;
  progressFill.style.width = `${pct}%`;
  conceptName.textContent = step.concept;
  terminalTitle.textContent = `Terminal — ${tab.label}`;
  btnPrev.disabled = currentStep === 0;
  btnNext.disabled = currentStep === total - 1;

  clearTimeout(typingTimeout);
  terminalOutput.innerHTML = '';
  cmdIndex = 0;
  typeLines(step.terminal);

  vizDiagram.innerHTML = DIAGRAMS[step.diagramKey] || '';

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

    const clsMap = {
      cmd: 't-line t-cmd', out: 't-line t-out', dim: 't-line t-dim',
      ok: 't-line t-ok', warn: 't-line t-warn', err: 't-line t-err',
      accent: 't-line t-accent', hl: 't-line t-hl', codelab: 't-line',
    };
    const cls = clsMap[line.t] || 't-line t-out';

    const span = document.createElement('span');
    span.className = cls;

    if (line.t === 'cmd') {
      cmdIndex++;
      span.id = `cmd-${cmdIndex}`;
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
