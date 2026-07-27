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
      const cursor = document.createElement("span");
      cursor.className = "term-cursor";
      body.appendChild(cursor);
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

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "encrypting payload ...";
    status.style.color = "var(--blue-bright)";

    setTimeout(() => {
      status.textContent = "[+] message transmitted. expect a response within 48h.";
      status.style.color = "#4ade80";
      form.reset();
    }, 1100);
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
});
