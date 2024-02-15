export const ShowMessage = (message:string)=>{
  console.log('ShowMessage:',message)
  alert(message)
}

export const ShowError=(error:any )=>{
  const msg=error.message || error || 'unknown error'
  console.log('ShowError:',msg)
  alert(msg)
}