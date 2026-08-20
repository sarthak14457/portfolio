const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobile-nav");
hamburger.addEventListener("click", () => mobileNav.classList.toggle("open"));
mobileNav
  .querySelectorAll("a")
  .forEach((a) =>
    a.addEventListener("click", () => mobileNav.classList.remove("open")),
  );

const navLinks = document.querySelectorAll("nav.desktop-nav a");
const sections = [...document.querySelectorAll("main section[id]")];
const navObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        navLinks.forEach((l) =>
          l.classList.toggle(
            "active",
            l.getAttribute("href") === "#" + e.target.id,
          ),
        );
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px" },
);
sections.forEach((s) => navObs.observe(s));

const queryEl = document.getElementById("query-line");
const queryHTML =
  '<span class="kw">SELECT</span> model <span class="kw">FROM</span> projects <span class="kw">WHERE</span> r2_score > <span class="str">0.9</span>;';
let qi = 0;
const plain = queryHTML.replace(/<[^>]+>/g, "");
function typeQuery() {
  if (qi > plain.length) {
    queryEl.innerHTML = queryHTML + '<span class="cursor"></span>';
    return;
  }

  queryEl.textContent = plain.slice(0, qi);
  qi += 2;
  setTimeout(typeQuery, 28);
}
setTimeout(typeQuery, 400);

const kpiObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.getAttribute("data-count"), 10);
        let cur = 0;
        const step = () => {
          cur += 1;
          el.textContent = cur;
          if (cur < target) requestAnimationFrame(step);
          else el.textContent = target;
        };
        step();
        kpiObs.unobserve(el);
      }
    });
  },
  { threshold: 0.6 },
);
document
  .querySelectorAll(".kpi .num[data-count]")
  .forEach((el) => kpiObs.observe(el));

const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        revealObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

const langObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target
          .querySelectorAll("[data-w]")
          .forEach((b) => (b.style.width = b.getAttribute("data-w") + "%"));
        langObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.4 },
);
const langPanel = document.querySelector(".lang-panel");
if (langPanel) langObs.observe(langPanel);

const chips = document.querySelectorAll(".filter-chip");
const cards = document.querySelectorAll(".proj-card");
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    const f = chip.getAttribute("data-filter");
    cards.forEach((card) => {
      const tags = card.getAttribute("data-tags");
      card.classList.toggle("hide", f !== "all" && !tags.includes(f));
    });
  });
});

const emailBtn = document.getElementById("email-btn");
if (emailBtn) {
  const address = "poudelsarthak44@gmail.com";
  const originalLabel = emailBtn.textContent;
  emailBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(address);
    } catch (err) {
      const ta = document.createElement("textarea");
      ta.value = address;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    emailBtn.textContent = "copied " + address + " ✓";
    emailBtn.style.background = "var(--teal)";

    window.location.href = "mailto:" + address;
    setTimeout(() => {
      emailBtn.textContent = originalLabel;
      emailBtn.style.background = "";
    }, 2200);
  });
}

document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const text = btn.getAttribute("data-copy");
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    const original = btn.textContent;
    btn.textContent = "copied ✓";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove("copied");
    }, 1500);
  });
});

window.addEventListener("load", () => {
  const ctx = document.getElementById("breadthChart");
  if (!ctx || !window.Chart) return;
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Data Analysis",
        "Machine Learning",
        "Excel",
        "Python Libs",
        "Databases",
        "Data Viz",
      ],
      datasets: [
        {
          data: [6, 5, 7, 5, 5, 4],
          backgroundColor: [
            "#0F9D8B",
            "#FF6B57",
            "#4F46E5",
            "#F5A623",
            "#0F9D8B",
            "#4F46E5",
          ],
          borderRadius: 6,
          maxBarThickness: 34,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (c) => c.parsed.y + " skills listed" } },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 2, font: { family: "IBM Plex Mono", size: 11 } },
          grid: { color: "#EDEFF3" },
        },
        x: {
          ticks: { font: { family: "Inter", size: 11 } },
          grid: { display: false },
        },
      },
    },
  });
});
