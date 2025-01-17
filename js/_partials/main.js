// add target blank to all external links
for (var i = 0; i < document.links.length; i++) {
    if (document.links[i].hostname !== window.location.hostname) {
        document.links[i].target = "_blank";
        document.links[i].rel = "noopener";
    }
}

var offset = 24;
var fixedHeaderSelector = 'body > header';
smoothScroll.init({ // https://github.com/cferdinandi/smooth-scroll
    selector: 'a[href^="#"]', // Selector for links (must be a class, ID, data attribute, or element tag)
    selectorHeader: fixedHeaderSelector, // Selector for fixed headers [optional]
    speed: 500, // Integer. How fast to complete the scroll in milliseconds
    easing: 'easeInOutCubic', // Easing pattern to use
    offset: offset, // Integer. How far to offset the scrolling anchor location in pixels
    callback: function (anchor, toggle) {
    } // Function to run after scrolling
});

// scroll to current element on load
if (window.location.hash && performance.navigation.type !== 1) {
    setTimeout(function () {
        window.scrollTo(0, window.scrollY - 106);
    }, 0);
}

setTimeout(function () {
    gumshoe.init({ // https://github.com/cferdinandi/gumshoe (scrollspy)
        selector: '#spy-nav ul a', // Default link selector
        selectorHeader: fixedHeaderSelector, // Fixed header selector
        container: window, // The element to spy on scrolling in (must be a valid DOM Node)
        offset: offset, // Distance in pixels to offset calculations
        activeClass: 'active', // Class to apply to active navigation link and its parent list item
        scrollDelay: false, // Wait until scrolling has stopped before updating the navigation
        callback: function (nav) {
            try {
                window.history.replaceState({}, "", location.pathname + "#" + nav.target.id);
            } catch (e) { /* Doesn't matter */
            }
        }
    });
}, 500);

function setMenuHeight () {
    const navHeight = document.getElementsByTagName("nav").item(0).offsetHeight;
    const footerHeight = document.getElementsByTagName("footer").item(0).offsetHeight;
    const tocHeight = window.innerHeight - navHeight - footerHeight - 50; // 50 = menu padding
    const spyNav = document.getElementById('spy-nav');
    let style = spyNav.getAttribute("style");
    const indexOfHeight = style.indexOf(" height");
    if(indexOfHeight > 0) {
        style = style.substring(0, indexOfHeight);
    }
    style = style + " height: " + tocHeight + "px;";
    spyNav.setAttribute("style", style);
}

window.onload = setMenuHeight;
window.onresize = setMenuHeight;

if (document.location.pathname.includes("/documentation")) {
    // "Added in" labels
    let addedTags = {
        "catch-up-subscription-blocking" : "0.1.1",
        "application-service" : "0.2.0",
        "command-composition" : "0.2.0",
        "command-conversion" : "0.2.0",
        "subscription-dsl" : "0.5.0",
        "subscription-life-cycle--testing-blocking" : "0.7.0",
        "retry-configuration-blocking" : "0.7.0",
        "competing-consumer-subscription-blocking" : "0.9.0",
        // "validator-nullability": "3.1.0",
        // "shared-state": "3.2.0",
        // "vue-directory-location": "3.5.0",
        // "redirect-to-lowercase-path-plugin": "3.7.0",
        // "rate-limiting": "3.7.0",
        // "setting-the-host": "3.7.0",
        // "dynamic-single-page-handler": "3.7.0",
        // "cdn-webjars": "3.8.0",
    };
    Object.keys(addedTags).forEach(key => {
        document.getElementById(key).classList.add("added-parent");
        document.getElementById(key).insertAdjacentHTML("beforeend",
                `<span class="added-in">Added in v${addedTags[key]}</span>`
        )
    });

}

// multi-tab code
document.addEventListener("click", function (e) {
    const targetTab = e.target.getAttribute("data-tab");
    if (targetTab == null) {
        return;
    }
    const grandParent = e.target.parentElement.parentElement;
    if (grandParent == null || !grandParent.classList.contains("multitab-code")) {
        return;
    }
    grandParent.setAttribute("data-tab", targetTab);
    if (!grandParent.classList.contains("dependencies")) {
        localStorage.setItem("language", e.target.textContent.toLowerCase());
        document.querySelectorAll(".multitab-code:not(.dependencies)").forEach(multitab => {
            multitab.setAttribute("data-tab", targetTab);
        });
    } else {
        document.querySelectorAll(".multitab-code.dependencies").forEach(multitab => {
            multitab.setAttribute("data-tab", targetTab);
        });
    }
});

(() => {
    function setLanguage() {
        const queryParams = new URLSearchParams(window.location.search);
        const language = (queryParams.get("language") || localStorage.getItem("language") || "").toLowerCase();
        const languages = new Map();
        const codeTabs = document.querySelectorAll(".multitab-code:not(.dependencies) li") || [];
        Array.from(codeTabs).forEach(it => {
            languages.set(it.textContent.toLowerCase(), it.getAttribute("data-tab")); // language and index
        });
        if (languages.get(language) !== undefined) {
            codeTabs[0].parentElement.querySelector(`[data-tab='${languages.get(language)}']`).click();
        }
    }

    const intervalId = setInterval(() => {
        if (document.querySelector(".multitab-code") !== null) {
            clearInterval(intervalId);
            setLanguage();
        }
    }, 10);
})();



