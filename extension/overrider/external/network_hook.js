(function () {
    console.log("[hook] injected into page world");

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        this._method = method;
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        this._payload = body;

        this.addEventListener("loadend", () => {
            window.dispatchEvent(new CustomEvent("network-detected", {
                detail: {
                    url: this.responseURL,
                    method: this._method,
                    status: this.status,
                    payload: this._payload,
                    response: this.responseText
                }
            }));
        });

        return originalSend.apply(this, arguments);
    };

    const originalFetch = window.fetch;
    window.fetch = function (input, init = {}) {
        const method = init.method || "GET";
        const payload = init.body || null;

        return originalFetch(input, init).then((response) => {
            const clone = response.clone();
            clone.text().then(text => {
                window.dispatchEvent(new CustomEvent("network-detected", {
                    detail: {
                        url: response.url,
                        method,
                        status: response.status,
                        payload,
                        responseText: text
                    }
                }));
            });

            return response;
        });
    };


})();