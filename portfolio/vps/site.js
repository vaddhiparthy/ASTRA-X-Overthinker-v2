(function () {
  const page = document.body.dataset.page || "home";
  const app = document.getElementById("app");

  async function readJson(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(path);
    return response.json();
  }

  const STACK_ICONS = {
    Airflow: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/apacheairflow.svg",
    "AWS S3": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazons3.svg",
    Chroma: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/chroma.svg",
    "Data Contracts": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/jsonwebtokens.svg",
    dbt: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/dbt.svg",
    Docker: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/docker.svg",
    "Docker Compose": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/docker.svg",
    DuckDB: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/duckdb.svg",
    FastAPI: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/fastapi.svg",
    Flask: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/flask.svg",
    "GitHub Actions": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/githubactions.svg",
    "Great Expectations": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/checkmarx.svg",
    "HMAC Tokenization": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/letsencrypt.svg",
    "HTTP APIs": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openapiinitiative.svg",
    Kafka: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/apachekafka.svg",
    LangChain: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/langchain.svg",
    "Model Ops": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openai.svg",
    Postgres: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/postgresql.svg",
    PostgreSQL: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/postgresql.svg",
    "Prompt Registry": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/bookstack.svg",
    "Privacy Engineering": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/letsencrypt.svg",
    Python: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/python.svg",
    "Session State Management": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/redis.svg",
    Scheduler: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/clockify.svg",
    Snowflake: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/snowflake.svg",
    SQLite: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/sqlite.svg",
    Streamlit: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/streamlit.svg",
    Terraform: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/terraform.svg",
    Uvicorn: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/uvicorn.svg",
  };

  function stackBadge(item) {
    const icon = STACK_ICONS[item];
    const fallback = item.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    return `
      <span class="stack-badge">
        ${icon ? `<img src="${icon}" alt="" loading="lazy">` : `<span class="stack-fallback">${fallback}</span>`}
        <span>${item}</span>
      </span>
    `;
  }

  function stackItems(value) {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    return value.split(",").map((item) => item.trim().replace(/\.$/, "")).filter(Boolean);
  }

  function stackBlock(value) {
    const items = stackItems(value);
    if (!items.length) return "";
    return `<div class="stack compact-stack">${items.map(stackBadge).join("")}</div>`;
  }

  function uniqueTechnologies(projects) {
    const seen = new Set();
    projects.forEach((project) => {
      (project.stack || []).forEach((item) => {
        if (!seen.has(item)) seen.add(item);
      });
    });
    return Array.from(seen);
  }

  function projectActions(project) {
    const actions = [];
    if (project.url) {
      actions.push(`
        <a class="project-action" href="${project.url}" target="_blank" rel="noreferrer" aria-label="Open project page">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3Z"></path><path d="M5 5h6v2H7v10h10v-4h2v6H5V5Z"></path></svg>
        </a>
      `);
    }
    if (project.github_url) {
      actions.push(`
        <a class="project-action" href="${project.github_url}" target="_blank" rel="noreferrer" aria-label="Open GitHub repository">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23A11.4 11.4 0 0 1 12 6.8c1.02 0 2.05.14 3.01.4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.47 5.93.43.37.81 1.1.81 2.22v3.3c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"></path></svg>
        </a>
      `);
    }
    return actions.length ? `<div class="project-actions">${actions.join("")}</div>` : "";
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function playPepperChime() {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) return;
    try {
      const context = new AudioContextCtor();
      const now = context.currentTime;
      const output = context.createGain();
      output.gain.setValueAtTime(0.0001, now);
      output.gain.exponentialRampToValueAtTime(0.035, now + 0.025);
      output.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);
      output.connect(context.destination);

      [
        { frequency: 659.25, start: 0, duration: 0.2 },
        { frequency: 880, start: 0.12, duration: 0.28 },
      ].forEach((tone) => {
        const oscillator = context.createOscillator();
        const toneGain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(tone.frequency, now + tone.start);
        toneGain.gain.setValueAtTime(0.0001, now + tone.start);
        toneGain.gain.exponentialRampToValueAtTime(0.42, now + tone.start + 0.025);
        toneGain.gain.exponentialRampToValueAtTime(0.0001, now + tone.start + tone.duration);
        oscillator.connect(toneGain);
        toneGain.connect(output);
        oscillator.start(now + tone.start);
        oscillator.stop(now + tone.start + tone.duration + 0.04);
      });

      window.setTimeout(() => context.close().catch(() => {}), 900);
    } catch (error) {
      console.warn("Pepper chime unavailable", error);
    }
  }

  function renderHome(content) {
    const sidebar = content.sidebar;
    const sections = content.sections;
    app.innerHTML = `
      <div class="home-layout">
        <aside class="profile-rail">
          <div class="avatar"><img src="${sidebar.avatar.src}" alt="${sidebar.avatar.alt}"></div>
          <h1>${sidebar.name}</h1>
          <p class="headline">${sidebar.headline_lines.join("<br>")}</p>
          <p class="degree">${sidebar.degree_lines.join("<br>")}</p>
          <ul class="meta-list">
            <li>${sidebar.location}</li>
            <li>${sidebar.employer}</li>
          </ul>
          <nav class="rail-links">
            <a href="/contact">Contact Form</a>
            <a href="/portfolio">Project Portfolio</a>
            ${sidebar.nav.profiles.map((item) => `<a href="${item.href}" target="_blank" rel="noreferrer">${item.label}</a>`).join("")}
          </nav>
          <section class="home-pepper-card">
            <h2>Career Desk</h2>
            <div id="home-pepper"></div>
          </section>
        </aside>
        <section class="content-panel">
          <section class="section">
            <h2>${sections.summary.title}</h2>
            ${sections.summary.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
          </section>
          <section class="section">
            <h2>${sections.research_interests.title}</h2>
            <ul class="skill-list">${sections.research_interests.items.map((item) => `<li>${item}</li>`).join("")}</ul>
          </section>
          <section class="section">
            <h2>${sections.projects.title}</h2>
            <div class="project-list">
              ${sections.projects.items.slice(0, 5).map((item) => `
                <article class="project-mini">
                  ${projectActions(item)}
                  <h3>${item.url ? `<a href="${item.url}" target="_blank" rel="noreferrer">${item.title}</a>` : item.title}</h3>
                  <p>${item.description}</p>
                  <p class="card-copy"><strong>Tech stack icons:</strong></p>
                  <div class="home-project-stack">${stackBlock(item.tech_stack)}</div>
                </article>
              `).join("")}
            </div>
          </section>
          <section class="section">
            <h2>${sections.contact.title}</h2>
            <p>Use the dedicated contact page for structured professional outreach, or connect through LinkedIn and scheduling links.</p>
            <p><a class="button-link" href="/contact">Open Contact Page</a></p>
          </section>
        </section>
      </div>
    `;
    initInlinePepper();
  }

  function renderContact() {
    app.innerHTML = `
      <section class="hero">
        <p class="eyebrow">Professional Contact</p>
        <h1>Contact Sri Surya S. Vaddhiparthy</h1>
        <p>Discuss data platforms, analytics systems, AI engineering work, architecture reviews, and professional opportunities.</p>
      </section>
      <section class="form-card contact-card">
        <div class="contact-layout">
          <div class="assistant-heading">
            <span class="brand-orb" id="assistant-orb" aria-hidden="true"></span>
            <div class="assistant-bubble" id="assistant-bubble" data-state="ready">
              <span class="assistant-name">Pepper</span>
              <div id="assistant-copy" class="assistant-copy">
                <p>Hi, I am Pepper. These are the ways to contact Surya:</p>
                <ol class="pepper-contact-list">
                  <li>
                    <button type="button" id="start-live-chat" class="contact-text-button">Direct chat with Surya</button>
                    <span>I can quickly check if he is available right now.</span>
                  </li>
                  <li>
                    <a href="mailto:surya@vaddhiparthy.com">Email surya@vaddhiparthy.com</a>
                  </li>
                  <li>
                    <a href="https://cal.com/vaddhiparthy/15min" target="_blank" rel="noreferrer">Schedule a 15-minute meeting through Cal.com</a>
                  </li>
                  <li>Fill out the form below.</li>
                </ol>
              </div>
            </div>
          </div>
          <form id="contact-form">
            <div class="split">
              <label>Name<input name="name" autocomplete="name" placeholder="Your name" required minlength="2"></label>
              <label>Email<input name="email" type="email" autocomplete="email" placeholder="you@company.com" required></label>
            </div>
            <div class="split">
              <label>Phone <span class="field-note">Optional</span><input name="phone" autocomplete="tel" inputmode="tel" placeholder="+1 555 123 4567" pattern="^[+()\\-\\.\\s0-9]{10,24}$"></label>
              <label>Request type <span class="field-note">Auto-generated</span><input name="request_type" id="request-type" value="Pending message analysis" readonly></label>
            </div>
            <label>Message<textarea name="message" rows="7" placeholder="Briefly describe the context, timeline, and what you would like to discuss." required minlength="20" maxlength="4000"></textarea></label>
            <div class="submit-row">
              <button type="submit" id="submit-button" class="pending-mode" disabled>Waiting for Pepper</button>
              <span id="form-status" role="status">Your message will be sent to Surya after submission.</span>
            </div>
          </form>
        </div>
        <section class="contact-live-overlay" id="contact-live-overlay" hidden aria-label="Direct chat with Surya">
          <div class="contact-live-panel">
            <header class="contact-live-header">
              <span class="brand-orb" aria-hidden="true"></span>
              <strong>Direct chat with Surya</strong>
              <button type="button" id="contact-live-close">Close</button>
            </header>
            <iframe id="contact-live-frame" title="Pepper direct contact chat"></iframe>
          </div>
        </section>
      </section>
    `;
    initContactForm();
  }

  async function renderPortfolio() {
    const projects = await readJson("/data/projects.json");
    const portfolioProjects = projects.filter((project) => project.featured).slice(0, 4);
    const technologies = uniqueTechnologies(portfolioProjects);
    app.innerHTML = `
      <section class="hero">
        <p class="eyebrow">Data Platform Portfolio</p>
        <h1>Production-minded data engineering and intelligent systems.</h1>
        <p>Selected work organized for technical review: business problem, architecture, data model, operational behavior, and engineering decisions.</p>
      </section>
      <section class="portfolio-panel">
        <div class="tech-filter-panel" aria-label="Filter by technology">
          <div>
            <p class="eyebrow">Filter By Technology</p>
            <p class="filter-help">Select a stack badge to show projects using that technology.</p>
          </div>
          <div class="tech-filter-list">
            ${technologies.map((tech) => `
            <button class="tech-filter" type="button" data-tech="${tech}">
              ${stackBadge(tech)}
            </button>
          `).join("")}
          </div>
        </div>
        <div class="case-list">
          ${portfolioProjects.map((project) => `
            <article class="portfolio-card ${project.featured ? "featured" : ""}" data-stack="${(project.stack || []).join("|")}">
              ${projectActions(project)}
              <div class="card-meta">
                ${project.portfolioGroup ? `<span class="pill tag-pill">${project.portfolioGroup}</span>` : ""}
                <span class="pill">${project.category}</span>
                ${project.status ? `<span class="pill">${project.status}</span>` : ""}
              </div>
              <h2>${project.url ? `<a href="${project.url}" target="_blank" rel="noreferrer">${project.title}</a>` : project.title}</h2>
              <p>${project.summary}</p>
              ${project.proof ? `<p class="card-copy"><strong>${project.proofLabel || "What it proves"}:</strong> ${project.proof}</p>` : ""}
              <div class="stack">${project.stack.map(stackBadge).join("")}</div>
            </article>
          `).join("")}
        </div>
      </section>
    `;
    const filters = Array.from(app.querySelectorAll(".tech-filter"));
    const cards = Array.from(app.querySelectorAll(".portfolio-card"));
    filters.forEach((filter) => {
      filter.addEventListener("click", () => {
        const tech = filter.dataset.tech;
        const alreadyActive = filter.classList.contains("active");
        filters.forEach((item) => item.classList.remove("active"));
        cards.forEach((card) => card.classList.remove("hidden"));
        if (!alreadyActive) {
          filter.classList.add("active");
          cards.forEach((card) => {
            const stack = (card.dataset.stack || "").split("|");
            card.classList.toggle("hidden", !stack.includes(tech));
          });
        }
      });
    });
  }

  async function renderCaseStudies() {
    const projects = (await readJson("/data/projects.json"))
      .filter((project) => project.portfolioGroup === "Research Builds")
      .sort((a, b) => {
        const order = [
          "Privacy-Aware Corpus Intelligence Pipeline",
          "Vector-Based Conflict Alert System Testbed",
        ];
        const aIndex = order.indexOf(a.title);
        const bIndex = order.indexOf(b.title);
        return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
      });
    const technologies = uniqueTechnologies(projects);
    app.innerHTML = `
      <section class="hero">
        <p class="eyebrow">Research Portfolio</p>
        <h1>Exploratory systems shaped by curiosity, real-world friction, and engineering imagination.</h1>
        <p>A focused collection of research builds inspired by problems I have noticed in daily life, technology, mobility, finance, aviation, and AI systems. Each one is an attempt to turn a practical question into a testable engineering surface.</p>
      </section>
      <section class="portfolio-panel">
        <div class="tech-filter-panel" aria-label="Filter research projects by technology">
          <div>
            <p class="eyebrow">Filter By Technology</p>
            <p class="filter-help">Select a stack badge to show research projects using that technology.</p>
          </div>
          <div class="tech-filter-list">
            ${technologies.map((tech) => `
            <button class="tech-filter" type="button" data-tech="${tech}">
              ${stackBadge(tech)}
            </button>
          `).join("")}
          </div>
        </div>
        <div class="case-list research-list">
          ${projects.map((project) => `
            <article class="portfolio-card research-card" data-stack="${(project.stack || []).join("|")}">
              ${projectActions(project)}
              <div class="card-meta">
                ${project.portfolioGroup ? `<span class="pill tag-pill">${project.portfolioGroup}</span>` : ""}
                <span class="pill">${project.category}</span>
                ${project.status ? `<span class="pill">${project.status}</span>` : ""}
              </div>
              <h2>${project.url ? `<a href="${project.url}" target="_blank" rel="noreferrer">${project.title}</a>` : project.title}</h2>
              <p>${project.summary}</p>
              ${project.thought ? `<div class="thought-cloud"><p>${project.thought}</p></div>` : ""}
              <p class="card-copy"><strong>Technical angle:</strong> ${project.proof || "Use this as a detailed architecture and delivery narrative once the full case page is expanded."}</p>
              <div class="stack">${project.stack.map(stackBadge).join("")}</div>
            </article>
          `).join("")}
        </div>
      </section>
    `;
    const filters = Array.from(app.querySelectorAll(".tech-filter"));
    const cards = Array.from(app.querySelectorAll(".portfolio-card"));
    filters.forEach((filter) => {
      filter.addEventListener("click", () => {
        const tech = filter.dataset.tech;
        const alreadyActive = filter.classList.contains("active");
        filters.forEach((item) => item.classList.remove("active"));
        cards.forEach((card) => card.classList.remove("hidden"));
        if (!alreadyActive) {
          filter.classList.add("active");
          cards.forEach((card) => {
            const stack = (card.dataset.stack || "").split("|");
            card.classList.toggle("hidden", !stack.includes(tech));
          });
        }
      });
    });
  }

  function renderPepperPage() {
    app.innerHTML = `
      <section class="hero pepper-hero">
        <p class="eyebrow">Live Portfolio Assistant</p>
        <h1>Portfolio Assistant Gateway & Context Orchestrator</h1>
        <p>This page isolates the same Career Desk assistant used across the portfolio. It demonstrates the live chat surface, profile-context routing, contact-intake workflow, and operator handoff pattern in a standalone project presentation.</p>
      </section>
      <section class="portfolio-panel pepper-demo-panel">
        <div class="pepper-demo-grid">
          <article class="portfolio-card pepper-demo-copy">
            <div class="card-meta">
              <span class="pill">FastAPI service</span>
              <span class="pill">Context routing</span>
              <span class="pill">Live demonstration</span>
            </div>
            <h2>What This Demonstrates</h2>
            <p>The assistant is not a mockup attached to the portfolio after the fact. It is the active interaction layer behind the website, handling profile questions, professional contact routing, and controlled handoff into a direct conversation flow.</p>
            <p class="card-copy"><strong>Implementation signal:</strong> session state, origin controls, provider-backed response generation, structured contact intake, transcript persistence, and operator takeover mechanics are packaged behind the same interface visitors use on the public site.</p>
            ${stackBlock("Python, FastAPI, Uvicorn, Pydantic, HTTP APIs, Context Orchestration, Session State Management, Operator Handoff, Docker")}
          </article>
          <article class="portfolio-card pepper-chat-card">
            <h2>Career Desk</h2>
            <div id="home-pepper"></div>
          </article>
        </div>
      </section>
    `;
    initInlinePepper();
  }

  function renderOverthinkerPage() {
    const tasks = [
      {
        title: "Build a portfolio-grade AI and data engineering project system",
        scope: "Yearly",
        description: "A long-range objective that starts broad and becomes executable as feedback is applied.",
        iterations: [
          {
            label: "Iteration 0",
            state: "Seed task",
            feedback: "No user feedback yet.",
            output: [
              "Identify projects that demonstrate credible engineering depth.",
              "Create public pages for each project.",
              "Document architecture and deployment approach.",
              "Add review checkpoints before expanding scope.",
            ],
          },
          {
            label: "Iteration 1",
            state: "First generated plan",
            feedback: "Prioritize finished artifacts over planning documents. Each project needs a live demo, technical proof, and a clean README.",
            output: [
              "Select fewer projects and finish them end-to-end.",
              "Publish a public demo route and repository README per project.",
              "Keep advanced modules marked as planned until implemented.",
              "Use evidence endpoints and artifacts to prove the implementation.",
            ],
          },
          {
            label: "Iteration 2",
            state: "Feedback incorporated",
            feedback: "The demo should show the overthinking loop, not just the final answer.",
            output: [
              "Show the seed task, generated plan, user feedback, and next improved plan.",
              "Keep the operational console separate from public review.",
              "Expose implementation artifacts for router, prompts, guardrails, and evaluations.",
              "Present refinement quality as the product, not just the generated markdown.",
            ],
          },
        ],
      },
      {
        title: "Release ASTRA-X as a clean public demonstration",
        scope: "Monthly",
        description: "A shorter delivery task showing how ASTRA-X turns feedback into a sharper release narrative.",
        iterations: [
          {
            label: "Iteration 0",
            state: "Seed task",
            feedback: "No user feedback yet.",
            output: [
              "Start the FastAPI service.",
              "Add a public landing page.",
              "Keep the old operator console available.",
              "Add documentation.",
            ],
          },
          {
            label: "Iteration 1",
            state: "First generated plan",
            feedback: "The demo should show task, generated plan, user feedback, then a better plan.",
            output: [
              "Replace static run cards with iteration playback.",
              "Add task selectors for yearly and monthly scopes.",
              "Add previous and next controls for plan revisions.",
              "Show feedback as a first-class part of the run history.",
            ],
          },
          {
            label: "Iteration 2",
            state: "Public review ready",
            feedback: "Explain the philosophy: outsource repeated overthinking to a system that remembers feedback.",
            output: [
              "Frame ASTRA-X as a memory-backed planning loop.",
              "Show how plans improve across iterations.",
              "Document what evidence can be produced live.",
              "Keep heavy cloud LLMOps components out of this local-first phase.",
            ],
          },
        ],
      },
    ];
    const components = [
      ["Model router", "Planner calls pass through a routing wrapper that captures provider, configured model, effective model, status, latency, prompt-token estimate, completion-token estimate, and prompt versions.", "data/private/operations/llm_call_log.jsonl", "overthinker/services/model_router.py"],
      ["Prompt registry", "Prompt templates are versioned by name, status, purpose, template body, and required-variable contract before runtime rendering.", "data/private/operations/prompt_registry.json", "overthinker/services/prompt_registry.py"],
      ["Guardrails", "Input checks detect credential-shaped strings and prompt-injection phrases. Output checks validate presence and required planning sections.", "data/private/operations/guardrail_events.jsonl", "overthinker/services/guardrails.py"],
      ["Evaluation harness", "Static JSONL test cases validate planning outputs, run guardrail checks, and persist pass/fail artifacts for review.", "data/private/operations/eval_results.jsonl", "overthinker/services/evals.py"],
    ];
    const evidenceRows = [
      ["GET /api/operations/evidence", "Artifact summary", "Returns prompt registry, model-router, guardrail, and evaluation summaries in one machine-readable response."],
      ["POST /api/evals/run", "Evaluation run", "Runs the local planning_basic suite and writes fresh result rows to eval_results.jsonl."],
      ["GET /api/demo/frozen-runs", "Demo playback data", "Returns the iteration-chain payload used by the public review interface."],
      ["GET /api/health", "Runtime readiness", "Exposes service health, storage mode, scheduler state, and provider configuration readiness."],
      ["Operator console", "Working UI", "The full container-style console remains at /ui/overthinker.html when the ASTRA service is deployed."],
    ];
    const codeArtifacts = [
      {
        title: "Model Router Capture",
        path: "overthinker/services/model_router.py",
        excerpt: `async def route_llm_call(messages, cfg=None, *, request_id=None, prompt_versions=None):
    started = time.perf_counter()
    prompt_tokens = _estimate_tokens(messages)
    try:
        result = await _call_provider(messages, cfg)
        return result
    finally:
        append_jsonl(LLM_CALL_LOG_FILE, {
            "request_id": request_id,
            "provider": result.provider if result else cfg.model.provider,
            "status": status,
            "latency_ms": elapsed_ms,
            "prompt_tokens_estimate": prompt_tokens,
            "prompt_versions": prompt_versions or {},
        })`,
      },
      {
        title: "Prompt Registry Contract",
        path: "overthinker/services/prompt_registry.py",
        excerpt: `def render_prompt(name: str, variables: dict | None = None) -> RenderedPrompt:
    prompt = get_prompt(name)
    missing = [key for key in prompt["required_variables"] if key not in variables]
    if missing:
        raise ValueError(f"Prompt '{name}' missing variables: {', '.join(missing)}")
    content = Template(prompt["template"]).safe_substitute(**variables).strip()
    return RenderedPrompt(name=name, version=prompt["version"], content=content)`,
      },
      {
        title: "Guardrail Event Logging",
        path: "overthinker/services/guardrails.py",
        excerpt: `def check_output(text: str, request_id: str | None = None) -> list[GuardrailCheck]:
    required = ["Path to completion", "Steps", "Risks", "Summary"]
    missing = [section for section in required if section.lower() not in text.lower()]
    checks = [
        GuardrailCheck(name="required_plan_sections", stage="output", passed=not missing),
        GuardrailCheck(name="empty_output", stage="output", passed=bool(text.strip())),
    ]
    for check in checks:
        _record(check, request_id)
    return checks`,
      },
      {
        title: "Evaluation Harness",
        path: "overthinker/services/evals.py",
        excerpt: `def run_static_eval_suite(suite_name: str = "planning_basic") -> dict:
    cases = load_suite(path)
    run_id = new_artifact_id("eval")
    for case in cases:
        output = case["candidate_output"]
        check_output(output, request_id=run_id)
        missing = [term for term in case["expected_terms"] if term.lower() not in output.lower()]
        append_jsonl(EVAL_RESULT_LOG_FILE, {"eval_run_id": run_id, "passed": not missing})
    return eval_summary()`,
      },
    ];
    const knowledgeSections = [
      ["Product Philosophy", "Agentic Planning and Execution Intelligence Platform is not a one-shot chatbot wrapper. It externalizes the repeated planning loop: define a goal, generate a plan, capture feedback, regenerate with retained context, and compare the improved version against the earlier one."],
      ["Implemented Architecture", "The current implementation is local-first and service-oriented. FastAPI exposes the public demo, operator console, health endpoint, evidence endpoint, evaluation endpoint, and persistent planning APIs. Storage is repository-backed with SQLite fallback and PostgreSQL support."],
      ["Evidence Strategy", "The project deliberately creates artifacts that can be inspected: prompt versions, model call logs, guardrail events, evaluation results, demo run payloads, and persisted planning runs. The public page summarizes those artifacts without exposing private runtime data."],
      ["Operational Boundary", "This phase avoids S3, Grafana, Terraform, and cloud warehouse infrastructure. The project value here is the AI operations core: routing, prompt governance, guardrails, evals, feedback memory, and reviewable iteration history."],
      ["What Can Run Live", "The evaluation endpoint can produce fresh pass/fail rows locally. The evidence endpoint can summarize current artifacts. Planner execution can produce router and guardrail records when a model provider is configured. The public portfolio page remains credential-free."],
      ["Review Narrative", "A reviewer should see the system as a planning control plane. The visible product is the iteration playback. The engineering proof is the supporting router, registry, guardrail, evaluation, and artifact trail behind that playback."],
    ];

    app.innerHTML = `
      <section class="hero overthinker-hero">
        <p class="eyebrow">ASTRA-X Project Demonstration</p>
        <h1>Overthinking outsourced into an execution loop.</h1>
        <p>Agentic Planning and Execution Intelligence Platform keeps goals, feedback, generated plans, and implementation evidence together. The system is built around a simple premise: a plan should improve as feedback accumulates, and that refinement should be traceable instead of buried inside a chat thread.</p>
      </section>
      <section class="portfolio-panel overthinker-panel overthinker-console">
        <div class="overthinker-tabs" role="tablist">
          <button type="button" class="overthinker-tab active" data-overthinker-tab="demo">Demonstration</button>
          <button type="button" class="overthinker-tab" data-overthinker-tab="knowledge">Knowledge Section</button>
        </div>
        <section class="overthinker-tab-panel active" id="overthinker-demo-panel">
          <div class="card-meta">
            <span class="pill">FastAPI</span>
            <span class="pill">Model router</span>
            <span class="pill">Prompt registry</span>
            <span class="pill">Guardrails</span>
            <span class="pill">Evaluation harness</span>
          </div>
          <div class="overthinker-demo-grid">
            <article class="portfolio-card">
              <h2>Iteration Playback</h2>
              <p class="card-copy">This is the public counterpart of the container interface. Select a task and step through how feedback changes the next plan.</p>
              <div class="overthinker-task-list">
                ${tasks.map((task, index) => `
                  <button type="button" class="overthinker-task ${index === 0 ? "active" : ""}" data-task-index="${index}">
                    <strong>${task.title}</strong>
                    <span>${task.scope} task / feedback-aware planning chain</span>
                  </button>
                `).join("")}
              </div>
            </article>
            <article class="portfolio-card overthinker-player">
              <div class="section-heading-row">
                <span class="rail-label" id="overthinker-scope">${tasks[0].scope} task</span>
                <strong id="overthinker-counter">Iteration 0 of 2</strong>
              </div>
              <h2 id="overthinker-title">${tasks[0].title}</h2>
              <p id="overthinker-description">${tasks[0].description}</p>
              <div class="overthinker-feedback">
                <span>User feedback at this point</span>
                <p id="overthinker-feedback">${tasks[0].iterations[0].feedback}</p>
              </div>
              <div class="overthinker-output" id="overthinker-output">
                ${tasks[0].iterations[0].output.map((item) => `<p>${item}</p>`).join("")}
              </div>
              <div class="overthinker-controls">
                <button type="button" id="overthinker-prev">Previous</button>
                <span id="overthinker-state">${tasks[0].iterations[0].state}</span>
                <button type="button" id="overthinker-next">Next</button>
              </div>
            </article>
          </div>
          <div class="overthinker-subsection">
            <div class="section-heading-row">
              <span class="rail-label">Runtime Evidence</span>
              <strong>Endpoints and artifacts this system exposes</strong>
            </div>
            <div class="overthinker-table-wrap">
              <table class="overthinker-table">
                <thead><tr><th>Surface</th><th>Evidence type</th><th>What it proves</th></tr></thead>
                <tbody>
                  ${evidenceRows.map(([surface, type, proof]) => `<tr><td><code>${surface}</code></td><td>${type}</td><td>${proof}</td></tr>`).join("")}
                </tbody>
              </table>
            </div>
          </div>
          <div class="overthinker-subsection">
            <div class="section-heading-row">
              <span class="rail-label">Code Artifacts</span>
              <strong>Implementation excerpts</strong>
            </div>
            <div class="overthinker-code-grid">
              ${codeArtifacts.map((artifact) => `
                <article class="portfolio-card overthinker-code-card">
                  <h2>${artifact.title}</h2>
                  <p class="card-copy"><strong>Path:</strong> <code>${artifact.path}</code></p>
                  <pre><code>${artifact.excerpt.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</code></pre>
                </article>
              `).join("")}
            </div>
          </div>
        </section>
        <section class="overthinker-tab-panel" id="overthinker-knowledge-panel">
          <div class="section-heading-row">
            <span class="rail-label">Knowledge Section</span>
            <strong>Architecture, artifacts, and operating model</strong>
          </div>
          <div class="overthinker-knowledge-grid">
            ${knowledgeSections.map(([title, copy]) => `
              <article class="portfolio-card">
                <h2>${title}</h2>
                <p>${copy}</p>
              </article>
            `).join("")}
          </div>
          <div class="overthinker-subsection">
            <div class="section-heading-row">
              <span class="rail-label">Implemented Components</span>
              <strong>Repository evidence map</strong>
            </div>
            <div class="case-list">
              ${components.map(([title, summary, artifact, path]) => `
                <article class="portfolio-card">
                  <h2>${title}</h2>
                  <p>${summary}</p>
                  <p class="card-copy"><strong>Runtime artifact:</strong> <code>${artifact}</code></p>
                  <p class="card-copy"><strong>Implementation file:</strong> <code>${path}</code></p>
                </article>
              `).join("")}
            </div>
          </div>
        </section>
      </section>
    `;

    let activeTask = 0;
    let activeIteration = 0;
    function renderIteration() {
      const task = tasks[activeTask];
      const iteration = task.iterations[activeIteration];
      document.getElementById("overthinker-scope").textContent = `${task.scope} task`;
      document.getElementById("overthinker-counter").textContent = `${iteration.label} of ${task.iterations.length - 1}`;
      document.getElementById("overthinker-title").textContent = task.title;
      document.getElementById("overthinker-description").textContent = task.description;
      document.getElementById("overthinker-feedback").textContent = iteration.feedback;
      document.getElementById("overthinker-state").textContent = iteration.state;
      document.getElementById("overthinker-output").innerHTML = iteration.output.map((item) => `<p>${item}</p>`).join("");
      document.getElementById("overthinker-prev").disabled = activeIteration === 0;
      document.getElementById("overthinker-next").disabled = activeIteration === task.iterations.length - 1;
    }
    document.querySelectorAll(".overthinker-task").forEach((button) => {
      button.addEventListener("click", () => {
        activeTask = Number(button.dataset.taskIndex);
        activeIteration = 0;
        document.querySelectorAll(".overthinker-task").forEach((node) => node.classList.remove("active"));
        button.classList.add("active");
        renderIteration();
      });
    });
    document.getElementById("overthinker-prev").addEventListener("click", () => {
      activeIteration = Math.max(0, activeIteration - 1);
      renderIteration();
    });
    document.getElementById("overthinker-next").addEventListener("click", () => {
      activeIteration = Math.min(tasks[activeTask].iterations.length - 1, activeIteration + 1);
      renderIteration();
    });
    document.querySelectorAll(".overthinker-tab").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".overthinker-tab").forEach((node) => node.classList.remove("active"));
        document.querySelectorAll(".overthinker-tab-panel").forEach((node) => node.classList.remove("active"));
        button.classList.add("active");
        document.getElementById(`overthinker-${button.dataset.overthinkerTab}-panel`).classList.add("active");
      });
    });
    renderIteration();
  }

  function renderVcasPage() {
    const demoSrc = "/vcas-demo/demo/radar_embed.html";
    const fullRadar = "/vcas-demo/demo/radar.html";
    const wikiArticle = "/writing/vector-based-conflict-alert-system-vcas-physics-architecture-notes";
    const evidenceRows = [
      ["Seeded showcase", "Scenario replay", "The default demo uses seed 1777414860 and persists a replayable AZO scenario at scenarios/canonical/azo_showcase_random.yml."],
      ["POST /vcas-demo/api/generate-scenario", "Scenario synthesis", "Creates random terminal-area traffic and returns the seed + scenario path so a reviewer can reproduce the same run."],
      ["GET /vcas-demo/api/run", "Engine execution", "Runs the conflict engine against timestamped frames and returns alerts plus a capped frame history for playback."],
      ["GET /vcas-demo/ws/surveillance", "Live monitor stream", "Streams the current engine snapshot for monitor-style UI checks after a scenario is loaded."],
      ["Radar replay UI", "Visual proof", "Shows aircraft motion, altitude labels, alert timing, and moving rings attached to the aircraft pair after the backend emits an alert."],
    ];
    const codeArtifacts = [
      {
        title: "Relative Kinematics",
        path: "src/vcas/physics/",
        excerpt: `delta_r = r_b - r_a
delta_v = v_b - v_a
t_min = -dot(delta_r, delta_v) / dot(delta_v, delta_v)
d_min = norm(delta_r + delta_v * t_min)`,
      },
      {
        title: "Engine Alert Loop",
        path: "src/vcas/core/engine.py",
        excerpt: `for pair in candidate_pairs:
    features = physics.evaluate_pair(pair)
    risk = scorer.score(features)
    if risk.bucket in {"medium", "high"}:
        audit_repo.append(alert_record)`,
      },
      {
        title: "Seeded Traffic Generator",
        path: "src/vcas/surveillance/simulator/random_traffic.py",
        excerpt: `rng = random.Random(seed)
scenario = generate_random_waypoint_scenario(
    seed=seed,
    bg_count=bg_count,
    duration_s=duration_s,
)`,
      },
      {
        title: "Radar Highlight Rendering",
        path: "web/radar.js",
        excerpt: `activePairs.forEach((entry) => {
  const pA = pointsByCallsign.get(entry.pair[0])
  const pB = pointsByCallsign.get(entry.pair[1])
  drawMovingAlertRings(pA, pB, entry.bucket)
})`,
      },
    ];
    const knowledgeSections = [
      ["Aviation Framing", "vCAS is a ground-side conflict alert research build for terminal airspace. It takes aircraft state vectors, projects them into a local airport-centered coordinate frame, and checks whether any aircraft pair is converging toward a protected separation volume."],
      ["Physics Basis", "The core calculation is relative motion: delta position, delta velocity, closing speed, time to closest point of approach, predicted minimum distance, and time to entering a protected radius and height band."],
      ["Why The Demo Is Seeded", "The public demo must be reviewable. A seed gives the same traffic every run, so the alert timing can be checked instead of hand-waved. The current showcase seed is 1777414860 around Kalamazoo Battle Creek (AZO)."],
      ["What Is Not Hidden", "The target pair is not pre-painted by the UI. The radar page draws alert rings only after the backend emits an alert for the pair in the returned history. Background traffic is present to prove the engine is screening a moving scene, not just animating two known dots."],
      ["Hybrid Extension", "The original concept includes flight-plan risk and ML risk. In this running build, deterministic physics is the safety floor; ML hooks exist, but the demo keeps the physics result auditable and reproducible."],
      ["Review Standard", "A reviewer should be able to generate traffic, run the engine, see no alerts early, see late alerts when geometry becomes unsafe, and re-run the same seed to get the same outcome."],
    ];
    app.innerHTML = `
      <section class="hero overthinker-hero">
        <p class="eyebrow">Research Build · Aviation Simulation</p>
        <h1>Vector-Based Conflict Alert System Testbed</h1>
        <p>vCAS is a physics-first conflict alert testbed. It turns aircraft positions and velocities into local 3D vectors, evaluates pairwise closure and closest approach, and emits alerts only when the predicted geometry becomes unsafe.</p>
      </section>

      <section class="portfolio-panel overthinker-panel vcas-panel">
        <div class="overthinker-tabs" role="tablist">
          <button type="button" class="overthinker-tab active" data-vcas-tab="demo">Demonstration</button>
          <button type="button" class="overthinker-tab" data-vcas-tab="knowledge">Knowledge Section</button>
        </div>

        <section class="overthinker-tab-panel active" id="vcas-demo-panel">
          <div class="card-meta">
            <span class="pill">Kalamazoo / AZO</span>
            <span class="pill">Seed 1777414860</span>
            <span class="pill">Deterministic physics</span>
            <span class="pill">Replayable radar</span>
          </div>
          <div class="vcas-intro-grid">
            <article class="portfolio-card">
              <h2>What This Project Is</h2>
              <p>vCAS is a research build for testing whether terminal-area aircraft conflicts can be detected cleanly from state vectors: position, altitude, velocity, and time.</p>
              <p>The demo is intentionally simulation-first. It creates traffic near the AZO airport reference point, runs the backend engine over every frame, and shows the moment the system promotes a pair into an alert state.</p>
              <p class="card-copy"><strong>Plain version:</strong> this is a radar-style proof surface for checking whether the conflict math triggers only when aircraft motion actually becomes unsafe.</p>
            </article>

            <article class="portfolio-card">
              <h2>How To Use The Demo</h2>
              <p>1. The default scenario is already set to the approved AZO showcase seed. Click <strong>Run scenario</strong> to replay it.</p>
              <p>2. Click <strong>Generate random traffic</strong> only when you want a fresh seeded scene. The returned seed and scenario path make the run reproducible.</p>
              <p>3. Watch the alert list and moving rings. They appear late for <strong>TST1</strong> and <strong>TST2</strong> only after the backend emits an alert.</p>
              <div class="vcas-actions">
                <a class="button-link" href="${fullRadar}" target="_blank" rel="noreferrer">Full Screen Radar</a>
                <a class="button-link" href="${wikiArticle}">Read Physics Notes</a>
              </div>
            </article>
          </div>

          <div class="overthinker-subsection">
            <div class="section-heading-row">
              <span class="rail-label">Live Demonstration</span>
              <strong>Embedded radar replay</strong>
            </div>
            <article class="portfolio-card vcas-embed-card">
              <iframe class="vcas-iframe" title="vCAS Radar Demo" src="${demoSrc}" loading="lazy" referrerpolicy="no-referrer"></iframe>
              <div class="vcas-embed-actions">
                <a class="button-link" href="${fullRadar}" target="_blank" rel="noreferrer">Open Full Screen</a>
              </div>
            </article>
          </div>

          <div class="overthinker-subsection">
            <div class="section-heading-row">
              <span class="rail-label">Runtime Evidence</span>
              <strong>What this page proves</strong>
            </div>
            <div class="overthinker-table-wrap">
              <table class="overthinker-table">
                <thead><tr><th>Surface</th><th>Evidence Type</th><th>What It Proves</th></tr></thead>
                <tbody>
                  ${evidenceRows.map(([surface, type, proof]) => `<tr><td><code>${surface}</code></td><td>${type}</td><td>${proof}</td></tr>`).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section class="overthinker-tab-panel" id="vcas-knowledge-panel">
          <div class="section-heading-row">
            <span class="rail-label">Knowledge Section</span>
            <strong>Architecture, physics, and review notes</strong>
          </div>
          <div class="overthinker-knowledge-grid">
            ${knowledgeSections.map(([title, copy]) => `
              <article class="portfolio-card">
                <h2>${title}</h2>
                <p>${copy}</p>
              </article>
            `).join("")}
          </div>

          <div class="overthinker-subsection">
            <div class="section-heading-row">
              <span class="rail-label">Physics Core</span>
              <strong>Relative motion equations</strong>
            </div>
            <article class="portfolio-card">
              <p>The engine evaluates aircraft pairs by converting geodetic positions into a local ENU frame, then computing relative position and velocity:</p>
              <pre><code>delta_r = r_b - r_a
delta_v = v_b - v_a
d(t) = norm(delta_r + delta_v * t)
t_min = -dot(delta_r, delta_v) / dot(delta_v, delta_v)
d_min = norm(delta_r + delta_v * t_min)</code></pre>
              <p>When the predicted closest approach and protected-zone timing cross configured thresholds, the pair moves from screening into alert tracking.</p>
              <p><a class="button-link" href="${wikiArticle}">Open Full Wiki Article</a></p>
            </article>
          </div>

          <div class="overthinker-subsection">
            <div class="section-heading-row">
              <span class="rail-label">Code Artifacts</span>
              <strong>Implementation excerpts</strong>
            </div>
            <div class="overthinker-code-grid">
              ${codeArtifacts.map((artifact) => `
                <article class="portfolio-card overthinker-code-card">
                  <h2>${artifact.title}</h2>
                  <p class="card-copy"><strong>Path:</strong> <code>${artifact.path}</code></p>
                  <pre><code>${artifact.excerpt.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</code></pre>
                </article>
              `).join("")}
            </div>
          </div>

          <div class="vcas-docs-grid">
            <article class="portfolio-card">
              <h2>Runtime Surface</h2>
              <div class="vcas-kpi">
                <div><span class="rail-label">Demo service</span><strong>/vcas-demo</strong></div>
                <div><span class="rail-label">Health</span><strong>/vcas-demo/health</strong></div>
              </div>
              ${stackBlock("Python, FastAPI, Simulation, WebSockets, Replay UI")}
            </article>

            <article class="portfolio-card">
              <h2>Interfaces</h2>
              <div class="vcas-table-wrap">
                <table class="overthinker-table vcas-table">
                  <thead><tr><th>Interface</th><th>Purpose</th></tr></thead>
                  <tbody>
                    <tr><td><code>POST /vcas-demo/api/generate-scenario</code></td><td>Generates a new seeded scenario YAML and returns the path + seed.</td></tr>
                    <tr><td><code>GET /vcas-demo/api/run</code></td><td>Runs the engine for a scenario and returns alerts + a capped history for replay.</td></tr>
                    <tr><td><code>GET /vcas-demo/ws/surveillance</code></td><td>Streams the latest engine snapshot once per second (monitor mode).</td></tr>
                    <tr><td><code>GET /vcas-demo/api/client-config</code></td><td>Returns aerodrome + display defaults and expected env token names.</td></tr>
                  </tbody>
                </table>
              </div>
            </article>

            <article class="portfolio-card">
              <h2>Code Artifacts</h2>
              <div class="vcas-table-wrap">
                <table class="overthinker-table vcas-table">
                  <thead><tr><th>Artifact</th><th>What It Owns</th><th>Path</th></tr></thead>
                  <tbody>
                    <tr><td>Engine loop</td><td>Frame ingestion, pair screening, alert emission, history snapshots.</td><td><code>src/vcas/core/engine.py</code></td></tr>
                    <tr><td>API surface</td><td>Run endpoints, websocket, client config, screenshot, scenario generation.</td><td><code>src/vcas/api/main.py</code></td></tr>
                    <tr><td>Random traffic generator</td><td>Seeded waypoint scenario synthesis (reproducible non-cheating runs).</td><td><code>src/vcas/surveillance/simulator/random_traffic.py</code></td></tr>
                    <tr><td>Waypoint simulator</td><td>Interpolates waypoint scenarios into time-indexed frames.</td><td><code>src/vcas/surveillance/simulator/bluesky_runner.py</code></td></tr>
                    <tr><td>Radar UI</td><td>Replay controls, scenario generation, alert list, canvas rendering.</td><td><code>web/radar.js</code></td></tr>
                  </tbody>
                </table>
              </div>
            </article>

            <article class="portfolio-card">
              <h2>What Counts As “Working”</h2>
              <p>1. Multiple aircraft are visible and moving with altitude labels.</p>
              <p>2. The alert list stays empty early in the run.</p>
              <p>3. Late in the run, alerts appear for <strong>TST1</strong> and <strong>TST2</strong>.</p>
              <p>4. Re-running with the same seed yields the same alert timing.</p>
            </article>
          </div>
        </section>
      </section>
    `;

    document.querySelectorAll("[data-vcas-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll("[data-vcas-tab]").forEach((node) => node.classList.remove("active"));
        document.querySelectorAll("#vcas-demo-panel, #vcas-knowledge-panel").forEach((node) => node.classList.remove("active"));
        button.classList.add("active");
        const tab = button.dataset.vcasTab;
        document.getElementById(`vcas-${tab}-panel`).classList.add("active");
      });
    });
  }

  async function renderWriting() {
    const posts = await readJson("/api/writing-index");
    const categoryFor = (title) => {
      const lower = title.toLowerCase();
      if (lower.includes("python")) return "Python";
      if (lower.includes("sql")) return "SQL";
      if (lower.includes("vector")) return "Vector Search";
      return "Technical Notes";
    };
    const postsWithSlugs = posts.map((post) => ({ ...post, slug: post.slug || slugify(post.title) }));
    const currentSlug = window.location.pathname.replace(/^\/writing\/?/, "").replace(/\/$/, "");
    const currentIndex = postsWithSlugs.findIndex((post) => post.slug === currentSlug);
    const recentPosts = postsWithSlugs.slice(0, 3);
    const articleLink = (post, className = "article-link-card") => `
      <a class="${className}" href="/writing/${post.slug}">
        <span>${post.published}</span>
        <strong>${post.title}</strong>
        <em>${categoryFor(post.title)}</em>
      </a>
    `;
    if (currentSlug && currentIndex === -1) {
      app.innerHTML = `
        <section class="hero">
          <p class="eyebrow">Technical Writing</p>
          <h1>Article not found.</h1>
          <p>The requested article is not available in the writing archive.</p>
          <p><a class="button-link" href="/writing">Back to Writing</a></p>
        </section>
      `;
      return;
    }

    if (currentIndex >= 0) {
      const post = await readJson(`/api/writing-article/${currentSlug}`);
      const newerPost = postsWithSlugs[currentIndex - 1];
      const olderPost = postsWithSlugs[currentIndex + 1];
      app.innerHTML = `
        <section class="hero writing-article-hero">
          <p class="eyebrow">Technical Writing</p>
          <h1>${post.title}</h1>
          <p>${post.published} · ${categoryFor(post.title)}</p>
          <p><a class="button-link" href="/writing">Writing index</a></p>
        </section>
        <section class="writing-panel writing-article-panel">
          <aside class="writing-rail" aria-label="Article navigation">
            <div class="writing-rail-card">
              <span class="rail-label">Current Article</span>
              <strong>${categoryFor(post.title)}</strong>
              <p>${post.published}</p>
            </div>
          </aside>
          <div class="article-list">
            <article class="article-card article-card-full">
              <div class="card-meta">
                <span class="pill">${post.published}</span>
                <span class="pill">${categoryFor(post.title)}</span>
                <a class="pill" href="${post.url}" target="_blank" rel="noreferrer">Original</a>
              </div>
              <div class="article-body">${post.content}</div>
            </article>
            <nav class="article-next-panel" aria-label="Article navigation">
              ${newerPost ? articleLink(newerPost, "article-link-card compact") : ""}
              ${olderPost ? articleLink(olderPost, "article-link-card compact primary-next") : ""}
            </nav>
          </div>
        </section>
      `;
      return;
    }

    app.innerHTML = `
      <section class="hero">
        <p class="eyebrow">Technical Writing</p>
        <h1>Writing on data engineering, AI systems, career strategy, and technical learning.</h1>
        <p>Newest article highlighted first, with the archive kept behind compact navigation instead of stacking every long-form article on one page.</p>
      </section>
      <section class="writing-panel">
        <aside class="writing-rail" aria-label="Writing archive">
          <div class="writing-rail-card">
            <span class="rail-label">Articles</span>
            <strong>${posts.length}</strong>
          </div>
          <details class="article-archive">
            <summary>Historical Timeline</summary>
            <nav class="article-timeline">
              ${postsWithSlugs.map((post) => articleLink(post, "")).join("")}
            </nav>
          </details>
        </aside>
        <div class="article-list">
          <article class="article-card featured-article-card">
            <div class="card-meta">
              <span class="pill">Most Recent</span>
              <span class="pill">${recentPosts[0].published}</span>
              <span class="pill">${categoryFor(recentPosts[0].title)}</span>
            </div>
            <h2>${recentPosts[0].title}</h2>
            <p class="article-preview-text">${recentPosts[0].excerpt || ""}</p>
            <a class="button-link" href="/writing/${recentPosts[0].slug}">Read full article</a>
          </article>
          <section class="recent-article-grid" aria-label="Recent articles">
            <div class="section-heading-row">
              <span class="rail-label">Recent Articles</span>
              <strong>Latest three</strong>
            </div>
            <div class="recent-article-cards">
              ${recentPosts.map((post) => articleLink(post)).join("")}
            </div>
          </section>
        </div>
      </section>
    `;
  }

  function firstName(form) {
    return form.elements.name.value.trim().split(/\s+/)[0] || "";
  }

  function initContactForm() {
    const form = document.getElementById("contact-form");
    const assistantCopy = document.getElementById("assistant-copy");
    const assistantOrb = document.getElementById("assistant-orb");
    const requestTypeEl = document.getElementById("request-type");
    const submitButton = document.getElementById("submit-button");
    const statusEl = document.getElementById("form-status");
    const liveButton = document.getElementById("start-live-chat");
    const liveOverlay = document.getElementById("contact-live-overlay");
    const liveClose = document.getElementById("contact-live-close");
    const liveFrame = document.getElementById("contact-live-frame");
    const minMessageWords = 6;
    let analyzeTimer = null;
    let approvedAnalysis = null;
    let lastAnalyzedMessage = "";
    let manualFallback = false;

    function named(text) {
      const visitor = firstName(form);
      if (!visitor || new RegExp(`^${visitor}\\b`, "i").test(text)) return text;
      return `${visitor}, ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
    }

    function setAssistant(text, state = "ready") {
      assistantCopy.textContent = text;
      assistantOrb.style.background = state === "thinking"
        ? "radial-gradient(circle at 30% 30%, #fff, #eab308)"
        : state === "error"
          ? "radial-gradient(circle at 30% 30%, #fff, #b91c1c)"
          : "radial-gradient(circle at 30% 30%, #fff, #2563eb)";
      submitButton.classList.toggle("deny-mode", state === "error");
    }

    function enableManualFallback() {
      manualFallback = true;
      form.dataset.manualFallback = "true";
      approvedAnalysis = {
        valid: true,
        classification: "General professional contact",
        summary: "manual contact submission",
        post_submit_message: "The form was submitted. Surya should receive it and follow up when available.",
      };
      requestTypeEl.value = "General professional contact";
      submitButton.disabled = false;
      submitButton.textContent = "Submit";
      submitButton.classList.remove("pending-mode", "deny-mode");
      submitButton.classList.add("ready-mode");
    }

    function openLiveChat() {
      liveOverlay.hidden = false;
      liveFrame.src = "/contact-live-chat";
    }

    function closeLiveChat() {
      liveOverlay.hidden = true;
      liveFrame.src = "about:blank";
    }

    function setThinking(text) {
      setAssistant(`${text} ...`, "thinking");
    }

    function hasEnoughMessage(text) {
      return (text.match(/[A-Za-z][A-Za-z'-]{1,}/g) || []).length >= minMessageWords;
    }

    function validateName() {
      const value = form.elements.name.value.trim();
      if (!value) return false;
      if (/\d/.test(value) || /[^a-zA-Z\s.'-]/.test(value) || value.length < 2) {
        setAssistant("That name does not look quite right. Please use your real name without numbers or unusual characters.", "error");
        return false;
      }
      setAssistant(`Thanks, ${firstName(form)}. The name looks good.`);
      return true;
    }

    function validateEmail() {
      if (!form.elements.email.value.trim() || !form.elements.email.checkValidity()) {
        setAssistant(named("That email address does not look valid yet. I cannot enable submission until it is corrected."), "error");
        return false;
      }
      setAssistant(named("The email address looks valid."));
      return true;
    }

    function validatePhone() {
      const value = form.elements.phone.value.trim();
      const digits = value.replace(/\D/g, "");
      if (!value) {
        setAssistant(named("Phone is optional. Please remember that adding one can make follow-up easier."));
        return true;
      }
      const allowed = /^[+()\-\.\s0-9]+$/.test(value) && !/[A-Za-z]/.test(value);
      const usTen = digits.length === 10 && !value.startsWith("+");
      const usOne = digits.length === 11 && digits.startsWith("1") && (value.startsWith("+1") || value.startsWith("1"));
      const international = value.startsWith("+") && digits.length >= 11 && digits.length <= 15;
      if (!allowed || digits.length < 10 || !(usTen || usOne || international)) {
        setAssistant(named("That phone number does not look valid. You can correct it or leave phone blank."), "error");
        return false;
      }
      setAssistant(named("The phone number looks usable. Please add the reason for contacting Surya today."));
      return true;
    }

    function disableSubmission() {
      approvedAnalysis = null;
      submitButton.disabled = true;
      submitButton.textContent = "Waiting for Pepper";
      submitButton.classList.remove("ready-mode");
      submitButton.classList.add("pending-mode");
      requestTypeEl.value = "Pending message analysis";
      if (manualFallback) enableManualFallback();
    }

    form.elements.name.addEventListener("blur", validateName);
    form.elements.email.addEventListener("blur", validateEmail);
    form.elements.phone.addEventListener("blur", validatePhone);
    form.elements.phone.addEventListener("input", () => {
      form.elements.phone.value = form.elements.phone.value.replace(/[^\d+()\-\.\s]/g, "");
    });
    form.elements.message.addEventListener("focus", () => {
      if (!form.elements.message.value.trim()) {
        setAssistant(named("Add a short reason for contacting Surya. I will review it when you pause."));
      }
    });
    form.elements.message.addEventListener("input", () => {
      disableSubmission();
      window.clearTimeout(analyzeTimer);
      const text = form.elements.message.value.trim();
      if (!text) {
        setAssistant(named("Add a short reason for contacting Surya. I will review it when you pause."));
        return;
      }
      setThinking(named("Reviewing as you type"));
      analyzeTimer = window.setTimeout(analyzeMessage, hasEnoughMessage(text) ? 3000 : 1700);
    });

    liveButton.addEventListener("click", openLiveChat);
    liveClose.addEventListener("click", closeLiveChat);
    liveOverlay.addEventListener("click", (event) => {
      if (event.target === liveOverlay) closeLiveChat();
    });
    liveFrame.addEventListener("load", () => {
      try {
        const chatApi = liveFrame.contentWindow && liveFrame.contentWindow.PepperChat;
        if (chatApi && typeof chatApi.startDirectContact === "function") {
          chatApi.startDirectContact().catch((error) => console.warn("Could not start direct contact chat", error));
        }
      } catch (error) {
        console.warn("Could not trigger direct contact chat", error);
      }
    });

    async function analyzeMessage() {
      const text = form.elements.message.value.trim();
      if (!validateName() || !validateEmail() || !validatePhone()) return;
      if (!hasEnoughMessage(text)) {
        setAssistant(named("Please add a short reason for contacting Surya. Six or seven clear words is enough."), "error");
        return;
      }
      if (text === lastAnalyzedMessage && approvedAnalysis) return;
      lastAnalyzedMessage = text;
      setThinking(named("Checking whether this is ready"));
      let data;
      try {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 4500);
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            name: form.elements.name.value,
            email: form.elements.email.value,
            phone: form.elements.phone.value,
            message: text,
          }),
        });
        window.clearTimeout(timeout);
        if (!response.ok) throw new Error("analysis_unavailable");
        data = await response.json();
      } catch (error) {
        enableManualFallback();
        return;
      }
      requestTypeEl.value = data.classification || "General professional contact";
      if (!data.valid) {
        setAssistant(data.assistant_message || named("Please add more detail before submitting."), "error");
        playPepperChime();
        submitButton.disabled = true;
        return;
      }
      approvedAnalysis = data;
      setAssistant(`${data.assistant_message} I summarized it as: ${data.summary}.`);
      playPepperChime();
      submitButton.disabled = false;
      submitButton.textContent = "Ready to submit";
      submitButton.classList.remove("pending-mode");
      submitButton.classList.add("ready-mode");
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        statusEl.textContent = "Please complete the required fields with a valid email and message. Phone is optional.";
        return;
      }
      if (!approvedAnalysis) {
        await analyzeMessage();
        if (!approvedAnalysis) return;
      }
      statusEl.textContent = "Submitting...";
      const formData = new FormData(form);
      if (manualFallback) formData.append("manual_fallback", "true");
      const response = await fetch("/api/contact", { method: "POST", body: formData });
      if (!response.ok) {
        statusEl.textContent = "Submission failed. Please review the fields and try again.";
        return;
      }
      const data = await response.json();
      const finalMessage = manualFallback
        ? "The form was submitted. Surya should receive it and follow up when available."
        : approvedAnalysis.post_submit_message;
      form.reset();
      disableSubmission();
      statusEl.textContent = `Submission received. Reference ${data.reference_code}.`;
      setAssistant(finalMessage);
      playPepperChime();
    });
  }

  function initPepperWidget() {
    const root = document.getElementById("pepper-widget-root");
    if (!root || page === "home") return;
    root.innerHTML = `
      <button class="chat-launcher" id="chat-launcher" type="button">
        <span class="chat-launcher-orb" aria-hidden="true"></span>
        <span>Pepper</span>
      </button>
      <section class="chat-panel" id="chat-panel" aria-label="Pepper assistant">
        <header class="chat-header">
          <span class="chat-orb" id="chat-orb" aria-hidden="true"></span>
          <span class="chat-header-title"><strong>Pepper</strong><span id="chat-status">Profile assistant</span></span>
          <button class="chat-close" id="chat-close" type="button">Close</button>
        </header>
        <div class="chat-messages" id="chat-messages"></div>
        <form class="chat-form" id="chat-form">
          <textarea id="chat-input" rows="1" placeholder="Ask Pepper"></textarea>
          <button type="submit">Send</button>
        </form>
      </section>
    `;
    const launcher = document.getElementById("chat-launcher");
    const panel = document.getElementById("chat-panel");
    const close = document.getElementById("chat-close");
    const messages = document.getElementById("chat-messages");
    const form = document.getElementById("chat-form");
    const input = document.getElementById("chat-input");
    const status = document.getElementById("chat-status");
    const history = [];
    let sessionId = window.sessionStorage.getItem("floating-pepper-session-v1") || "";

    function syncViewportMetrics() {
      const viewport = window.visualViewport;
      const viewportHeight = viewport ? viewport.height : window.innerHeight;
      const viewportWidth = viewport ? viewport.width : window.innerWidth;
      const viewportOffsetTop = viewport ? viewport.offsetTop : 0;
      const viewportOffsetLeft = viewport ? viewport.offsetLeft : 0;

      document.documentElement.style.setProperty("--viewport-height", viewportHeight + "px");
      document.documentElement.style.setProperty("--viewport-width", viewportWidth + "px");
      document.documentElement.style.setProperty("--viewport-offset-top", viewportOffsetTop + "px");
      document.documentElement.style.setProperty("--viewport-offset-left", viewportOffsetLeft + "px");
    }

    function setPanelOpen(open) {
      syncViewportMetrics();
      panel.classList.toggle("open", open);
      document.body.classList.toggle("pepper-floating-open", open);
      if (open) {
        messages.scrollTop = messages.scrollHeight;
        window.setTimeout(() => input.focus(), 0);
      }
    }

    function addMessage(role, text) {
      const row = el("div", `message-row ${role}`);
      const bubble = el("div", `message-bubble ${role}`, text);
      row.appendChild(bubble);
      messages.appendChild(row);
      messages.scrollTop = messages.scrollHeight;
      history.push({ role, content: text });
    }

    launcher.addEventListener("click", () => {
      setPanelOpen(true);
      if (!messages.children.length) {
        addMessage("assistant", "Hi, I am Pepper. Ask me about Surya's work, projects, or background.");
      }
      input.focus();
    });
    close.addEventListener("click", () => setPanelOpen(false));
    window.addEventListener("resize", syncViewportMetrics);
    window.addEventListener("orientationchange", syncViewportMetrics);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", syncViewportMetrics);
      window.visualViewport.addEventListener("scroll", syncViewportMetrics);
    }
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setPanelOpen(false);
    });
    syncViewportMetrics();
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      addMessage("user", text);
      input.value = "";
      status.textContent = "Processing";
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, page, session_id: sessionId, history: history.slice(-8) }),
      });
      const data = await response.json();
      if (data.session_id) {
        sessionId = data.session_id;
        window.sessionStorage.setItem("floating-pepper-session-v1", sessionId);
      }
      addMessage("assistant", data.reply || "I had trouble forming a reply.");
      playPepperChime();
      status.textContent = "Ready";
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
      }
    });
  }

  function initInlinePepper() {
    const root = document.getElementById("home-pepper");
    if (!root) return;
    root.innerHTML = `
      <section class="inline-chat">
        <header class="inline-chat-header">
          <span class="chat-orb" aria-hidden="true"></span>
          <span><strong>Pepper</strong><small>Profile assistant</small></span>
        </header>
        <div class="inline-chat-messages" id="home-chat-messages"></div>
        <form class="inline-chat-form" id="home-chat-form">
          <textarea id="home-chat-input" rows="1" placeholder="Ask here"></textarea>
          <button type="submit">Send</button>
        </form>
      </section>
    `;
    const messages = document.getElementById("home-chat-messages");
    const form = document.getElementById("home-chat-form");
    const input = document.getElementById("home-chat-input");
    const history = [];

    function addMessage(role, text) {
      const row = el("div", `message-row ${role}`);
      const bubble = el("div", `message-bubble ${role}`, text);
      row.appendChild(bubble);
      messages.appendChild(row);
      messages.scrollTop = messages.scrollHeight;
      history.push({ role, content: text });
    }

    addMessage("assistant", "Hi, I am Pepper. Ask me about Surya's work, projects, or background.");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      addMessage("user", text);
      input.value = "";
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, page: "home", history: history.slice(-8) }),
      });
      const data = await response.json();
      addMessage("assistant", data.reply || "I had trouble forming a reply.");
      playPepperChime();
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
      }
    });
  }

  async function boot() {
    const content = await readJson("/data/site-content.json");
    if (page === "home") renderHome(content);
    if (page === "contact") renderContact();
    if (page === "portfolio") await renderPortfolio();
    if (page === "case-studies") await renderCaseStudies();
    if (page === "pepper") renderPepperPage();
    if (page === "overthinker") renderOverthinkerPage();
    if (page === "vcas") renderVcasPage();
    if (page === "writing") await renderWriting();
    initPepperWidget();
  }

  boot().catch((error) => {
    console.error(error);
    app.innerHTML = "<p>Preview failed to load.</p>";
  });
})();
