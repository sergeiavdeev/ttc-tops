<script setup>
import IconLogo from '@/components/icons/IconLogo.vue'
import { useUserStore } from '@/stores/user.js'
import { onMounted } from 'vue'

const store = useUserStore();

function auth() {
  store.isAuthenticated = true
  store.id = 1
  store.name = 'Sergey'
  store.email = '1@1.ru'
}

onMounted(() => {
  store.isAuthenticated = false;
})

</script>

<template>
  <header>
    <nav class="nav">
      <input type="checkbox" id="menu_open" class="menu_open" />
      <label for="menu_open" class="nav__burger">
        <span></span>
      </label>
      <RouterLink to="/#home">
        <IconLogo />
      </RouterLink>
      <ul class="nav__list">
        <li>
          <RouterLink to="/#home">О нас</RouterLink>
        </li>
        <li>
          <RouterLink to="/#services">Услуги</RouterLink>
        </li>
        <li>
          <RouterLink to="/#contacts">Контакты</RouterLink>
        </li>
      </ul>
      <a class="link__account" href="#" v-on:click="auth()">{{!store.isAuthenticated ? 'Войти' : store.name}}</a>
    </nav>
  </header>
</template>

<style scoped>
header {
  background-color: var(--color-dark);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 73px;
  z-index: 50;
}

.nav {
  background-color: var(--color-dark);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 10px;
}

.nav__list {
  display: flex;
  flex-direction: row;
  gap: 60px;
}

.nav a {
  color: var(--color-white);
  font-size: 2.3rem;
}

.nav a:hover {
  color: var(--color-light);
}
.nav input[type='checkbox'] {
  display: none;
}

.nav__burger {
  display: none;
  height: 16px;
  width: 25px;
  position: relative;
}

.nav span {
  display: block;
  width: 25px;
  height: 2px;
  background-color: var(--color-white);
  position: absolute;
  top: 8px;
}

.nav span::before,
span::after {
  content: '';
  background-color: var(--color-white);
  position: absolute;
  width: 25px;
  height: 2px;
}

.nav span::before {
  top: -8px;
}

.nav span::after {
  top: 8px;
}

@media (max-width: 740px) {
  .nav__list {
    flex-direction: column;
    gap: 30px;
    position: fixed;
    left: -250px;
    top: 67px;
    bottom: 0;
    padding: 20px;
    background-color: var(--color-dark);
  }

  .nav__burger {
    display: block;
  }

  .menu_open:checked ~ .nav__list {
    transition: all 0.4s;
    transform: translateX(250px);
  }

  .menu_open ~ .nav__list {
    transition: all 0.4s;
    transform: translateX(-250px);
  }
}
</style>
