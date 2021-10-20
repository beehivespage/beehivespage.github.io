var indexrender = {
    init: function () {
        indexrender.addEventInput();
    },
    addEventInput: function () {
        let input = document.getElementById('nameInput');
        shinobi.util.addEventEnter(input, function () {
            console.log(input.value.trim());
            if (input.value.trim() == '') {
                alert('Please enter your name!!!');
            } else {
                window.localStorage.setItem('username', input.value.trim());
                window.location.href = '/home.html';
            }
        })
    },
};