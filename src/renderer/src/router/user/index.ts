export default {
  path: '/user',
  children: [{
    path: 'login',
    name: 'Login',
    component: () => import('../../components/user/Login.vue'),
  }, {
    path: 'register',
    name: 'Register',
    component: () => import('../../components/user/Register.vue'),
  }],
}