<script setup>

</script>

<template>
  <section id="admin-panel">
    <div class="container">
      <nav>
        <ul>
          <li><RouterLink to="/admin/orders" active-class="active">Забронировано</RouterLink></li>
          <li><RouterLink to="/admin/settings" active-class="active">Настройки</RouterLink></li>
        </ul>
      </nav>
    </div>
    <RouterView />
  </section>
</template>

<style scoped>

nav {
  padding-top: 2rem;
}

ul {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

a {
  color: var(--color-dark);
  font-size: 2rem;
  transition: 0.3s ease-in-out;
  padding: 1rem;
}

a.active {
  color: var(--color-light);
  border-bottom: 2px solid var(--color-light);
}

a:hover {
  color: var(--color-light);
}

</style>
