const bcrypt = require('bcrypt');

// Fonction pour hasher un mot de passe
async function hashPassword(password) {
    try {
        const saltRounds = 10; // Nombre de rounds de salage
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(`Mot de passe: ${password}`);
        console.log(`Hash: ${hashedPassword}`);
    } catch (error) {
        console.error('Erreur lors du hashage du mot de passe:', error);
    }
}

// Exemple d'utilisation
const password = process.argv[2]; // Mot de passe passé en argument de la ligne de commande
if (password) {
    hashPassword(password);
} else {
    console.error('Veuillez fournir un mot de passe à hasher en argument de la ligne de commande.');
    console.error('Exemple : node hashPassword.js monMotDePasse');
}
