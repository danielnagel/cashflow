<script setup lang="ts">
import { ReportType } from "./enums";
import FixedPayDay from "./components/FixedPayDay.vue";
import { ref } from "vue";
import Transactions from "./components/Transactions.vue";
import NavBar from "./components/NavBar.vue";
import Trend from "./components/Trend.vue";

const selected = ref(ReportType.Trend as string);

const changeSelection = (newSelection: string): void => {
    if (selected.value === newSelection) return;
    for (const o of Object.values(ReportType)) {
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
        <NavBar
            @selection="changeSelection"
            :selection="selected"
            :options="Object.values(ReportType)"
        />
        <div class="p-10">
            <Transactions v-show="selected === ReportType.Transactions" />
            <FixedPayDay v-show="selected === ReportType.FixedPayDay" />
            <Trend v-show="selected === ReportType.Trend" />
        </div>
    </div>
</template>
