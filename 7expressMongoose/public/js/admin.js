const deleteProduct = async (params) =>{
  if(!params){
    return
  }
  console.log('tariel', params)
  const csrf = params.parentNode.querySelector('[name=_csrf]')?.value
  const productId = params.parentNode.querySelector('[name=id]')?.value
  const productCard = params.closest('article')
  try{
    const data = await fetch(`/admin/delete-product/${productId}`, {
      method: "DELETE",
      headers:{
        'csrf-token': csrf
      }
    })
    const result = await data.json()
    if(result){
      productCard.remove()
    }
    console.log('data', data)
  }catch(e){
    console.log(e)
  }
}