<script setup lang="ts">
import { TrendType } from "../utilities/enums";
import { ref } from "vue";

const props = defineProps<{
    visible?: boolean;
}>();

const selected = ref("all");
const handleSelectedChange = (v: string) => (selected.value = v);

// TODO: selectedCategory vom laptop!
</script>

<template>
    <div id="trend-container-root" v-show="visible">
        <ComboBox
            @change="handleSelectedChange"
            :selected="selected"
            :items="Object.values(TrendType)"
            :label="`Trend type: ${selected}`"
        />
        <TrendDetail
            v-for="type of Object.values(TrendType)"
            :key="type"
            :visible="props.visible && selected === type"
            :type="type"
            :chart-id="`trend-chart-${type}`"
        />
    </div>
</template>
