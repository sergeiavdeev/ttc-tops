<script setup>
import ContactLink from '@/components/links/ContactLink.vue'
</script>

<template>
  <section id="contacts">
    <div class="contacts">
      <h2>Контакты</h2>
      <div class="container">
        <div class="contacts__title">

          <ContactLink
            text="г. Подольск, улица Клемента Готвальда, 6В (второй этаж, помещение 4)"
            img="location"
            href="#contacts"
          />
          <ContactLink text="+7 (925) 881-58-22" img="phone" href="tel:+79258815822" />
          <ContactLink text="lucky1974@mail.ru" img="mail" href="mailto:lucky1974@mail.ru" />
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
a {
  transition: 0.3s all;
  filter: brightness(0) saturate(100%) invert(2%) sepia(3%) saturate(7404%) hue-rotate(257deg) brightness(100%) contrast(100%);
}

a:hover {
  filter: brightness(0) saturate(100%) invert(50%) sepia(24%) saturate(6795%) hue-rotate(171deg) brightness(104%) contrast(97%);
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
