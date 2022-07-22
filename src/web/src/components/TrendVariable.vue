<script setup lang="ts">
import { watch, ref, onMounted } from "vue";
import { isApplicationError } from "../../../utils/typeguards";
import Alert from "./Alert.vue";
import { getApi } from "../utilities/api";
import ComboBox from "./ComboBox.vue";
import {
    generateAreaChart,
    generateVariableTrendColumns,
} from "../utilities/chart";

const props = defineProps<{
    visible?: boolean;
}>();

const error = ref("");
const trendReportTable = ref(null as TrendReportTableRow[] | null);
const selectedFilter = ref("");
const filters = ref([] as string[]);
const columns = ref([] as Array<Array<string | number>>);
const chartId = "#trend-variable-root-chart";

const loadApiData = async () => {
    error.value = "";
    try {
        const result = await getApi("/trend/variable");
        trendReportTable.value = result as TrendReportTableRow[];
    } catch (e: any) {
        if (typeof e === "string") error.value = e;
    }
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

const chartFilter = (v: unknown) => {
    if (selectedFilter.value === "all") return true;
    const typeSafeV = v as unknown as { id: string };
    return typeSafeV.id === selectedFilter.value;
};

const handleChange = (value: string) => {
    selectedFilter.value = value;
    generateAreaChart(columns.value, chartId, undefined, chartFilter);
};

const setup = async () => {
    if (props.visible && trendReportTable.value === null) {
        await loadApiData();
        filters.value = getFilters();
        columns.value = generateVariableTrendColumns(trendReportTable.value);
        generateAreaChart(columns.value, chartId, undefined, chartFilter);
    }
};

onMounted(() => setup());
watch(
    () => props.visible,
    () => setup(),
);
</script>

<template>
    <div
        id="trend-variable-root"
        class="relative overflow-x-auto"
        v-show="visible"
    >
        <alert :message="error"></alert>
        <ComboBox
            @change="handleChange"
            :selected="selectedFilter"
            :items="filters"
            :label="`Filter: ${selectedFilter}`"
        />
        <div id="trend-variable-root-chart-container">
            <div id="trend-variable-root-chart"></div>
        </div>
    </div>
</template>
