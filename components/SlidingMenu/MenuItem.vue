<template>
  <div
    :class="[
      'menu-item',
      {
        'highlighted': isHighlighted,
      },
    ]"
    @click="onClickMenuItem">

    <a v-if="isExternal || !to" :href="to">
      <slot/>
    </a>
    <nuxt-link v-else :to="to">
      <slot/>
    </nuxt-link>

  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'menu-item',
  props: {
    isHighlighted: {
      type: Boolean,
      default: false,
    },
    to: {
      type: [String, Object],
    },
    isExternal: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapActions([
      'closeSlidingMenu',
    ]),
    onClickMenuItem() {
      this.closeSlidingMenu();
      this.$emit('click');
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.menu-item {
  display: inline;

  font-weight: 300;
  color: $like-green;

  cursor: pointer;

  &:hover {
    > a::before {
      width: 100%;
    }
  }

  &.highlighted {
    font-weight: 600;
  }

  .primary & {
    font-size: 20px;

    @media (max-width: 600px) {
      font-size: 16px;
    }
  }

  .secondary & {
    font-size: 16px;

    @media (max-width: 600px) {
      font-size: 12px;
    }
  }

  > a {
    position: relative;
    text-decoration: none;

    display: inline-flex;

    &::before {
      content: " ";
      position: absolute;
      top: calc(100% + 3px);
      left: 0;
      height: 2px;
      background-color: $like-green;
      width: 0%;

      transition: width 0.25s ease-out;
    }

    :global(svg) {
      fill: $like-green !important;
    }
  }
}
</style>
