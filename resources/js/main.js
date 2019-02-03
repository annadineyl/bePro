var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')) : {
    todo: [],
    completed: []
}

var completeSVG = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 58 58" style="enable-background:new 0 0 58 58;" xml:space="preserve"> <rect class="rect" width="58" height="58"/> <polyline class="checked" style="fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" points="42,20 26,38 16,30 "/></svg>';
var editSVG = '<svg xmlns="http://www.w3.org/2000/svg" height="512px" viewBox="0 0 480 480" width="512px"> <path class="pencil-circle" d="m240 0c-132.546875 0-240 107.453125-240 240s107.453125 240 240 240 240-107.453125 240-240c-.148438-132.484375-107.515625-239.851562-240-240zm0 464c-123.710938 0-224-100.289062-224-224s100.289062-224 224-224 224 100.289062 224 224c-.140625 123.652344-100.347656 223.859375-224 224zm0 0"/> <path class="pencil" d="m341.824219 90.175781c-12.738281-.035156-24.960938 5.027344-33.945313 14.054688l-176.679687 176.707031-33.960938 101.824219 101.824219-33.960938 176.707031-176.679687c13.730469-13.730469 17.835938-34.375 10.40625-52.316406-7.429687-17.9375-24.9375-29.632813-44.351562-29.628907zm-192.335938 195.082031 147.078125-147.082031 45.257813 45.257813-147.082031 147.078125zm-7.816406 14.804688 38.265625 38.265625-57.402344 19.136719zm222.785156-139.261719-11.3125 11.3125-45.265625-45.257812 11.320313-11.3125c12.496093-12.496094 32.757812-12.496094 45.257812 0 12.496094 12.5 12.496094 32.761719 0 45.257812zm0 0"/></svg>';
var removeSVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" width="512px" height="512px"> <g> <g> <path class="fill" d="M256,0C114.51,0,0,114.497,0,256c0,141.49,114.497,256,256,256c141.49,0,256-114.497,256-256C512,114.51,397.503,0,256,0z M256,477.867c-122.337,0-221.867-99.529-221.867-221.867S133.663,34.133,256,34.133S477.867,133.663,477.867,256 S378.337,477.867,256,477.867z"/> </g> </g> <g> <g> <path class="fill" d="M280.136,256l79.986-79.987c6.665-6.664,6.665-17.471,0-24.136c-6.664-6.664-17.471-6.664-24.136,0L256,231.864 l-79.986-79.987c-6.664-6.665-17.469-6.665-24.136,0c-6.665,6.664-6.665,17.471,0,24.136L231.864,256l-79.986,79.987 c-6.665,6.664-6.665,17.471,0,24.136s17.471,6.665,24.136,0L256,280.136l79.986,79.987c6.663,6.664,17.469,6.666,24.136,0 c6.665-6.664,6.665-17.471,0-24.136L280.136,256z"/></g></g></svg>';

renderTodoList();

document.getElementById('add').addEventListener('click', function() {
    var value = document.getElementById('item').value;
    if (value) addTodo(value);
});

document.getElementById('item').addEventListener('keydown', function(e) {
    var value = this.value;
    if (e.code === 'Enter' && value) addTodo(value);
});

function addTodo(value) {
    addTodoToDOM(value);
    document.getElementById('item').value = '';  // Reset the value

    data.todo.push(value);
    dataUpdated();
}

function dataUpdated() {
    localStorage.setItem('todoList', JSON.stringify(data));
}

function renderTodoList() {
    if (!data.todo.length && !data.completed.length) return;

    for (var i = 0; i < data.todo.length; i++) {
        var value = data.todo[i];
        addTodoToDOM(value);
    }

    for (var j = 0; j < data.completed.length; j++) {
        var value = data.completed[j];
        addTodoToDOM(value, true);
    }
}

function editTodo(e) {
    function edit() {
        editButton.classList.add('update');
        editInput.value = itemText;
        itemSpan.classList.add('hide');
        editInput.classList.remove('hide');
        completeButton.classList.add('hide');
        removeButton.classList.add('update');
    }
    
    function update() {
        if (editInput.value) {
            if (id === 'todo') {
                var i = data.todo.indexOf(itemText);
                data.todo[i] = editInput.value;
            } else {
                var i = data.completed.indexOf(itemText);
                data.completed[i] = editInput.value;
            }
            dataUpdated();
    
            editButton.classList.remove('update');
            item.querySelector('span.item-text').innerText = editInput.value;
            editInput.classList.add('hide');
            itemSpan.classList.remove('hide');
            completeButton.classList.remove('hide');
            removeButton.classList.remove('update');
        } else {
            if (id === 'todo') {
                data.todo.splice(data.todo.indexOf(itemText), 1);
            } else {
                data.completed.splice(data.completed.indexOf(itemText), 1);
            }
            dataUpdated();

            list.removeChild(item);
        }
    }
    
    if (e.type === 'keydown') {
        if (e.code === 'Enter') {
            var item = this.parentNode;
            var list = item.parentNode;
            var id = list.id;
            var editInput = item.querySelector('input.edit-input');
            var completeButton = item.querySelector('button.complete');
            var editButton = item.querySelector('.buttons .edit');
            var removeButton = item.querySelector('button.remove');
            var itemSpan = item.querySelector('span.item-text');
            var itemText = itemSpan.innerText;

            update(); 
        }
    }

    if (e.type === 'click') {
        var item = this.parentNode.parentNode;
        var list = item.parentNode;
        var id = list.id;
        var editInput = item.querySelector('input.edit-input');
        var completeButton = item.querySelector('button.complete');
        var editButton = item.querySelector('.buttons .edit');
        var removeButton = item.querySelector('button.remove');
        var itemSpan = item.querySelector('span.item-text');
        var itemText = itemSpan.innerText;

        this.classList.contains('update') ? update() : edit();
    }
}

function removeTodo() {
    var item = this.parentNode.parentNode;
    var list = item.parentNode;
    var id = list.id;
    var value = item.querySelector('.item-text').innerText;

    if (!this.classList.contains('update')) {
        if (id === 'todo') {
            data.todo.splice(data.todo.indexOf(value), 1);
        } else {
            data.completed.splice(data.completed.indexOf(value), 1);
        }
        dataUpdated();

        list.removeChild(item);
    }
}

function completeTodo() {
    var item = this.parentNode;
    var list = item.parentNode;
    var id = list.id;
    var target;
    var value = item.querySelector('.item-text').innerText;

    list.removeChild(item);

    if (id === 'todo') {
        data.todo.splice(data.todo.indexOf(value), 1);
        data.completed.push(value);

        target = document.getElementById('completed');
        target.insertBefore(item, target.childNodes[0]);
    } else {
        data.completed.splice(data.completed.indexOf(value), 1);
        data.todo.unshift(value);

        target = document.getElementById('todo');
        target.appendChild(item);
    }
    dataUpdated();
}

function addTodoToDOM(txt, completed) {
    var list = completed ? document.getElementById('completed') : document.getElementById('todo');

    var item = document.createElement('li');

    var itemText = document.createElement('span');
    itemText.classList.add('item-text');
    itemText.innerText = txt;

    var editInput = document.createElement('input');
    editInput.setAttribute('type', 'text');
    editInput.classList.add('edit-input', 'hide');

    // Complete button
    var complete = document.createElement('button');
    complete.classList.add('complete');
    complete.innerHTML = completeSVG;

    complete.addEventListener('click', completeTodo);

    // Buttons div
    var buttons = document.createElement('div');
    buttons.classList.add('buttons');

    // Edit button
    var edit = document.createElement('button');
    edit.classList.add('edit');
    edit.innerHTML = editSVG;

    edit.addEventListener('click', editTodo);
    editInput.addEventListener('keydown', editTodo);

    // Remove button
    var remove = document.createElement('button');
    remove.classList.add('remove');
    remove.innerHTML = removeSVG;

    remove.addEventListener('click', removeTodo);

    buttons.appendChild(edit);
    buttons.appendChild(remove);
    item.appendChild(itemText);
    item.appendChild(editInput);
    item.appendChild(complete);
    item.appendChild(buttons);

    list.insertBefore(item, list.childNodes[0]);
}