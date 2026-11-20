const form = document.getElementById("login-form");
const submit = document.getElementById("login-submit");
const error = document.getElementById("login-error");

form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.textContent = "";
    submit.disabled = true;
    submit.textContent = "Connexion…";

    const name = document.getElementById("login-name").value.trim();
    const password = document.getElementById("login-password").value;
    const query = new URLSearchParams({ name, password });

    try {
        const response = await fetch(`/api/authenticate/login?${query}`, {
            method: "GET",
            credentials: "same-origin"
        });

        if (!response.ok) {
            throw new Error(response.status === 401
                ? "Nom d’utilisateur ou mot de passe incorrect."
                : "La connexion a échoué. Réessayez plus tard.");
        }

        window.location.assign("/");
    } catch (requestError) {
        error.textContent = requestError.message;
    } finally {
        submit.disabled = false;
        submit.textContent = "Se connecter";
    }
});