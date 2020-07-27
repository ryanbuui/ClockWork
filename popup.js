window.onload=function() {
    document.getElementById('Timer').addEventListener("click", timerAdd);
    document.getElementById('Reminder').addEventListener("click", reminderAdd);
}
let allTasks = [];
let count = 0;
load();
let counterSec = setInterval(countDown, 1000);

function reset() {
    chrome.storage.sync.set({'tasks': []});
    chrome.storage.sync.set({'countNum': 0});
}

function countDown() {
    if (allTasks.length > 0) {
        for(i = 0; i < allTasks.length; i++) {
            if (allTasks[i].time != 0) {
                allTasks[i].time -= true ? 1 : 0;
            }
            document.getElementById('taskTime'+allTasks[i].count).innerText = getTimeFromSec(allTasks[i].time);
        }
    }
}

function completed(event) {
    if(event.target.style.textDecoration == 'line-through') {
        event.target.style.backgroundColor = '';
        event.target.style.textDecoration = 'none';
    }
    else{
        event.target.style.textDecoration = 'line-through';
        event.target.style.backgroundColor = '#67d674';
    }
}

function deleteTask(event) {
    let target = event.target.id;
    let num = parseInt(target.substring(6));
    for(let k = 0; k < allTasks.length; k++) {
        if(num == allTasks[k].count) {
            allTasks.splice(k, 1);
            break;
        }
    }
    event.target.parentNode.style.display = 'none';
    store();
}

function getTimeFromSec(seconds) {
    let hours = Math.floor(seconds/3600);
    let secondsLeft = seconds % 3600;
    let minutes = Math.floor(secondsLeft/60);
    if(hours < 10) {
        hours = hours == 0 ? '00' : '0'+hours;
    }
    if(minutes < 10) {
        minutes = minutes == 0 ? '00' : '0'+minutes;
    }
    let timeString = `${hours}:${minutes}`;
    return timeString;
}

function timerAdd() {
    if(!(getName() && getDate())) {
        return;
    }
    const taskComp = `<li class="task">
    <button class="component taskName" id="taskName${count}">${getName()}</button>
    <button class="component" id="taskDate">${getDate()}</button>
    <button class="component" id="taskTime${count}">${getTime()}</button>
    <button class="component cancel" id="cancel${count}">X</button> 
    </li>`;
    let taskList = document.getElementById('tasks-list');
    taskList.insertAdjacentHTML('beforeend', taskComp)
    document.getElementById('taskName'+count).addEventListener("click", completed);
    document.getElementById('cancel'+count).addEventListener("click", deleteTask);
    let newTask = {
        type: "timer",
        name: getName(),
        time: getTimeInSec(),
        date: getDate(),
        count: count,
        status: false
    }
    allTasks.push(newTask);
    count++;
    store();
}

function reminderAdd() {
    if(!(getName() && getDate())) {
        return;
    }
    const taskComp = `<li class="task">
    <button class="component-2" id="taskName${count}">${getName()}</button>
    <button class="component-2" id="taskDate">${getDate()}</button>
    <button class="component cancel" id="cancel${count}">X</button> 
    </li>`;
    let taskList = document.getElementById('tasks-list');
    taskList.insertAdjacentHTML('beforeend', taskComp);
    document.getElementById('taskName'+count).addEventListener("click", completed);
    document.getElementById('cancel'+count).addEventListener("click", deleteTask);
    let newTask = {
        type: "reminder",
        name: getName(),
        date: getDate(),
        count: count
    }
    allTasks.push(newTask);
    count++;
    store();
}

function getName() {
    return document.getElementById('nameInput').value;
}

function getTimeInSec() {
    let hours = document.getElementById('hourInput').value;
    let minutes = document.getElementById('minInput').value;
    let seconds = hours*3600 + minutes*60;
    return seconds;
}

function getTime() {
    let hours = document.getElementById('hourInput').value;
    let minutes = document.getElementById('minInput').value;
    if(hours < 10) {
        hours = hours == 0 ? '00' : '0'+hours;
    }
    if(minutes < 10) {
        minutes = minutes == 0 ? '00' : '0'+minutes;
    }
    let timeString = `${hours}:${minutes}`;
    return timeString;
}

function getDate() {
    return document.getElementById('dateInput').value;
}

function store() {
    chrome.storage.sync.set({'tasks': allTasks});
    chrome.storage.sync.set({'countNum': count});
}

function load() {
    let loadedTasks = [];
    chrome.storage.sync.get('countNum', function(result){
        count = result.countNum;
    });
    chrome.storage.sync.get('tasks', function(result) {
        if(result.tasks) {
            loadedTasks = result.tasks;
            allTasks = loadedTasks;
            addAllTasks();
        }
    })
}

function addAllTasks() {
    for(let j = 0; j < allTasks.length; j++) {
        if(allTasks[j].type == "timer") {
            const taskComp = `<li class="task">
            <button class="component taskName" id="taskName${allTasks[j].count}">${allTasks[j].name}</button>
            <button class="component" id="taskDate">${allTasks[j].date}</button>
            <button class="component" id="taskTime${allTasks[j].count}">${getTimeFromSec(allTasks[j].time)}</button>
            <button class="component cancel" id="cancel${allTasks[j].count}">X</button> 
            </li>`;
            let taskList = document.getElementById('tasks-list');
            taskList.insertAdjacentHTML('beforeend', taskComp)
            document.getElementById('taskName'+allTasks[j].count).addEventListener("click", completed);
            document.getElementById('cancel'+allTasks[j].count).addEventListener("click", deleteTask);
        }
        else {
            const taskComp = `<li class="task">
            <button class="component-2" id="taskName${allTasks[j].count}">${allTasks[j].name}</button>
            <button class="component-2" id="taskDate">${allTasks[j].date}</button>
            <button class="component cancel" id="cancel${allTasks[j].count}">X</button> 
            </li>`;
            let taskList = document.getElementById('tasks-list');
            taskList.insertAdjacentHTML('beforeend', taskComp);
            document.getElementById('taskName'+allTasks[j].count).addEventListener("click", completed);
            document.getElementById('cancel'+allTasks[j].count).addEventListener("click", deleteTask);
        }
    }
}