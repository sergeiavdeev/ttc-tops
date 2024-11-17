<script setup>

import { useRouter } from 'vue-router'
import RentIcon from '@/components/icons/RentIcon.vue'
import SparringIcon from '@/components/icons/SparringIcon.vue'
//import TournamentIcon from '@/components/icons/TournamentIcon.vue'
const router = useRouter();
</script>

<template>
  <section id="services">
    <div class="services">
      <h2>Услуги</h2>
      <div class="container">
        <div class="services__content">
          <div class="services__item" v-on:click="router.push('/rent')">
            <figure>
              <RentIcon />
              <figcaption><RouterLink to="/rent">Аренда</RouterLink></figcaption>
            </figure>
          </div>
          <div class="services__item" v-on:click="router.push('/sparring')">
            <figure>
              <SparringIcon />
              <figcaption><RouterLink to="/sparring">Тренировки</RouterLink></figcaption>
            </figure>
          </div>
<!--          <div class="services__item">
            <figure>
              <TournamentIcon />
              <figcaption><a href="#">Турниры</a></figcaption>
            </figure>
          </div>-->
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services h2 {
  text-align: center;
}

.services__content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding-top: 2rem;

  @media (max-width: 880px) {
    flex-direction: column;
    align-items: center;
  }
}

.services__item {
  margin: 4rem;
}

.services__item figure {
  height: 32rem;
  width: 32rem;
  padding: 50px;
  border-radius: 50%;
  border: 5px solid var(--color-dark);
  background-color: rgba(3, 165, 244, 1);
  transition: all 0.3s ease-in-out;
}

.services__item figure:hover {
  background-color: rgba(3, 165, 244, 0.7);
  cursor: pointer;
}

.services__item figure:hover > svg {
  fill: white;
  color: rgba(3, 165, 244, 0.7);
}

.services__item figcaption {
  text-align: center;
  padding-top: 8rem;
  font-size: 2rem;
}

.services__item svg {
  fill: var(--color-white);
  stroke: var(--color-white);
  transition: all 0.3s ease-in-out;
}

.services__item svg:hover {
  fill: white;
}

.services__item a {
  color: var(--color-dark);
}

@media (max-width: 400px) {
  .services__item figure {
    height: 40rem;
    width: 40rem;
  }

  .services__item figcaption {
    padding-top: 10rem;
  }
}
</style>
