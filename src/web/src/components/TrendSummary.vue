<script setup lang="ts">
import { watch, ref, onMounted } from "vue";
import Alert from "./Alert.vue";
import { getApi } from "../utilities/api";
import {
    generateAreaChart,
    generateTrendTypeColumns,
} from "../utilities/chart";

const props = defineProps<{
    visible?: boolean;
}>();

const error = ref("");
const trendReportTable = ref(null as TrendReportTableRow[] | null);

const loadApiData = async () => {
    error.value = "";
    try {
        const result = await getApi("/trend");
        trendReportTable.value = result as TrendReportTableRow[];
    } catch (e: any) {
        if (typeof e === "string") error.value = e;
    }
};

const setup = async () => {
    if (props.visible && trendReportTable.value === null) {
        await loadApiData();
        const columns = generateTrendTypeColumns(trendReportTable.value);
        const groups = [
            [columns[1][0].toString()],
            [columns[2][0].toString(), columns[3][0].toString()],
        ];
        generateAreaChart(columns, "#trend-summary-root-chart", groups);
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
        v-show="visible"
        id="trend-summary-root"
        class="relative overflow-x-auto"
    >
        <alert :message="error"></alert>
        <div id="trend-summary-root-chart"></div>
    </div>
</template>
