var homerender = {
    quoteList: ['Keep up your work!', 'Stop Phubbing!', 'You can do it!', 'You’re almost there!', 'Please keep feeding me!'],
    totalFocusTime: {},
    quoteChangeInterval: 30000,
    increaseBeeFocusTime: 30 * 60 * 1000,
    increaseBeeCount: 1,
    decreaseBeeCount: 2,
    maxFocusTime: 60 * 60 * 1000,
    currentFocusTime: 0,
    interval: '',
    taskList: [],
    dieBee: 0,
    liveBee: 0,
    init: function () {
        homerender.addEventChangeQuote();
        homerender.addEventStartButton();
        homerender.addEventGiveUpButton();
        homerender.loadUserName();
        homerender.renderTaskList();
        homerender.addEventAddTask();
        homerender.addEventFilterTask();
        homerender.renderBee();
        homerender.addEventChooseTimePeriod();

    },

    addEventChooseTimePeriod: function () {
        var container = document.getElementById('counter');
        var modal = document.getElementById('chooseMaxTimeModal');
        container.onclick = function () {
            modal.classList.add('is-active');
        }

        var options = modal.querySelectorAll('.time-period-button');
        options.forEach(function (option) {
            option.onclick = function () {
                var value = this.dataset.value;
                var maxTime = value * 60 * 1000;
                homerender.renderCounter(maxTime);
                modal.classList.remove('is-active');

            }
        })
    },

    addEventFilterTask: function () {
        var select = document.getElementById('filterTask');
        select.onchange = function () {
            homerender.renderTaskList();
        }
    },

    getTaskList: function () {
        let taskList = (localStorage.getItem('taskList')) ? JSON.parse(localStorage.getItem('taskList')) : [];
        homerender.taskList = taskList;
        return taskList;
    },
    setTaskList: function (taskList) {
        homerender.taskList = taskList;
        localStorage.setItem('taskList', JSON.stringify(homerender.taskList));
        homerender.renderTaskList();
    },

    beeType: {
        die: 'die', live: 'live'
    },

    getBee: function (type) {
        var key = (type == this.beeType.die) ? 'dieBee' : 'liveBee';
        let count = (localStorage.getItem(key)) ? Number(localStorage.getItem(key)) : 0;
        homerender[key] = count;
        return count;
    },

    setBee: function (type, value) {
        var key = (type == this.beeType.die) ? 'dieBee' : 'liveBee';
        homerender[key] = value;
        localStorage.setItem(key, homerender[key].toString());
        homerender.renderBee();
    },

    renderBee: function () {
        let container = document.getElementById('scoreContainer');
        var dieBee = homerender.getBee(this.beeType.die);
        var liveBee = homerender.getBee(this.beeType.live);
        if (container) {
            container.querySelector('.live-bee-container .bee-value').innerHTML = liveBee;
            container.querySelector('.die-bee-container .bee-value').innerHTML = dieBee;
        }
    },

    renderTaskList: function () {
        let container = document.getElementById('taskListContainer');
        var taskList = homerender.getTaskList();
        var filter = document.getElementById('filterTask');
        var currentFilter = filter.value;
        container.innerHTML = taskList.filter(task => (currentFilter == 'all')
            ? task
            : (task.status == currentFilter)
        ).map((task) => {
            var newItem = (
                `<div class="todo-list-task-item" id="${task.id}" data-status="${task.status}" >
                    <img src="/images/logo.png" class="todo-list-task-icon">
                    <div class="todo-list-info">
                        <input class="input todo-list-name" 
                            value="${task.name}"  
                            onfocus="this.setSelectionRange(this.value.length, this.value.length);"  
                        readonly>
                        <a data-tooltip="Save" class="button save-button is-hidden">
                            <span class="icon">
                                <i class="fal fa-lg fa-save"></i>
                            </span>
                        </a>
                        <a data-tooltip="Edit" class="button edit-button">
                            <span class="icon">
                                <i class="fal fa-lg fa-pen"></i>
                            </span>
                        </a>
                        <a  class="button complete-button">
                            <span class="icon">
                                <i class="fal fa-lg fa-check-circle"></i>
                            </span>
                        </a>
                        <a data-tooltip="Delete" class="button delete-button">
                            <span class="icon">
                                <i class="fal fa-lg fa-trash-alt"></i>
                            </span>
                        </a>
                    </div>
                </div>`
            );


            return newItem;
        }).join('');

        container.onclick = function (event) {

            let item = event.target.closest('.todo-list-task-item');

            if (item) {
                var input = item.querySelector('.input.todo-list-name');
                var saveButton = item.querySelector('.save-button');
                var renameButton = item.querySelector('.edit-button');

                // add event rename 
                if (event.target.closest('.edit-button')) {
                    saveButton.classList.remove('is-hidden');
                    renameButton.classList.add('is-hidden');
                    input.readOnly = false;
                    input.focus();
                }

                // add event save name 
                if (event.target.closest('.save-button')) {
                    if (input.value.trim() == '') {
                        alert('Task name is empty!');
                    } else {
                        saveButton.classList.add('is-hidden');
                        renameButton.classList.remove('is-hidden');
                        input.readOnly = true;
                        homerender.taskList =
                            homerender.taskList.map(task => (task.id == item.id)
                                ? {
                                    id: task.id,
                                    name: input.value.trim(),
                                    status: task.status
                                }
                                : task
                            );
                        homerender.setTaskList(homerender.taskList);
                    }

                }


                //add event complete
                if (event.target.closest('.complete-button') && item.dataset.status != 'finished') {
                    homerender.taskList =
                        homerender.taskList.map(task => (task.id == item.id)
                            ? {
                                id: task.id,
                                name: task.name,
                                status: 'finished'
                            }
                            : task
                        );
                    homerender.setTaskList(homerender.taskList);
                }

                //add event delete
                if (event.target.closest('.delete-button')) {
                    homerender.taskList = homerender.taskList.filter(task => task.id != item.id);
                    homerender.setTaskList(homerender.taskList);
                }
            }

        }

    },

    addEventAddTask: function () {
        var container = document.getElementById('addTaskContainer');
        var input = container.querySelector('.input');
        var button = container.querySelector('.button');
        button.onclick = function () {
            if (input.value.trim() == '') {
                alert('Task name is empty!');
            } else {
                homerender.taskList.push({
                    id: input.value.trim() + new Date().getTime(),
                    name: input.value.trim(),
                    status: 'unfinished',
                });
                input.value = '';
                input.focus();
                homerender.setTaskList(homerender.taskList);
            }
        }
    },

    createInterval: function (maxFocusTime) {
        let start = document.querySelector('.start-button');
        let giveUp = document.querySelector('.give-up-button');

        homerender.maxFocusTime = maxFocusTime;
        homerender.currentFocusTime = homerender.maxFocusTime;
        let tick = 1000;
        homerender.renderCounter();
        if (maxFocusTime == 0) {
            clearInterval(homerender.interval);
        } else {
            homerender.interval = setInterval(function () {
                if (homerender.currentFocusTime < tick) {
                    clearInterval(homerender.interval);

                    start.classList.remove('is-hidden');
                    giveUp.classList.add('is-hidden');
                } else {
                    homerender.currentFocusTime -= tick;
                    homerender.renderCounter();

                    if (homerender.currentFocusTime < homerender.maxFocusTime &&
                        homerender.currentFocusTime % homerender.increaseBeeFocusTime == 0) {
                        homerender.increaseBee();
                    }
                }
            }, 1000);
        }

    },

    increaseBee: function () {
        var live = this.getBee(this.beeType.live);
        this.setBee(this.beeType.live, live + this.increaseBeeCount);
    },
    decreaseBee: function () {
        var die = this.getBee(this.beeType.die);
        this.setBee(this.beeType.die, die + this.decreaseBeeCount);
    },


    renderCounter: function (maxTime) {
        if (maxTime) {
            homerender.maxFocusTime = maxTime;
            homerender.currentFocusTime = homerender.maxFocusTime;
        }
        let counter = document.getElementById('counter');
        let minuteElement = counter.querySelector('.minute');
        let secondElement = counter.querySelector('.second');
        var minute = Math.floor(homerender.currentFocusTime / 1000 / 60);
        var second = homerender.currentFocusTime / 1000 % 60;
        minuteElement.innerHTML = homerender.standardNumber(minute);
        secondElement.innerHTML = homerender.standardNumber(second);
    },

    standardNumber: function (number) {
        return (number < 10) ? '0' + Number(number).toString() : number;
    },

    loadUserName: function () {
        let title = document.querySelector('.todo-list-section .title');
        var userName = localStorage.getItem('username');
        if (userName) {
            title.innerHTML = `${userName.split(' ').at(-1)}'s todo list`;
        }
    },

    addEventStartButton: function () {
        let start = document.querySelector('.start-button');
        let giveUp = document.querySelector('.give-up-button');
        start.onclick = function () {
            start.classList.add('is-hidden');
            giveUp.classList.remove('is-hidden');
            homerender.createInterval((homerender.maxFocusTime == 0) ? 60 * 60 * 1000 : homerender.maxFocusTime);
        }
    },

    addEventGiveUpButton: function () {
        let start = document.querySelector('.start-button');
        let giveUp = document.querySelector('.give-up-button');
        giveUp.onclick = function () {
            start.classList.remove('is-hidden');
            giveUp.classList.add('is-hidden');
            var maxTime = homerender.maxFocusTime;
            homerender.createInterval(0);
            homerender.decreaseBee();
            homerender.renderCounter(maxTime);
        }
    },

    addEventChangeQuote: function () {
        let quoteList = homerender.quoteList;
        let quoteContainer = document.getElementById('quoteMessage');
        quoteContainer.innerHTML = quoteList[0];

        setInterval(function () {
            var currentQuoteIndex = quoteList.indexOf(quoteContainer.innerHTML);
            quoteContainer.innerHTML = (currentQuoteIndex + 1 < quoteList.length)
                ? quoteList[currentQuoteIndex + 1]
                : quoteList[0];
        }, homerender.quoteChangeInterval);

    },
};