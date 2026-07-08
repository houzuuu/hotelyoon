const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector(".nav-toggle");
const bookingForm = document.querySelector("[data-booking-form]");
const formNote = document.querySelector("[data-form-note]");
const stayModeSelect = document.querySelector("[data-stay-mode-select]");
const stayModeName = document.querySelector("[data-stay-mode-name]");
const stayModeState = document.querySelector("[data-stay-mode-state]");
const stayModeExperience = document.querySelector("[data-stay-mode-experience]");
const revealItems = document.querySelectorAll("[data-reveal]");
const roomButtons = document.querySelectorAll("[data-room]");
const roomNote = document.querySelector("[data-room-note]");
const roomDescription = document.querySelector("[data-room-description]");
const roomPrice = document.querySelector("[data-room-price]");
const roomImage = document.querySelector("[data-room-image]");
const heroVideo = document.querySelector("[data-hero-video]");
const heroToggle = document.querySelector("[data-hero-toggle]");
const heroToggleLabel = document.querySelector("[data-hero-toggle-label]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const roomDetails = {
  yoon: {
    description: "짧은 도심 체류를 위한 기본 객실로, 조용한 수면과 티 루틴에 집중합니다.",
    note: "26 sqm · City view · 1-2 guests",
    price: "KRW 240,000",
    image: "assets/yoon-room-wide.png",
    alt: "도시 전망과 차분한 조명을 갖춘 HOTEL YO:ON YO:ON Room",
  },
  pause: {
    description: "데스크와 긴 라운지 베드, 티 테이블이 분리된 스튜디오로 머무는 시간이 조금 더 여유롭습니다.",
    note: "34 sqm · Lounge area · 1-2 guests",
    price: "KRW 320,000",
    image: "assets/yoon-pause-wide-v2.png",
    alt: "데스크와 라운지 베드가 넓게 보이는 HOTEL YO:ON Pause Studio",
  },
  suite: {
    description: "프라이빗 배스와 분리 라운지를 갖춘 스위트로, 하루를 더 깊게 내려놓기에 어울립니다.",
    note: "48 sqm · Private bath · 1-3 guests",
    price: "KRW 470,000",
    image: "assets/yoon-suite-wide-v2.png",
    alt: "프라이빗 배스와 분리 라운지가 보이는 HOTEL YO:ON ON Suite",
  },
};

const stayModes = {
  calm: {
    name: "Calm Mode",
    state: "조용히 쉬고 싶은 고객",
    experience: "허브티, 저조도 조명, 차분한 음악",
  },
  focus: {
    name: "Focus Mode",
    state: "출장과 업무에 집중해야 하는 고객",
    experience: "데스크 세팅, 집중 조명, 미니 문구 키트",
  },
  recharge: {
    name: "Recharge Mode",
    state: "피로를 회복하고 싶은 고객",
    experience: "배스 솔트, 아로마, 수면 카드",
  },
  social: {
    name: "Social Mode",
    state: "가벼운 모임과 대화를 원하는 고객",
    experience: "라운지 안내, 바 메뉴, 로컬 큐레이션",
  },
};

const pad = (value) => String(value).padStart(2, "0");

const toInputDate = (date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 20);
};

const setHeroToggleState = () => {
  if (!heroVideo || !heroToggle) return;

  const isPaused = heroVideo.paused;
  heroToggle.setAttribute("aria-label", isPaused ? "메인 영상 재생" : "메인 영상 일시정지");
  heroToggle.setAttribute("aria-pressed", String(!isPaused));
  heroToggle.classList.toggle("is-paused", isPaused);

  if (heroToggleLabel) {
    heroToggleLabel.textContent = isPaused ? "Play" : "Pause";
  }
};

const closeNav = () => {
  navToggle?.setAttribute("aria-expanded", "false");
  nav?.classList.remove("is-open");
  header?.classList.remove("is-open");
};

const initDates = () => {
  if (!bookingForm) return;

  const checkin = bookingForm.elements.checkin;
  const checkout = bookingForm.elements.checkout;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  checkin.min = toInputDate(today);
  checkout.min = toInputDate(tomorrow);
  checkin.value = toInputDate(today);
  checkout.value = toInputDate(tomorrow);

  checkin.addEventListener("change", () => {
    const nextDate = new Date(checkin.value);
    nextDate.setDate(nextDate.getDate() + 1);
    checkout.min = toInputDate(nextDate);

    if (checkout.value <= checkin.value) {
      checkout.value = toInputDate(nextDate);
    }
  });
};

const updateStayMode = () => {
  if (!stayModeSelect) return;

  const mode = stayModes[stayModeSelect.value] || stayModes.calm;

  if (stayModeName) {
    stayModeName.textContent = mode.name;
  }

  if (stayModeState) {
    stayModeState.textContent = mode.state;
  }

  if (stayModeExperience) {
    stayModeExperience.textContent = mode.experience;
  }
};

const initReveal = () => {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
};

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  nav?.classList.toggle("is-open", !isOpen);
  header?.classList.toggle("is-open", !isOpen);
});

nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeNav();
});

heroToggle?.addEventListener("click", async () => {
  if (!heroVideo) return;

  if (heroVideo.paused) {
    try {
      await heroVideo.play();
    } catch {
      setHeroToggleState();
    }
  } else {
    heroVideo.pause();
  }

  setHeroToggleState();
});

heroVideo?.addEventListener("play", setHeroToggleState);
heroVideo?.addEventListener("pause", setHeroToggleState);
stayModeSelect?.addEventListener("change", updateStayMode);

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.querySelector(id);
    if (!target) return;

    event.preventDefault();
    closeNav();

    const offset = (header?.getBoundingClientRect().height || 0) + 14;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    history.replaceState(null, "", id);
  });
});

roomButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const room = roomDetails[button.dataset.room] || roomDetails.yoon;

    roomButtons.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("is-active");
    button.setAttribute("aria-pressed", "true");

    if (roomNote) {
      roomNote.textContent = room.note;
    }

    if (roomDescription) {
      roomDescription.textContent = room.description;
    }

    if (roomPrice) {
      roomPrice.innerHTML = `<span>from</span> ${room.price}`;
    }

    if (roomImage && roomImage.getAttribute("src") !== room.image) {
      const updateImage = () => {
        roomImage.src = room.image;
        roomImage.alt = room.alt;
      };

      if (prefersReducedMotion) {
        updateImage();
        return;
      }

      roomImage.classList.add("is-changing");
      window.setTimeout(() => {
        const clearChangingState = () => {
          roomImage.classList.remove("is-changing");
        };

        roomImage.addEventListener("load", clearChangingState, { once: true });
        roomImage.addEventListener("error", clearChangingState, { once: true });
        updateImage();
        window.setTimeout(clearChangingState, 420);
      }, 120);
    }
  });
});

Object.values(roomDetails).forEach((room) => {
  const image = new Image();
  image.src = room.image;
});

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const checkin = data.get("checkin");
  const checkout = data.get("checkout");
  const mode = stayModes[data.get("stayMode")] || stayModes.calm;

  if (checkout <= checkin) {
    formNote.textContent = "체크아웃 날짜는 체크인 날짜 이후로 선택해주세요.";
    return;
  }

  formNote.textContent = `${data.get("destination")} · ${checkin}부터 ${checkout}까지, ${data.get(
    "guests"
  )} · ${mode.name} 기준으로 예약 가능 여부를 확인했습니다. 선택하신 모드에는 ${mode.experience}가 준비됩니다. HOTEL YO:ON 팀이 가장 편안한 옵션을 안내드릴게요.`;
});

window.addEventListener("scroll", setHeaderState, { passive: true });

setHeaderState();
setHeroToggleState();
initDates();
updateStayMode();
initReveal();
