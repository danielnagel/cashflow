<script setup lang="ts">
import { watch, ref, onMounted } from "vue";
import { formatDate } from "../../../utils/dates";
import { roundToString } from "../../../utils/numbers";
import { getApi } from "../utilities/api";

const props = defineProps<{
    visible?: boolean;
}>();

const error = ref("");
const transactions = ref([] as ExtendedTransaction[]);

const loadApiData = async () => {
    error.value = "";
    try {
        const result = (await getApi("/transactions")) as ReportTransactions;
        transactions.value = result.transactions;
    } catch (e: any) {
        if (typeof e === "string") error.value = e;
    }
};

const setup = () => {
    if (props.visible && transactions.value.length === 0) {
        loadApiData();
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
        id="transactions-root"
        class="relative overflow-x-auto shadow-md"
        v-show="visible"
    >
        <alert :message="error" data-testid="alert"></alert>
        <table
            class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
        >
            <thead
                class="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400"
            >
                <tr>
                    <th class="px-6 py-3">ID</th>
                    <th class="px-6 py-3">Date</th>
                    <th class="px-6 py-3">Initiator</th>
                    <th class="px-6 py-3">Purpose</th>
                    <th class="px-6 py-3">Value</th>
                    <th class="px-6 py-3">Type</th>
                    <th class="px-6 py-3">Category</th>
                </tr>
            </thead>
            <tbody data-testid="table-body">
                <tr
                    v-for="t of transactions"
                    :key="t.date + t.initiator + t.purpose"
                    class="border-b dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
                    data-testid="transaction"
                >
                    <td class="px-6 py-4">
                        {{ t.id }}
                    </td>
                    <th class="px-6 py-4">
                        {{ formatDate(new Date(t.date)) }}
                    </th>
                    <td class="px-6 py-4">
                        {{ t.initiator }}
                    </td>
                    <td class="px-6 py-4">{{ t.purpose }}</td>
                    <td class="px-6 py-4">
                        {{ roundToString(t.value) }}
                    </td>
                    <td class="px-6 py-4">{{ t.category.type }}</td>
                    <td class="px-6 py-4">{{ t.category.name }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
