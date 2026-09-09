// ============ TYPING ANIMATION ============
const roles = ["Social Media Specialist", "Content Creator", "Growth Marketer"];
const typedEl = document.getElementById("typedText");
let roleIndex = 0, charIndex = 0, deleting = false;
 
function typeLoop(){
  const current = roles[roleIndex];
 
  if(!deleting){
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if(charIndex === current.length){
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if(charIndex === 0){
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
 
  setTimeout(typeLoop, deleting ? 45 : 85);
}
typeLoop();
 
// ============ MOBILE MENU ============
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
 
burger.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  burger.setAttribute("aria-expanded", isOpen);
});
 
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  });
});
 
// ============ ACTIVE NAV LINK ON SCROLL ============
const sectionIds = ["home", "about", "education", "works", "skills", "contact"];
const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
const navItems = document.querySelectorAll(".nav-link");
 
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
      if(active){
        navItems.forEach(item => item.classList.remove("active"));
        active.classList.add("active");
      }
    }
  });
}, { rootMargin: "-45% 0px -45% 0px" });
 
sections.forEach(sec => navObserver.observe(sec));
 
// ============ REVEAL ON SCROLL ============
const revealEls = document.querySelectorAll("[data-reveal]");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0, rootMargin: "0px 0px -48px 0px" });
 
revealEls.forEach(el => revealObserver.observe(el));
 
// ============ CURSOR GLOW ============
const cursorGlow = document.getElementById("cursorGlow");
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 
if(cursorGlow && !reduceMotion && (canHover || isTouch)){
  if(isTouch) cursorGlow.classList.add("is-touch");
 
  let targetX = window.innerWidth / 2, targetY = window.innerHeight / 2;
  let curX = targetX, curY = targetY;
  let active = false;
  let hideTimeout;
 
  function showGlow(x, y){
    targetX = x;
    targetY = y;
    if(!active){
      active = true;
      cursorGlow.classList.add("is-active");
    }
  }
 
  if(canHover){
    window.addEventListener("mousemove", (e) => showGlow(e.clientX, e.clientY));
    document.addEventListener("mouseleave", () => {
      active = false;
      cursorGlow.classList.remove("is-active");
    });
  }
 
  if(isTouch){
    window.addEventListener("touchstart", (e) => {
      const t = e.touches[0];
      curX = t.clientX;
      curY = t.clientY;
      clearTimeout(hideTimeout);
      showGlow(t.clientX, t.clientY);
    }, { passive: true });
 
    window.addEventListener("touchmove", (e) => {
      const t = e.touches[0];
      clearTimeout(hideTimeout);
      showGlow(t.clientX, t.clientY);
    }, { passive: true });
 
    window.addEventListener("touchend", () => {
      hideTimeout = setTimeout(() => {
        active = false;
        cursorGlow.classList.remove("is-active");
      }, 300);
    });
  }
 
  let previousGlowTime;
  function animateGlow(timestamp){
    // Preserve the original 60 Hz feel on high-refresh-rate displays.
    const elapsed = previousGlowTime === undefined ? 1000 / 60 : Math.min(timestamp - previousGlowTime, 100);
    previousGlowTime = timestamp;
    const smoothing = 1 - Math.pow(1 - 0.12, elapsed / (1000 / 60));
    curX += (targetX - curX) * smoothing;
    curY += (targetY - curY) * smoothing;
    cursorGlow.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
    requestAnimationFrame(animateGlow);
  }
  requestAnimationFrame(animateGlow);
} else if(cursorGlow){
  cursorGlow.remove();
}
 
// ============ WORK GRID & PROJECT DIALOG ============
const workDialog = document.getElementById("workDialog");
const workDialogContent = document.getElementById("workDialogContent");
const workPreviews = document.querySelectorAll(".work-grid video");
let workOpener;
let savedBodyOverflow;

// Only play previews that are on screen; pause them while a project is open.
const previewObserver = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    target.dataset.inView = String(isIntersecting);
    if(isIntersecting && !workDialog.open && !document.hidden){
      target.play().catch(() => {});
    } else {
      target.pause();
    }
  });
}, { threshold: 0.1 });
workPreviews.forEach(video => previewObserver.observe(video));

function resumeWorkPreviews(){
  workPreviews.forEach(video => {
    if(video.dataset.inView === "true" && !document.hidden && !workDialog.open){
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}
document.addEventListener("visibilitychange", resumeWorkPreviews);

document.querySelectorAll(".work-open").forEach(button => {
  button.addEventListener("click", () => {
    workOpener = button;
    const template = button.parentElement.querySelector(".work-detail");
    workDialogContent.replaceChildren(template.content.cloneNode(true));
    workDialogContent.querySelector("h3").id = "workDialogTitle";
    savedBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    workPreviews.forEach(video => video.pause());
    workDialog.showModal();
    workDialog.scrollTop = 0;
    workDialog.querySelector(".work-dialog-close").focus({ preventScroll: true });
    const video = workDialogContent.querySelector("video");
    if(video){
      video.muted = false;
      video.play().catch(() => {});
    }
  });
});

workDialog.querySelector(".work-dialog-close").addEventListener("click", () => workDialog.close());
// A click on the backdrop closes the dialog; clicks inside the panel do not.
let backdropPointerDown = false;
function outsideWorkDialog(event){
  const rect = workDialog.getBoundingClientRect();
  return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
}
workDialog.addEventListener("pointerdown", event => {
  backdropPointerDown = event.target === workDialog && outsideWorkDialog(event);
});
workDialog.addEventListener("click", event => {
  if(backdropPointerDown && event.target === workDialog && outsideWorkDialog(event)) workDialog.close();
  backdropPointerDown = false;
});
workDialogContent.addEventListener("click", event => {
  if(event.target.closest('a[href="#contact"]')) workDialog.close();
});
workDialog.addEventListener("close", () => {
  workDialogContent.querySelectorAll("video").forEach(video => video.pause());
  workDialogContent.replaceChildren();
  document.body.style.overflow = savedBodyOverflow;
  workOpener?.focus({ preventScroll: true });
  resumeWorkPreviews();
});

// ============ TECH TOOLS CAROUSEL ============
const techTrack = document.getElementById("techTrack");
const techPages = techTrack ? Array.from(techTrack.children) : [];
const techDotsWrap = document.getElementById("techDots");
const prevTechBtn = document.getElementById("prevTech");
const nextTechBtn = document.getElementById("nextTech");
let currentTech = 0;
 
if(techDotsWrap){
  techPages.forEach((_, i) => {
    const dot = document.createElement("button");
    if(i === 0) dot.classList.add("active");
    dot.setAttribute("aria-label", `View tools page ${i + 1}`);
    dot.addEventListener("click", () => goToTech(i));
    techDotsWrap.appendChild(dot);
  });
}
const techDots = techDotsWrap ? Array.from(techDotsWrap.children) : [];
 
function goToTech(index){
  currentTech = (index + techPages.length) % techPages.length;
  techTrack.style.transform = `translateX(-${currentTech * 100}%)`;
  techDots.forEach((d, i) => d.classList.toggle("active", i === currentTech));
}
 
prevTechBtn?.addEventListener("click", () => goToTech(currentTech - 1));
nextTechBtn?.addEventListener("click", () => goToTech(currentTech + 1));
 
const techViewportEl = techTrack?.parentElement;
 
function syncTechHeight(){
  if(!techViewportEl || !techPages.length) return;
  const isCarouselMode = window.matchMedia("(max-width: 900px)").matches;
  if(!isCarouselMode){
    techViewportEl.style.height = "";
    return;
  }
  techViewportEl.style.height = "auto";
  const maxH = Math.max(...techPages.map(page => page.offsetHeight));
  // Ditambahkan + 48 agar memberikan ekstra space untuk padding pengaman zoom agar tidak terpotong
  techViewportEl.style.height = (maxH + 48) + "px";
}
 
window.addEventListener("resize", syncTechHeight);
window.addEventListener("load", syncTechHeight);
syncTechHeight();
 
techTrack?.querySelectorAll("img").forEach(img => {
  img.addEventListener("load", syncTechHeight, { once: true });
});
 
const techViewport = techTrack?.parentElement;
 
if(techViewport){
  let techTouchStartX = 0;
  let techTouchEndX = 0;
 
  techViewport.addEventListener('touchstart', (e) => {
    techTouchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
 
  techViewport.addEventListener('touchend', (e) => {
    techTouchEndX = e.changedTouches[0].screenX;
    handleTechSwipe();
  }, { passive: true });
 
  function handleTechSwipe(){
    const swipeThreshold = 50;
 
    if (techTouchStartX - techTouchEndX > swipeThreshold) {
      goToTech(currentTech + 1);
    } else if (techTouchEndX - techTouchStartX > swipeThreshold) {
      goToTech(currentTech - 1);
    }
  }
}
 
// ============ GENERIC TAB TOGGLE ============
document.querySelectorAll(".tab-toggle").forEach(toggle => {
  const panelsWrap = toggle.nextElementSibling;
  if(!panelsWrap) return;
 
  const btns = toggle.querySelectorAll(".tab-btn");
  const panels = panelsWrap.querySelectorAll(".tab-panel");
 
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
 
      btns.forEach(b => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
 
      panels.forEach(panel => {
        const isTarget = panel.dataset.panel === target;
        panel.classList.toggle("active", isTarget);
        if(isTarget) animateBarsIn(panel);
      });
      scheduleScrollEffects();
    });
  });
});
 
// ============ SOFT SKILL BAR ANIMATION ============
function animateBarsIn(scope){
  const fills = scope.querySelectorAll(".skill-bar-fill");
  fills.forEach(fill => {
    const pct = fill.dataset.percent;
    requestAnimationFrame(() => {
      fill.style.width = pct + "%";
    });
  });
}
 
const skillBarObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      animateBarsIn(entry.target);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
 
document.querySelectorAll('.tab-panel[data-panel="soft"]').forEach(panel => {
  skillBarObserver.observe(panel);
});
 
// ============ THEME TOGGLE ============
const themeToggle = document.getElementById("themeToggle");
const htmlEl = document.documentElement;
const savedTheme = localStorage.getItem("portfolio-theme");
 
if(savedTheme === "blue"){
  htmlEl.setAttribute("data-theme", "blue");
  themeToggle?.setAttribute("aria-pressed", "true");
}
 
themeToggle?.addEventListener("click", () => {
  const isBlue = htmlEl.getAttribute("data-theme") === "blue";
  if(isBlue){
    htmlEl.removeAttribute("data-theme");
    localStorage.setItem("portfolio-theme", "green");
    themeToggle.setAttribute("aria-pressed", "false");
  } else {
    htmlEl.setAttribute("data-theme", "blue");
    localStorage.setItem("portfolio-theme", "blue");
    themeToggle.setAttribute("aria-pressed", "true");
  }
});
 
// ============ CONTACT FORM FEEDBACK ============
const form = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
 
form?.addEventListener("submit", () => {
  formNote.textContent = "Sending message...";
});
 
// ============ TECH LOGO FALLBACK ============
document.querySelectorAll(".tech-item img").forEach(img => {
  let retried = false;
  img.addEventListener("error", () => {
    if(!retried){
      retried = true;
      const originalSrc = img.src;
      setTimeout(() => { img.src = originalSrc + "?retry=1"; }, 600);
      return;
    }
    const label = img.alt || img.nextElementSibling?.textContent || "?";
    const initials = label.trim().slice(0, 2).toUpperCase();
    const fallback = document.createElement("div");
    fallback.className = "tech-fallback";
    fallback.textContent = initials;
    img.replaceWith(fallback);
  });
});
// ============ FOOTER YEAR ============
document.getElementById("year").textContent = new Date().getFullYear();
 
// ============ SCROLL PROGRESS BAR ============
const scrollProgress = document.getElementById("scrollProgress");
const timelines = Array.from(document.querySelectorAll(".timeline"), element => ({
  element,
  items: Array.from(element.querySelectorAll(".timeline-item"))
}));

function updateTimelines(){
  // The flowing point follows a reading line in the lower half of the viewport.
  const readingLine = window.innerHeight * 0.65;
  timelines.forEach(({ element, items }) => {
    if(!element.getClientRects().length || !items.length) return;
    const timelineTop = element.getBoundingClientRect().top;
    // Anchor the line and moving orb to the actual card centers at every screen size.
    const centers = items.map(item => {
      const card = item.querySelector(".timeline-content").getBoundingClientRect();
      return card.top + card.height / 2 - timelineTop;
    });
    const first = centers[0];
    const length = centers[centers.length - 1] - first;
    const distance = readingLine - timelineTop - first;
    const travel = Math.max(0, Math.min(length, distance));
    element.style.setProperty("--timeline-start", first + "px");
    element.style.setProperty("--timeline-length", length + "px");
    element.style.setProperty("--timeline-progress", length > 0 ? travel / length : 0);
    element.style.setProperty("--timeline-travel", travel + "px");
    element.style.setProperty("--timeline-started", distance >= 0 ? 1 : 0);
    items.forEach((item, index) => {
      // Allow for fractional layout pixels rounded by the browser's scroll position.
      item.classList.toggle("is-reached", distance >= centers[index] - first - 1);
    });
  });
}
 
function updateScrollProgress(){
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = docHeight > 0 ? Math.max(0, Math.min(1, scrollTop / docHeight)) : 0;
  if(scrollProgress) scrollProgress.style.transform = `scaleX(${progress})`;
}

let scrollEffectsFrame = 0;
function scheduleScrollEffects(){
  if(scrollEffectsFrame) return;
  scrollEffectsFrame = requestAnimationFrame(() => {
    scrollEffectsFrame = 0;
    updateScrollProgress();
    updateTimelines();
  });
}
window.addEventListener("scroll", scheduleScrollEffects, { passive: true });
window.addEventListener("resize", scheduleScrollEffects);
window.addEventListener("load", scheduleScrollEffects);
// Fonts, tab switches, and media can change page height without a scroll event.
const scrollLayoutObserver = new ResizeObserver(scheduleScrollEffects);
scrollLayoutObserver.observe(document.body);
timelines.forEach(({ element }) => scrollLayoutObserver.observe(element));
scheduleScrollEffects();
 
// ============ SCROLL TO TOP BUTTON ============
const scrollTopBtn = document.getElementById("scrollTop");
 
function toggleScrollTopVisibility(){
  if(!scrollTopBtn) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  scrollTopBtn.classList.toggle("is-visible", scrollTop > 400);
}
 
scrollTopBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
 
window.addEventListener("scroll", toggleScrollTopVisibility, { passive: true });
toggleScrollTopVisibility();
