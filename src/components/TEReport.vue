<template>
  <div>
    <el-row class="TopNav">
      <el-col :span="24">
        <TopNav v-bind:activeIndex="navKey"></TopNav>
      </el-col>
    </el-row>
    <el-row style="text-align:left">
      <el-col :span="12" :offset="6">
        <el-row style="padding-bottom:15px;">
          <el-col :span="22" :offset="1">
            Company:  <el-select v-model="companyCode"  size="small" placeholder="Please Select Company">
                        <el-option
                          v-for="item in companyOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
          </el-col>
        </el-row>
        <el-row style="padding-bottom:15px;">
          <el-col :span="22" :offset="1">
            Report Type: <el-select v-model="Key"  size="small" placeholder="HR or Finance">
                        <el-option
                          v-for="item in KeyOption"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
          </el-col>
        </el-row>
        <el-row style="padding-bottom:15px;">
          <el-col :span="17" :offset="1">
            Select Date Range:
            <el-date-picker  size="small" v-model="reportDateRage" type="daterange">
            </el-date-picker>
          </el-col>
          <el-col :span="6">
            <el-button  size="small" type="primary" v-on:click="LoadReport">Load Report</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import FileSaver from "file-saver";
  import { csvParse, csvParseRows, tsvParse, tsvParseRows, csvFormat, csvFormatRows, tsvFormat, tsvFormatRows } from "d3-dsv";
  import TopNav from './TopNav';
  var moment = require('moment');
  import { Loading } from 'element-ui';
  var array = require('array');

  export default {
      name: 'TEReport',
      data() {
        return {
          companyCode: '0246',
          companyOptions: [{value:'0246',label:'0246'}],
          startDate:'',
          endDate: '',
          reportDateRage: [],
          Key: '',
          KeyOption: [{
            value:'HR',
            label:'HR'
          },{
            value:'Finance',
            label:'Finance'
          }],
          navKey : 'TED',
          reportData: null
        }
      },
      components: {TopNav},
      created: function() {
        this.loadCompanyCode();
        var drStartDate = new moment().date(21).add(-1, 'M').toDate();
        var drEndDate = new moment().date(20).toDate();
        this.reportDateRage = [drStartDate,drEndDate];
      },
      methods: {
          ShowLoadingView: function() {
            Loading.service({ fullscreen: true });
          },
          HideLoadingView: function() {
            let curLoadingInstance = Loading.service({ fullscreen: true });
            curLoadingInstance.close();
          },
          loadCompanyCode: function() {
            this.ShowLoadingView();
            const requestUrl = "/_vti_bin/ZeissAPI/RandomTravelExpenseService.svc/GetCompanyCodes";
            this.axios.get(requestUrl).then((response) => {
              this.HideLoadingView();
              if(response.status == 200 && response.data.GetCompanyCodesResult.status == "success") {
                //this.companyCodes = response.data.GetCompanyCodesResult.data;
                var codeList = response.data.GetCompanyCodesResult.data;
                var resultList = new array();

                for(var key in codeList) {
                  var singleCode = codeList[key];
                  if(singleCode.codes != null && singleCode.codes != '')
                  {
                    resultList.push({value:singleCode.codes,label:singleCode.codes});
                  }
                }
                this.companyOptions = resultList.toArray();
              } else {
                this.$message.error(response.data.GetCompanyCodesResult.message);
              }
            }).catch((error) => {
              this.HideLoadingView();
              this.$message.error(error.message);
            });
          },
          LoadReport: function() {
            if(!this.Validateinput())
            {
              return;
            }
            this.startDate = new moment(this.reportDateRage[0]).format('YYYY-MM-DD');
            this.endDate = new moment(this.reportDateRage[1]).format('YYYY-MM-DD');
            var requestUrl = "/_vti_bin/ZeissAPI/RandomTravelExpenseService.svc/GetAllTravelExpense/"
             + this.companyCode + "/" + this.startDate + "/" + this.endDate + "/" + this.Key;
             this.ShowLoadingView();

             this.axios.get(requestUrl).then((response) => {
               this.HideLoadingView();
               if(response.status == 200 && response.data.GetAllTravelExpenseResult.Status == "success") {
                 this.reportData = response.data.GetAllTravelExpenseResult.Data;
                 if(this.reportData == null || this.reportData.length == 0)
                 {
                   this.$message.error("No Data!");
                   return;
                 }
                 this.exportTravelExpense();
               } else {
                 this.$message.error(response.data.GetAllTravelExpenseResult.Message);
               }

             }).catch((error) => {
               this.HideLoadingView();
               this.$message.error(error.message);
             });
          },
          Validateinput: function() {
            if(this.companyCode == null || this.companyCode == "") {
              this.$message.error("Please select company!");
              return false;
            }
            if(this.Key == null || this.Key == "") {
              this.$message.error("Please select Report Type!");
              return false;
            }
            if(this.reportDateRage == null || this.reportDateRage.length != 2) {
              this.$message.error("Please select Date Range!");
              return false;
            }
            return true;
          },
          exportTravelExpense: function() {
            var csvContent = csvFormat(this.reportData,
              ["TE_No","Title","EmployeeName","Location","IsOverSea",
              "DateSubmitted","TotalAmount","Remark","Department","Company",
              "VendorCode","ACStatus","ApprovalDate","ACApprovalDate",
              "Division","IsExported","Date","CountryCity","Purpose",
              "ExpenseType","DescriptionOfExpenseClaim","Currency","CurrencyAmount",
              "Amount","OTDays","PrivateCarMile"]);
            var mime_type = "text/csv;charset=utf-8";
            var filename = this.Key + " expense_" + this.startDate + "_" + this.endDate + ".csv";

            var file = new Blob([csvContent], {type: mime_type});

            FileSaver.saveAs(file, filename);
          }
      }
    }

</script>

<style scoped="scoped">
</style>
