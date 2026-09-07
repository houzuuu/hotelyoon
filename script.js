const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector(".nav-toggle");
const bookingForm = document.querySelector("[data-booking-form]");
const formNote = document.querySelector("[data-form-note]");
const stayModeSelect = document.querySelector("[data-stay-mode-select]");
const bookingRoomSelect = document.querySelector("[data-room-select]");
const guestSelect = bookingForm?.elements.guests;
const stayModeName = document.querySelector("[data-stay-mode-name]");
const stayModeState = document.querySelector("[data-stay-mode-state]");
const stayModeExperience = document.querySelector("[data-stay-mode-experience]");
const recommendedRoomName = document.querySelector("[data-recommended-room-name]");
const recommendedRoomCopy = document.querySelector("[data-recommended-room-copy]");
const recommendedRoomMeta = document.querySelector("[data-recommended-room-meta]");
const revealItems = document.querySelectorAll("[data-reveal]");
const roomButtons = document.querySelectorAll("[data-room]");
const roomNote = document.querySelector("[data-room-note]");
const roomDescription = document.querySelector("[data-room-description]");
const roomPrice = document.querySelector("[data-room-price]");
const roomImage = document.querySelector("[data-room-image]");
const heroVideo = document.querySelector("[data-hero-video]");
const heroToggle = document.querySelector("[data-hero-toggle]");
const heroToggleLabel = document.querySelector("[data-hero-toggle-label]");
const sectionNavLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const roomDetails = {
  yoon: {
    name: "YO:ON Room",
    description: "짧은 도심 체류를 위한 기본 객실로, 조용한 수면과 티 루틴에 집중합니다.",
    recommendation: "조용한 휴식과 수면 루틴에 집중한 기본 객실",
    note: "26 sqm · City view · 1-2 guests",
    price: "KRW 240,000",
    image: "assets/yoon-room-wide.jpg",
    maxGuests: 2,
    alt: "도시 전망과 차분한 조명을 갖춘 HOTEL YO:ON YO:ON Room",
  },
  pause: {
    name: "Pause Studio",
    description: "데스크와 긴 라운지 베드, 티 테이블이 분리된 스튜디오로 머무는 시간이 조금 더 여유롭습니다.",
    recommendation: "데스크와 라운지 공간이 분리된 업무형 스테이",
    note: "34 sqm · Lounge area · 1-4 guests",
    price: "KRW 320,000",
    image: "assets/yoon-pause-wide-v2.jpg",
    maxGuests: 4,
    alt: "데스크와 라운지 베드가 넓게 보이는 HOTEL YO:ON Pause Studio",
  },
  suite: {
    name: "ON Suite",
    description: "프라이빗 배스와 분리 라운지를 갖춘 스위트로, 하루를 더 깊게 내려놓기에 어울립니다.",
    recommendation: "프라이빗 배스와 깊은 회복을 위한 스위트",
    note: "48 sqm · Private bath · 2-5 guests",
    price: "KRW 470,000",
    image: "assets/yoon-suite-wide-v2.jpg",
    maxGuests: 5,
    alt: "프라이빗 배스와 분리 라운지가 보이는 HOTEL YO:ON ON Suite",
  },
};

const stayModes = {
  calm: {
    name: "Calm Mode",
    state: "온전히 쉬고 싶은 날",
    experience: "허브티, 저조도 조명, 차분한 음악",
    room: "yoon",
  },
  focus: {
    name: "Focus Mode",
    state: "일과 휴식의 균형이 필요한 날",
    experience: "데스크 세팅, 집중 조명, 미니 문구 키트",
    room: "pause",
  },
  recharge: {
    name: "Recharge Mode",
    state: "몸의 피로를 내려놓고 싶은 날",
    experience: "배스 솔트, 아로마, 수면 루틴",
    room: "suite",
  },
  lounge: {
    name: "Lounge Mode",
    state: "가벼운 모임과 대화가 필요한 날",
    experience: "라운지 안내, 바 메뉴, 로컬 큐레이션",
    room: "pause",
  },
};

const pad = (value) => String(value).padStart(2, "0");

const toInputDate = (date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const parseInputDate = (value) => {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day);
};

const getGuestCount = () => Number(String(guestSelect?.value).match(/\d+/)?.[0]) || 1;

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
  navToggle?.setAttribute("aria-label", "메뉴 열기");
  nav?.classList.remove("is-open");
  header?.classList.remove("is-open");
  document.body.classList.remove("nav-open");
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

  checkin.addEventListener("change", () => {
    if (!checkin.value) return;
    const nextDate = parseInputDate(checkin.value);
    nextDate.setDate(nextDate.getDate() + 1);
    checkout.min = toInputDate(nextDate);

    if (checkout.value && checkout.value <= checkin.value) {
      checkout.value = "";
    }
  });
};

const updateStayMode = () => {
  if (!stayModeSelect) return;
  bookingRoomSelect.value = "";

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

  updateRoomAvailability();
};

const updateRoomAvailability = () => {
  if (!bookingRoomSelect) return;

  const guestCount = getGuestCount();
  const mode = stayModes[stayModeSelect?.value] || stayModes.calm;
  const options = Array.from(bookingRoomSelect.options);

  options.forEach((option) => {
    const room = roomDetails[option.value];
    option.disabled = room ? room.maxGuests < guestCount : true;
    if (room) {
      option.textContent = `${room.name} · 최대 ${room.maxGuests}명${stayModeSelect?.value && mode.room === option.value && !option.disabled ? " · 추천" : ""}`;
    }
  });

  const currentRoomIsAvailable = !bookingRoomSelect.selectedOptions[0]?.disabled;

  if (!currentRoomIsAvailable) {
    bookingRoomSelect.value = "";
  }

  updateRoomRecommendation();
};

const updateBookingProgress = () => {
  if (!bookingForm) return;
  const { destination, checkin, checkout, guests } = bookingForm.elements;
  const journeyReady = [destination, checkin, checkout, guests].every((field) => field.value && field.validity.valid)
    && checkout.value > checkin.value;
  [stayModeSelect, bookingRoomSelect].forEach((field) => {
    field.closest("label").hidden = !journeyReady;
    field.disabled = !journeyReady || (field === bookingRoomSelect && !stayModeSelect.value);
  });
  const complete = Boolean(journeyReady && stayModeSelect.value && bookingRoomSelect.value);
  bookingForm.querySelector(".booking-summary").hidden = !complete;
  const submit = bookingForm.querySelector('[type="submit"]');
  submit.hidden = !complete;
  submit.disabled = !complete;
  const journeySummary = bookingForm.querySelector("[data-journey-summary]");
  if (complete) {
    const formatDate = (value) => {
      const [year, month, day] = value.split("-").map(Number);
      return `${year}년 ${month}월 ${day}일`;
    };
    const toDay = (value) => {
      const [year, month, day] = value.split("-").map(Number);
      return Date.UTC(year, month - 1, day);
    };
    const nights = Math.round((toDay(checkout.value) - toDay(checkin.value)) / 86400000);
    journeySummary.textContent = `${destination.value} · ${formatDate(checkin.value)}–${formatDate(checkout.value)} · ${nights}박 · ${guests.value}`;
  } else {
    journeySummary.textContent = "";
  }
  if (!complete && formNote) formNote.textContent = "";
};

const updateRoomRecommendation = () => {
  const roomKey = bookingRoomSelect?.value || stayModes[stayModeSelect?.value]?.room || "yoon";
  const room = roomDetails[roomKey] || roomDetails.yoon;

  if (recommendedRoomName) {
    recommendedRoomName.textContent = room.name;
  }

  if (recommendedRoomCopy) {
    recommendedRoomCopy.textContent = room.recommendation;
  }

  if (recommendedRoomMeta) {
    recommendedRoomMeta.textContent = `${room.note} · ${room.price}부터`;
  }
  const reason = document.querySelector("[data-room-match-reason]");
  if (reason) {
    const mode = stayModes[stayModeSelect?.value];
    reason.textContent = mode?.room === roomKey
      ? "선택하신 인원과 휴식 모드에 어울리는 객실입니다."
      : "선택하신 인원이 머물 수 있는 객실에 휴식 모드를 함께 준비합니다.";
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

const initScrollSpy = () => {
  if (!("IntersectionObserver" in window) || !sectionNavLinks.length) return;

  const targets = Array.from(sectionNavLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) return;

      sectionNavLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${visibleEntry.target.id}`;
        if (isCurrent) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    { rootMargin: "-30% 0px -55%", threshold: [0, 0.2, 0.5] }
  );

  targets.forEach((target) => observer.observe(target));
};

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "메뉴 열기" : "메뉴 닫기");
  nav?.classList.toggle("is-open", !isOpen);
  header?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});

nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeNav();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav?.classList.contains("is-open")) {
    closeNav();
    navToggle?.focus();
  }
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
bookingRoomSelect?.addEventListener("change", updateRoomRecommendation);
guestSelect?.addEventListener("change", updateRoomAvailability);


document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.querySelector(id);
    if (!target) return;

    event.preventDefault();
    closeNav();

    const offset = header?.getBoundingClientRect().height || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    if (link.classList.contains("skip-link")) {
      target.focus({ preventScroll: true });
    }
    history.replaceState(null, "", id);
  });
});

roomButtons.forEach((button) => {
  const preloadRoomImage = () => {
    const room = roomDetails[button.dataset.room];
    if (!room) return;
    const image = new Image();
    image.src = room.image;
  };

  button.addEventListener("pointerenter", preloadRoomImage, { once: true });
  button.addEventListener("focus", preloadRoomImage, { once: true });

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

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const checkin = data.get("checkin");
  const checkout = data.get("checkout");
  const mode = stayModes[data.get("stayMode")] || stayModes.calm;
  const room = roomDetails[data.get("roomType")] || roomDetails[mode.room] || roomDetails.yoon;

  if (checkout <= checkin) {
    formNote.textContent = "체크아웃 날짜는 체크인 날짜 이후로 선택해주세요.";
    formNote.focus({ preventScroll: true });
    return;
  }

  formNote.textContent = `선택하신 스테이를 확인해주세요. ${mode.name} · ${room.name}, 함께하는 휴식은 ${mode.experience}입니다. 실제 예약 가능 여부와 확정 요금은 호텔에 문의해주세요.`;
  formNote.focus({ preventScroll: true });
});

bookingForm?.addEventListener("input", () => {
  if (formNote?.textContent) formNote.textContent = "";
  updateBookingProgress();
});
bookingForm?.addEventListener("change", updateBookingProgress);

window.addEventListener("scroll", setHeaderState, { passive: true });

setHeaderState();
if (prefersReducedMotion) heroVideo?.pause();
setHeroToggleState();
initDates();
updateStayMode();
updateBookingProgress();
initReveal();
initScrollSpy();
