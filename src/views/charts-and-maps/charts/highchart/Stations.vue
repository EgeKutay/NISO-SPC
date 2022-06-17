
<template>

<div id="StationMeasurements">
  
      <b-col cols="12">
      </b-col>
        <b-card no-body  style="background-color:#f0f0fa">
               <b-row style="padding:0px 0px 0px 10px">
                 <b-col cols="2"  style="text-align:left">
          <b-card-title style="align-self:left;text-align:left">
            PPM: {{PPM}}
          </b-card-title>
                 </b-col>
                 <b-col cols="1"  style="text-align:left">
          <b-card-title style="align-self:left;color:green;text-align:left">
            OK: {{Ok}}
          </b-card-title>
                 </b-col>
          <b-col cols="2">
            <b-card-title style="color:red">
            Not OK: {{Nok}}
          </b-card-title>
          </b-col>
          <b-col cols="6">
             <b-card-title style="padding:-0px 0px 0px 0px;font-family:Arial;font-weight:bold;font-size:2.0em;">
            {{productName}}
          </b-card-title>
          </b-col>
             </b-row>
          <div v-if="isDummyData">
        <b-row v-if="isAudit" style="padding-left:25px">
          
          <b-col  v-for="chart in dummychartObjects" :key="chart.MeasurementName"  :cols="4">
          <auditcontrolchart :chartdatas="chart" :query="querydata" :key="refresh" />
          </b-col>
        </b-row>
        <b-row v-else style="padding-left:25px">
      <b-col  v-for="chart in dummychartObjects" :key="chart.MeasurementName"  :cols="4">
       <controlchart :chartdatas="chart" :query="querydata" :key="refresh" />

       </b-col>
        </b-row>
          </div>
          <div v-else>
              <b-row v-if="isAudit" style="padding-left:25px">
                <b-col  v-for="chart in chartObjects" :key="chart.MeasurementName"  :cols="4">
                  <auditcontrolchart :chartdatas="chart" :query="querydata" :key="refresh" />
                </b-col>
              </b-row>
              <b-row v-else-if="!isDetailed" style="padding-left:25px">    
                <b-col  v-for="chart in chartObjects" :key="chart.MeasurementName"  :cols="4">
                  <newcontrolchart :chartdatas="chart" :query="querydata" :key="refresh" />
                </b-col>
              </b-row>
              <b-row v-else style="padding-left:25px">    
                <b-col  v-for="chart in chartObjects" :key="chart.MeasurementName"  :cols="4">
                  <controlchart :chartdatas="chart" :query="querydata" :key="refresh" />
                </b-col>
              </b-row>
          </div>
        </b-card>
     
</div>
</template>
<script>
/* This is the component where station's control charts will be printed that received from cameras */

import { Chart } from 'highcharts-vue'
import spcConfig from "@/../spcConfig"
import Controlchart from "./controlcharts/Controlchart.vue"
import AuditControlchart from "./controlcharts/AuditControlChart.vue"
import NewControlchart from "./controlcharts/NewControlChart.vue"
import dummydata from "@/views/charts-and-maps/dummydata/response.json"
//import dummyparams from "@/views/charts-and-maps/dummydata/dummyparams.json"
import {GET_STATIONS_QUERY,SET_RTSPC_QUERY} from "@/store/spc/rtspc.module"
import ApexBarChart from '../apex-chart/ApexBarChart.vue';
export default{
name:"Highcharts",
components:{
auditcontrolchart:AuditControlchart,
controlchart:Controlchart,
newcontrolchart:NewControlchart,
highcharts:Chart,
refresh:0,
ApexBarChart,
},
props:{
linedId:null,
stationObj:null,
wcId:null,
},
 data(){
   return{
     isAudit:spcConfig["AUDIT_MODE"],
     isDummyData:spcConfig["DUMMY_DATA"],
     isDetailed:spcConfig["DETAILED_MODE"],
     colNum:6,
     productName:'',
    stationObjects:{},
    timer:'',
    Ok:0,
    Nok:0,
    PPM:0,
    chartObjects:{},
    dummychartObjects:{},
    querydata:{
    id: 0,
    lineID: 1,
    workCenterID: this.stationObj.WorkcenterID,
    stationTypeID:this.stationObj.StationTypeID,
    stationID: this.stationObj.StationID,
    measurements: [
      ""
    ],
    productID: 0,
    startDate: "2022-04-19T06:46:58.148Z",
    finishDate: "2022-04-19T06:46:58.148Z",
    type: 0,
    filterID: 0,
    dataMatrix:"",
  },

   }
  },
created(){
if(!this.isDummyData){
  this.fetchData()
  this.timer= setInterval(()=>this.fetchData(),120000)
  this.fetchStations()

}
else{
 this.dummychartObjects=dummydata
}
    },
    methods:{
    fetchData(){
     
       this.$store.dispatch(SET_RTSPC_QUERY,JSON.parse(JSON.stringify(this.querydata))).then(
         ()=>{
              let auditMode=spcConfig["AUDIT_MODE"]
              let jsondata=this.$store.getters.getRtSpcData
              console.log(jsondata)
             this.chartObjects= JSON.parse(JSON.stringify(jsondata))
             this.dummychartObjects=JSON.parse(JSON.stringify(dummydata))
             if(Object.keys(jsondata).length>0){
             this.productName=jsondata[0].ProductName
             this.Ok=jsondata[0].OK 
             this.Nok=jsondata[0].NOK
             this.PPM=jsondata[0].PPM
             }
             if(auditMode){
               this.PPM=0;
               this.Nok=0;

             }
              }).catch((error)=>console.error(error))
             this.refresh++;
      },
      cancelAutoUpdate(){
      clearInterval(this.timer)
      },
      fetchStations(){
        this.$store.dispatch(GET_STATIONS_QUERY,{ params: {workcenterId:11,stationTypeId:1,isFiltered:true}}).then(()=>
        {
           let jsondata=this.$store.getters.getStationsData
       this.stationObjects=jsondata
        })

      },
      test(){
        console.log(this.stationObj)
      }
    },
    beforeDestroy(){
      this.cancelAutoUpdate()
    },
}

</script>
<style>
</style>
