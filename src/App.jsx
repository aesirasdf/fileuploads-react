import React, { useEffect, useMemo, useState } from 'react'
import { index, store } from './api/products'
import { index as categoryIndex } from './api/categories'
import ProductCard from './components/ProductCard'

export default function App() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState(0)

  useEffect(() => {
    refreshProducts()
    refreshCategory()
  }, [])

  const refreshProducts = () => {
    index().then(res => {
      if(res?.ok){
        setProducts(res.data)
      }
    })
  }
  const refreshCategory = () => {
    categoryIndex().then(res => {
      if(res?.ok){
        setCategories(res.data)
      }
    })
  }

  const onProductCreate = (e) => {
    e.preventDefault()
    const form = document.getElementById("create-product-form")
    const formdata = new FormData(form)

    store(formdata).then(res => {
      
    })

  }


  const filteredProducts = useMemo(() => {
    if(products.length != 0){
      if(category == 0) {
        return products
      }
      else{
        return products.filter(x => x.category_id === category)
      }
    }
    else{
      return products
    }
  }, [category, products])



  return (
    <div className='min-h-screen flex flex-col'>
      <nav className="p-3 text-white bg-blue-500">
        SM Supermarket
      </nav>
      <div className="flex-1 bg-slate-500 flex">
        <nav className="w-[50px] lg:w-[200px] transition-all bg-red-600 flex flex-col text-white items-center">
          
          <div onClick={() => setCategory(0)} className="hidden lg:block bg-red-700 w-full p-3 hover:bg-red-800 transition-all">
            All
          </div>
          {categories.map(category => (
            <div key={category.id} onClick={() => setCategory(category.id)} className="hidden lg:block bg-red-700 w-full p-3 hover:bg-red-800 transition-all">
              {category.name}
            </div>
          ))}
        </nav>
        <main className="flex-1 bg-green-400">
          <form onSubmit={onProductCreate} id="create-product-form" action="" encType='multipart/form-data' className="p-3">
            <input name="name" type="text" placeholder="Name" />
            <br />
            <input name="description" type="text" placeholder="Description" />
            <br />
            <select name="category_id">
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <br />
            <input name="price" type="number" placeholder="Price" />
            <br />
            <input name="image" type="file" />
            <br />
            <input type="submit" />
          </form>
          <div className="p-3 text-xl font-bold">
            {categories?.find(x => x.id === category)?.name ?? "All"}
          </div>
          <div className="flex gap-3 p-3">
            {
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            }
          </div>
        </main>
      </div>
    </div>
  )
}
