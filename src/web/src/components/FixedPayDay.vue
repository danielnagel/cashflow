<script setup lang="ts">
import { onMounted, ref } from "vue";

const error = ref("");

const setup = () => {
    error.value = "";

    // vue can't work with fs
    // express als api server? weniger umbauen ...
    // mit vite daten vorab laden und in die applikation einfügen
    // theoretisch nur die config + csv.ts
    // ist allerdings hässlich
    console.log("wow:", config);
};

onMounted(() => {
    setup();
});
</script>

<template>
    <p v-show="error">{{ error }}</p>
</template>
