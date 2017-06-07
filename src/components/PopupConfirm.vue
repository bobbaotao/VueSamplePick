<template>
  <modal name="confirm-modal" :height="200">
    <div  class="confirm-modal-box">
      <div class="confirm-modal-message">
        Please confirm, will random pick Travel Expense from company: <span>{{companyCode}}</span> with <span>{{percent}}%</span> from year: <span>{{year}}</span>  month: <span>{{month}}</span>.
      </div>
      <div class="confirm-modal-button-container">
        <button class="confirm-modal-button" v-on:click="confirmRandomPick">Confirm to Pick</button>
        <button class="confirm-modal-button" v-on:click="closeWindow">Close and Reset</button>
      </div>
    </div>
  </modal>
</template>
<script>
  export default {
    name: 'PopupConfirm',
    props: ['year','month','percent', 'companyCode'],
    methods: {
      confirmRandomPick: function(){
        this.$emit('randompick');
      },
      closeWindow: function(){
        this.$modal.hide('confirm-modal');
      }
    }
  }
</script>
<style scoped>
.confirm-modal-box {
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  height: 100%;
  width: 100%;
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
.confirm-modal-message span {
  font-weight: bold;
  font-style: italic;
}
</style>
