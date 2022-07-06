<script setup lang="ts">
import { Options } from "./enums";
import FixedPayDay from "./components/FixedPayDay.vue";
import { ref } from "vue";
import Transactions from "./components/Transactions.vue";
import NavBar from "./components/NavBar.vue";
import Trend from "./components/Trend.vue";

const selected = ref(Options.Trend as string);

const changeSelection = (newSelection: string): void => {
    if (selected.value === newSelection) return;
    for (const o of Object.values(Options)) {
        // check validity of selection
        if (o === newSelection) {
            selected.value = newSelection;
        }
    }
};
</script>

<template>
    <div
        id="root"
        class="w-full min-w-screen h-full min-h-screen bg-white dark:bg-gray-900"
    >
        <NavBar @selection="changeSelection" :selection="selected" />
        <div class="p-10">
            <Transactions v-show="selected === Options.Transactions" />
            <FixedPayDay v-show="selected === Options.FixedPayDay" />
            <Trend v-show="selected === Options.Trend" />
        </div>
    </div>
</template>
