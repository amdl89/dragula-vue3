# dragula-vue

Vue 3 components for working with the [`dragula`](https://github.com/bevacqua/dragula) library.

---

## Install

The library is available on [npm](https://www.npmjs.com/) as [`dragula-vue`](https://www.npmjs.com/package/dragula-vue).

```bash
npm install --save dragula-vue
``` 

## Setup

```js
import { createApp } from "vue";
import App from "./App.vue";

import DragulaVue from "dragula-vue";

const app = createApp(App);
app.use(DragulaVue);
app.mount("#app");
```

## Usage

```vue
<template>
    <dragula-container
        v-model="listsObj"
        :item-key-func="(item) => `${item.id}`"
        @drop="onDrop"
        @remove="onRemove"
        class="container"
        v-slot="{ listKeys }"
    >
        <dragula-list
            v-for="key in listKeys"
            :key="key"
            :list-key="key"
            class="list"
            v-slot="{ listItems }"
        >
            <dragula-list-item
                v-for="item in listItems"
                :key="item.id"
                :list-item="item"
                class="list-item"
                v-slot="{ listItem }"
            >
                {{ listItem.title }}
            </dragula-list-item>
        </dragula-list>
    </dragula-container>
</template>

<script>
export default {
    data() {
        return {
            listsObj: {
                todo: [
                    { id: 1, title: "Do 1" },
                    { id: 2, title: "Do 2" },
                ],
                done: [
                    { id: 3, title: "Done 3" },
                    { id: 4, title: "Done 4" },
                ],
            },
        };
    },
    methods: {
        onDrop({ sourceKey, targetKey, listItem }) {
            console.log(sourceKey, targetKey, listItem);
        },
        onRemove({ sourceKey, listItem }) {
            console.log(sourceKey, listItem);
        },
    },
};
</script>

<style scoped>
.container {
    display: flex;
    gap: 10px;
    margin: 20px;
}
.list {
    background: #ccc;
    padding: 20px;
}
.list-item {
    background: lavender;
    border: 1px solid black;
    padding: 5px;
    margin-bottom: 5px;
}
</style>
```

## Components

#### `DragulaContainer`

It is the wrapper component representing the container in which the dragula lists reside. It accepts an object representing all the lists inside the container and keeps it in sync using `v-model` prop. It exposes the default scoped slot with `listKeys`, which is an array of the keys of the object passed to v-model, which can be used to loop over and construct a `DragulaList` for every list in the passed object [_(as shown in the usage example)_](https://github.com/amdl89/dragula-vue3#usage).

###### `Props`

|    Name     |                    Type                     | Desctiption                                                                                                                                                                                                |
| :---------: | :-----------------------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   v-model   |           Object **_(Required)_**           | Object containing all the lists for a dragula container.                                                                                                                                                   |
| itemKeyFunc | Function: (item) => String **_(Required)_** | Function to get the key for each list item. Make sure this function **returns a String**, and is **unique** among list items in all the arrays for a container; not just the initial one where they reside |
|   options   |                   Object                    | Options used by the underlying dragula library. Look up the [dragula documentation](https://github.com/bevacqua/dragula#dragulacontainers-options) for a list of all options and their description.        |
|     tag     |                   String                    | The html tag of the container element. Defaults to `div`                                                                                                                                                   |

#### `DragulaList`

It represents an inidvidual list in a container. It accepts a `listKey` prop, which corresponds to a list for that key in the object passed to `DragulaContainer`, and exposes the default scoped slot with `listItems`, which is the list for that key, and is used to construct a `DragulaListItem` for items in that list [_(as shown in the usage example)_](https://github.com/amdl89/dragula-vue3#usage).

###### `Props`

|  Name   |          Type           | Desctiption                                                             |
| :-----: | :---------------------: | ----------------------------------------------------------------------- |
| listKey | String **_(Required)_** | key for a specific item list in the object passed to `DragulaContainer` |
|   tag   |         String          | The html tag of the list element. Defaults to `div`                     |

#### `DragulaListItem`

It represents an individual item in a list inside a container. It accepts a 'listItem' prop, and just exposes it in the default scoped slot[_(as shown in the usage example)_](https://github.com/amdl89/dragula-vue3#usage).

|   Name   |         Type         | Desctiption                                              |
| :------: | :------------------: | -------------------------------------------------------- |
| listItem | Any **_(Required)_** | The list item data.                                      |
|   tag    |        String        | The html tag of the list item element. Defaults to `div` |

## Events

The `DragulaContainer` component emits the following events:

|  Name  |                     Args                     | Description                                                                                                                            |
| :----: | :------------------------------------------: | -------------------------------------------------------------------------------------------------------------------------------------- |
|  drop  | Object: `{ sourceKey, targetKey, listItem }` | Fired after syncing v-model when an element is dragged from one list and dropped to another list or is reordered within the same list. |
| remove |      Object: `{ sourceKey, listItem }`       | Fired after syncing v-model when an element is removed from the dragula container.                                                     |

## Dragula instance

The underlying dragula instance can be accessed from `DragulaContainer` component using its `$drake` property. It will be null before the `DragulaContainer` component mounts and dragula is initialized.

Look up the [dragula documentation](https://github.com/bevacqua/dragula#api) for using the drake instance.

```vue
<template>
    <dragula-container ... ref="dragulaContainer"> ... </dragula-container>
</template>

<script>
export default {
   ...
    methods: {
      getDrakeInstance() {
        return this.$refs.dragulaContainer.$drake;
      }
    },
};
</script>
```
