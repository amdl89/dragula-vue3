<template>
    <component :is="tag" data-dragula-list-item :data-dragula-id="itemKey">
        <slot :listItem="listItem" />
    </component>
</template>

<script>
export default {
    props: {
        tag: {
            type: String,
            default: "div",
        },
        listItem: {
            required: true,
        },
    },
    inject: ["dragulaItemKeyFunc"],
    computed: {
        itemKey() {
            return this.dragulaItemKeyFunc(this.listItem);
        },
    },
};
</script>

<style></style>
