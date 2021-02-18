import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

// Translation provided by Vuetify (typescript)
import ja from "vuetify/src/locale/ja";

Vue.component("my-component", {
  methods: {
    changeLocale() {
      this.$vuetify.lang.current = "ja";
    }
  }
});

export default new Vuetify({
  lang: {
    locales: { ja },
    current: "ja"
  }
});
