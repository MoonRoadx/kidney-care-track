document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const addSymptomBtn = document.getElementById('add-symptom-btn');
    const addExamBtn = document.getElementById('add-exam-btn');
    const symptomForm = document.getElementById('symptom-form');
    const examForm = document.getElementById('exam-form');
    const saveSymptomBtn = document.getElementById('save-symptom-btn');
    const saveExamBtn = document.getElementById('save-exam-btn');
    const urgenceBtn = document.getElementById('urgence-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const changePictureBtn = document.getElementById('change-picture-btn');
    const uploadPicture = document.getElementById('upload-picture');
    const profilePicture = document.getElementById('profile-picture');
    const editPatientBtn = document.getElementById('edit-patient-btn');
    const editPatientForm = document.getElementById('edit-patient-form');
    const savePatientBtn = document.getElementById('save-patient-btn');
    const exportDataBtn = document.getElementById('export-data-btn');
    const shareDataBtn = document.getElementById('share-data-btn');
    const addAppointmentBtn = document.getElementById('add-appointment-btn');
    const appointmentForm = document.getElementById('appointment-form');
    const saveAppointmentBtn = document.getElementById('save-appointment-btn');
    const generateCardBtn = document.getElementById('generate-card-btn');
    const cardForm = document.getElementById('card-form');
    const saveCardBtn = document.getElementById('save-card-btn');
    const addFoodBtn = document.getElementById('add-food-btn');
    const foodJournalForm = document.getElementById('food-journal-form');
    const saveFoodBtn = document.getElementById('save-food-btn');
    const showMapBtn = document.getElementById('show-map-btn');
    const mapContainer = document.getElementById('map-container');
    const scanNfcBtn = document.getElementById('scan-nfc-btn');

    // Données
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
            profilePicture.src = savedPicture;
        }
    }

    // Changer la photo de profil
    changePictureBtn.addEventListener('click', function() {
        uploadPicture.click();
    });

    uploadPicture.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                profilePicture.src = event.target.result;
                localStorage.setItem('profilePicture', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Enregistrer un symptôme
    saveSymptomBtn.addEventListener('click', function() {
        const symptom = document.getElementById('symptom-input').value;
        const date = document.getElementById('symptom-date').value;

        if (symptom) {
            symptoms.push({ text: symptom, date: date });
            saveData();
            displayHistory();
            symptomForm.classList.add('hidden');
            document.getElementById('symptom-input').value = '';
            document.getElementById('symptom-date').value = '';
        } else {
            alert('Veuillez entrer un symptôme.');
        }
    });

    // Enregistrer un examen
    saveExamBtn.addEventListener('click', function() {
        const examType = document.getElementById('exam-type-input').value;
        const examResult = document.getElementById('exam-result-input').value;
        const date = document.getElementById('exam-date').value;

        if (examType && examResult) {
            exams.push({ type: examType, result: examResult, date: date });
            saveData();
            displayHistory();
            generateChart();
            examForm.classList.add('hidden');
            document.getElementById('exam-type-input').value = '';
            document.getElementById('exam-result-input').value = '';
            document.getElementById('exam-date').value = '';
        } else {
            alert('Veuillez entrer le type d\'examen et le résultat.');
        }
    });

    // Afficher le formulaire pour ajouter un symptôme
    addSymptomBtn.addEventListener('click', function() {
        symptomForm.classList.toggle('hidden');
        examForm.classList.add('hidden');
        editPatientForm.classList.add('hidden');
        appointmentForm.classList.add('hidden');
        foodJournalForm.classList.add('hidden');
        cardForm.classList.add('hidden');
    });

    // Afficher le formulaire pour ajouter un examen
    addExamBtn.addEventListener('click', function() {
        examForm.classList.toggle('hidden');
        symptomForm.classList.add('hidden');
        editPatientForm.classList.add('hidden');
        appointmentForm.classList.add('hidden');
        foodJournalForm.classList.add('hidden');
        cardForm.classList.add('hidden');
    });

    // Bouton Urgence
    urgenceBtn.addEventListener('click', function() {
        alert('Contactez immédiatement un médecin ou rendez-vous aux urgences.');
    });

    // Déconnexion
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('loggedIn');
        window.location.href = 'login.html';
    });

    // Modifier les informations du patient
    editPatientBtn.addEventListener('click', function() {
        editPatientForm.classList.toggle('hidden');
        symptomForm.classList.add('hidden');
        examForm.classList.add('hidden');
        appointmentForm.classList.add('hidden');
        foodJournalForm.classList.add('hidden');
        cardForm.classList.add('hidden');
        document.getElementById('edit-patient-name').value = document.getElementById('patient-name').textContent;
        document.getElementById('edit-kidney-status').value = document.getElementById('kidney-status').textContent;
    });

    // Enregistrer les modifications du patient
    savePatientBtn.addEventListener('click', function() {
        const newName = document.getElementById('edit-patient-name').value;
        const newStatus = document.getElementById('edit-kidney-status').value;

        if (newName) {
            document.getElementById('patient-name').textContent = newName;
        }
        if (newStatus) {
            document.getElementById('kidney-status').textContent = newStatus;
        }

        editPatientForm.classList.add('hidden');
    });

    // Exporter les données
    exportDataBtn.addEventListener('click', function() {
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
    shareDataBtn.addEventListener('click', function() {
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
    addAppointmentBtn.addEventListener('click', function() {
        appointmentForm.classList.toggle('hidden');
        symptomForm.classList.add('hidden');
        examForm.classList.add('hidden');
        editPatientForm.classList.add('hidden');
        foodJournalForm.classList.add('hidden');
        cardForm.classList.add('hidden');
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
    saveAppointmentBtn.addEventListener('click', function() {
        const title = document.getElementById('appointment-title').value;
        const datetime = document.getElementById('appointment-datetime').value;

        if (title && datetime) {
            appointments.push({ title: title, datetime: datetime });
            saveData();
            displayAppointments();
            appointmentForm.classList.add('hidden');
            document.getElementById('appointment-title').value = '';
            document.getElementById('appointment-datetime').value = '';
        } else {
            alert('Veuillez entrer un titre et une date pour le rendez-vous.');
        }
    });

    // Générer une carte de suivi
    generateCardBtn.addEventListener('click', function() {
        cardForm.classList.toggle('hidden');
        symptomForm.classList.add('hidden');
        examForm.classList.add('hidden');
        editPatientForm.classList.add('hidden');
        appointmentForm.classList.add('hidden');
        foodJournalForm.classList.add('hidden');
    });

    // Écrire sur une puce NFC
    saveCardBtn.addEventListener('click', function() {
        const patientName = document.getElementById('card-patient-name').value;
        if (patientName) {
            const cardData = `PATIENT_${patientName}`;
            writeToNFCTag(cardData);
            cardForm.classList.add('hidden');
            document.getElementById('card-patient-name').value = '';
        } else {
            alert('Veuillez entrer le nom du patient.');
        }
    });

    // Lire une puce NFC
    if ('NDEFReader' in window) {
        scanNfcBtn.addEventListener('click', async () => {
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
        scanNfcBtn.textContent = "NFC non supporté";
        scanNfcBtn.disabled = true;
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
    showMapBtn.addEventListener('click', function() {
        mapContainer.classList.toggle('hidden');
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
    addFoodBtn.addEventListener('click', function() {
        foodJournalForm.classList.toggle('hidden');
        symptomForm.classList.add('hidden');
        examForm.classList.add('hidden');
        editPatientForm.classList.add('hidden');
        appointmentForm.classList.add('hidden');
        cardForm.classList.add('hidden');
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
    saveFoodBtn.addEventListener('click', function() {
        const foodName = document.getElementById('food-name').value;
        const foodNotes = document.getElementById('food-notes').value;
        const foodDate = document.getElementById('food-date').value;

        if (foodName) {
            foodJournal.push({ name: foodName, notes: foodNotes, date: foodDate });
            saveData();
            displayFoodJournal();
            foodJournalForm.classList.add('hidden');
            document.getElementById('food-name').value = '';
            document.getElementById('food-notes').value = '';
            document.getElementById('food-date').value = '';
        } else {
            alert('Veuillez entrer le nom de l\'aliment.');
        }
    });

    // Charger les données au démarrage
    loadData();
});
