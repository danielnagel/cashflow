<script setup lang="ts">
import { TrendType } from "../utilities/enums";
import { ref } from "vue";
import TrendSummary from "./TrendSummary.vue";
import TrendVariable from "./TrendVariable.vue";
import TrendFixed from "./TrendFixed.vue";
import ComboBox from "./ComboBox.vue";

const props = defineProps<{
    visible?: boolean;
}>();

const selected = ref("");
</script>

<template>
    <div id="trend-container-root" class="p-10" v-show="visible">
        <ComboBox
            @change="(v) => (selected = v)"
            :selected="selected"
            :items="Object.values(TrendType)"
            :label="`Trend type: ${selected}`"
        />
        <TrendSummary :visible="props.visible && selected === TrendType.All" />
        <TrendVariable
            :visible="props.visible && selected === TrendType.Variable"
        />
        <TrendFixed :visible="props.visible && selected === TrendType.Fixed" />
    </div>
</template>
