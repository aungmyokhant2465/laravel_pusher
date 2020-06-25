/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import ChatMessages from './components/ChatMessages.vue';
import ChatForm from './components/ChatForm.vue';
import Echo from 'laravel-echo';

const app = new Vue({
    el: '#app',
    components: {
        ChatMessages,
        ChatForm
    },

    data: {
        messages: []
    },

    created() {
        this.fetchMessages();

        // Echo.private('chat')
        // .listen('MessageSent', (e) => {
        //     //console.log("listen event: ", e);
        //     this.messages.push({
        //     message: e.message.message,
        //     user: e.user
        //     });
        // });

        
        window.Echo.join('chat')
            .here((users) => {
                console.log("Users : ",users);
            })
            .joining((user) => {
                console.log("Joining User : ",user.name);
            })
            .leaving((user) => {
                console.log("leave User : ",user.name);
            })
            .listen('MessageSent', (e) => {
                this.messages.push({
                message: e.message.message,
                user: e.user
                });
            })
            .listenForWhisper('typing', (e) => {
                console.log(e.name);
            });

    },

    methods: {
        fetchMessages() {
            axios.get('/messages').then(response => {
                this.messages = response.data;
            });
        },

        addMessage(message) {
            this.messages.push(message);
            console.log("playload in add Message: ",message);
            axios.post('/messages',{message: message.message, user: message.user}).then(response => {
              console.log(response.data);
            })
            .catch(err => {console.log('error from add Message: ', err)});
        },
        tryToSent() {
            window.Echo.join('chat')
                .whisper('typing', {
                    name: 'ok'
                });
        }
    }
});
