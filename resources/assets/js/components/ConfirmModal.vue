<template>
  <div v-if="opened" v-bind:style="styleBack" >
    <div v-bind:style="styleDiv" >
      <h5 class="text-center">Please confirm</h5>
      <p class="text-center">{{ text }}</p>
      <button v-on:click="$emit('confirm-success')" class="btn btn-danger">confirm</button>
      <button v-on:click="$emit('close-confirm-modal')"  class="btn btn-default pull-right">cancel</button>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['text', 'opened'],
    data() {
      return {
        styleBack : {
          position: "fixed",
          width: "100%",
          height: "100%",
          background : "rgba(0,0,0, .5)",
          top: "0",
          left: "0",
        },
        styleDiv : {
          position: "fixed",
          top: "50%",
          left: "50%",
          marginLeft: "-150px",
          width: "300px",
          border: "1px 777 solid",
          background : "#fff",
          borderRadius: "10px",
          padding: "10px",
        },
      }
    },
  }
</script>