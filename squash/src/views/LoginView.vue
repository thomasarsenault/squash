<script setup lang="ts">

import { ref } from 'vue';

const apiUrl = import.meta.env.STAN_API_URL || '';

const email = ref('');
const password = ref('');
const login = async () => {
    console.log('logging in')
    console.log(email);
    console.log(password);

    const res = await fetch(`${apiUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    if (res.ok) {
        const { session } = await res.json(); // Assuming accessToken is sent back
        const accessToken = session.access_token;

        console.log('got the access token', accessToken);
        localStorage.setItem('accessToken', accessToken); // Store the token
    } else {
        console.error('Login failed');
    }
}
</script>

<template>
  <div class="login-container">
    <div class="login">
      <div class="title">Squash</div>
      <div class="subtitle">A simple task manager</div>
      <div class="login-form">
        <!-- with primevue -->
        <InputText  />
        <InputText v-model="password" placeholder="password" class="login-input" type="password" />
        <Button @click="login">Login</Button>
        <!-- <md-filled-text-field
          label="email"
          class="login-input"
          v-model="email"
        />
        <md-filled-text-field
          label="Password"
          class="login-input"
          type="password"
          v-model="password"
        />
        <md-filled-tonal-button @click="login">Login</md-filled-tonal-button> -->
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login {
  background-color: var(--surface-ground);
  padding: 1rem;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 300px;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
}

.subtitle {
  font-size: 1rem;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-input {
  width: 100%;
}

</style>