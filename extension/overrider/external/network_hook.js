(function () {
    console.log("[hook] injected into page world");

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        return originalOpen.apply(this, arguments);
    };

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        this.addEventListener("loadend", () => {
                window.dispatchEvent(new CustomEvent("network-detected", {
                    detail: {
                        url: this.responseURL,
                        status: this.status,
                        response: this.responseText
                    }
                }));    
        });
        return originalSend.apply(this, arguments);
    };

    const originalFetch = window.fetch;
    window.fetch = function () {
        return originalFetch.apply(this, arguments).then((response) => {
            console.log("[hook][fetch][response]", response.url, response.status);
                // give url string and status code and response object as event detail
                window.dispatchEvent(new CustomEvent("network-detected", {
                    detail: {
                        url: response.url,
                        status: response.status,
                        response: response
                    }
                }));
            return response;
        });
    };
    
})();