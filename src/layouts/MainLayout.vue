<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-grey-10" bordered>
      <q-toolbar class="constrain">
        <q-btn
          class="large-screen-only q-mr-sm"
          icon="eva-camera-outline"
          size="18px"
          to="/recipe"
          dense
          flat
          round
        />
        <q-separator class="large-screen-only" vertical spaced />
        <q-toolbar-title class="text-grand-hotel text-bold">
          CookN'Share
        </q-toolbar-title>
        <q-btn
          @click="logout()"
          class="large-screen-only"
          icon="eva-log-out-outline"
          size="18px"
          dense
          flat
          round
        />
        <q-btn
          class="large-screen-only"
          icon="eva-home-outline"
          size="18px"
          to="/"
          dense
          flat
          round
        />
      </q-toolbar>
    </q-header>
    <q-footer class="bg-white small-screen-only" bordered>
      <q-tabs
        class="text-grey-10"
        active-color="primary"
        indicator-color="transparent"
      >
        <q-route-tab to="/" icon="eva-home-outline" />
        <q-route-tab to="/recipe" icon="eva-camera-outline" />
      </q-tabs>
    </q-footer>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { LocalStorage } from "quasar";
export default {
  name: "MainLayout",
  data() {
    return {};
  },
  methods: {
    logout() {
      this.$axios
        .get(`${process.env.API}/api/auth/logout`)
        .then(response => {
          this.$q.notify({
            color: "green",
            message: response.data.message,
            icon: "arrow_forward"
          });

          LocalStorage.set("loggedIn", false);
          this.$router.push("/login");
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",

            message: error.response.data.message,
            icon: "report_problem"
          });
        });
    }
  }
};
</script>

<style lang="sass">
.q-toolbar
  @media (min-width: $breakpoint-sm-min)
    height: 77px
.q-toolbar__title
  font-size: 30px
  @media (max-width: $breakpoint-xs-max)
    text-align: center

.q-footer
  .q-tab__icon
    font-size: 30px
</style>
