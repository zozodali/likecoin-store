<template>
  <div id="site-header" class="with-sliding-menu">

    <div class="navigation-menu">

      <site-title />

      <menu-button />

    </div>

    <div v-if="isShowAccountButton" class="lc-container-3 lc-tablet-hide">
      <div class="account-btn-wrapper">
        <material-button
          v-if="!shouldHideRegister"
          className="account-btn"
          :hasShadow="true"
          @click="onSignUpClick">
          {{ getButtonText }}
        </material-button>
      </div>
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import MaterialButton from '~/components/MaterialButton';
import MenuButton from '~/components/SlidingMenu/MenuButton';
import SiteTitle from '~/components/SiteTitle';

export default {
  name: 'site-header',
  props: [
    'isShowAccountButton',
  ],
  components: {
    MaterialButton,
    MenuButton,
    SiteTitle,
  },
  computed: {
    getButtonText() {
      if (this.getUserIsRegistered) return this.getUserInfo.user;
      return this.$t(this.getUserNeedAuth ? 'Home.Header.button.signIn' : 'Home.Header.button.signUp');
    },
    shouldHideRegister() {
      return (
        (!this.getUserIsRegistered && this.$route.name === 'in-register')
        || this.$route.name === 'in'
      );
    },
    ...mapGetters([
      'getUserInfo',
      'getUserIsRegistered',
      'getUserNeedAuth',
    ]),
  },
  methods: {
    ...mapActions([
      'showLoginWindow',
    ]),
    onSignUpClick() {
      if (this.getUserIsRegistered) {
        this.$router.push({ name: 'in' });
      } else if (this.getUserNeedAuth) {
        if (this.$route.name === 'index') {
          this.$router.push({ name: 'in' });
        } else {
          this.showLoginWindow();
        }
      } else {
        this.$router.push({
          name: 'in-register',
          query: { ...this.$route.query, ref: '' },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

#site-header {
  .navigation-menu {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 48px 8px;

    @media (max-width: 768px) {
      padding: 12px;
    }
  }

  .account-btn-wrapper {
    position: absolute;
    z-index: 2;
    right: 8px;
    bottom: 0;

    width: 188px;

    transform: translateY(50%);

    .account-btn {
      font-size: 18px;
    }
  }
}
</style>
