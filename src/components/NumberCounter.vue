<template>
  <div
    class="flex flex-col items-center justify-center space-y-2 rounded-lg shadow-xl custom-number-input shadow-pure-black"
  >
    <slot name="label" />
    <div
      class="relative flex flex-row w-56 lg:w-64 h-[70px] md:h-[85px] bg-transparent rounded-lg"
    >
      <button
        @click="dec"
        class="w-4/12 rounded-l-lg outline-none cursor-pointer number-btn text-yellow hover:text-gold-dark"
      >
        <span class="m-auto text-42 z-1">−</span>
      </button>
      <input
        type="number"
        v-model="count"
        :max="max"
        class="flex items-center w-4/12 text-3xl font-bold text-center shadow-inner outline-none pointer-events-none shadow-zinc-800 bg-pure-black text-yellow md:text-basecursor-default hover:text-black focus:text-black focus:outline-none"
        name="custom-input-number"
      />
      <button
        @click="inc"
        class="w-4/12 rounded-r-lg outline-none cursor-pointer number-btn text-yellow hover:text-gold-dark"
      >
        <span class="m-auto text-42 z-1">+</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  max: Number,
  label: String,
  canIncrement: {
    type: Boolean,
    default: true,
  },
  numberRemaining: Number,
  remainingLabel: String,
});

const emit = defineEmits(["numberChanged"]);

const count = ref(0);

const inc = () => {
  if (count.value < props.max && props.canIncrement) {
    count.value = count.value + 1;
    emit("numberChanged", count.value);
  }
};

const dec = () => {
  if (count.value) {
    count.value = count.value - 1;
    emit("numberChanged", count.value);
  }
};
</script>

<style lang="css" scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.custom-number-input input:focus {
  outline: none !important;
}

.custom-number-input button:focus {
  outline: none !important;
}

.number-btn {
  @apply bg-gradient-to-b from-zinc-700 to-zinc-900;
}

.number-btn::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  border-radius: inherit;
  background: linear-gradient(#18181b, rgb(63, 63, 70));
  transition: opacity 500ms;
}

.number-btn:hover::after {
  opacity: 0.5;
}
</style>
