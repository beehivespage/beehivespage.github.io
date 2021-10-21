var indexrender = {
    init: function () {
        if (localStorage.hasOwnProperty('username')) {
            window.location.href = '/home.html';
        }
        indexrender.addEventInput();
        indexrender.addEventDescription();

    },
    addEventInput: function () {
        let input = document.getElementById('nameInput');
        let description = document.getElementById('descriptionInput');

        shinobi.util.addEventEnter(input, function () {
            console.log(input.value.trim());
            if (input.value.trim() == '') {
                alert('Please enter your name!!!');
            } else {
                window.localStorage.setItem('username', input.value.trim());
                input.parentElement.parentElement.classList.add('is-hidden');
                description.parentElement.parentElement.classList.remove('is-hidden');
                description.focus();
            }
        })
    },
    addEventDescription: function () {
        let input = document.getElementById('descriptionInput');
        shinobi.util.addEventEnter(input, function () {
            console.log(input.value.trim());
            if (input.value.trim() == '') {
                alert('Please enter your goal!!!');
            } else {
                document.body.querySelector('.main-section').classList.add('is-fade-out');
                setTimeout(function () {
                    window.location.href = '/home.html';
                }, 1000);
            }
        })
    },
};