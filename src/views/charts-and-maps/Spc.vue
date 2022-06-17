<template>
<b-form-group>
  <b-col cols="12">
   <b-card no-body style="background-color:#f0f0fa;padding:15px">
  <b-row>
      <b-col cols="auto" >
           <label for="line">Line</label>
     <b-form-select
     id="line"
      v-model="lineselected"
      :options="lineoption"
       @change="fetchWorkCenterData"
    />
      </b-col>
     <b-col cols="auto" >
       <label for="workcenter">Workcenter</label>
      <b-form-select
      id="workcenter"
      v-model="wcselected"
      :options="wcoption"
      @change="fetchStationsData"
    />
     </b-col>

     <b-col cols="auto">
      <label for="stationtype">Station Type</label>
      <b-form-select
      id="stationtype"
      v-model="sttypeselected"
      :options="stoption"
      @change="fetchStationsTypeData"
    />
     </b-col>

  </b-row>
    </b-card>
  </b-col>
    <b-card style="background-color:#f0f0fa;"  v-if="Object.keys(stationObjects).length>0">
          <b-tabs @change="fetchStationsData"  >
            <b-tab v-for="station in stationObjects" :key="station.StationName" :title=station.StationName  >
              <b-card-body>
          <station :stationObj="station" :linedId="lineselected" :key="wcselected" />
            </b-card-body>
              </b-tab>
          </b-tabs>
          
    
        </b-card>
        <h1 v-else style="color:#FF9900"> Cannot find the station with the paramaters you selected.</h1>
</b-form-group>
</template>
<script>
  import Station from "@/views/charts-and-maps/charts/highchart/Stations.vue";
import spcConfig from "@/../spcConfig"
   import {GET_LINES,GET_WORKCENTERS_QUERY,GET_STATION_TYPES,GET_STATIONS_QUERY} from "@/store/spc/rtspc.module"
   import dummyparams from "@/views/charts-and-maps/dummydata/dummyparams.json"
/*
in this component there will be select component that changes the  queue data. and it will be used in Station.vue

*/
export default {
  name:"Spc",
  components:{
      station:Station
  },
  created(){
  //these should in a order: fetchLinedata-> fetchworkcenterdata ->  Type
  if(this.useDummy){
    this.lineoption=dummyparams["lineoptions"]
    this.wcoption=dummyparams["wcoptions"],
     this.stoption=dummyparams["stoptions"]
     this.stationObjects=dummyparams["stationobject"]
  }
  else{
this.fetchLineData()
this.fetchWorkCenterData()
this.fetchStationsTypeData()
this.fetchStationsData()
  }
  },
  data(){
    return {
      useDummy:spcConfig["DUMMY_DATA"],
      stationObjects:{},
      lineselected:2,
      wcselected:10,
      stselected:1,
      sttypeselected:1,
     lineoption:[],
     wcoption:[],
     stoption:[],
    }
  },
  methods:{
fetchLineData()
  {
  this.$store.dispatch(GET_LINES).then(
          ()=>{
                let jsondata=JSON.parse(JSON.stringify(this.$store.getters.getLinesData))
          
          for(let option in jsondata){
            let data={
              value:jsondata[option].Value,
              text:`${jsondata[option].Text}`,
            }
            this.lineoption.push(data)
          }
         console.log(JSON.stringify(this.lineoption))            
         })
  },
  fetchWorkCenterData(){
    this.wcoption=[]
    this.$store.dispatch(GET_WORKCENTERS_QUERY,{ params: { lineId: this.lineselected } }).then(
          ()=>{
            let jsondata=JSON.parse(JSON.stringify(this.$store.getters.getWorkcentersData))
                for(let option in jsondata){
            let data={
              value:jsondata[option].Value,
              text:`${jsondata[option].Text}`,
            }
           
           this.wcoption.push(data)
          }
           console.log(JSON.stringify(this.wcoption))      
           this.fetchStationsData()
           
                })
  },
  fetchStationsTypeData(){
    this.$store.dispatch(GET_STATION_TYPES).then(
          ()=>{
            this.stoption=[]
                let jsondata=JSON.parse(JSON.stringify(this.$store.getters.getStationTypesData))
          for(let option in jsondata){
            let data={
              value:jsondata[option].Value,
              text:`${jsondata[option].Text}`,
            }
            this.stoption.push(data)
          }
          console.log(JSON.stringify(this.stoption))      
          this.fetchStationsData()
                })
  },
  test(){
   
  },
   fetchStationsData(){
        this.$store.dispatch(GET_STATIONS_QUERY,{ params: {workcenterId:this.wcselected,stationTypeId:this.sttypeselected,isFiltered:true}}).then(()=>
        {
       let jsondata=JSON.parse(JSON.stringify(this.$store.getters.getStationsData))
       this.stationObjects=jsondata
       console.log(JSON.stringify(this.stationObjects))
        })

      },
  }
    
}
</script>
<style scoped>

</style>