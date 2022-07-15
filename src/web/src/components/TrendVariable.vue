<script setup lang="ts">
import "billboard.js/dist/theme/insight.css";
import bb, { area } from "billboard.js";
import { onMounted, ref } from "vue";
import { isApplicationError } from "../../../utils/typeguards";
import Alert from "./Alert.vue";
import { getApi } from "../utils";

const error = ref("");
const trendReportTable = ref(null as TrendReportTableRow[] | null);
const selectedFilter = ref("");
const filters = ref([] as string[]);
const chartxAxis = ref([] as string[]);
const charData = ref([] as Array<Array<string | number>>);

const loadApiData = async () => {
    error.value = "";
    try {
        const result = await getApi("/trend/variable");
        trendReportTable.value = result as TrendReportTableRow[];
    } catch (e: any) {
        if (typeof e === "string") error.value = e;
    }
};

const getData = (): Array<Array<string | number>> => {
    const table = trendReportTable.value;

    const result: Array<Array<string | number>> = [];

    if (isApplicationError(table) || table === null) {
        return result;
    }

    for (const row of table) {
        const resultRow: Array<string | number> = [];
        resultRow.push(row.category);
        for (const value of Object.values(row)) {
            if (!value) continue;
            let number = parseFloat(value.substring(0, value.length - 2));
            if (isNaN(number)) continue;
            if (number < 0) number *= -1;
            resultRow.push(number);
        }
        if (resultRow.length > 0) result.push(resultRow);
    }
    return result;
};

const getX = (): string[] => {
    const result = ["x"];
    const table = trendReportTable.value;

    if (isApplicationError(table) || table === null) {
        return result;
    }

    const firstRow = table[0];
    for (const key of Object.keys(firstRow)) {
        if (key === "category") continue;
        result.push(key);
    }
    return result;
};

const getFilters = (): string[] => {
    const table = trendReportTable.value;
    const result: Array<string> = ["all"];
    if (isApplicationError(table) || table === null) {
        return result;
    }
    table.forEach((row) => result.push(row.category));
    return result;
};

const generateChart = (): void => {
    const columns = [chartxAxis.value, ...charData.value];
    bb.generate({
        data: {
            x: "x",
            columns,
            type: area(),
            filter: function (v) {
                if (selectedFilter.value === "all") return true;
                const typeSafeV = v as unknown as { id: string };
                return typeSafeV.id === selectedFilter.value;
            },
        },
        axis: {
            x: {
                type: "timeseries",
                tick: {
                    format: "%m.%Y",
                },
            },
        },
        bindto: "#trend-variable-root-chart",
    });
};

onMounted(async () => {
    await loadApiData();

    filters.value = getFilters();
    selectedFilter.value = filters.value[0];
    chartxAxis.value = getX();
    charData.value = getData();

    generateChart();
});
</script>

<template>
    <div id="trend-variable-root" class="relative overflow-x-auto">
        <alert :message="error"></alert>
        <div id="trend-variable-type-selection-container" class="mb-4">
            <label
                for="trend-variable-type-selection"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >Filter: {{ selectedFilter }}</label
            >
            <select
                v-model="selectedFilter"
                id="trend-variable-type-selection"
                class="block p-2 mb-6 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                @change="generateChart"
            >
                <option v-for="f of filters" :value="f">{{ f }}</option>
            </select>
        </div>
        <div id="trend-variable-root-chart-container">
            <div id="trend-variable-root-chart"></div>
        </div>
    </div>
</template>
