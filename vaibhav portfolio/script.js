"use strict";

/* =========================================
1. MOBILE NAVIGATION
========================================= */

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");

function closeMobileMenu() {
    if (!menuToggle || !navMenu) {
        return;
    }

    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
}

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", function () {
        const isOpen = navMenu.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            closeMobileMenu();
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    document.addEventListener("click", function (event) {
        const clickedInsideMenu = navMenu.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            closeMobileMenu();
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 700) {
            closeMobileMenu();
        }
    });
}

/* =========================================
2. NAVIGATION ACTIVE SECTION
========================================= */

const pageSections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {

    const sectionObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                const currentId = entry.target.id;

                navLinks.forEach(function (link) {
                    const isActive =
                        link.getAttribute("href") === "#" + currentId;

                    if (isActive) {
                        link.classList.add("active");
                        link.setAttribute("aria-current", "location");
                    } else {
                        link.classList.remove("active");
                        link.removeAttribute("aria-current");
                    }
                });
            });
        },
        {
            rootMargin: "-25% 0px -60% 0px"
        }
    );

    pageSections.forEach(function (section) {
        sectionObserver.observe(section);
    });
}

/* =========================================
3. PORTFOLIO VIDEO LOADING
========================================= */

const portfolioVideos = document.querySelectorAll(".portfolio-video");

portfolioVideos.forEach(function (video) {

    const videoFrame = video.closest(".video-frame");
    const placeholder = videoFrame
        ? videoFrame.querySelector(".video-placeholder")
        : null;
    const videoPath = video.dataset.video;

    function showPlaceholder() {
        video.hidden = true;
        if (placeholder) {
            placeholder.hidden = false;
        }
    }

    function showVideo() {
        video.hidden = false;
        if (placeholder) {
            placeholder.hidden = true;
        }
    }

    if (
        !videoPath ||
        videoPath.trim() === "" ||
        videoPath.includes("YOUR_VIDEO_HERE")
    ) {
        showPlaceholder();
        return;
    }

    video.addEventListener("loadedmetadata", function () {
        if (Number.isFinite(video.duration) && video.duration > 0) {
            showVideo();
        }
    });

    video.addEventListener("error", function () {
        console.log("Video load nahi hua:", videoPath);
        showPlaceholder();
    });

    video.src = videoPath;
    video.load();
});

/* =========================================
4. EMAIL CONTACT BUTTON
========================================= */

const emailLink = document.querySelector("#email-link");
const contactNote = document.querySelector("#contact-note");

if (emailLink) {

    const email = (emailLink.dataset.email || "").trim();

    const emailIsPlaceholder =
        !email ||
        email === "YOUR_EMAIL_HERE" ||
        email.includes("YOUR_EMAIL");

    if (!emailIsPlaceholder) {

        const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (emailIsValid) {
            emailLink.href = "mailto:" + encodeURIComponent(email);
            emailLink.removeAttribute("aria-disabled");
        } else {
            emailLink.href = "#contact";
            emailLink.setAttribute("aria-disabled", "true");
        }

    } else {
        emailLink.href = "#contact";
        emailLink.setAttribute("aria-disabled", "true");
    }
}

/* =========================================
5. WHATSAPP CONTACT BUTTON
========================================= */

const whatsappLink = document.querySelector("#whatsapp-link");

if (whatsappLink) {

    const phone = (whatsappLink.dataset.phone || "").trim();

    const phoneIsPlaceholder =
        !phone ||
        phone === "YOUR_WHATSAPP_NUMBER_HERE" ||
        phone.includes("YOUR_WHATSAPP");

    if (!phoneIsPlaceholder) {

        const phoneIsValid = /^\d{8,15}$/.test(phone);

        if (phoneIsValid) {
            whatsappLink.href = "https://wa.me/" + phone;
            whatsappLink.removeAttribute("aria-disabled");
        } else {
            whatsappLink.href = "#contact";
            whatsappLink.setAttribute("aria-disabled", "true");
        }

    } else {
        whatsappLink.href = "#contact";
        whatsappLink.setAttribute("aria-disabled", "true");
    }
}

/* =========================================
6. INACTIVE CONTACT BUTTON PROTECTION
========================================= */

document.querySelectorAll('.contact-link[aria-disabled="true"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        if (contactNote) {
            contactNote.textContent =
                "Add your real email address and WhatsApp number in index.html.";
        }
    });
});

/* =========================================
7. AUTOMATIC COPYRIGHT YEAR
========================================= */

const currentYear = document.querySelector("#current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}