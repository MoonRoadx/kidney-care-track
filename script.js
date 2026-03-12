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

// Variables globales
let symptoms = [];
let exams = [];
let appointments = [];
let foodJournal = [];

// Charger les données
function loadData() {
    const savedSymptoms = localStorage.getItem('symptoms');
    const savedExams = localStorage.getItem('exams');
    const savedAppointments = localStorage.getItem('appointments');
    const savedFoodJournal = localStorage.getItem('foodJournal');

    if (savedSymptoms) symptoms = JSON.parse(savedSymptoms);
    if (savedExams) exams = JSON.parse(savedExams);
    if (savedAppointments) appointments = JSON.parse(savedAppointments);
    if (savedFoodJournal) foodJournal = JSON.parse(savedFoodJournal);

    displayHistory();
    generateChart();
    loadProfilePicture();
    displayAppointments();
    displayFoodJournal();
    loadMessages();
}

// Sauvegarder les données
function saveData() {
    localStorage.setItem('symptoms', JSON.stringify(symptoms));
    localStorage.setItem('exams', JSON.stringify(exams));
    localStorage.setItem('appointments', JSON.stringify(appointments));
    localStorage.setItem('foodJournal', JSON.stringify(foodJournal));
}

// Afficher l'historique
function displayHistory() {
    const symptomsHistory = document.getElementById('symptoms-history');
    const examsHistory = document.getElementById('exams-history');

    symptomsHistory.innerHTML = '<h4>Symptômes</h4>';
    symptoms.forEach(symptom => {
        symptomsHistory.innerHTML += `
            <div class="history-item">
                <p><strong>${symptom.date || "Date non spécifiée"}</strong>: ${symptom.text}</p>
            </div>
        `;
    });

    examsHistory.innerHTML = '<h4>Examens</h4>';
    exams.forEach(exam => {
        examsHistory.innerHTML += `
            <div class="history-item">
                <p><strong>${exam.date || "Date non spécifiée"}</strong>: ${exam.type} (Résultat: ${exam.result})</p>
            </div>
        `;
    });
}

// Générer un graphique de suivi
function generateChart() {
    const ctx = document.getElementById('kidney-chart').getContext('2d');
    const dates = exams.map(exam => exam.date || "Date inconnue");
    const results = exams.map(exam => parseFloat(exam.result));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Résultats des examens',
                data: results,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Charger la photo de profil
function loadProfilePicture() {
    const savedPicture = localStorage.getItem('profilePicture');
    if (savedPicture) {
        document.getElementById('profile-picture').src = savedPicture;
    }
}

// Changer la photo de profil
document.getElementById('change-picture-btn').addEventListener('click', function() {
    document.getElementById('upload-picture').click();
});

document.getElementById('upload-picture').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('profile-picture').src = event.target.result;
            localStorage.setItem('profilePicture', event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Enregistrer un symptôme
document.getElementById('save-symptom-btn').addEventListener('click', function() {
    const symptom = document.getElementById('symptom-input').value;
    const date = document.getElementById('symptom-date').value;

    if (symptom) {
        symptoms.push({ text: symptom, date: date });
        saveData();
        displayHistory();
        document.getElementById('symptom-form').classList.add('hidden');
        document.getElementById('symptom-input').value = '';
        document.getElementById('symptom-date').value = '';
    } else {
        alert('Veuillez entrer un symptôme.');
    }
});

// Enregistrer un examen
document.getElementById('save-exam-btn').addEventListener('click', function() {
    const examType = document.getElementById('exam-type-input').value;
    const examResult = document.getElementById('exam-result-input').value;
    const date = document.getElementById('exam-date').value;

    if (examType && examResult) {
        exams.push({ type: examType, result: examResult, date: date });
        saveData();
        displayHistory();
        generateChart();
        document.getElementById('exam-form').classList.add('hidden');
        document.getElementById('exam-type-input').value = '';
        document.getElementById('exam-result-input').value = '';
        document.getElementById('exam-date').value = '';
    } else {
        alert('Veuillez entrer le type d\'examen et le résultat.');
    }
});

// Afficher le formulaire pour ajouter un symptôme
document.getElementById('add-symptom-btn').addEventListener('click', function() {
    document.getElementById('symptom-form').classList.toggle('hidden');
    document.getElementById('exam-form').classList.add('hidden');
    document.getElementById('edit-patient-form').classList.add('hidden');
    document.getElementById('appointment-form').classList.add('hidden');
    document.getElementById('food-journal-form').classList.add('hidden');
    document.getElementById('card-form').classList.add('hidden');
});

// Afficher le formulaire pour ajouter un examen
document.getElementById('add-exam-btn').addEventListener('click', function() {
    document.getElementById('exam-form').classList.toggle('hidden');
    document.getElementById('symptom-form').classList.add('hidden');
    document.getElementById('edit-patient-form').classList.add('hidden');
    document.getElementById('appointment-form').classList.add('hidden');
    document.getElementById('food-journal-form').classList.add('hidden');
    document.getElementById('card-form').classList.add('hidden');
});

// Bouton Urgence
document.getElementById('urgence-btn').addEventListener('click', function() {
    alert('Contactez immédiatement un médecin ou rendez-vous aux urgences.');
});

// Déconnexion
document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'login.html';
});

// Modifier les informations du patient
document.getElementById('edit-patient-btn').addEventListener('click', function() {
    document.getElementById('edit-patient-form').classList.toggle('hidden');
    document.getElementById('symptom-form').classList.add('hidden');
    document.getElementById('exam-form').classList.add('hidden');
    document.getElementById('appointment-form').classList.add('hidden');
    document.getElementById('food-journal-form').classList.add('hidden');
    document.getElementById('card-form').classList.add('hidden');
    document.getElementById('edit-patient-name').value = document.getElementById('patient-name').textContent;
    document.getElementById('edit-kidney-status').value = document.getElementById('kidney-status').textContent;
});

// Enregistrer les modifications du patient
document.getElementById('save-patient-btn').addEventListener('click', function() {
    const newName = document.getElementById('edit-patient-name').value;
    const newStatus = document.getElementById('edit-kidney-status').value;

    if (newName) {
        document.getElementById('patient-name').textContent = newName;
    }
    if (newStatus) {
        document.getElementById('kidney-status').textContent = newStatus;
    }

    document.getElementById('edit-patient-form').classList.add('hidden');
});

// Exporter les données
document.getElementById('export-data-btn').addEventListener('click', function() {
    const data = {
        symptoms: symptoms,
        exams: exams,
        appointments: appointments,
        foodJournal: foodJournal,
        patientName: document.getElementById('patient-name').textContent,
        kidneyStatus: document.getElementById('kidney-status').textContent
    };

    const dataStr = JSON.stringify(data);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'kidney-care-data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
});

// Partager les données
document.getElementById('share-data-btn').addEventListener('click', function() {
    const data = {
        symptoms: symptoms,
        exams: exams,
        appointments: appointments,
        foodJournal: foodJournal,
        patientName: document.getElementById('patient-name').textContent,
        kidneyStatus: document.getElementById('kidney-status').textContent
    };

    const dataStr = JSON.stringify(data);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    if (navigator.share) {
        navigator.share({
            title: 'Données KidneyCare Tracker',
            text: `Voici les données de suivi pour ${data.patientName}`,
            url: dataUri,
        }).catch(err => {
            console.log('Erreur lors du partage:', err);
            alert("Le partage n'est pas supporté sur ce navigateur. Utilisez l'export pour sauvegarder les données.");
        });
    } else {
        alert("Le partage n'est pas supporté sur ce navigateur. Utilisez l'export pour sauvegarder les données.");
    }
});

// Gestion des rendez-vous
document.getElementById('add-appointment-btn').addEventListener('click', function() {
    document.getElementById('appointment-form').classList.toggle('hidden');
    document.getElementById('symptom-form').classList.add('hidden');
    document.getElementById('exam-form').classList.add('hidden');
    document.getElementById('edit-patient-form').classList.add('hidden');
    document.getElementById('food-journal-form').classList.add('hidden');
    document.getElementById('card-form').classList.add('hidden');
});

// Afficher les rendez-vous
function displayAppointments() {
    const appointmentsList = document.getElementById('appointments-list');
    appointmentsList.innerHTML = '';

    appointments.forEach(appointment => {
        appointmentsList.innerHTML += `
            <div class="history-item">
                <p><strong>${new Date(appointment.datetime).toLocaleString()}</strong>: ${appointment.title}</p>
            </div>
        `;
        scheduleAppointmentNotification(appointment);
    });
}

// Planifier une notification pour un rendez-vous
function scheduleAppointmentNotification(appointment) {
    const now = new Date();
    const appointmentTime = new Date(appointment.datetime);
    const timeUntilAppointment = appointmentTime - now;

    if (timeUntilAppointment > 0) {
        setTimeout(() => {
            if (Notification.permission === 'granted') {
                new Notification(`Rappel: Rendez-vous pour ${appointment.title}`, {
                    body: `Le rendez-vous est prévu à ${appointmentTime.toLocaleString()}`,
                });
            }
        }, timeUntilAppointment - 3600000); // Notifier 1 heure avant
    }
}

// Enregistrer un rendez-vous
document.getElementById('save-appointment-btn').addEventListener('click', function() {
    const title = document.getElementById('appointment-title').value;
    const datetime = document.getElementById('appointment-datetime').value;

    if (title && datetime) {
        appointments.push({ title: title, datetime: datetime });
        saveData();
        displayAppointments();
        document.getElementById('appointment-form').classList.add('hidden');
        document.getElementById('appointment-title').value = '';
        document.getElementById('appointment-datetime').value = '';
    } else {
        alert('Veuillez entrer un titre et une date pour le rendez-vous.');
    }
});

// Générer une carte de suivi
document.getElementById('generate-card-btn').addEventListener('click', function() {
    document.getElementById('card-form').classList.toggle('hidden');
    document.getElementById('symptom-form').classList.add('hidden');
    document.getElementById('exam-form').classList.add('hidden');
    document.getElementById('edit-patient-form').classList.add('hidden');
    document.getElementById('appointment-form').classList.add('hidden');
    document.getElementById('food-journal-form').classList.add('hidden');
});

// Écrire sur une puce NFC
document.getElementById('save-card-btn').addEventListener('click', function() {
    const patientName = document.getElementById('card-patient-name').value;
    if (patientName) {
        const cardData = `PATIENT_${patientName}`;
        writeToNFCTag(cardData);
        document.getElementById('card-form').classList.add('hidden');
        document.getElementById('card-patient-name').value = '';
    } else {
        alert('Veuillez entrer le nom du patient.');
    }
});

// Lire une puce NFC
if ('NDEFReader' in window) {
    document.getElementById('scan-nfc-btn').addEventListener('click', async () => {
        try {
            const reader = new NDEFReader();
            await reader.scan();

            reader.onreading = event => {
                const message = event.message;
                for (const record of message.records) {
                    const textDecoder = new TextDecoder(record.encoding);
                    const nfcData = textDecoder.decode(record.data);

                    alert(`Données NFC lues : ${nfcData}`);

                    if (nfcData.startsWith("PATIENT_")) {
                        const patientId = nfcData.split("_")[1];
                        alert(`Chargement des données pour le patient ${patientId}`);
                    }
                }
            };

            reader.onerror = () => {
                alert("Erreur lors de la lecture de la puce NFC.");
            };

        } catch (error) {
            alert(`Erreur : ${error}`);
        }
    });
} else {
    document.getElementById('scan-nfc-btn').textContent = "NFC non supporté";
    document.getElementById('scan-nfc-btn').disabled = true;
}

// Écrire sur une puce NFC
async function writeToNFCTag(data) {
    if ('NDEFReader' in window) {
        try {
            const writer = new NDEFReader();
            await writer.write({ records: [{ recordType: "text", data }] });
            alert("Données écrites sur la puce NFC avec succès !");
        } catch (error) {
            alert(`Erreur : ${error}`);
        }
    } else {
        alert("Web NFC non supporté par ce navigateur.");
    }
}

// Afficher la carte des centres médicaux
document.getElementById('show-map-btn').addEventListener('click', function() {
    document.getElementById('map-container').classList.toggle('hidden');
    initMap();
});

// Initialiser la carte
function initMap() {
    if (window.google) {
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 48.8566, lng: 2.3522 },
            zoom: 12
        });

        new google.maps.Marker({
            position: { lat: 48.8566, lng: 2.3522 },
            map: map,
            title: 'Hôpital Exemple'
        });
    } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD3CrD7PGL6DlVpG8NvmiJt1YZ5jcGmjoE&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    }
}

// Journal alimentaire
document.getElementById('add-food-btn').addEventListener('click', function() {
    document.getElementById('food-journal-form').classList.toggle('hidden');
    document.getElementById('symptom-form').classList.add('hidden');
    document.getElementById('exam-form').classList.add('hidden');
    document.getElementById('edit-patient-form').classList.add('hidden');
    document.getElementById('appointment-form').classList.add('hidden');
    document.getElementById('card-form').classList.add('hidden');
});

// Afficher le journal alimentaire
function displayFoodJournal() {
    const foodJournalList = document.getElementById('food-journal-list');
    foodJournalList.innerHTML = '';

    foodJournal.forEach(food => {
        foodJournalList.innerHTML += `
            <div class="history-item">
                <p><strong>${food.date || "Date non spécifiée"}</strong>: ${food.name} - ${food.notes || ''}</p>
            </div>
        `;
    });
}

// Enregistrer une entrée dans le journal alimentaire
document.getElementById('save-food-btn').addEventListener('click', function() {
    const foodName = document.getElementById('food-name').value;
    const foodNotes = document.getElementById('food-notes').value;
    const foodDate = document.getElementById('food-date').value;

    if (foodName) {
        foodJournal.push({ name: foodName, notes: foodNotes, date: foodDate });
        saveData();
        displayFoodJournal();
        document.getElementById('food-journal-form').classList.add('hidden');
        document.getElementById('food-name').value = '';
        document.getElementById('food-notes').value = '';
        document.getElementById('food-date').value = '';
    } else {
        alert('Veuillez entrer le nom de l\'aliment.');
    }
});

// Analyse prédictive
async function loadModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [3] }));
    model.compile({
        loss: 'meanSquaredError',
        optimizer: 'sgd'
    });

    // Entraînement fictif
    const xs = tf.tensor2d([[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]], [2, 3]);
    const ys = tf.tensor2d([[0.7], [0.9]], [2, 1]);
    await model.fit(xs, ys, { epochs: 100 });

    return model;
}

document.getElementById('predict-btn').addEventListener('click', async function() {
    const model = await loadModel();
    const predictionResult = document.getElementById('prediction-result');
    predictionResult.classList.remove('hidden');

    const lastExams = exams.slice(-3);
    const inputData = lastExams.map(exam => parseFloat(exam.result) / 100);

    while (inputData.length < 3) {
        inputData.unshift(0);
    }

    const input = tf.tensor2d([inputData]);
    const prediction = model.predict(input);
    const riskScore = prediction.dataSync()[0];

    document.getElementById('prediction-text').textContent =
        `Risque de complication : ${(riskScore * 100).toFixed(2)}%`;

    const ctx = document.getElementById('prediction-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Risque Prédit'],
            datasets: [{
                label: 'Score de Risque',
                data: [riskScore * 100],
                backgroundColor: riskScore > 0.7 ? 'rgba(255, 99, 132, 0.7)' : 'rgba(75, 192, 192, 0.7)',
                borderColor: riskScore > 0.7 ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)',
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
});

// Téléconsultation
document.getElementById('start-consultation-btn').addEventListener('click', function() {
    const roomName = `kidney-care-${Math.random().toString(36).substr(2, 9)}`;
    const consultationRoom = document.getElementById('consultation-room');
    consultationRoom.classList.remove('hidden');

    const iframe = document.getElementById('jitsi-meet');
    iframe.src = `https://meet.jit.si/${roomName}`;
});

// Messagerie sécurisée
function loadMessages() {
    const messagesRef = database.ref('messages');
    messagesRef.on('value', (snapshot) => {
        const messages = snapshot.val();
        displayMessages(messages);
    });
}

function displayMessages(messages) {
    const messagesList = document.getElementById('messages-list');
    messagesList.innerHTML = '';

    if (messages) {
        Object.keys(messages).forEach(messageId => {
            const message = messages[messageId];
            messagesList.innerHTML += `
                <div class="history-item">
                    <p><strong>${message.sender}:</strong> ${message.text}</p>
                    <p>${new Date(message.timestamp).toLocaleString()}</p>
                </div>
            `;
        });
    }
    messagesList.scrollTop = messagesList.scrollHeight;
}

document.getElementById('send-message-btn').addEventListener('click', function() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (messageText) {
        const messagesRef = database.ref('messages');
        messagesRef.push({
            sender: document.getElementById('patient-name').textContent,
            text: messageText,
            timestamp: Date.now()
        });
        messageInput.value = '';
    }
});

// Charger les données au démarrage
loadData();
