function getCurrentDate() {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // JS months start at 0
    var day = currentDate.getDate().toString().padStart(2, '0');
    var formattedDate = "".concat(month, "/").concat(day, "/").concat(year);
    console.log(formattedDate);
    return formattedDate;
}
var today = getCurrentDate();
document.getElementById("datepicker").value = today;
//@ts-ignore
var dbName = 'WorkoutDB';
//@ts-ignore
var objectStoreName = 'workouts';
// function deleteDataBase() {
//     var requestDeleteDB = window.indexedDB.deleteDatabase(dbName);
//     requestDeleteDB.onsuccess = function() {
//         console.log("IndexedDB database deleted successfully");
//     };
//     requestDeleteDB.onerror = function(event) {
//         // @ts-ignore
//         let errorCode = event.target!.errorCode;
//         console.error("Error deleting IndexedDB database: ", errorCode );
//     };
// }
// deleteDataBase()
//@ts-ignore
var db;
var openRequest = indexedDB.open(dbName, 1);
openRequest.onupgradeneeded = function (event) {
    console.log('on upgradde needed');
    // @ts-ignore
    db = event.target.result;
    var objectStore = db.createObjectStore("workouts", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("date", "date", { unique: false });
    objectStore.createIndex("bodyPart", "bodyPart", { unique: false });
    objectStore.createIndex("exercise", "exercise", { unique: false });
    objectStore.createIndex("weight", "weight", { unique: false });
    objectStore.createIndex("repeat", "repeat", { unique: false });
    objectStore.createIndex("note", "note", { unique: false });
    // console.log(objectStore)
};
openRequest.onsuccess = function (event) {
    // @ts-ignore
    db = event.target.result;
    changeTableByDate(today);
    console.log('on success');
};
openRequest.onerror = function (event) {
    // @ts-ignore
    var errorCode = event.target.errorCode;
    console.log("Error opening database", errorCode);
};
var exerciesByBodyPart = [
    {
        "name": "Chest",
        "exercises": ["Bench Press", "Push Ups"]
    },
    {
        "name": "Legs",
        "exercises": ["Squats", "Lunges"]
    }
];
window.onload = function () {
    populateSelects(exerciesByBodyPart);
};
// @ts-ignore
function changeDate() {
    clearTable();
    // @ts-ignore
    var date = document.getElementById("datepicker");
    changeTableByDate(date.value);
}
// @ts-ignore
function clearTable() {
    // @ts-ignore
    var table = document.getElementById('tableBody');
    while (table.firstChild) {
        table.firstChild.remove();
    }
}
function changeTableByDate(date) {
    var transaction = db.transaction(["workouts"]);
    var objectStore = transaction.objectStore("workouts");
    var request = objectStore.getAll();
    // @ts-ignore
    request.onsuccess = function (event) {
        event.target.result.forEach(function (workout) {
            console.log('test2');
            console.log(workout);
            if (workout.date == date)
                addExerciseToTable(workout);
        });
    };
}
// @ts-ignore
function populateSelects(bodyParts) {
    // @ts-ignore
    var bodyPartSelect = document.getElementById('bodypart');
    // @ts-ignore
    var exerciseSelect = document.getElementById('exercise');
    bodyParts.forEach(function (part, index) {
        var option = document.createElement('option');
        option.text = part.name;
        option.value = index;
        bodyPartSelect.add(option);
    });
    // Populate initial exercises
    populateExercises(bodyParts[0].exercises);
    // @ts-ignore
    var weightInput = document.getElementById('weight');
    // @ts-ignore
    var repsInput = document.getElementById('reps');
    // Update exercises when body part changes
    bodyPartSelect.onchange = function () {
        // @ts-ignore
        var exercises = bodyParts[this.value].exercises;
        populateExercises(exercises);
        // Clear inputs
        weightInput.value = '';
        repsInput.value = '';
    };
}
// @ts-ignore
function populateExercises(exercises) {
    //@ts-ignore
    var exerciseSelect = document.getElementById('exercise');
    exerciseSelect.innerHTML = '';
    exercises.forEach(function (exercise) {
        var option = document.createElement('option');
        option.text = exercise;
        exerciseSelect.add(option);
    });
    // @ts-ignore
    var weightInput = document.getElementById('weight');
    // @ts-ignore
    var repsInput = document.getElementById('reps');
    // 종목이 바뀌면 input 창 초기화 하기
    exerciseSelect.onchange = function () {
        // Clear inputs
        weightInput.value = '';
        repsInput.value = '';
    };
}
// @ts-ignore
function addExercise() {
    // @ts-ignore
    var date = document.getElementById("datepicker");
    // @ts-ignore
    var bodyPartSelect = document.getElementById('bodypart');
    // @ts-ignore
    var exerciseSelect = document.getElementById('exercise');
    // @ts-ignore
    var weightInput = document.getElementById('weight');
    // @ts-ignore
    var repsInput = document.getElementById('reps');
    // console.log(date.value)
    var newWorkout = {
        date: date.value,
        bodyPart: bodyPartSelect.options[bodyPartSelect.selectedIndex].text,
        exercise: exerciseSelect.value,
        weight: weightInput.value,
        reps: repsInput.value
    };
    console.log(newWorkout);
    var transaction = db.transaction(["workouts"], "readwrite");
    var objectStore = transaction.objectStore("workouts");
    objectStore.add(newWorkout);
    console.log(objectStore);
    addExerciseToTable(newWorkout);
}
// @ts-ignore
function addExerciseToTable(exercise, index) {
    //@ts-ignore
    var tableBody = document.getElementById('tableBody');
    var row = tableBody.insertRow();
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    var cell5 = row.insertCell(5);
    cell0.innerHTML = exercise.date;
    cell1.innerHTML = exercise.bodyPart;
    cell2.innerHTML = exercise.exercise;
    cell3.innerHTML = exercise.weight;
    cell4.innerHTML = exercise.reps;
    // Add delete button
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function () {
        // Remove from HTML table
        tableBody.removeChild(row);
        // Remove from local data and save updated data to localStorage
        data.splice(index, 1);
        localStorage.setItem('workoutData', JSON.stringify(data));
    };
    cell5.appendChild(deleteButton);
}
