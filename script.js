const route = (event) => {
    event.preventDefault();
    const path = event.target.getAttribute("href");
    window.history.pushState({}, "", path);
    handleLocation();
};

const routes = {
    "index.html": "./kaeru/pages/index.html",
    "/": "./kaeru/pages/index.html",
    "/commands": "./kaeru/pages/commands.html",
    "/tos": "./kaeru/pages/tos.html",
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || "./index.html" || "/pages/404.html";

    try {
        const response = await fetch(route);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${route}`);
        }

        const html = await response.text();
        document.querySelector(".main-page").innerHTML = html;
    } catch (error) {
        console.error(error);
        // Handle the error, for example, redirect to a 404 page
        // window.location.href = "/pages/404.html";
    }
};

window.onpopstate = handleLocation;

handleLocation();
