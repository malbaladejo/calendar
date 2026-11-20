const form = document.getElementById("import-form");
const jsonContent = document.getElementById("json-content");
const submit = document.getElementById("import-submit");
const statusMessage = document.getElementById("import-status");

form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusMessage.textContent = "";
    statusMessage.className = "import-status";

    let labels;
    try {
        labels = JSON.parse(jsonContent.value);
        if (!Array.isArray(labels)) {
            throw new Error("Le contenu doit être un tableau.");
        }
    } catch (error) {
        statusMessage.textContent = error instanceof SyntaxError
            ? "Le contenu n’est pas un valide."
            : error.message;
        statusMessage.classList.add("import-status--error");
        return;
    }

    submit.disabled = true;
    submit.textContent = "Import…";

    try {
        const response = await fetch("/api/calendar/massupload", {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(labels)
        });

        if (!response.ok) {
            throw new Error(`L’import a échoué (HTTP ${response.status}).`);
        }

        const importedLabels = await response.json();
        statusMessage.textContent = `Import terminé : ${importedLabels.length} élément(s) traité(s).`;
        statusMessage.classList.add("import-status--success");
    } catch (error) {
        statusMessage.textContent = error.message || "Une erreur est survenue pendant l’import.";
        statusMessage.classList.add("import-status--error");
    } finally {
        submit.disabled = false;
        submit.textContent = "Valider";
    }
});