<template>
  <q-page class="flex flex-center">
    <div>
      <q-card class="login-card" flat bordered>
        <h3 class="q-ma-lg text-supermarcado-one">
          Cook
          <p class="titleN">N'</p>
          Share
        </h3>
        <q-tabs v-model="tab">
          <q-tab label="Login" name="one" />
          <q-tab label="Register" name="two" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="one">
            <q-input v-model="login.email" type="email" label="Email" />
            <q-input
              v-model="login.password"
              type="password"
              label="Password"
            />

            <q-card-actions align="right">
              <q-btn
                @click="onLogin"
                size="lg"
                type="submit"
                class="q-ma-sm"
                round
                unelevated
                text-color="black"
                color="primary"
                icon="eva-log-in-outline"
              />
            </q-card-actions>
          </q-tab-panel>

          <q-tab-panel name="two">
            <q-input v-model="signup.name" type="text" label="Name" />
            <q-input v-model="signup.email" type="email" label="Email" />
            <q-input
              v-model="signup.password"
              type="password"
              label="Password"
            />
            <q-card-actions align="right">
              <q-btn
                @click="onSignup"
                size="lg"
                type="submit"
                class="q-ma-sm"
                round
                unelevated
                text-color="black"
                color="primary"
                icon="eva-corner-down-right-outline"
              />
            </q-card-actions>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage } from "quasar";
import { colors } from "quasar";
colors.setBrand("light_", "#f8f4f9");

export default {
  name: "AuthPage",
  data() {
    return {
      tab: "one",
      signup: {
        password: "",
        email: "",
        name: ""
      },
      login: {
        password: "",
        email: ""
      }
    };
  },
  beforeMount() {
    if (LocalStorage.getItem("loggedIn")) {
      this.$router.push("/");
    }
  },
  methods: {
    onSignup() {
      console.log("onSignup fired");
      this.$axios
        .post(`${process.env.API}/api/auth/register`, this.signup)
        .then(response => {
          console.log(response.data);
          this.$q.notify({
            color: "green",
            message: response.data.message,
            icon: "arrow_forward"
          });
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",
            message: error.response.data.message,
            icon: "report_problem"
          });
        });
    },
    onLogin() {
      console.log("onLogin fired");
      this.$axios
        .post(`${process.env.API}/api/auth/login`, {
          email: this.login.email,
          password: this.login.password
        })
        .then(response => {
          this.$q.notify({
            color: "green",
            message: response.data.message,
            icon: "arrow_forward"
          });
          console.log(response.data);
          LocalStorage.set("loggedIn", true);
          LocalStorage.set("userId", response.data.userId);
          this.$router.push("/");
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

<style lang="sass" scoped>
/* .bg-image {
 *   background-image: url(../assets/topography.svg);
 *  background-size: contain;
 *  background-color: #f0f4ef;
 *}

.titleN
  margin:0
  padding:0.2em 0.3em
  display: inline-block
  color: black
  background-color: $primary
  border-radius:100%


.login-card
  width: 100%
  border: 1px solid rgba(0, 0, 0, 0.1)
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  padding: 2vh 12vh
  height: 80vh

.q-field, .q-field--standout .q-field__control
  margin-bottom: 10px

@media only screen and (max-width: 700px)
  .login-card
    padding: 2vh

@media only screen and (max-width: 1150px)
  .login-card
    padding: 2vh
</style>
