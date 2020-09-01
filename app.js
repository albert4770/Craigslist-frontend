const baseUrl = 'https://strangers-things.herokuapp.com/api/2006-CPU-RM-WEB-PT';

let state = {
    token: '',
    isLogged: false,
    posts: [],
    messages: [],
    currentPost: ''
}

const renderHeader = () => {
    if (state.isLogged) {
        $('#login, #signup').addClass('disabled'); 
        $('#create, #logout, #messages').removeClass('disabled'); 
    } else {
        $('#login, #signup').removeClass('disabled'); 
        $('#create, #logout, #messages').addClass('disabled'); 
        $('#message-parent').addClass('disabled');
        $('#create-comp').addClass('disabled');

    }
}

const createPostElem = (post) => {
    let postElem = $(`
    <div class='post'>
        <div>User: ${post.author.username}</div>
        <div>Title: ${post.title}</div>
        <div>Description: ${post.description}</div>
        <div>Price: ${post.price}</div>
        <div>Location: ${post.location}</div>
        <div>Delivery: ${post.willDeliver}</div>
        <div>Last Update: ${post.updatedAt}</div>
        ${post.isAuthor ? `<span><button id='delete-post'>Delete</button></span>` : ''}
        ${post.isAuthor ? `<span><button id='edit-post'>Edit</button></span>` : ''}
        ${state.isLogged && !post.isAuthor ? `<span><button id='create-message'>Message</button></span>` : ''}
    </div>`);

    postElem.data('post', post);
    return postElem;
}

const renderPosts = () => {
    $('#all-posts').empty();
    state.posts.forEach(post => {
        // console.log(post);
        let postElem = createPostElem(post);
        $('#all-posts').prepend(postElem);
    })
}

const createMessageElem = (message) => {
    let messageElem = $(`
    <div id='message'>
        <p>Post Title: ${message.post.title}</p>
        <p>From: ${message.fromUser.username}</p>
        <p>Message: ${message.content}</p>
    </div>`);

    return messageElem;
}

const renderMessages = () => {
    $('#messages-list').empty();
    state.messages.forEach( message => {
        console.log(message);
        let messageElem = createMessageElem(message);
        $('#messages-list').prepend(messageElem);
    })
}

const createMessageForm = () => {
    let messageForm = $(`
        <form>
            <textarea type="text" name="content" id="message-content" placeholder="Enter your comment"></textarea>
            <button id="post-message">Submit message</button>
            <button id="cancel-message">Cancel message</button>
        </form>`);
    return messageForm;
}

const createEditForm = (post) => {
    let editFormElem = $(`
        <form id="edit-form">
            <p>Edit Post!</p>
            <input type="text" name="" id="edit-title" placeholder="Title" required>
            <input type="text" name="" id="edit-desc" placeholder="Description" required>
            <input type="text" name="" id="edit-price" placeholder="Price" required>
            <input type="text" name="" id="edit-location" placeholder="Location">
            <input type="checkbox" name="delivery" id="edit-delivery"><span><label for="delivery">Will Deliver?</label></span>
            <button id="edit-submit">Edit Post</button>
            <button type="submit" id="cancel-edit">Cancel Edit</button>
        </form>`)
    return editFormElem; 
}

const fetchAllPosts = async () => {
    let url = `${baseUrl}/posts`

    try {
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${state.token}`
            } 
        });
        let obj = await response.json();
        state.posts = await obj.data.posts;
        // console.log(state.posts);
        renderPosts();
    } catch (error) {
        console.log(error);
    }
}

const signUp = async (user, pass) => {
    let url = `${baseUrl}/users/register`;
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: {
                    username: user,
                    password: pass
                }
            })
        }); 
        let obj = await response.json();
        return obj;
    } catch (error) {
        console.log(error);
    }
}

const logIn = async (user, pass) => {
    let url = `${baseUrl}/users/login`;
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: {
                    username: user,
                    password: pass
                }
            })
        }); 
        let obj = await response.json();
        return obj;
    } catch (error) {
        console.log(error);
    }
}

const createPost = async (post) => {
    console.log(post);
    let url = `${baseUrl}/posts`;
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            }, 
            body: JSON.stringify({post})
        });
        let obj = await response.json();
        return obj;

    } catch (error) {
        console.log(error);
    }
}

const deletePost = async (postId) => {
    let url = `${baseUrl}/posts/${postId}`;

    try {
        let response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${state.token}`
            }
        });
        let obj = await response.json();
        return obj;

    } catch (error) {
        console.log(error);
    }
}

const fetchMessages = async () => {
    let url = `${baseUrl}/users/me`;

    try {
        let response = await fetch(url, {
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${state.token}`
            },
        });

        let obj = await response.json();
        state.messages = obj.messages;
        // console.log(state.messages);

    } catch(error) {
        console.log(error);
    }
}

const createMessage = async (postId, content) => {
    let url = `${baseUrl}/posts/${postId}/messages`;

    try {   
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify({message: {
                content: content
            }})
        });

        let obj = await response.json();
        return obj;
    } catch(error) {
        console.log(error);
    }
}

const editPost = async (postId, post) => {
    let url = `${baseUrl}/posts/${postId}`;

    try {
        let response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify({post: post})
        });

        let obj = await response.json();
        return obj
    } catch(error) {
        console.log(error);
    }
}

const validatePass = (pass) => {
    if (pass.length < 8) {
        alert('Password too short!')
    } else return true;
}

$('#signup').click( () => {
    $('#login-comp').addClass('disabled'); 
    $('#signup-comp').removeClass('disabled'); 
}); 

$('#login').click( () => {
    $('#signup-comp').addClass('disabled'); 
    if (localStorage.getItem('token')) {
        state.token = JSON.parse(localStorage.getItem('token'));
        state.isLogged = true; 
        alert('You have logged in from local storage!');
        $('#login-comp').addClass('disabled');
        renderHeader();
        fetchAllPosts();
        fetchMessages();
        return;
    }

    $('#login-comp').removeClass('disabled'); 
});

$('#logout').click( event => {
    state.token = '';
    state.isLogged = false;
    renderHeader();
    fetchAllPosts();
});

$('#messages').click( () => {
    $('#message-parent').removeClass('disabled');
    $('#create-comp').addClass('disabled'); 
    fetchMessages().then( obj => {
        renderMessages();
    });
});

$('#hide-messages').click( () => {
    $('#message-parent').addClass('disabled');
});

$('#login-submit').click( event => {
    event.preventDefault();
    
    let user = $('#username-li').val();
    let pass = $('#password-li').val();

    logIn(user, pass).then( obj => {
        if (obj.success) {
            localStorage.setItem('token', JSON.stringify(obj.data.token));
            state.token = obj.data.token; 
            state.isLogged = true; 
            alert('You have successfully logged in!')
            $('#login-comp').addClass('disabled');
            renderHeader();
            fetchAllPosts();
            fetchMessages();
        }
    });
    $('#login-comp form').trigger('reset');
});

$('#signup-submit').click( event => {
    event.preventDefault();
    let user = $('#username-su').val();
    let pass = $('#password-su').val();

    let validPass = validatePass(pass);

    if (validPass) {
        signUp(user, pass).then( obj => {
            if (obj.success) {
                state.token = obj.data.token;
                state.isLogged = true; 
                alert('You have successfully signed up, you will be logged in automatically!')
                $('#signup-comp').addClass('disabled');
                renderHeader();
                fetchAllPosts();
            }
        }); 
    }
    $('#signup-comp form').trigger('reset');
});

$('#create').click( () => {
    $('#create-comp').removeClass('disabled'); 
    $('#message-parent').addClass('disabled'); 

    console.log('Create post');
});

$('#create-submit').click( (event) => {
    event.preventDefault();
    console.log('Create sub');

    let title = $('#post-title').val();
    let description = $('#post-desc').val();
    let price = $('#post-price').val();
    let location = $('#post-location').val();
    let willDeliver;
    $('#edit-delivery').is(':checked') ? willDeliver = true : willDeliver = false;

    let post = {title, description, price, location, willDeliver}

    createPost(post).then( obj => {
        if (obj.success) {
            state.posts.push(obj.data.post);
            renderPosts();
        }
    });

    $('#create-comp form').trigger('reset');
});

$('#cancel-create').click( () => {
    $('#create-comp').addClass('disabled'); 
});

$('#all-posts').on('click', '#delete-post', function(event) {
    let postElem = $(this).closest('.post');
    let data = postElem.data('post');
    let postId = data._id;

    deletePost(postId).then( obj => {
        console.log(obj);
        if (obj.success) {
            fetchAllPosts();
        }
    });
});

$('#all-posts').on('click', '#create-message', function() {
    console.log('Clicked create Message ');

    let postElem = $(this).closest('.post');
    let messageForm = createMessageForm();
    $(postElem).append(messageForm);

    $(this).addClass('disabled');

});

$('#all-posts').on('click', '#post-message', function(event) {
    event.preventDefault();
    let postElem = $(this).closest('.post');
    let postData = $(postElem).data('post');
    console.log(postData._id);

    let message = $(postElem).find('#message-content').val();
    console.log(message);
    
    createMessage(postData._id, message).then( obj => {
        if (obj.success) {
            console.log(obj);
            $(this).closest('.post').find('#create-message').removeClass('disabled');
            $(this).closest('form').addClass('disabled');

        } else {
            console.log(obj);
            alert('Please enter a valid comment')
        }
    });

});

$('#all-posts').on('click', '#cancel-message', function(event) {
    event.preventDefault();
    console.log('SUUUP');

    $(this).closest('.post').find('#create-message').removeClass('disabled');
    $(this).closest('form').addClass('disabled');
});


$('#all-posts').on('click', '#edit-post', function() {
    let postElem = $(this).closest('.post');
    state.currentPost = $(postElem).data('post');
    let editFormElem = createEditForm(state.currentPost);

    // console.log(state.currentPost);

    let editButton = this;
    let deleteButton = $(postElem).find('#delete-post');

    $(editButton).addClass('disabled');
    $(deleteButton).addClass('disabled');

    $(postElem).append(editFormElem)
    $('#edit-title').val(state.currentPost.title);
    $('#edit-desc').val(state.currentPost.description);
    $('#edit-price').val(state.currentPost.price);
    $('#edit-location').val(state.currentPost.location);
    $('#edit-delivery').val(state.currentPost.willDeliver);
});

$('#all-posts').on('click', '#edit-submit', function(event) {
    event.preventDefault();
    let postData = $(this).closest('.post').data('post');

    let title = $('#edit-title').val();
    let description = $('#edit-desc').val();
    let price = $('#edit-price').val();
    let location = $('#edit-location').val();
    let willDeliver;
    $('#edit-delivery').is(':checked') ? willDeliver = true : willDeliver = false;

    let post = {title, description, price, location, willDeliver};

    editPost(postData._id, post).then(obj => {
        if (obj.success) {
            console.log(obj);
            console.log('post edited');
            fetchAllPosts();
        }
    });
}); 

$('#all-posts').on('click', '#cancel-edit', function(event) {
    event.preventDefault();
    
    let editButton = $(this).closest('.post').find('#edit-post');
    let deleteButton = $(this).closest('.post').find('#delete-post');
    
    $(editButton).removeClass('disabled');
    $(deleteButton).removeClass('disabled');
    $('#edit-form').remove();
});

fetchAllPosts();

// Albert477033
// wfj23r#4twejif