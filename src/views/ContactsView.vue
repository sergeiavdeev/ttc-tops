<script setup></script>

<template>
  <section id="contacts">
    <div class="contacts">
      <h2>Контакты</h2>
      <div class="container">
        <div class="contacts__title">
          <a class="link__location" href="tel:+79258815822"
            ><b>Адрес: </b>г. Подольск, улица Клемента Готвальда, 6В (второй этаж, помещение 4)</a
          >
          <a class="link__phone" href="tel:+79258815822"><b>Телефон: </b>+7 (925) 881-58-22</a>
          <a class="link__mail" href="mailto:lucky1974@mail.ru"><b>E-mail: </b>lucky1974@mail.ru</a>
        </div>

        <div class="contacts__map">
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor%3A0e01f45cf3af7fb545b0ccef5df1193dd310d9774925f0349421a786fa87854f&amp;source=constructor"
            width="100%"
            height="100%"
            loading="lazy"
            title="Местоположение на Яндекс карте"
          >
          </iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contacts a {
  color: var(--color-dark);
}

.contacts__title {
  display: flex;
  flex-direction: column;
  font-size: 2.2rem;
  line-height: 5rem;
  padding: 2rem 0 2rem 0;
}

.contacts__map {
  height: 700px;

  @media (max-width: 740px) {
    height: 550px;
  }

  @media (max-width: 400px) {
    height: 350px;
  }
}
</style>
