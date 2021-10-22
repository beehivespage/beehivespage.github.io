var homerender = {
    quoteList: ['Keep up your work!', 'Stop Phubbing!', 'You can do it!', 'You’re almost there!', 'Please keep feeding me!'],
    totalFocusTime: {},
    quoteChangeInterval: 15 * 1000,
    increaseBeeFocusTime: 30 * 60 * 1000,
    increaseBeeCount: 1,
    decreaseBeeCount: 2,
    maxFocusTime: 60 * 60 * 1000,
    currentFocusTime: 0,
    interval: '',
    taskList: [],
    dieBee: 0,
    liveBee: 0,
    running: false,
    tab: 'beefocus',
    dynamicBeeIntervalTime: 5 * 1000,
    init: function () {
        homerender.addEventChangeQuote();
        homerender.addEventStartButton();
        homerender.addEventCancelButton();
        homerender.addEventLogoutButton();
        homerender.addEventGiveUpButton();
        homerender.loadUserName();
        homerender.renderTaskList();
        homerender.addEventAddTask();
        homerender.addEventFilterTask();
        homerender.renderBee();
        homerender.addEventChooseTimePeriod();
        homerender.addEventChangeTab();
        homerender.addEventCloseWindow();

    },

    addEventCloseWindow: function () {
        window.onbeforeunload = function () {
            if (homerender.running) {
                return 'Do you want to leave the site?';
            }
        }
    },

    addEventLogoutButton: function () {
        var button = document.querySelector('.logout-button');
        button.onclick = function () {
            homerender.logout();
        }
    },
    addEventChangeTab: function () {
        var tabs = document.querySelectorAll('.tabs-container .button[data-tab]');
        var container = document.querySelector('.tabs-container').parentElement;
        tabs.forEach(function (tab) {
            tab.onclick = function () {
                if (container.dataset.tab != tab.dataset.tab) {

                    var isChangeTab = false;

                    if (homerender.tab == 'beefocus' && homerender.running) {
                        isChangeTab = confirm('You will give up if you switch to beebreak!');
                    } else {
                        isChangeTab = true;
                    }
                    if (isChangeTab) {
                        container.querySelector('.give-up-button').click();
                        container.setAttribute('data-tab', tab.dataset.tab);
                        homerender.tab = tab.dataset.tab;
                        homerender.renderCounter(
                            (homerender.maxFocusTime % homerender.increaseBeeFocusTime == 0)
                                ? homerender.maxFocusTime
                                : homerender.increaseBeeFocusTime
                        );
                        tabs.forEach(function (tabItem) {
                            if (tab == tabItem) {
                                tabItem.classList.add('is-primary');
                            } else {
                                tabItem.classList.remove('is-primary');
                            }
                        })
                    }
                }
            }
        })

    },

    addEventChooseTimePeriod: function () {
        var container = document.getElementById('counter');
        var modal = document.getElementById('chooseMaxTimeModal');
        var modal1 = document.getElementById('chooseBreakModal');

        container.onclick = function () {
            if (!homerender.running) {
                if (homerender.tab == 'beefocus') {
                    modal.classList.add('is-active');
                } else {
                    modal1.classList.add('is-active');
                    modal1.querySelector('.minute').focus();
                }
            }
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

        //add event time setting
        var minutes = modal1.querySelector('.minute');
        var second = modal1.querySelector('.second');
        var buttonTimeSetting = modal1.querySelector('.save-time-setting-button');
        buttonTimeSetting.onclick = function () {


            var minutesValue = Number(minutes.value.trim());
            var secondValue = Number(second.value.trim());
            if (minutesValue != '' && secondValue != '' ||
                minutesValue >= 0 && secondValue >= 0 && secondValue <= 59 &&
                !(minutesValue == 0 && secondValue == 0)
            ) {
                var maxTime = (minutesValue * 60 + secondValue) * 1000;
                homerender.renderCounter(maxTime);
                modal1.classList.remove('is-active');

            } else {

                console.log(minutesValue, secondValue);
                alert('Time input invalid!')
            }
        }

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

    getTotalFocusTime: function () {
        var key = 'totalFocusTime';
        let count = (localStorage.hasOwnProperty(key)) ? JSON.parse(localStorage.getItem(key)) : {};
        homerender[key] = count;
        return count;
    },

    increaseTotalFocusTime: function () {
        var value = homerender.increaseBeeFocusTime;
        var key = 'totalFocusTime';
        var totalFocusTime = homerender.getTotalFocusTime();
        var currentDate = shinobi.util.getCurrentDate();
        if (totalFocusTime.hasOwnProperty(currentDate)) {
            totalFocusTime[currentDate] += Number(value);
        } else {
            totalFocusTime[currentDate] = Number(value);
        }

        homerender[key] = totalFocusTime;
        localStorage.setItem(key, JSON.stringify(totalFocusTime));
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

        function addTask() {
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
        var container = document.getElementById('addTaskContainer');
        var input = container.querySelector('.input');
        var button = container.querySelector('.button');
        shinobi.util.addEventEnter(input, addTask)
        button.onclick = addTask;
    },

    playNotification: function () {
        var audio = new Audio('/sound/notification.mp3');
        audio.play();
    },

    createInterval: function (maxFocusTime) {
        var beeCounterContainer = document.querySelector('.bee-counter-container');
        homerender.tab = beeCounterContainer.dataset.tab;
        let start = document.querySelector('.start-button');
        let giveUp = document.querySelector('.give-up-button');

        homerender.maxFocusTime = maxFocusTime;
        homerender.currentFocusTime = homerender.maxFocusTime;
        let tick = 1000;
        homerender.renderCounter();
        if (maxFocusTime == 0) {
            clearInterval(homerender.interval);
            homerender.running = false;
        } else {
            homerender.running = true;
            homerender.playNotification();
            homerender.interval = setInterval(function () {
                if (homerender.currentFocusTime < tick) {
                    homerender.running = false;
                    clearInterval(homerender.interval);
                    start.classList.remove('is-hidden');
                    giveUp.classList.add('is-hidden');
                    if (homerender.tab == 'beefocus') {
                        homerender.successSession();
                    }
                } else {
                    homerender.currentFocusTime -= tick;
                    homerender.renderCounter();
                    if (homerender.currentFocusTime < homerender.maxFocusTime &&
                        homerender.currentFocusTime % homerender.increaseBeeFocusTime == 0 &&
                        homerender.tab == 'beefocus') {
                        homerender.increaseBee();
                    }
                }
            }, 1000);
        }
        homerender.addEventChangeQuote();
    },

    successSession: function () {
        homerender.playNotification();
        homerender.addEventChangeQuote();
        document.querySelector('.button[data-tab="beebreak"]').click();
        var modal = document.getElementsByClassName('success-score-board')[0];
        modal.classList.remove('is-hidden');
        var value = modal.querySelector('.score .value');
        value.innerHTML = homerender.maxFocusTime / homerender.increaseBeeFocusTime;
        var dynamicBee = document.querySelector('.dynamic-bee');
        var button = modal.querySelector('.button');
        button.onclick = function () {
            modal.classList.add('is-hidden');
            dynamicBee.classList.add('is-active');
            clearTimeout(homerender.dynamicBeeInterval);
            homerender.dynamicBeeInterval = setTimeout(function () {
                dynamicBee.classList.remove('is-active');
            }, 5000 * homerender.dynamicBeeIntervalTime);

        }

    },
    increaseBee: function () {
        var live = this.getBee(this.beeType.live);
        this.setBee(this.beeType.live, live + this.increaseBeeCount);
        homerender.increaseTotalFocusTime()
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
        } else {
            homerender.logout();
        }
    },

    logout: function () {
        localStorage.clear();
        window.location.href = '/';
    },

    addEventStartButton: function () {
        let start = document.querySelector('.start-button');
        let cancel = document.querySelector('.cancel-button');
        let giveUp = document.querySelector('.give-up-button');
        start.onclick = function () {

            let cancelInterval = (homerender.tab == 'beefocus') ? 10 * 1000 : 0;
            let cancelCurrentInterval = cancelInterval;
            start.classList.add('is-hidden');
            cancel.classList.remove('is-hidden');
            cancel.innerHTML = `Cancel (${cancelCurrentInterval / 1000})`;
            clearInterval(homerender.cancelInterval);
            clearTimeout(homerender.cancelTimeout);
            homerender.cancelInterval = setInterval(function () {
                if (cancelCurrentInterval == 0) {
                    clearInterval(homerender.cancelInterval);
                } else {
                    cancelCurrentInterval -= 1000;
                    cancel.innerHTML = `Cancel (${cancelCurrentInterval / 1000})`;
                }

            }, 1000);

            homerender.cancelTimeout = setTimeout(function () {
                cancel.classList.add('is-hidden');
                giveUp.classList.remove('is-hidden');
                giveUp.innerHTML = (homerender.tab == 'beefocus') ? 'Give Up' : 'Stop';
            }, cancelInterval);
            homerender.createInterval((homerender.maxFocusTime == 0) ? 60 * 60 * 1000 : homerender.maxFocusTime);
        }
    },

    addEventCancelButton: function () {
        let start = document.querySelector('.start-button');
        let cancel = document.querySelector('.cancel-button');
        let giveUp = document.querySelector('.give-up-button');
        cancel.onclick = function () {
            cancel.classList.add('is-hidden');
            start.classList.remove('is-hidden');
            giveUp.classList.add('is-hidden');
            var maxTime = homerender.maxFocusTime;
            homerender.createInterval(0);
            homerender.renderCounter(maxTime);
            clearInterval(homerender.cancelInterval);
            clearTimeout(homerender.cancelTimeout);
        }
    },

    addEventGiveUpButton: function () {
        let start = document.querySelector('.start-button');
        let giveUp = document.querySelector('.give-up-button');
        let cancel = document.querySelector('.cancel-button');
        giveUp.onclick = function () {

            var maxTime = homerender.maxFocusTime;
            if (homerender.tab == 'beefocus' && homerender.running) {
                var value = confirm('Are you sure to kill me?');
                if (value) {
                    homerender.decreaseBee();
                    homerender.createInterval(0);
                    homerender.renderCounter(maxTime);
                    start.classList.remove('is-hidden');
                    giveUp.classList.add('is-hidden');
                    cancel.classList.add('is-hidden');
                }

            } else {
                homerender.createInterval(0);
                homerender.renderCounter(maxTime);
                start.classList.remove('is-hidden');
                giveUp.classList.add('is-hidden');
                cancel.classList.add('is-hidden');
            }


        }
    },

    renderTotalFocusTime: function (callback) {
        let quoteContainer = document.getElementById('quoteMessage');
        var totalFocusTime = homerender.getTotalFocusTime();
        var currentDate = shinobi.util.getCurrentDate();
        if (!homerender.running) {
            if (totalFocusTime.hasOwnProperty(currentDate)) {
                var totalMinute = totalFocusTime[currentDate] / 1000 / 60;
                var hour = Math.floor(totalMinute / (60));
                var second = (totalMinute - hour * 60);
            } else {
                hour = 0;
                second = 0;
            }

            quoteContainer.innerHTML = `You have focused ${hour} hours ${second} mins today`;
        } else {
            if (callback) {
                callback()
            }
        }
    },



    addEventChangeQuote: function () {
        let quoteList = homerender.quoteList;
        let quoteContainer = document.getElementById('quoteMessage');
        if (homerender.running) {
            quoteContainer.innerHTML = quoteList[0];
        }
        homerender.renderTotalFocusTime();
        clearInterval(homerender.changeQuoteInterval);
        homerender.changeQuoteInterval = setInterval(function () {
            homerender.renderTotalFocusTime(function () {
                var currentQuoteIndex = quoteList.indexOf(quoteContainer.innerHTML);
                quoteContainer.innerHTML = (currentQuoteIndex + 1 < quoteList.length)
                    ? quoteList[currentQuoteIndex + 1]
                    : quoteList[0];
            });

        }, homerender.quoteChangeInterval);

    },
};