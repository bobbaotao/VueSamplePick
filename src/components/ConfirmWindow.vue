<template>
  <div class="container">
    <div  class="confirm-modal-box">
      <div class="confirm-modal-message">
        Please confirm, will random pick Travel Expense with percent {{percent}} from year: {{year}}  month: {{month}}.
      </div>
      <div class="confirm-modal-button-container">
        <button class="confirm-modal-button" v-on:click="confirmRandomPick">Confirm to Pick</button>
        <button class="confirm-modal-button" v-on:click="closeWindow">Close and Reset</button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ConfirmWindow',
    props: ['year','month','percent'],
    methods: {
      confirmRandomPick: function(){
        this.$emit('randompick');
      },
      closeWindow: function(){
        this.$emit('closeWindow');
      }
    }
  }
</script>
<style scoped>
.confirm-modal-box {
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  height: 220px;
  width: 430px;
  background-color: #fff;
  margin-left: auto;
  margin-right: auto;
  margin-top: 150px;
}
.container {
  width: 100%;
  height: 100%;
}

.confirm-modal-message{
  height: 50%;
  padding: 30px 20px 0px 20px;
}
.confirm-modal-button {
  border: 1px solid transparent;
	border-radius: .25rem;
  background-color: #57abff;
  color: #fff;
  padding-left: 15px;
  padding-right: 15px;
}
</style>
