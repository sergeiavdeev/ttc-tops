<script setup>
import IconArrowDropDown from '@/components/icons/IconArrowDropDown.vue'
import IconAccount from '@/components/icons/IconAccount.vue'
import { useUserStore } from '@/stores/user.js'
import { ref } from 'vue'

const user = useUserStore()
const isShowDropDown = ref(false)

function onClick() {
  if (user.isAuthenticated) {
    isShowDropDown.value = !isShowDropDown.value
  } else {
    user.login();
  }
}

</script>

<template>
  <div class="account-link">
    <a href="#" v-on:click="onClick">
      <IconAccount />
      {{user.isAuthenticated ? user.info.firstName + ' ' + user.info.lastName : 'Войти'}}
      <IconArrowDropDown v-if="user.isAuthenticated" />
    </a>
    <div class="drop-down" v-if="isShowDropDown">
      <ul>
        <li><RouterLink to="/orders">Тренировки</RouterLink></li>
        <li><RouterLink to="">Статистика</RouterLink></li>
        <li><a href="#" v-on:click="user.logout()">Выйти</a></li>
      </ul>
    </div>
  </div>
</template>

<style>
.account-link{
  position: relative;

  & ul {
    color: var(--color-white);
    font-size: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
    padding: 20px
  }
}

.drop-down{
  position: absolute;
  right: 0;
  left: 0;
  background-color: var(--color-dark);
}

.account-link a {
  font-size: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  filter: brightness(0) saturate(100%) invert(99%) sepia(70%) saturate(353%) hue-rotate(232deg)
  brightness(115%) contrast(100%);
  transition: 0.3s all;
}

.account-link a:hover {
  filter: brightness(0) saturate(100%) invert(50%) sepia(24%) saturate(6795%) hue-rotate(171deg) brightness(104%) contrast(97%);
}

svg {
  margin-right: 5px;
  margin-left: 5px;
}

</style>
