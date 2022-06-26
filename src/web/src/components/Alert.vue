<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

const props = defineProps<{
    message?: string;
}>();

const internalMessage = ref("");

watch(
    () => props.message,
    (message, previousMessage) => {
        if (message) {
            internalMessage.value = message;
        }
    },
);

onMounted(() => {
    if (props.message) internalMessage.value = props.message;
});
</script>

<template>
    <div
        v-show="internalMessage"
        data-testid="alert"
        class="flex p-4 mb-4 bg-red-100 text-red-700 border-t-4 border-red-500 dark:bg-red-200"
        role="alert"
    >
        <span class="font-medium">Error!</span>
        <div class="ml-3">
            {{ internalMessage }}
        </div>
        <button
            type="button"
            class="ml-auto -mx-1.5 -my-1.5 bg-red-100 dark:bg-red-200 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 dark:hover:bg-red-300 inline-flex h-8 w-8"
            aria-label="Close"
            @click="internalMessage = ''"
        >
            <span class="sr-only">Dismiss</span>
            <svg
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                ></path>
            </svg>
        </button>
    </div>
</template>
