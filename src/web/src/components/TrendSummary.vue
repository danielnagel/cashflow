<script setup lang="ts">
import "billboard.js/dist/theme/insight.css";
import bb, { area } from "billboard.js";
import { onMounted, ref } from "vue";
import { isApplicationError } from "../../../utils/typeguards";
import { TransactionType } from "../../../types/enums";
import Alert from "./Alert.vue";
import { getApi } from "../utils";

const error = ref("");
const trendReportTable = ref(null as TrendReportTableRow[] | null);

const setup = async () => {
    error.value = "";
    try {
        const result = await getApi("/trend");
        trendReportTable.value = result as TrendReportTableRow[];
    } catch (e: any) {
        if (typeof e === "string") error.value = e;
    }
};

const getData = (transactionType: string): Array<string | number> => {
    const table = trendReportTable.value;

    const result: Array<string | number> = [];

    if (isApplicationError(table) || table === null) {
        return result;
    }

    for (const row of table) {
        if (row.category === transactionType) {
            result.push(row.category);
            for (const value of Object.values(row)) {
                if (value === transactionType || value === null) continue;
                let number = parseFloat(value.substring(0, value.length - 2));
                if (number < 0) number *= -1;
                result.push(number);
            }
        }
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

onMounted(async () => {
    await setup();

    const xAxis = getX();
    const incomeData = getData(TransactionType.Income);
    const variableData = getData(TransactionType.Variable);
    const fixedData = getData(TransactionType.Fixed);

    bb.generate({
        data: {
            x: "x",
            columns: [xAxis, incomeData, fixedData, variableData],
            type: area(),
            groups: [
                [incomeData[0].toString()],
                [fixedData[0].toString(), variableData[0].toString()],
            ],
        },
        axis: {
            x: {
                type: "timeseries",
                tick: {
                    format: "%m.%Y",
                },
            },
        },
        bindto: "#trend-summary-root-chart",
    });
});
</script>

<template>
    <div id="trend-summary-root" class="relative overflow-x-auto">
        <alert :message="error"></alert>
        <div id="trend-summary-root-chart"></div>
    </div>
</template>
