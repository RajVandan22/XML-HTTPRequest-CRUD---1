let cl = console.log;
const BASE_URL = `https://jsonplaceholder.typicode.com`;
const POST_URL = `${BASE_URL}/posts`

//=======================================================================
let $ = function (selector) {
    return document.querySelector(selector);
}
let PostContainer = $("#PostContainer");
let formpostData = $("#postData");
let titleControl = $("#title");
let contentControl = $("#content");
let userIdControl = $("#userId");
let addPostBtn = $("#addPostBtn");
let updateBtn = $("#updateBtn");
let spinner = $('#spinner');
// cl(spinner);


//=======================================================================
function message(msg, err) {
    Swal.fire({
        title: msg,
        icon: err,
        timer: 3000
    });
}
//=======================================================================
function showSpinner() {
    spinner.classList.remove('d-none');
}
function hideSpinner() {
    spinner.classList.add('d-none')
}

//=======================================================================
//1.Read :=
function readPostCard() {
    let xhr = new XMLHttpRequest();

    xhr.open('GET', POST_URL);

    xhr.send(null);
    showSpinner();
    xhr.onload = function () {
        let res = JSON.parse(xhr.response);
        if (xhr.status == 200 && xhr.readyState == 4) {
            createPostCards(res);
        } else {
            message('Something went wrong', 'error')
        }
        hideSpinner();
    }
    xhr.onerror = function () {
        hideSpinner();
    }
}

readPostCard();
//==========================================================================
function createPostCards(arr) {
    let result = '';
    arr.forEach(post => {
        result += `<div class="col-md-3 mt-4" id="${post.id}">
                <div class="card h-100">
                    <div class="card-header">
                        <h4>${post.title}</h4>
                    </div>
                    <div class="card-body">
                        <p>${post.body}</p>
                        <!-- <h5>1</h5> -->
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button type="button" onclick='onEdit(this)' class="btn btn-primary">Edit</button>
                        <button type="button"  onclick='onRemove(this)' class="btn btn-danger" id="removeBtn">Remove</button>
                    </div>
                </div>
            </div>`
    })
    PostContainer.innerHTML = result;
}
//==========================================================================================
//2.Create :=
function createPostCard(eve) {
    eve.preventDefault();
    if (titleControl.value == '' || contentControl.value == '' || userIdControl.value == '') {
        message('pleaze fill all field');
        return;

    } else {
        let postObj = {
            title: titleControl.value,
            body: contentControl.value,
            userId: userIdControl.value,
        }
        let xhr = new XMLHttpRequest();
        showSpinner();
        xhr.open("POST", POST_URL);

        xhr.send(JSON.stringify(postObj));

        xhr.onload = function () {
            let res = xhr.response;
            cl(res);
            if (xhr.status == 201 && xhr.readyState == 4) {

                let div = document.createElement('div');
                div.classList.add('col-md-3', 'mt-4');
                div.id = res.id;
                div.innerHTML = `<div class="card h-100">
                    <div class="card-header">
                        <h4>${postObj.title}</h4>
                    </div>
                    <div class="card-body">
                        <p>${postObj.body}</p>
                        <!-- <h5>1</h5> -->
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button type="button" onclick='onEdit(this)' class="btn btn-primary">Edit</button>
                        <button type="button"  onclick='onRemove(this)' class="btn btn-danger" id="removeBtn">Remove</button>
                    </div>
                </div>`
                PostContainer.prepend(div);
                message('Post Added Successfully', 'success')
                formpostData.reset();

            } else {
                message('Something went wrong', 'error')
            }
            hideSpinner();
            xhr.onerror = function () {
                hideSpinner();
            }
        }
    }
}
    //===========================================================================================
    //3.Edit :=
    function onEdit(ele) {
        cl('click');
        let card = ele.closest('.col-md-3')
        card.querySelector('#removeBtn').disabled = true;

        let editedID = ele.closest(".col-md-3").id;
        localStorage.setItem('editId', editedID)

        const SINGLE_POST_URL = `${BASE_URL}/posts/${editedID}`

        let xhr = new XMLHttpRequest();
        showSpinner();

        xhr.open('GET', SINGLE_POST_URL);

        xhr.send(null);

        xhr.onload = function () {
            let res = JSON.parse(xhr.response);
            if (xhr.status == 200 && xhr.readyState == 4) {
                titleControl.value = res.title;
                contentControl.value = res.body;
                userIdControl.value = res.userId;
                addPostBtn.classList.add('d-none');
                updateBtn.classList.remove('d-none');
            } else {
                message('Something went wrong', 'error')
            }
            hideSpinner();
        }
        xhr.onerror = function () {
            hideSpinner();
        }
    }

//==========================================================================
//4.Update:=
function onUpdate() {

    let updateId = localStorage.getItem('editId');

    localStorage.removeItem('editId');

    const UPDATE_URL = `${BASE_URL}/posts/${updateId}`;

    let postObj = {
        title: titleControl.value,
        body: contentControl.value,
        userId: userIdControl.value,
    }

    let xhr = new XMLHttpRequest();
    showSpinner();

    xhr.open('PUT', UPDATE_URL);

    xhr.send(JSON.stringify(postObj));

    xhr.onload = function () {
        let res = xhr.response;
        if (xhr.status == 200 && xhr.readyState == 4) {
            let div = document.getElementById(updateId);
            let h4 = div.querySelector('.card-header h4');
            let p = div.querySelector('.card-body p');
            h4.innerHTML = postObj.title;
            p.innerHTML = postObj.body;
            addPostBtn.classList.remove('d-none');
            updateBtn.classList.add('d-none');
            formpostData.reset();
            message('Post Updated Successfully!!!', 'success');
        } else {
            message('Something went wrong', 'error');
        }
        hideSpinner();
        let card = document.getElementById(updateId);
        card.querySelector('#removeBtn').disabled = false;
        xhr.onerror = function () {
            hideSpinner();
        }
    }
}
//==============================================================================
//Delete := 
function onRemove(ele) {
    let removeId = ele.closest('.col-md-3').id;

    const DELETE_URL = `${BASE_URL}/posts/${removeId}`;
    let xhr = new XMLHttpRequest();
    showSpinner();
    xhr.open('DELETE', DELETE_URL);
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status == 200) {
            ele.closest('.col-md-3').remove();
            message('Postdata Deleted Successfully!!!', 'success');
        } else {
            message('Something went wrong', 'error');
        }
        hideSpinner();
    }
    xhr.onerror = function () {
        hideSpinner();
    }
}
//===============================================================================
formpostData.addEventListener('submit', createPostCard);
updateBtn.addEventListener('click', onUpdate);