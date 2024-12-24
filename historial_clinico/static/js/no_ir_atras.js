if (window.history && window.history.pushState) {
    window.history.pushState('', '', window.location.href);
    window.onpopstate = function () {
        window.history.pushState('', '', window.location.href);
    };
}
