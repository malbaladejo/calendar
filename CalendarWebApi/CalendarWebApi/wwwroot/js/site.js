document.getElementById("logout-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("button");
    button.disabled = true;

    try {
        const response = await fetch(form.action, {
            method: "POST",
            credentials: "same-origin"
        });

        if (!response.ok) {
            throw new Error("La déconnexion a échoué.");
        }

        window.location.assign("/Home/Login");
    } catch {
        button.disabled = false;
        window.alert("Impossible de vous déconnecter. Réessayez.");
    }
});