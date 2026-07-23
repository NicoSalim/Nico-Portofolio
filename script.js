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
}, { threshold: 0.15 });
 
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
 
  function animateGlow(){
    curX += (targetX - curX) * 0.12;
    curY += (targetY - curY) * 0.12;
    cursorGlow.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
    requestAnimationFrame(animateGlow);
  }
  requestAnimationFrame(animateGlow);
} else if(cursorGlow){
  cursorGlow.remove();
}
 
// ============ WORK CAROUSEL ============
const track = document.getElementById("workTrack");
const cards = track ? Array.from(track.children) : [];
const dotsWrap = document.getElementById("workDots");
const prevBtn = document.getElementById("prevWork");
const nextBtn = document.getElementById("nextWork");
let current = 0;
 
if(dotsWrap){
  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    if(i === 0) dot.classList.add("active");
    dot.setAttribute("aria-label", `View project ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });
}
const dots = dotsWrap ? Array.from(dotsWrap.children) : [];
 
function goTo(index){
  current = (index + cards.length) % cards.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle("active", i === current));
}
 
prevBtn?.addEventListener("click", () => goTo(current - 1));
nextBtn?.addEventListener("click", () => goTo(current + 1));
 
const viewport = document.getElementById("workTrack")?.parentElement;
 
if (viewport) {
  let touchStartX = 0;
  let touchEndX = 0;
 
  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
 
  viewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
 
  function handleSwipe() {
    const swipeThreshold = 50;
    
    if (touchStartX - touchEndX > swipeThreshold) {
      goTo(current + 1);
    } 
    else if (touchEndX - touchStartX > swipeThreshold) {
      goTo(current - 1);
    }
  }
}
 
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
 
function updateScrollProgress(){
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if(scrollProgress) scrollProgress.style.width = progress + "%";
}
 
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();
 
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