<script setup lang="ts">
import { TrendType, FilterPeriod } from "../utilities/enums";
import { ref } from "vue";

const props = defineProps<{
    visible?: boolean;
}>();

const selectedTrend = ref("all");
const handleSelectedTrendChange = (v: string) => (selectedTrend.value = v);

const selectedCategory = ref("all");
const handleSelectedCategoryChange = (v: string) =>
    (selectedCategory.value = v);

const availableCategories = ref([] as string[]);
const handleNewCategories = (v: string[]) => {
    availableCategories.value = v;
    selectedCategory.value = "all";
};

const selectedPeriod = ref("");
const handleSelectedPeriodChange = (v: string) => {
    selectedPeriod.value = v;
};
</script>

<template>
    <div id="trend-container-root" v-show="visible">
        <div id="trend-container-menu" class="px-6 flex flex-row">
            <ComboBox
                @change="handleSelectedTrendChange"
                :selected="selectedTrend"
                :items="Object.values(TrendType)"
                :label="`Trend type: ${selectedTrend}`"
                class="basis-1/4 px-2"
            />
            <ComboBox
                @change="handleSelectedCategoryChange"
                :selected="selectedCategory"
                :items="availableCategories"
                :label="`Category type: ${selectedCategory}`"
                class="basis-1/4 px-2"
            />
            <combo-box
                @change="handleSelectedPeriodChange"
                :selected="selectedPeriod"
                :items="Object.values(FilterPeriod)"
                :label="`Filter period: ${selectedPeriod}`"
                class="basis-1/4 px-2"
            />
        </div>
        <TrendDetail
            v-for="type of Object.values(TrendType)"
            :key="type"
            :visible="props.visible && selectedTrend === type"
            :type="type"
            :chart-id="`trend-chart-${type}`"
            :category="selectedCategory"
            :period="selectedPeriod"
            @categories="handleNewCategories"
        />
    </div>
</template>
