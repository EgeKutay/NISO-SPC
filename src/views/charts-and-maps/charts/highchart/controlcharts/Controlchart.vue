<template>
  <div id="controlchart">
 <b-card >
      
      <b-card-header>
        <b-card-title >{{chartdata.MeasurementName}}</b-card-title>
      </b-card-header>
      <b-row style="padding-left:20px">
         <b-col cols="3">
 <b-card-sub-title>
     Ok: {{`${chartdata.OK}`}}
 </b-card-sub-title>
        </b-col>
         <b-col style="margin-left:-20px" cols="3">
     <b-card-sub-title>
       Not Ok:{{`${chartdata.NOK}`}}
     </b-card-sub-title>
        </b-col>
      </b-row>
    <highcharts :constructor-type="'stockChart'" style="margin-left:-20px;padding-left:0px"  :options="chartOptions"></highcharts>
    </b-card>
</div>
</template>
<script>
import { Chart } from "highcharts-vue";

import spcConfig from "@/../spcConfig"
export default{
  name:'controlchart',
  props:{
  chartdatas:{},
  query:{}
  },
  components:{
    highcharts: Chart,
  },
    data(){
   return{
  xAxisdetails:{},
  chartdata:[],
  measuredDataList:[],
  date:null,
  chartName:'',
        chartOptions: {
  boost: {
        useGPUTranslations: true,
        },
   scrollbar: { enabled: false },
            rangeSelector: {
                selected: 4,
                inputEnabled: false,
                buttonTheme: {
                    visibility: 'hidden'
                },
                allButtonsEnabled: false,
                labelStyle: {
                    visibility: 'hidden'
                },
                enabled: false,
            },

            navigator: {
                visible: false,
                enabled: false
            },
  legend: {
    enabled:true,
        layout: 'horizontal',
        backgroundColor: '#FFFFFF',
        align: 'left',
        verticalAlign: 'top',
        floating: false,
        x: 90,
        y:0,
        
    },
         title:{
          text:" "
        },
       chart: {
        zoomType: 'xy',
         type: 'scatter',
        },
        series: [
        1],
    yAxis: 
    {
      endOnTick:false,
      startOnTick:false,
      tickAmount:6,
      labels: {
      visible: true,
      align: "left",
        style:{
        fontSize: 10
        },
       
  },
      
      min:0.0,
      max:0.0,
      label:"Wire Height",
      plotLines:[]
    },
    xAxis:
    {
      tickInterval:60000*10,
      type:'datetime',
      labels:{ 
        enabled: true,
        format: '{value:%H:%M}',
      },
      categories:[],
    }
      },
    }
  },
    created()
    {
      //chart data is an array but chartdatas is collection of objects. 
      //So They needed to be inserted into an array in order to access by index.

      this.chartdata= this.chartdatas
      this.setPlotLines(this.chartdata.UCL,this.chartdata.LCL,this.chartdata.Min,this.chartdata.Max,this.chartdata.Avg)
      this.setSeriesData(this.chartdata.DataList)
    },
    methods:{
        test(){},
        setPlotLines(Ucl,Lcl,Min,Max,Avg)
        {
            let uclPlot={
              color:"#FF9900",
              value:Ucl,
              width:3,
              dashStyle: 'LongDashDot'  ,
               zIndex:1,
            }
            let lclPlot={
              color:"#FF9900",
              value:Lcl,
              width:3,
                dashStyle: 'LongDashDot'  ,
                 zIndex:1,
            }
              let MinPlot={
              color:"#FF0000",
              value:Min,
              width:3,
                dashStyle: 'LongDashDot' ,
                 zIndex:0, 
            }
            let MaxPlot={
              color:"#FF0000",
              value:Max,
              width:3,
                dashStyle: 'LongDashDot',
                 zIndex:10,
            }
             let AvgPlot={
              color:"#666666",
              value:Avg,
              width:1.5,
              zIndex:3,
            }
            this.chartOptions.yAxis.plotLines.push(uclPlot)
            this.chartOptions.yAxis.plotLines.push(lclPlot)
            this.chartOptions.yAxis.plotLines.push(MinPlot)
            this.chartOptions.yAxis.plotLines.push(MaxPlot)
            this.chartOptions.yAxis.plotLines.push(AvgPlot)
            if(Min<Lcl){
            this.chartOptions.yAxis.min = Min-Min*0.02
            }
            else{
               this.chartOptions.yAxis.min = Lcl-Lcl*0.02
            }
           if(Ucl>Max)
            this.chartOptions.yAxis.max = Ucl+Max*0.02
            else{
              this.chartOptions.yAxis.max=Max+Max*0.02
            }
        },
       setSeriesData(datalist)
       {
           let data={}
            let maxLength={
              piece:{},
              value:0,
            }
          for(let i=0;i<datalist.length;i++){
              data[`${datalist[i].Piece}`]=[]
            }
          for(let i=0;i<datalist.length;i++){
            let d =new Date(datalist[i].Date)
            data[`${datalist[i].Piece}`].push([
            d.getTime()+10800000,datalist[i].Value])
          }
            for(let piece in data){
              let seriesBlock={
                name:`P${piece}`,
                data:data[piece],
                width:2,
              }
              this.chartOptions.series.push(seriesBlock)
              if(data[piece].length>maxLength.value){
                maxLength.value=data[piece].length
              }
            }
        },
    }
}
</script>
<style scoped>

</style>