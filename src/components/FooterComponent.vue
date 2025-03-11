<template>
  <footer>
    <div class="footer">
      <div class="container">
        <a href="mailto:admin@avdeev-sa.ru"><b>Avdeev S. A.: </b>admin@avdeev-sa.ru</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-light);
  height: var(--footer-height);
  width: 100%;
  position: fixed;
  bottom: 0;
}

.footer a {
  color: var(--color-dark);
}

.footer a:hover {
  color: var(--color-white);
}
</style>
