
export const eventLog=(...data: any[])=>{
  const t=new Date().toDateString().replace(/T/g,' ').split('.')[0]
  console.log(t,data)
}