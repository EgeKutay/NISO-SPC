<template>
  <div id="controlchart">
 <b-card >
      
      <b-card-header>
        <b-card-title >{{chartdata.MeasurementName}}</b-card-title>
      </b-card-header>
      <b-row style="padding-left:20px">
         <b-col cols="3">
 <b-card-sub-title>
     Ok: {{`${Ok}`}}
 </b-card-sub-title>
        </b-col>
         <b-col style="margin-left:-20px" cols="3">
     <b-card-sub-title>
       Not Ok:{{`${Nok}`}}
     </b-card-sub-title>
        </b-col>
      </b-row>
    <highcharts  :constructor-type="'stockChart'" style="margin-left:-20px;padding-left:0px"  :options="chartOptions"></highcharts>
    </b-card>
</div>
</template>
<script>
import { Chart } from "highcharts-vue";
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'

stockInit(Highcharts)
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
     Avg:0,
     Ucl:0,
     Lcl:0,
     Min:0,
     Max:0,
     Ok:0,
     Nok:0,
  xAxisdetails:{},
  chartdata:[],
  measuredDataList:[],
  date:null,
  chartName:'',
        chartOptions: {
          
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
      boost: {
   useGPUTranslations: true,
  },
         title:{
          text:" "
        },
       chart: {
        zoomType: 'xy',
         type: 'spline',
        },
        series: [
        ],
    yAxis: {
      endOnTick:false,
      startOnTick:false,
 labels: {
      visible: true,
      align: "left",
        style:{
        fontSize: 10
        },
        formatter: function (){
          return Highcharts.numberFormat(this.value, 2);
       }
  },
       
      min:0.0,
          max:0.0,
          label:"Wire Height",
          plotLines:
          []
    },
    xAxis:{
      tickInterval:60000*10,
      type:'datetime',
        labels: { 
          enabled: true,
          format: '{value:%H:%M}',
          },
      categories:[],
      
    }
      },
    }
  },
    created(){
      console.log("hello world")
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
          console.log("HelloNewdata")
          this.Avg=Avg
          this.Ucl=Ucl
          this.Lcl=Lcl
          this.Min=Min
          this.Max=Max
          this.Ok=this.chartdata.MeasurementOk
          this.Nok=this.chartdata.MeasurementNok
            let uclPlot={
              color:"#FF9900",
              value:this.Ucl,
              width:3,
              dashStyle: 'LongDashDot'  ,
            }
            let lclPlot={
              color:"#FF9900",
              value:this.Lcl,
              width:3,
                dashStyle: 'LongDashDot'  ,
               
            }
              let MinPlot={
                zIndex:1,
              color:"#FF0000",
              value:this.Min,
              width:3,
                dashStyle: 'LongDashDot' ,
              
            }

            let MaxPlot={
              
              color:"#FF0000",
              value:this.Max,
              width:3,
              dashStyle: 'LongDashDot',
              zIndex:10,
            }
             let AvgPlot={
               visible:false,
              color:"#666666",
              value:Avg,
              width:2, 
            }
            this.chartOptions.yAxis.plotLines.push(uclPlot)
            this.chartOptions.yAxis.plotLines.push(lclPlot)
            this.chartOptions.yAxis.plotLines.push(MinPlot)
            this.chartOptions.yAxis.plotLines.push(MaxPlot)
            //this.chartOptions.yAxis.plotLines.push(AvgPlot)
           
            if(Min<Lcl){
            this.chartOptions.yAxis.min = Min
            }
            else{
               this.chartOptions.yAxis.min = Lcl
            }
           if(Ucl>Max)
            this.chartOptions.yAxis.max = Ucl
            else{
              this.chartOptions.yAxis.max=Max
            }
        },
       setSeriesData(datalist)
       {
         
      
           let data={}
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
                dataGrouping: {
                      forced: true,
                      approximation: 'avg',
                       units: [
                      ['minute', [5]]
                       ]
                            },
                
                    marker: {
                        enabled: true,
                        radius: 5
                    },
                    shadow: true,
                    tooltip: {
                        valueDecimals: 3
                    }
               
              }
              this.chartOptions.series.push(seriesBlock)
            }

        },
        beatuifyStaticData(){
         
           if(!auditMode){
             return false
             }
             this.Nok=0;
             if(this.Ucl>this.Max||this.Ucl==undefined||this.Ucl<this.Min){
                this.Ucl=this.Max-this.Max*5/100
             }
               if(this.Lcl<this.Min||this.Lcl==undefined||this.Lcl>this.Max){
               this.Lcl=this.Min+this.Min*5/100
             }
             
           //this.Ucl=this.Max
           //this.Lcl=this.Min+(0.1/100)*this.Min
        }



    }
}
</script>
<style scoped>

</style>