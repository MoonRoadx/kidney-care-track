document.addEventListener('DOMContentLoaded', function() {
    const addSymptomBtn = document.getElementById('add-symptom-btn');
    const addExamBtn = document.getElementById('add-exam-btn');
    const symptomForm = document.getElementById('symptom-form');
    const examForm = document.getElementById('exam-form');
    const saveSymptomBtn = document.getElementById('save-symptom-btn');
    const saveExamBtn = document.getElementById('save-exam-btn');
    const urgenceBtn = document.getElementById('urgence-btn');
    const logoutBtn = document.getElementById('logout-btn');

    let symptoms = [];
    let exams = [];

    // Charger l'historique depuis localStorage
    function loadHistory() {
        const savedSymptoms = localStorage.getItem('symptoms');
        const savedExams = localStorage.getItem('exams');

        if (savedSymptoms) symptoms = JSON.parse(savedSymptoms);
        if (savedExams) exams = JSON.parse(savedExams);

        displayHistory();
        generateChart();
    }

    // Sauvegarder l'historique dans localStorage
    function saveHistory() {
        localStorage.setItem('symptoms', JSON.stringify(symptoms));
        localStorage.setItem('exams', JSON.stringify(exams));
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

        // Exemple de données
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

    // Enregistrer un symptôme
    saveSymptomBtn.addEventListener('click', function() {
        const symptom = document.getElementById('symptom-input').value;
        const date = document.getElementById('symptom-date').value;

        if (symptom) {
            symptoms.push({ text: symptom, date: date });
            saveHistory();
            alert(`Symptôme enregistré : ${symptom} (Date : ${date || "non spécifiée"})`);
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
            saveHistory();
            alert(`Examen enregistré : ${examType} (Résultat : ${examResult}, Date : ${date || "non spécifiée"})`);
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
    });

    // Afficher le formulaire pour ajouter un examen
    addExamBtn.addEventListener('click', function() {
        examForm.classList.toggle('hidden');
        symptomForm.classList.add('hidden');
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

    // Charger l'historique au démarrage
    loadHistory();
});
