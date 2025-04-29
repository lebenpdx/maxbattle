document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("ivForm");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form from reloading the page

        const attack = parseInt(document.getElementById("attackIV").value, 10);
        const defense = parseInt(document.getElementById("defenseIV").value, 10);
        const stamina = parseInt(document.getElementById("staminaIV").value, 10);

        console.log("Submitted IVs:", { attack, defense, stamina });

        console.log(`IVs submitted:\nAttack: ${attack}\nDefense: ${defense}\nStamina: ${stamina}`);
    });
});