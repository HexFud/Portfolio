const bootLines = [
  "initializing secure shell ...",
  "loading kernel modules [ok]",
  "mounting /dev/portfolio ...",
  "checking integrity ... 47/47 signatures valid",
  "decrypting profile.bin with local key ...",
  "access granted.",
  "",
  "welcome back, operator."
];

function runBootSequence() {
  const bootScreen = document.getElementById("bootScreen");
  const bootText = document.getElementById("bootText");
  let lineIndex = 0;
  let charIndex = 0;
  let output = "";

  function typeNext() {
    if (lineIndex >= bootLines.length) {
      setTimeout(() => bootScreen.classList.add("hidden"), 400);
      return;
    }
    const line = bootLines[lineIndex];
    if (charIndex < line.length) {
      output += line[charIndex];
      charIndex++;
      bootText.textContent = output;
      setTimeout(typeNext, 12);
    } else {
      output += "\n";
      lineIndex++;
      charIndex = 0;
      bootText.textContent = output;
      setTimeout(typeNext, 90);
    }
  }

  typeNext();
}

const heroScript = [
  { type: "cmd", text: "$ nmap -sV -p- chal.pascalctf.it" },
  { type: "dim", text: "3 open ports found ... 8080/tcp web" },
  { type: "ok", text: "[+] /api/verify leaks intermediate primes" },
  { type: "cmd", text: "$ python3 lattice_attack.py --n=$N --e=$E" },
  { type: "dim", text: "reducing basis ... LLL converging" },
  { type: "ok", text: "[+] related primes recovered" },
  { type: "cmd", text: "$ python3 decrypt.py --p=$P --q=$Q" },
  { type: "ok", text: "[+] plaintext recovered" },
  { type: "dim", text: "submitting to pascalctf.it/submit ..." },
  { type: "warn", text: "flag{l4tt1c3_r3duct10n_ftw}" }
];

function typeHeroTerminal() {
  const body = document.getElementById("terminalBody");
  let lineIndex = 0;

  function renderLine() {
    if (lineIndex >= heroScript.length) {
      initInteractiveTerminal(body);
      return;
    }
    const entry = heroScript[lineIndex];
    const row = document.createElement("div");
    row.className = "term-line-" + entry.type;
    body.appendChild(row);

    let charIndex = 0;
    function typeChar() {
      if (charIndex < entry.text.length) {
        row.textContent += entry.text[charIndex];
        charIndex++;
        setTimeout(typeChar, entry.type === "cmd" ? 22 : 10);
      } else {
        lineIndex++;
        setTimeout(renderLine, 220);
      }
    }
    typeChar();
  }

  renderLine();
}

const terminalCommands = {
  help() {
    return [
      "available commands:",
      "  help              show this list",
      "  whoami            who you're talking to",
      "  ls                list site sections",
      "  cd <section>      jump to a section",
      "  ctf               latest competition stats",
      "  contact           open the contact channel",
      "  clear             clear the screen",
      "  ...there may be a few more if you go looking."
    ];
  },
  whoami() {
    return ["HexFud — CTF player training for TeamItaly. Not a real shell, don't get too excited."];
  },
  ls() {
    return ["about/  skills/  writeups/  ctf/  contact/"];
  },
  cd(args) {
    const target = (args[0] || "").replace(/^\.?\/*/, "").replace(/\/$/, "");
    const known = ["about", "skills", "writeups", "ctf", "contact"];
    if (!target) return ["usage: cd <section>"];
    if (!known.includes(target)) return ["no such section: " + target, "try: " + known.join(", ")];
    const el = document.getElementById(target);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 200);
    return ["jumping to /" + target + " ..."];
  },
  ctf() {
    return [
      "top result: CTF@CIT 2026 — 10,534.00 pts (weight 5.514)",
      "runner-up: PascalCTF 2026 — 1,950.00 pts (weight 6.384)",
      "full log at #ctf"
    ];
  },
  contact() {
    const el = document.getElementById("contact");
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 200);
    return ["opening secure channel ..."];
  },
  date() {
    return [new Date().toString()];
  },
  coffee() {
    return [
      "      ( (",
      "       ) )",
      "    ........",
      "    |      |]",
      "    \\      /",
      "     `----'",
      "brewing... this terminal runs on caffeine, not electricity."
    ];
  },
  sudo() {
    return ["permission denied: nice try, this shell doesn't have root either."];
  },
  su() {
    return terminalCommands.sudo();
  },
  "rm"(args) {
    if (args.join(" ").includes("-rf")) {
      return ["command blocked: this filesystem is read-only. good instincts though."];
    }
    return ["rm: missing operand"];
  },
  flag() {
    return ["flag{ur_1n_th3_wr0ng_pl4c3_th1s_1snt_a_ctf}"];
  },
  cat(args) {
    if ((args[0] || "").includes("flag")) return terminalCommands.flag();
    return ["cat: " + (args[0] || "file") + ": no such file"];
  },
  matrix() {
    triggerMatrixEffect();
    return ["wake up..."];
  },
  teamitaly() {
    return ["see you at the finals."];
  },
  hexfud() {
    return ["that's me."];
  }
};

function initInteractiveTerminal(body) {
  const window_ = body.closest(".terminal-window");
  if (window_) window_.classList.add("is-live");

  function printPrompt() {
    const row = document.createElement("div");
    row.className = "term-input-row";
    row.innerHTML = '<span class="term-prompt">guest@sec-portfolio:~$</span>';
    const input = document.createElement("input");
    input.type = "text";
    input.className = "terminal-input";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.setAttribute("aria-label", "terminal command input");
    row.appendChild(input);
    body.appendChild(row);
    input.focus();
    body.scrollTop = body.scrollHeight;

    const history = initInteractiveTerminal.history;
    let historyPos = history.length;

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const value = input.value.trim();
        input.disabled = true;
        submitCommand(row, input, value);
        if (value) history.push(value);
        historyPos = history.length;
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (historyPos > 0) {
          historyPos--;
          input.value = history[historyPos];
        }
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        if (historyPos < history.length - 1) {
          historyPos++;
          input.value = history[historyPos];
        } else {
          historyPos = history.length;
          input.value = "";
        }
      }
    });
  }

  function submitCommand(row, input, value) {
    const echo = document.createElement("div");
    echo.className = "term-line-cmd";
    echo.textContent = "guest@sec-portfolio:~$ " + value;
    row.replaceWith(echo);

    if (!value) {
      printPrompt();
      return;
    }

    if (value === "clear") {
      body.innerHTML = "";
      printPrompt();
      return;
    }

    const parts = value.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    const handler = terminalCommands[cmd];
    const output = handler ? handler(args) : ["command not found: " + cmd + " — try 'help'"];

    output.forEach((line) => {
      const out = document.createElement("div");
      out.className = "term-output";
      out.textContent = line;
      body.appendChild(out);
    });

    body.scrollTop = body.scrollHeight;
    printPrompt();
  }

  initInteractiveTerminal.history = initInteractiveTerminal.history || [];
  printPrompt();

  if (window_) {
    window_.addEventListener("click", () => {
      const activeInput = body.querySelector(".terminal-input:not([disabled])");
      if (activeInput) activeInput.focus();
    });
  }
}

function triggerMatrixEffect() {
  const canvas = document.getElementById("matrixCanvas");
  if (!canvas || canvas.dataset.running === "true") return;
  canvas.dataset.running = "true";

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.classList.add("active");

  const chars = "01アイウエオカキクケコサシスセソタチツテト";
  const fontSize = 16;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = new Array(columns).fill(1);
  const colors = ["#3b82f6", "#6fb1ff", "#ff3b52", "#ff6b7d"];

  let frame = 0;
  const maxFrames = 260;

  function draw() {
    ctx.fillStyle = "rgba(4,6,12,0.14)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    frame++;
    if (frame < maxFrames) {
      requestAnimationFrame(draw);
    } else {
      canvas.classList.remove("active");
      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.dataset.running = "false";
      }, 500);
    }
  }

  draw();
}

const konamiSequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let konamiProgress = 0;

function watchForKonamiCode() {
  document.addEventListener("keydown", (event) => {
    const expected = konamiSequence[konamiProgress];
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (key === expected) {
      konamiProgress++;
      if (konamiProgress === konamiSequence.length) {
        konamiProgress = 0;
        triggerMatrixEffect();
      }
    } else {
      konamiProgress = key === konamiSequence[0] ? 1 : 0;
    }
  });
}

function animateCounters() {
  const counters = document.querySelectorAll(".stat-num");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const tick = () => {
        current += step;
        if (current >= target) {
          el.textContent = String(target).padStart(2, "0");
        } else {
          el.textContent = String(current).padStart(2, "0");
          requestAnimationFrame(tick);
        }
      };
      tick();
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach((counter) => observer.observe(counter));
}

function handleContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submitBtn = form.querySelector("button[type=submit]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (form.action.includes("YOUR_FORM_ID")) {
      status.textContent = "[!] form endpoint not configured yet — set your Formspree ID in index.html";
      status.style.color = "var(--red-bright)";
      return;
    }

    submitBtn.disabled = true;
    status.textContent = "encrypting payload ...";
    status.style.color = "var(--blue-bright)";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        status.textContent = "[+] message transmitted. expect a response within 48h.";
        status.style.color = "#4ade80";
        form.reset();
      } else {
        const data = await response.json().catch(() => null);
        const detail = data && data.errors ? data.errors.map((e) => e.message).join(", ") : "unknown error";
        status.textContent = "[!] transmission failed: " + detail;
        status.style.color = "var(--red-bright)";
      }
    } catch (err) {
      status.textContent = "[!] connection refused — check your network and try again";
      status.style.color = "var(--red-bright)";
    } finally {
      submitBtn.disabled = false;
    }
  });
}

function highlightActiveSection() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      links.forEach((link) => {
        link.style.color = link.getAttribute("href") === "#" + id ? "var(--blue-bright)" : "";
      });
    });
  }, { threshold: 0.5 });

  sections.forEach((section) => observer.observe(section));
}

document.addEventListener("DOMContentLoaded", () => {
  runBootSequence();
  typeHeroTerminal();
  animateCounters();
  handleContactForm();
  highlightActiveSection();
  watchForKonamiCode();
});
