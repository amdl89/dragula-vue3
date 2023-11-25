<template>
    <component :is="tag" data-dragula-list :data-dragula-id="listKey">
        <slot :listItems="listItems" />
    </component>
</template>

<script>
export default {
    props: {
        listKey: {
            type: String,
            required: true,
        },
        tag: {
            type: String,
            default: "div",
        },
    },
    inject: ["dragulaLists"],
    computed: {
        listItems() {
            return this.dragulaLists[this.listKey];
        },
    },
};
</script>

<style></style>
