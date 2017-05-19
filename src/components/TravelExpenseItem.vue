<template>
  <tr class="tetr">
    <td>
      {{item.Title}}
    </td>
    <td>
      <a v-bind:href="'/TravelExpense/Pages/TravelExpense.aspx?Id=' + item.id" target="_blank">{{item.TE_No}}</a>
    </td>
    <td>
      {{item.Amount}}
    </td>
    <td>
      {{item.Filled_By}}
    </td>
    <td>
      {{item.Created}}
    </td>
  </tr>
</template>

<script>
  export default {
    name: 'tetr',
    props: ['item']
  }
</script>

<style scoped>
.tetr
{
  width: 100%;
  height: 26px;
}
.tetr TD
{
  padding-left: 5px;
  padding-right: 5px;
  font-size: 12px;
}
</style>
