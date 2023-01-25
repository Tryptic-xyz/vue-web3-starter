<template>
  <button
    type="button"
    class="relative h-[65px] w-full items-center self-center rounded-lg px-10 py-2 text-20 font-bold leading-4 text-black shadow-lg shadow-pure-black md:h-[75px] lg:h-[85px] lg:self-start gradient-button"
    :class="{
      'pointer-events-none': disabled,
      'opacity-50': disabled,
    }"
    @click="handleClick"
  >
    {{ btnText }}
    <svg
      v-if="loading"
      class="absolute w-8 h-8 ml-4 -translate-y-1/2 top-1/2 right-3 fill-black"
      version="1.1"
      id="loader-1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width="40px"
      height="40px"
      viewBox="0 0 40 40"
      enable-background="new 0 0 40 40"
      xml:space="preserve"
    >
      <path
        opacity="0.2"
        d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
    s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
    c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
      />
      <path
        d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
    C22.32,8.481,24.301,9.057,26.013,10.047z"
      >
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="rotate"
          from="0 20 20"
          to="360 20 20"
          dur="0.5s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  </button>
</template>

<script setup>
defineProps({
  loading: Boolean,
  handleClick: Function,
  type: {
    default: "success",
  },
  disabled: {
    default: false,
    type: Boolean,
  },
  btnText: String,
});
</script>

<style scoped>
.gradient-button {
  @apply bg-gradient-to-b from-gold-dark via-yellow-light to-gold-dark overflow-hidden;
}
.gradient-button::after {
  content: "";
  position: absolute;
  top: -100%;
  left: 0;
  height: 300%;
  width: 100%;
  background: linear-gradient(
    130deg,
    rgba(255, 255, 255, 0) 20%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 80%
  );
  border-radius: inherit;
  transition: opacity 300ms;
  transform: translateX(-100%);
}

.gradient-button:hover::after {
  animation: shimmer 0.75s ease-in-out;
}
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
