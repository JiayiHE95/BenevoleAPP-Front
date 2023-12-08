import axiosInstance from "./axiosInstance"

const fileAPI={
 importDataToDB(data){
  return axiosInstance.post(`file/import-data`,data)
 }

}
export default fileAPI