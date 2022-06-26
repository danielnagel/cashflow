<script setup lang="ts">
import { onMounted, ref } from "vue";
import { formatDate } from "../../../utils/dates";
import { roundToString } from "../../../utils/numbers";
import Alert from "./Alert.vue";

const error = ref("");
const transactions = ref([] as Transaction[]);

const setup = async () => {
    error.value = "";

    const url = `http://${process.env.BACKEND_ADDRESS}/transactions`;
    let response = null;
    try {
        response = await fetch(url);
    } catch (e: any) {
        error.value = `Backend server is unreachable.`;
        return;
    }

    try {
        transactions.value = await response.json();
    } catch (e: any) {
        error.value = `Couldn't parse JSON data. Expected fixed pay day report json, got unparsable object.`;
    }
};

onMounted(() => {
    setup();
});
</script>

<template>
    <div id="transactions-root" class="relative overflow-x-auto shadow-md">
        <alert :message="error"></alert>
        <table
            class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
        >
            <thead
                class="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400"
            >
                <tr>
                    <th class="px-6 py-3">Date</th>
                    <th class="px-6 py-3">Initiator</th>
                    <th class="px-6 py-3">Purpose</th>
                    <th class="px-6 py-3">Value</th>
                </tr>
            </thead>
            <tbody data-testid="table-body">
                <tr
                    v-for="t of transactions"
                    :key="t.date + t.initiator + t.purpose"
                    class="border-b dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
                    data-testid="transaction"
                >
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
                </tr>
            </tbody>
        </table>
    </div>
</template>
