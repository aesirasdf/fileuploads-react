import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { store } from '../api/products'
import { toast } from 'react-toastify'

export default function ProductForm({categories, close, refresh}) {
    const [loading, setLoading] = useState(false)
    

  const onProductCreate = (e) => {
    e.preventDefault()
    if(!loading){
        const form = document.getElementById("create-product-form")
        const formdata = new FormData(form)
    
        setLoading(true)
        store(formdata).then(res => {
            if(res?.ok){
                toast.success(res?.message ?? "Product has been created!")
                close()
                refresh()
            }
            else{
                toast.error(res?.message ?? "Request didn't pass the validation!")
            }
        }).finally(() => {
            setLoading(false)
        })
    }
  }
  return (
    <form onSubmit={onProductCreate} id="create-product-form" action="" encType='multipart/form-data' className="p-3">
                <Input name="name" type="text" placeholder="Name" />
                <br />
                <Input name="description" type="text" placeholder="Description" />
                <br />
                <Select name="category_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Category"  />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={`${category.id}`}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <br />
                <Input name="price" type="number" placeholder="Price" />
                <br />
                <Input name="image" type="file" />
                <br />
                <Input name="barcode" type="text" placeholder="Barcode" />
                <br />
                <div className='text-right'>
                  <Button disabled={loading} type="submit" className="bg-green-400 text-neutral-950 hover:bg-green-700">Create</Button>
                </div>
              </form>
  )
}
