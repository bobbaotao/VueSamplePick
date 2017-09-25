<template>
  <div class="travelExpenseList">
    <el-row>
      <TopNav v-bind:activeIndex="navKey"></TopNav>
    </el-row>
    <div class='modalLayout' v-if="isLoading === 'true'">
      <Spinner class="spinnerLoader"></Spinner>
    </div>
    <div>
        <p class="errorMessage">{{message}}</p>
        <div class="viewSwitcher">
          <input id="rdSelectView" type="radio" value="false" v-model="isRandomPickView">
            <label for="rdSelectView">Show picked TE</label>
          </input>
          <input id="rdRandomView" type="radio" value="true" v-model="isRandomPickView">
            <label for="rdRandomView">Random pick TE for last month</label>
          </input>
        </div>
        <div class="viewRandomPick" v-if="isRandomPickView === 'true'">
          click button will Random pick TE which are approved in year: {{year}} month: {{month}}<br />
          select company:
          <select v-model="selectedCompanyCode" v-on:change="changeCompanyCode">
              <option v-for="companyItem in companyCodes" v-bind:value="companyItem">{{companyItem.codes}}</option>
          </select>
          set percent (1-100):
            <input type="number" v-model="percent" min="1" max="100" />
            <button type="button" v-on:click="showConfirmWindow">Random Pick Travel Expense</button>

        </div>
        <div class="viewGetTE" v-else>
            select company:
            <select v-model="selectedCompanyCode" v-on:change="changeCompanyCode">
                <option v-for="companyItem in companyCodes" v-bind:value="companyItem">{{companyItem.codes}}</option>
            </select>
            select year:
            <select v-model="selectedYear">
                <option>2016</option>
                <option>2017</option>
                <option>2018</option>
                <option>2019</option>
                <option>2020</option>
                <option>2021</option>
                <option>2022</option>
                <option>2023</option>
            </select>
            select month:
            <select v-model="selectedMonth">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
                <option>11</option>
                <option>12</option>
            </select>

            <button type="button" v-on:click="loadPickedTravelExpense" >Load Picked Travel Expense</button>
        </div>
        <div class="countMessage">
          <span>Total: {{totalNumber}}</span><span>Picked: {{pickedNumber}}</span><span>Total picked Amount: {{totalPickedAmount}}</span><span>Total Amount: {{totalAmount}}</span>
          <button type="button" class="btnDownload" v-on:click="exportTravelExpense">Download Excel</button>
        </div>
        <table class="tbTE">
          <thead>
            <tr>
              <td>Title </td>
              <td>SeriesNo </td>
              <td>Amount</td>
              <td>Applicationname</td>
              <td>Created</td>
            </tr>
          </thead>
          <tbody>
            <TravelExpenseItem v-for="item in items" v-bind:item="item" />
          </tbody>
        </table>
      <PopupConfirm v-bind:year="year" v-bind:month="month" v-bind:percent="percent" v-bind:companyCode="selectedCompanyCode.codes" v-on:randompick="confirmedPick">

      </PopupConfirm>
    </div>
  <!--  <div class='modalLayout' v-if="isShowWindow === 'true'">
      <ConfirmWindow  v-bind:year="year" v-bind:month="month" v-bind:percent="percent" v-on:randompick="confirmedPick" v-on:closeWindow="closeConfirmWindow" />
    </div>
  -->
  </div>
</template>
<script>
    import TravelExpenseItem from './TravelExpenseItem.vue';
    import PopupConfirm from './popupConfirm.vue';
    import ConfirmWindow from './ConfirmWindow.vue'
    import FileSaver from "file-saver";
    import { csvParse, csvParseRows, tsvParse, tsvParseRows, csvFormat, csvFormatRows, tsvFormat, tsvFormatRows } from "d3-dsv";
    import axios from 'axios';
    require('es6-promise').polyfill();
    import Spinner from 'vue-simple-spinner';
    import TopNav from './TopNav'

    export default {
      name: 'travelExpenseList',
      data()  {
        return {
          selectedYear: 2017,
          selectedMonth: 2,
          year: 0,
          month: 0,
          items: [],
          //items: [{"Title": "asd汉字","TE_No":"汉字","Amount":"3424","Filled_By":"顺丰速递","Created":"as"}],
          percent: 30,
          message: "",
          isRandomPickView: 'false',
          isLoading: 'false',
          totalNumber: 0,
          pickedNumber: 0,
          totalAmount: 0,
          totalPickedAmount: 0,
          detailItems: [],
          isShowWindow: 'false',
          //companyCodes: [],
          companyCodes: [{codes: "0246", defaultPercent: "30"}],
          selectedCompanyCode: {codes: "0246", defaultPercent: "30"},
          navKey : 'Home'
        }
      },
      created: function() {
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        if(month == 0){
          year = year - 1;
          month = 12;
        };
        this.month = month;
        this.selectedMonth = month;
        this.year = year;
        this.selectedYear = year;
        this.loadCompanyCode();
      },
      components: {TravelExpenseItem, Spinner, PopupConfirm, ConfirmWindow, TopNav},
      methods: {
        changeCompanyCode: function() {
          this.percent = this.selectedCompanyCode.defaultPercent;
        },
        exportTravelExpense: function() {
          var csvContent = csvFormat(this.detailItems,
            ["TE_No","Title","EmployeeName","Location","IsOverSea",
            "DateSubmitted","TotalAmount","Remark","Department","Company",
            "VendorCode","ACStatus","ApprovalDate","ACApprovalDate",
            "Division","IsExported","Date","CountryCity","Purpose",
            "ExpenseType","DescriptionOfExpenseClaim","Currency","CurrencyAmount",
            "Amount"]);
          var mime_type = "text/csv;charset=utf-8";
          var filename = "travel expense_" + this.selectedYear + "_" + this.selectedMonth + ".csv";
          if(this.isRandomPickView === 'true') {
            filename = "travel expense_" + this.year + "_" + this.month + ".csv";
          }

          var file = new Blob([csvContent], {type: mime_type});

          FileSaver.saveAs(file, filename);
        },
        loadPickedTravelExpense: function() {
            this.isLoading = 'true';
            this.items = [];
            this.detailItems = [];
            this.totalNumber = 0;
            this.pickedNumber = 0;
            this.totalAmount = 0;
            this.totalPickedAmount = 0;
            const requestUrl =  "/_vti_bin/ZeissAPI/RandomTravelExpenseService.svc/GetTravelExpense/" + this.selectedYear + "/"
             + this.selectedMonth + "/" + this.selectedCompanyCode.codes + "?randomKey" + new Date().getMilliseconds();
            axios.get(requestUrl).then((response) => {

                this.isLoading = 'false';
              if(response.data.GetTravelExpenseResult.status == "success"){
                this.items = response.data.GetTravelExpenseResult.data;
                this.detailItems = response.data.GetTravelExpenseResult.detailData;
                this.totalNumber = response.data.GetTravelExpenseResult.totalCount;
                this.pickedNumber = response.data.GetTravelExpenseResult.pickedCount;
                this.totalPickedAmount = response.data.GetTravelExpenseResult.totalPickedAmount.toFixed(2);
                this.totalAmount = response.data.GetTravelExpenseResult.totalAmount.toFixed(2);
                this.message = "";
                this.exportTravelExpense();
              } else {
                this.message = response.data.GetTravelExpenseResult.message;
              }
            }).catch((error) => {
              this.isLoading = 'false';
              this.message = error.description;
            });
        },
        loadCompanyCode: function() {
          this.isLoading = 'true';
          const requestUrl = "/_vti_bin/ZeissAPI/RandomTravelExpenseService.svc/GetCompanyCodes";
          axios.get(requestUrl).then((response) => {
            this.isLoading = 'false';
            if(response.status == 200 && response.data.GetCompanyCodesResult.status == "success") {
              this.companyCodes = response.data.GetCompanyCodesResult.data;
              this.selectedCompanyCode = this.companyCodes[0];
            } else {
              this.message = response.data.GetCompanyCodesResult.message;
            }
          }).catch((error) => {
            this.isLoading = 'false';
            this.message = error.description;
          });
        },
        randomPickTravelExpense: function() {
          this.isLoading = 'true';
          this.items = [];
          this.detailItems = [];
          this.totalNumber = 0;
          this.pickedNumber = 0;
          this.totalAmount = 0;
          this.totalPickedAmount = 0;
          const requestUrl ="/_vti_bin/ZeissAPI/RandomTravelExpenseService.svc/InitRandomTravelExpense/" + this.year
          + "/" + this.month + "/" + this.percent + "/" + this.selectedCompanyCode.codes + "?randomKey" + new Date().getMilliseconds();
          axios.get(requestUrl).then((response) => {
              this.isLoading = 'false';
            if(response.status == 200 && response.data.InitRandomTravelExpenseResult.status == "success"){
              this.items = response.data.InitRandomTravelExpenseResult.data;
              this.detailItems = response.data.InitRandomTravelExpenseResult.detailData;
              this.totalNumber = response.data.InitRandomTravelExpenseResult.totalCount;
              this.pickedNumber = response.data.InitRandomTravelExpenseResult.pickedCount;
              this.totalPickedAmount = response.data.InitRandomTravelExpenseResult.totalPickedAmount.toFixed(2);
              this.totalAmount = response.data.InitRandomTravelExpenseResult.totalAmount.toFixed(2);
              this.message = "";
              this.exportTravelExpense();
            } else {
              this.message = response.data.InitRandomTravelExpenseResult.message;
            }
          }).catch((error) => {
            this.isLoading = 'false';
            this.message = error.description;
          });;
        },
        showConfirmWindow: function(){
          this.$modal.show('confirm-modal');
        },
        confirmedPick: function(){
          //this.$modal.hide('confirm-modal');
          this.$modal.toggle('confirm-modal',false);
          this.randomPickTravelExpense();
        },
        closeConfirmWindow: function(){
        //  this.$modal.hide('confirm-modal');
        this.$modal.toggle('confirm-modal',false);
        }
      }

    }
</script>

<style scoped>
.travelExpenseList
{
  width: 100%;
  line-height: 26px;
}
.viewSwitcher
{
  padding-top: 15px;
  padding-bottom: 15px;
}
.viewSwitcher INPUT
{
  margin-left: 5px;
  margin-right: 5px;
}
.viewRandomPick INPUT
{
  margin-left: 10px;
  margin-right: 10px;
  width: 80px;
}
BUTTON
{
  margin-left: 10px;
  border: 1px solid transparent;
	border-radius: .25rem;
  background-color: #57abff;
  color: #fff;
  padding-left: 15px;
  padding-right: 15px;
}
.viewGetTE SELECT
{
  margin-left: 5px;
  margin-right: 10px;
  width: 80px;
}
.btnDownload
{
  margin-top: 10px;
}
.tbTE
{
  width: 700px;
  margin: 10px auto;
}
.modalLayout
{
  position: fixed;
  background-color:rgba(0,0,0,.5);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1050;
  overflow-x: hidden;
  overflow-y: auto;
}
.spinnerLoader
{
  margin-top: 200px;
}
.errorMessage
{
  color: red;
  padding-top: 15px;
}
.countMessage span
{
  padding-right: 25px;
  font-weight: bold;
}
</style>
