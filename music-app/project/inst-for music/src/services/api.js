import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000'
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const registerUser = (userData) => api.post('/register', userData);
export const loginUser = (credentials) => api.post('/login', credentials);
export const getUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const deleteUserById = (userId) => api.delete(`/users/deleteById/${userId}`);
export const getTracks = () => api.get('/tracks');
export const getTracksByUser = (userId) => api.get(`/tracks/user/${userId}`);
export const getTrackById = (id) => api.get(`/tracks/${id}`);
export const createTrack = (trackData) => api.post('/tracks', trackData);
export const updateTrack = (id, trackData) => api.put(`/tracks/${id}`, trackData);
export const deleteTrack = (id) => api.delete(`/tracks/${id}`);
export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
export const getComments = (trackId) => api.get(`/comments?track_id=${trackId}`);
export const getCommentsByUser = (userId) => api.get(`/comments/user/${userId}`);
export const getCommentById = (id) => api.get(`/comments/${id}`);
export const createComment = (commentData) => api.post('/comments', commentData);
export const updateComment = (id, commentData) => api.put(`/comments/${id}`, commentData);
export const deleteComment = (id) => api.delete(`/comments/${id}`);
export const getLikes = (trackId) => api.get(`/likes?track_id=${trackId}`);
export const getLikeById = (id) => api.get(`/likes/${id}`);
export const createLike = (likeData) => api.post('/likes', likeData);
export const deleteLike = (id) => api.delete(`/likes/${id}`);
export const getUserLike = (trackId, userId) => api.get(`/likes/user/${userId}/track/${trackId}`);
export const getSubscriptions = (userId) => api.get(`/subscriptions?user_id=${userId}`);
export const getSubscriptionById = (id) => api.get(`/subscriptions/${id}`);
export const createSubscription = (subscriptionData) => {
    const userId = Number(localStorage.getItem('user_id'));
    const dataWithUserId = { ...subscriptionData, user_id: userId };
    return api.post('/subscriptions', dataWithUserId);
};
export const deleteSubscription = (id) => api.delete(`/subscriptions/${id}`);
export const getTracksByUserId = (userId) => api.get(`/tracks/user/${userId}`);
