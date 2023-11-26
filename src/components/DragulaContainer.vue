<template>
    <component :is="tag">
        <slot :listKeys="listKeys" />
    </component>
</template>

<script>
import dragula from "dragula";

export default {
    $drake: null,
    props: {
        modelValue: {
            type: Object,
            required: true,
        },
        options: {
            type: Object,
            default: () => ({}),
        },
        tag: {
            type: String,
            default: "div",
        },
        itemKeyFunc: {
            type: Function,
            required: true,
        },
    },
    provide() {
        return {
            dragulaLists: this.modelValue,
            dragulaItemKeyFunc: this.itemKeyFunc,
        };
    },
    computed: {
        listKeys() {
            return Object.keys(this.modelValue);
        },
    },
    methods: {
        syncListsOnDrop(el, target, source, sibling) {
            const lists = this.modelValue;
            const itemKeyFunc = this.itemKeyFunc;

            const sourceListKey = source.dataset.dragulaId;
            const targetListKey = target.dataset.dragulaId;

            const sourceList = lists[sourceListKey];
            const targetList = lists[targetListKey];

            const sourceDataId = el.dataset.dragulaId;
            const sourceDataIndex = sourceList.findIndex(
                (item) => itemKeyFunc(item) === sourceDataId
            );
            const sourceData = sourceList[sourceDataIndex];

            // remove el data from new source list if copy is falsy

            const newSourceList = [...sourceList];
            if (!this.options.copy) {
                newSourceList.splice(sourceDataIndex, 1);
            }

            // add el data to new target list before sibling data or end if sibling is null

            const newTargetList =
                sourceListKey !== targetListKey
                    ? [...targetList]
                    : newSourceList;
            if (sibling) {
                const siblingDataId = sibling.dataset.dragulaId;
                const siblingDataIndex = targetList.findIndex(
                    (item) => itemKeyFunc(item) === siblingDataId
                );
                newTargetList.splice(siblingDataIndex, 0, sourceData);
            } else {
                newTargetList.push(sourceData);
            }

            this.$emit("update:modelValue", {
                ...lists,
                [sourceListKey]: newSourceList,
                [targetListKey]: newTargetList,
            });

            this.$emit("drop", {
                sourceKey: sourceListKey,
                targetKey: targetListKey,
                listItem: sourceData,
            });
        },
        syncListsOnRemove(el, container, source) {
            const lists = this.modelValue;
            const itemKeyFunc = this.itemKeyFunc;

            const sourceListKey = source.dataset.dragulaId;
            const sourceList = lists[sourceListKey];

            const sourceDataId = el.dataset.dragulaId;
            const sourceData = sourceList.find(
                (item) => itemKeyFunc(item) === sourceDataId
            );

            const newSourceList = sourceList.filter(
                (item) => !(item === sourceData)
            );

            this.$emit("update:modelValue", {
                ...lists,
                [sourceListKey]: newSourceList,
            });

            this.$emit("remove", {
                sourceKey: sourceListKey,
                listItem: sourceData,
            });
        },

        setDrakeContainers() {
            if (!this.$drake) {
                return;
            }
            this.$drake.containers = [
                ...this.$el.querySelectorAll("[data-dragula-list]"),
            ];
        },
    },
    mounted() {
        this.$drake = dragula({
            ...this.options,
        });
        this.setDrakeContainers();
        this.$drake.on("drop", this.syncListsOnDrop);
        this.$drake.on("remove", this.syncListsOnRemove);
    },
    updated() {
        this.setDrakeContainers();
    },
    beforeUnmount() {
        this.$drake.destroy();
    },
};
</script>
