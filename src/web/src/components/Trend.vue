<script setup lang="ts">
import { TrendType } from "../enums";
import { ref } from "vue";
import TrendSummary from "./TrendSummary.vue";

const selected = ref(TrendType.All as string);
</script>

<template>
    <div id="trend-container-root" class="p-10">
        <TrendSummary v-show="selected === TrendType.All" />
    </div>
</template>
