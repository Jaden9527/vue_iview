<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <h2>Essential Links</h2>
        <h3>{{this.$store.state.count}}</h3>
        <Button @click="addFn" type="primary">add</Button>
        <Button @click="reductFn" type="dashed">delete</Button>
    </div>
</template>

<script>
export default {
    name: "HelloWorld",
    data() {
        return {
            msg: "Welcome to Your Vue.js App"
        };
    },
    methods: {
        addFn: function() {
            this.$store.dispatch('add', 3);
        },
        reductFn: function() {
            this.$store.dispatch('reduct', 5);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
    font-weight: normal;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>
