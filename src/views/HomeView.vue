<script setup></script>

<template>
  <section id="home" class="home">
    <div class="home__title">
      <h1>
        ЦЕНТР <br />
        НАСТОЛЬНОГО ТЕННИСА <br />
        В ПОДОЛЬСКЕ <br />
        ТОПС <br />
      </h1>
      <hr />
      <div class="home__description">
        <div>Аренда столов, индивидуальные тренировки, помощь в подборе инвентаря.</div>
        <a href="tel:+79258815822" class="link__phone">+7 (925) 881-58-22</a>
      </div>
    </div>
    <div class="container">
      <div class="home__content">
        <div>
          <img src="../assets/img/gallery/1000005272.webp" alt="" />
        </div>
        <div>
          Профессиональное оборудование и инвентарь, эффективные методики, современный зал - все,
          что нужно для хорошей игры.
        </div>
        <div class="last-item">
          <img src="../assets/img/gallery/1000005258.webp" alt="" id="img02" />
        </div>
        <div>
          Учим, развиваем и помогаем наслаждаться настольным теннисом.
        </div>
        <div class="last-item">
          <img src="../assets/img/gallery/1000005270.webp" alt="" id="img03" />
        </div>
        <div class="last-item">
          Столы 25 мм МДФ, профессиональное теннисное покрытие Terraflex 4,5 мм, хорошее освещение.
        </div>
      </div>
      <div class="home__footer">
        Рады Вас видеть ежедневно с 10 до 22 &nbsp;
        <a href="tel:+79258815822" class="link__phone">+7 (925) 881-58-22</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home {
  background-color: var(--color-white);
}

.home__title {
  background:
    linear-gradient(
      180deg,
      rgba(8, 4, 5, 0.65) 0%,
      rgba(8, 4, 5, 0.325) 45.81%,
      rgba(8, 4, 5, 0.65) 100%
    ),
    url(../assets/img/header-background1.webp) center no-repeat;
  background-size: cover;
}

.home__description {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-white);
  font-size: 2.5rem;
  line-height: 4rem;
  padding-top: 3rem;
  padding-bottom: 3rem;
  overflow: hidden;
  text-align: center;
}

.home h1 {
  color: var(--color-white);
}

.home a {
  color: var(--color-white);
}

.home a:hover {
  color: var(--color-light);
}

.home .link__phone::before {
  filter: brightness(0) saturate(100%) invert(99%) sepia(70%) saturate(353%) hue-rotate(232deg)
    brightness(115%) contrast(100%);
  bottom: -3px;
}

.home__content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-flow: row;
  align-items: center;
  justify-items: center;
  gap: 4rem;
  margin-top: 4rem;
  font-size: 2.5rem;
}

.home__content img {
  border-radius: 50%;
  height: 40rem;
  width: 40rem;
}

.home__footer {
  display: flex;
  justify-content: center;
  font-size: 2.5rem;
  padding: 2rem;
  margin-top: 2rem;
  background-color: var(--color-light);
}

.home__footer a {
  color: var(--color-dark);
}

.home__footer a:hover {
  color: var(--color-white);
}

.home__footer .link__phone::before {
  filter: brightness(0) saturate(100%) invert(0%) sepia(3%) saturate(29%) hue-rotate(351deg)
    brightness(89%) contrast(100%);
  top: 0;
}

@media (max-width: 880px) {
  .home__content {
    grid-template-columns: repeat(1, 1fr);
    text-align: center;
  }

  .home__footer {
    flex-direction: column;
    align-items: center;
  }
}
</style>
