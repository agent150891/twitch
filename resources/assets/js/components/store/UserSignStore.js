import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const UserSignStore = new Vuex.Store({
    state: {
        token: false,
        message: "",
        profileData: {
            avatar : null,
            username: null,
            nickname: null,
            email: null,
            bio: null,
        },
        promotedStreamers: {
            list: [],
            loaded: false,
        }
    },
    mutations: {
        signUp(state) {
            state.token = localStorage.getItem("userToken");
        },
        signOut(state) {
            var formData = new FormData();
            formData.append('token', state.token);
            
            fetch('api/auth/logout',
            {
                method: "POST",
                body: formData,
                credentials: 'omit',
                mode: 'cors',
            })
            .then(function(res){
                return res.json();
            })
            .then(function(jsonResp){
                delete localStorage["userToken"];
                state.token = false;
                state.message = jsonResp.message;
            });
        },
        loadProfile(state, id) {
            var formData = new FormData();
            var url = 'api/profile/current';
            if (id > 0) {
                formData.append('id', id);
                url = 'api/profile/get';
            } else {
                formData.append('token', state.token);
            }
            fetch(url,
            {
                method: "POST",
                body: formData,
                credentials: 'omit',
                mode: 'cors',
            })
            .then(function(res){
                return res.json();
            })
            .then(function(jsonResp){
                if (jsonResp.errors && jsonResp.errors[0] == 'Unauthenticated.') {
                    state.token = false;
                } else {
                    state.profileData = jsonResp.data;
                }
            });
        },
        getPromotedList(state) {
            var formData = new FormData();
            state.promotedStreamers.loaded = false;
            formData.append('token', state.token);
            fetch('api/streamers/promoted/list',
            {
                method: "POST",
                body: formData,
                credentials: 'omit',
                mode: 'cors',
            })
            .then(function(res){
                return res.json();
            })
            .then(function(jsonResp){
                if (jsonResp.errors && jsonResp.errors[0] == 'Unauthenticated.') {
                    state.token = false;
                } else {
                    state.promotedStreamers.list = jsonResp.data ? jsonResp.data.promoted : [];
                    state.promotedStreamers.loaded = true;
                }
            });
        },
    },
    actions: {
        
    },
    getters : {
        checkToken: state => {
            return state.token ? true : false;
        },
        profileData: state => {
            return state.profileData;
        },
        promotedStreamers: state => {
            return state.promotedStreamers.list;
        },
        promotedLoaded: state => {
            return state.promotedStreamers.loaded;
        },
    },

});

export default UserSignStore;