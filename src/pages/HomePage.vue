<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <template v-if="!loadingPosts && posts.length">
          <q-card
            v-for="post in posts"
            :key="post.id"
            class="my-card q-mb-md"
            flat
            bordered
          >
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img src="../assets/picioare.jpg" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-bold">liviuiosim</q-item-label>
                <q-item-label caption>{{ post.location }} </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <img :src="post.imageUrl" />

            <q-card-section>
              <div>{{ post.caption }}</div>
              <div class="text-caption text-grey">
                {{ post.date | niceDate }}
              </div>
              <q-btn
                @click="onPostClick(post)"
                class="col-4  deleteSection"
                type="submit"
                color="primary"
                size="24px"
                flat
                >See Recipe</q-btn
              >
            </q-card-section>
          </q-card>
        </template>
        <template v-else-if="!loadingPosts && !posts.length">
          <h5 class="text-center text-grey">
            No posts yet
          </h5>
        </template>
        <template v-else>
          <q-card flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-skeleton type="QAvatar" animation="fade" size="40px" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton height="200px" square animation="fade" />

            <q-card-section>
              <q-skeleton type="text" class="text-subtitle2" animation="fade" />
              <q-skeleton
                type="text"
                width="50%"
                class="text-subtitle2"
                animation="fade"
              />
            </q-card-section>
          </q-card>
        </template>
      </div>
      <div class="col-4 large-screen-only">
        <q-item class="fixed">
          <q-item-section avatar>
            <q-avatar size="48px">
              <img src="../assets/picioare.jpg" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">liviuiosim</q-item-label>
            <q-item-label caption>Liviu Iosim </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
    <q-dialog v-model="dialog">
      <q-card style="border-radius:25px">
        <q-card-section class="row">
          <div class="q-pr-lg text-h6">
            {{ selectedPostInfo.caption }}
          </div>
          <q-space />
          <q-btn v-close-popup dense flat rounded icon="close" />
        </q-card-section>
        <q-card-section>
          <div v-html="selectedPostInfo.recipe"></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { LocalStorage } from "quasar";
import { date } from "quasar";

export default {
  name: "HomePage",
  data() {
    return {
      dialog: false,
      posts: [],
      loadingPosts: false,
      selectedPostInfo: {}
    };
  },
  methods: {
    onPostClick(p) {
      this.dialog = true;
      this.selectedPostInfo = this.posts.find(post => post.id === p.id);
      console.log(this.selectedPostInfo);
    },
    getPosts() {
      console.log("logged in user id: " + LocalStorage.getItem("userId"));
      this.loadingPosts = true;
      this.$axios
        .get(`${process.env.API}/api/posts`)
        .then(response => {
          this.posts = response.data;
          this.loadingPosts = false;
        })
        .catch(err => {
          this.$q.dialog({
            title: "Error",
            message: "Could not download posts."
          });
          this.loadingPosts = false;
        });
    }
  },
  filters: {
    niceDate(value) {
      return date.formatDate(value, "MMMM D h:mmA");
    }
  },
  created() {
    this.getPosts();
  },
  beforeMount() {
    if (!LocalStorage.getItem("loggedIn")) {
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="sass">
.card-post
  .q-img
    min-height: 200px
</style>
