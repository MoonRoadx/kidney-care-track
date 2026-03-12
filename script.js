document.addEventListener('DOMContentLoaded', function() {
    const addSymptomBtn = document.getElementById('add-symptom-btn');
    const addExamBtn = document.getElementById('add-exam-btn');
    const symptomForm = document.getElementById('symptom-form');
    const examForm = document.getElementById('exam-form');
    const saveSymptomBtn = document.getElementById('save-symptom-btn');
    const saveExamBtn = document.getElementById('save-exam-btn');
    const urgenceBtn = document.getElementById('urgence-btn');

    addSymptomBtn.addEventListener('click', function() {
        symptomForm.classList.toggle('hidden');
        examForm.classList.add('hidden');
    });

    addExamBtn.addEventListener('click', function() {
        examForm.classList.toggle('hidden');
        symptomForm.classList.add('hidden');
    });

    saveSymptomBtn.addEventListener('click', function() {
        const symptom = document.getElementById('symptom-input').value;
        const date = document.getElementById('symptom-date').value;
        if (symptom) {
            alert(`Symptôme enregistré : ${symptom} (Date : ${date || "non spécifiée"})`);
            symptomForm.classList.add('hidden');
            document.getElementById('symptom-input').value = '';
            document.getElementById('symptom-date').value = '';
        } else {
            alert('Veuillez entrer un symptôme.');
        }
    });

    saveExamBtn.addEventListener('click', function() {
        const examType = document.getElementById('exam-type-input').value;
        const examResult = document.getElementById('exam-result-input').value;
        const date = document.getElementById('exam-date').value;
        if (examType && examResult) {
            alert(`Examen enregistré : ${examType} (Résultat : ${examResult}, Date : ${date || "non spécifiée"})`);
            examForm.classList.add('hidden');
            document.getElementById('exam-type-input').value = '';
            document.getElementById('exam-result-input').value = '';
            document.getElementById('exam-date').value = '';
        } else {
            alert('Veuillez entrer le type d\'examen et le résultat.');
        }
    });

    urgenceBtn.addEventListener('click', function() {
        alert('Contactez immédiatement un médecin ou rendez-vous aux urgences.');
    });
});
