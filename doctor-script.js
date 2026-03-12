// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-database-compat.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-analytics-compat.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByqG8oZzfSZeYpCOxpSRRk3jDqpnJeuUA",
  authDomain: "kidneycaretracker-1a030.firebaseapp.com",
  projectId: "kidneycaretracker-1a030",
  storageBucket: "kidneycaretracker-1a030.firebasestorage.app",
  messagingSenderId: "302890693728",
  appId: "1:302890693728:web:6f86ff8481f277457e7f05",
  measurementId: "G-3QW5FCRYFT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Charger les données des patients
async function loadPatients() {
    const patientsRef = ref(database, 'patients');
    onValue(patientsRef, (snapshot) => {
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
    const messagesRef = ref(database, 'messages');
    onValue(messagesRef, (snapshot) => {
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
