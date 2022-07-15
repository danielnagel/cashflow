<script setup lang="ts">
import { TrendType } from "../enums";
import { ref } from "vue";
import TrendSummary from "./TrendSummary.vue";
import TrendVariable from "./TrendVariable.vue";

const selected = ref(TrendType.Variable as string);
</script>

<template>
    <div id="trend-container-root" class="p-10">
        <TrendSummary v-show="selected === TrendType.All" />
        <TrendVariable v-show="selected === TrendType.Variable" />
    </div>
</template>
