 import ApiService from "./api.service"
//actions
export const SET_RTSPC_QUERY="getRtSpcData"
export const GET_LINES="getLines"
export const GET_WORKCENTERS_QUERY="getWorkcenters"
export const GET_STATION_TYPES="getStationType"
export const GET_STATIONS_QUERY="getStations"
//mutations
export const GET_RTSPC_DATA="getrtspcdata"
export const GET_LINES_DATA="getLinesData"
export const GET_WORKCENTERS_DATA="getWorkcentersData"
export const GET_STATION_TYPES_DATA="getStationTypeData"
export const GET_STATIONS_DATA="getStationsData"



const state={
    rtspcdata:[],
    linesdata:[],
    workcentersdata:[],
    stationtypedata:[],
    stationdata:[],
    
};

const getters={
    getRtSpcData(state){
    if(state.rtspcdata.lenght>0){
    return state.rtspcdata;
    }
    return state.rtspcdata
    },
    getLinesData(state){
        return state.linesdata
    },
    getWorkcentersData(state){
        return state.workcentersdata
    },
    getStationsData(state){
        return state.stationdata
    },
    getStationTypesData(state){
        
     
        return state.stationtypedata
    }
}

const actions={
   async [SET_RTSPC_QUERY](context,data){

       context.commit(GET_RTSPC_DATA,await ApiService.post("Data/GetRealTimeSPCData",data))
      /*
        this does basically same thing with the above code.
        ApiService.post("Data/GetRealTimeSPCData",data).then(
            (response)=>{
                context.commit(GET_RTSPC_DATA,response)
            }
        )
       */
    },
    async [GET_LINES](context){
        try{
        context.commit(GET_LINES_DATA,await ApiService.get("Common/GetLines"))
        }
        catch(err){
            console.error(err)
        }
    },

    async [GET_WORKCENTERS_QUERY](context,data){
        try{
        let response=await ApiService.query("Common/GetWorkcenters",data)
        context.commit(GET_WORKCENTERS_DATA,response)
        }
        catch(err){
            console.error(err);
        }
    },
    async [GET_STATIONS_QUERY](context,data){
        try{
        context.commit(GET_STATIONS_DATA,await ApiService.query("Common/GetStations",data))
        }
        catch(err){
            console.error(err)
        }
    },
    async [GET_STATION_TYPES](context){
        try{
        context.commit(GET_STATION_TYPES_DATA,await ApiService.get("Common/GetStationTypes"))
        }
        catch(err){
            console.error(err);
        }
    },
  
}

const mutations={
    [GET_RTSPC_DATA](state,response){
        if(response.lenght<1)
        console.error("")
      
        state.rtspcdata=JSON.parse(JSON.stringify(response.data))

    },
    [GET_LINES_DATA](state,response){
        state.linesdata=JSON.parse(JSON.stringify(response.data))
    },
    [GET_WORKCENTERS_DATA](state,response){
        state.workcentersdata=JSON.parse(JSON.stringify(response.data))
    },
    [GET_STATIONS_DATA](state,response){
        state.stationdata=JSON.parse(JSON.stringify(response.data))
    },
    [GET_STATION_TYPES_DATA](state,response){
        state.stationtypedata=JSON.parse(JSON.stringify(response.data))
    },
  

}

export default {
    state,
    getters,
    mutations,
    actions
}
