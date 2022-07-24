<script setup lang="ts">
import { TrendType } from "../utilities/enums";
import { ref } from "vue";

const props = defineProps<{
    visible?: boolean;
}>();

const selected = ref("");

const allTrendTypes = Object.values(TrendType);
const trendTypes = [...allTrendTypes];
trendTypes.shift();
</script>

<template>
    <div id="trend-container-root" v-show="visible">
        <ComboBox
            @change="(v) => (selected = v)"
            :selected="selected"
            :items="allTrendTypes"
            :label="`Trend type: ${selected}`"
        />
        <TrendSummary :visible="props.visible && selected === TrendType.All" />
        <TrendDetail
            v-for="type of trendTypes"
            :key="type"
            :visible="props.visible && selected === type"
            :type="type"
            :chart-id="`trend-chart-${type}`"
        />
    </div>
</template>
