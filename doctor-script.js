// Initialiser Firebase
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://VOTRE_PROJECT_ID.firebaseio.com",
    projectId: "VOTRE_PROJECT_ID",
    storageBucket: "VOTRE_PROJECT_ID.appspot.com",
    messagingSenderId: "VOTRE_SENDER_ID",
    appId: "VOTRE_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Charger les données des patients
async function loadPatients() {
    const patientsRef = database.ref('patients');
    patientsRef.on('value', (snapshot) => {
        const patients = snapshot.val();
        displayRiskPatients(patients);
        displayTrends(patients);
    });
}

// Afficher les patients à risque
function displayRiskPatients(patients) {
    const riskPatientsDiv = document.getElementById('risk-patients');
    riskPatientsDiv.innerHTML = '';

    if (patients) {
        Object.keys(patients).forEach(patientId => {
            const patient = patients[patientId];
            if (patient.riskScore > 0.7) {
                riskPatientsDiv.innerHTML += `
                    <div class="history-item">
                        <h4>${patient.name}</h4>
                        <p>Score de risque: ${(patient.riskScore * 100).toFixed(2)}%</p>
                        <p>Dernier examen: ${patient.lastExam || 'Non spécifié'}</p>
                    </div>
                `;
            }
        });
    }
}

// Afficher les tendances
function displayTrends(patients) {
    const ctx = document.getElementById('doctor-trends-chart').getContext('2d');
    let labels = [];
    let data = [];

    if (patients) {
        Object.keys(patients).forEach(patientId => {
            const patient = patients[patientId];
            labels.push(patient.name);
            data.push((patient.riskScore || 0) * 100);
        });
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Score de Risque (%)',
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Charger les messages
function loadMessages() {
    const messagesRef = database.ref('messages');
    messagesRef.on('value', (snapshot) => {
        const messages = snapshot.val();
        displayMessages(messages);
    });
}

// Afficher les messages
function displayMessages(messages) {
    const messagesDiv = document.getElementById('doctor-messages');
    messagesDiv.innerHTML = '';

    if (messages) {
        Object.keys(messages).forEach(messageId => {
            const message = messages[messageId];
            messagesDiv.innerHTML += `
                <div class="history-item">
                    <p><strong>${message.sender}:</strong> ${message.text}</p>
                    <p>${new Date(message.timestamp).toLocaleString()}</p>
                </div>
            `;
        });
    }
}

// Charger les données au démarrage
loadPatients();
loadMessages();
