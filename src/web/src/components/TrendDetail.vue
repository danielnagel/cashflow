<script setup lang="ts">
import { watch, ref, onMounted } from "vue";
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
    category: string;
    period: string;
}>();

const emit = defineEmits(["categories"]);

const error = ref("");
const trendReportTable = ref(null as TrendReportTableRow[] | null);
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

const getCategories = (): string[] => {
    const table = trendReportTable.value;
    const result: Array<string> = ["all"];
    if (isApplicationError(table) || table === null) {
        return result;
    }
    table.forEach((row) => result.push(row.category));
    return result;
};

const chartFilter = (v: unknown) => {
    if (props.category === "all") return true;
    const typeSafeV = v as unknown as { id: string };
    return typeSafeV.id === props.category;
};

const handleChange = () => {
    if (props.visible) {
        columns.value = isTrendTypeAll()
            ? generateTrendTypeColumns(trendReportTable.value, props.period)
            : generateVariableTrendColumns(
                  trendReportTable.value,
                  props.period,
              );
        groups.value = isTrendTypeAll()
            ? [
                  [columns.value[1][0].toString()],
                  [
                      columns.value[2][0].toString(),
                      columns.value[3][0].toString(),
                  ],
              ]
            : undefined;
        generateAreaChart(
            columns.value,
            `#${props.chartId}`,
            groups.value,
            chartFilter,
        );
    }
};

const setup = async () => {
    if (props.visible) {
        if (trendReportTable.value === null) {
            await loadApiData();
        }
        emit("categories", getCategories());
        handleChange();
    }
};

onMounted(() => setup());
watch(
    () => props.visible,
    () => setup(),
);
watch(
    () => props.category,
    () => handleChange(),
);
watch(
    () => props.period,
    () => handleChange(),
);
</script>

<template>
    <div
        :id="`trend-detail-root-${type}`"
        class="relative overflow-x-auto"
        v-show="visible"
    >
        <alert :message="error"></alert>
        <div :id="`trend-detail-root-chart-container-${type}`">
            <div :id="chartId"></div>
        </div>
    </div>
</template>
