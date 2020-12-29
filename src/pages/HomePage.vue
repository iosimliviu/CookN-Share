<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <div class="q-mb-md">
          <q-btn-dropdown
            menu-anchor="bottom end"
            outline
            label="Sort by"
            dropdown-icon="eva-arrow-down-outline"
          >
            <q-list>
              <q-item clickable v-close-popup @click="getPosts">
                <q-item-section>
                  <q-item-label>Date added, newest</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="getPostsByLocation">
                <q-item-section>
                  <q-item-label>Location, A to Z</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
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
                <q-avatar
                  v-if="post.userId === loggedInUser.id"
                  color="primary"
                  text-color="black"
                  icon="eva-person-outline"
                />
                <q-avatar
                  v-else
                  color="grey-3"
                  text-color="black"
                  icon="eva-person-outline"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-bold">
                  {{ getUserById(post.userId).name }}
                </q-item-label>
                <q-item-label caption>{{ post.location }} </q-item-label>
              </q-item-section>
              <q-space />
              <q-btn
                v-if="isUsersPost(post)"
                @click="onDeleteClick(post)"
                class="q-pa-sml"
                color="negative"
                dense
                flat
                rounded
                icon="eva-trash-2-outline"
              />
              <q-btn
                v-if="isUsersPost(post)"
                @click="onUpdateClick(post)"
                class="q-pa-sml"
                dense
                flat
                rounded
                icon="eva-edit-outline"
              />
            </q-item>

            <q-separator />

            <img :src="post.imageUrl" />

            <q-card-section>
              <q-item-label class="text-bold">{{
                isUsersPost(post)
              }}</q-item-label>
              <div>{{ post.caption }}</div>
              <div class="text-caption text-grey">
                {{ post.date | niceDate }}
              </div>
              <q-btn
                @click="onRecipeClick(post)"
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
            <q-avatar
              size="48px"
              color="primary"
              text-color="black"
              icon="eva-person-outline"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">{{
              loggedInUser.name
            }}</q-item-label>
            <q-item-label caption>{{ loggedInUser.email }}</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
    <q-dialog v-model="dialogRecipe">
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

    <q-dialog v-model="dialogDelete">
      <q-card style="border-radius:25px">
        <q-card-section class="row">
          <div class="q-pr-lg text-h6">
            Delete post
          </div>
          <q-space />
          <q-btn v-close-popup dense flat rounded icon="close" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          Are you sure you want to delete this post?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            @click="deletePost(selectedPostInfo.id)"
            type="submit"
            flat
            label="DELETE"
            color="primary"
            size="lg"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogUpdate">
      <q-card class="feedbackDialog">
        <q-card-section class="row">
          <div class="q-pr-lg text-h6">
            Edit post
          </div>
          <q-space />
          <q-btn v-close-popup dense flat rounded icon="close" />
        </q-card-section>
        <form>
          <q-card-section class="q-pa-lg">
            <div class="row q-mb-lg">
              <q-input
                v-model="selectedPostInfo.caption"
                label="Caption"
                class="col"
                clearable
              />
            </div>
            <div class="row q-mb-lg">
              <q-input
                v-model="selectedPostInfo.location"
                label="Location"
                class="col"
                clearable
              />
            </div>
            <div class="row q-mb-lg">
              <q-input
                v-model="selectedPostInfo.recipe"
                label="Recipe"
                class="col"
                clearable
              />
            </div>
          </q-card-section>
          <div class="q-pa-lg">
            <q-btn
              color="primary"
              label="Save"
              @click="updatePost(selectedPostInfo.id)"
              type="submit"
            />
          </div>
        </form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { LocalStorage } from "quasar";
import { date } from "quasar";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "HomePage",
  data() {
    return {
      dialogRecipe: false,
      dialogDelete: false,
      dialogUpdate: false,
      posts: [],
      loadingPosts: false,
      selectedPostInfo: {},
      loggedInUser: {}
    };
  },
  computed: {
    ...mapGetters(["getUsers", "getUserById"])
  },
  methods: {
    puladecal() {
      return this.getUserById("LKt86Icm0FfGs8SqqjGcFonf0Om1");
    },
    onUpdateClick(p) {
      this.dialogUpdate = true;
      this.selectedPostInfo = this.posts.find(post => post.id === p.id);
      console.log(this.selectedPostInfo);
    },
    updatePost(postId) {
      this.loadingPosts = true;
      this.$axios
        .put(`${process.env.API}/api/posts/${this.selectedPostInfo.id}`, {
          caption: this.selectedPostInfo.caption,
          location: this.selectedPostInfo.location,
          recipe: this.selectedPostInfo.recipe
        })
        .then(response => {
          this.$q.dialog({
            title: "Ok",
            message: "Post updated"
          });
          this.loadingPosts = false;
          this.getPosts();
        })
        .catch(err => {
          this.$q.dialog({
            title: "Error",
            message: "Could not download posts."
          });
          this.loadingPosts = false;
        });
    },
    onDeleteClick(p) {
      this.dialogDelete = true;
      this.selectedPostInfo = this.posts.find(post => post.id === p.id);
      console.log(this.selectedPostInfo);
    },
    deletePost(postId) {
      this.loadingPosts = true;
      this.$axios
        .delete(`${process.env.API}/api/posts/${this.selectedPostInfo.id}`)
        .then(response => {
          this.$q.dialog({
            title: "Ok",
            message: "Post deleted"
          });
          this.loadingPosts = false;
          this.getPosts();
        })
        .catch(err => {
          this.$q.dialog({
            title: "Error",
            message: "Could not download posts."
          });
          this.loadingPosts = false;
        });
    },
    isUsersPost(post) {
      if (post.userId === LocalStorage.getItem("userId")) return true;
      else return false;
    },
    onRecipeClick(p) {
      this.dialogRecipe = true;
      this.selectedPostInfo = this.posts.find(post => post.id === p.id);
      console.log(this.selectedPostInfo);
    },
    getPostsByLocation() {
      this.loadingPosts = true;
      this.$axios
        .get(`${process.env.API}/api/posts/loc/az`)
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
    },
    getLoggedInUser() {
      this.$axios
        .get(`${process.env.API}/api/users/${LocalStorage.getItem("userId")}`)
        .then(response => {
          this.loggedInUser = response.data;
        })
        .catch(err => {
          this.$q.dialog({
            title: "Error",
            message: "Could not download posts."
          });
          this.loadingPosts = false;
        });
      console.log(this.loggedInUser);
    },
    ...mapActions(["fetchUsers"])
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
    this.getLoggedInUser();
    this.fetchUsers();
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
