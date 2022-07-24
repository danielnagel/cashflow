<script setup lang="ts">
import { watch, ref, onMounted, computed } from "vue";
import { isApplicationError } from "../../../utils/typeguards";
import { getApi } from "../utilities/api";
import {
    generateAreaChart,
    generateTrendTypeColumns,
    generateVariableTrendColumns,
} from "../utilities/chart";
import { TrendType } from "../utilities/enums";

const props = defineProps<{
    visible?: boolean;
    chartId: string;
    type: string;
}>();

const error = ref("");
const trendReportTable = ref(null as TrendReportTableRow[] | null);
const selectedFilter = ref("");
const filters = ref([] as string[]);
const columns = ref([] as Array<Array<string | number | Date>>);
const groups = ref(undefined as Array<Array<string>> | undefined);

const isTrendTypeAll = () => props.type === TrendType.All;

const loadApiData = async () => {
    error.value = "";
    let url = "/trend";
    if (!isTrendTypeAll()) {
        url += `/${props.type}`;
    }
    try {
        const result = await getApi(url);
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
    columns.value = isTrendTypeAll()
        ? generateTrendTypeColumns(trendReportTable.value)
        : generateVariableTrendColumns(trendReportTable.value);
    groups.value = isTrendTypeAll()
        ? [
              [columns.value[1][0].toString()],
              [columns.value[2][0].toString(), columns.value[3][0].toString()],
          ]
        : undefined;
    generateAreaChart(
        columns.value,
        `#${props.chartId}`,
        groups.value,
        chartFilter,
    );
};

const setup = async () => {
    if (props.visible && trendReportTable.value === null) {
        await loadApiData();
        filters.value = getFilters();
        handleChange("all");
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
        :id="`trend-detail-root-${type}`"
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
        <div :id="`trend-detail-root-chart-container-${type}`">
            <div :id="chartId"></div>
        </div>
    </div>
</template>
