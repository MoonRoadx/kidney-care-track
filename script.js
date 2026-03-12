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
    const addAppointmentBtn = document.getElementById('add-appointment-btn');
    const appointmentForm = document.getElementById('appointment-form');
    const saveAppointmentBtn = document.getElementById('save-appointment-btn');

    // Données
    let symptoms = [];
    let exams = [];
    let appointments = [];

    // Charger les données
    function loadData() {
        const savedSymptoms = localStorage.getItem('symptoms');
        const savedExams = localStorage.getItem('exams');
        const savedAppointments = localStorage.getItem('appointments');

        if (savedSymptoms) symptoms = JSON.parse(savedSymptoms);
        if (savedExams) exams = JSON.parse(savedExams);
        if (savedAppointments) appointments = JSON.parse(savedAppointments);

        displayHistory();
        generateChart();
        loadProfilePicture();
        displayAppointments();
    }

    // Sauvegarder les données
    function saveData() {
        localStorage.setItem('symptoms', JSON.stringify(symptoms));
        localStorage.setItem('exams', JSON.stringify(exams));
        localStorage.setItem('appointments', JSON.stringify(appointments));
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
    });

    // Afficher le formulaire pour ajouter un examen
    addExamBtn.addEventListener('click', function() {
        examForm.classList.toggle('hidden');
        symptomForm.classList.add('hidden');
        editPatientForm.classList.add('hidden');
        appointmentForm.classList.add('hidden');
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

    // Gestion des rendez-vous
    addAppointmentBtn.addEventListener('click', function() {
        appointmentForm.classList.toggle('hidden');
        symptomForm.classList.add('hidden');
        examForm.classList.add('hidden');
        editPatientForm.classList.add('hidden');
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
        });
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

    // Charger les données au démarrage
    loadData();
});
