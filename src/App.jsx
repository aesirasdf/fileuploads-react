import React, { useEffect, useMemo, useState } from 'react'
import { index, store } from './api/products'
import {store as storeTransaction, index as indexTransaction} from './api/transactions'
import { index as categoryIndex } from './api/categories'
import ProductCard from './components/ProductCard'
import { Button } from './components/ui/button'
import { Table, TableHeader, TableBody, TableHead, TableCell, TableFooter, TableRow } from './components/ui/table'
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogTitle } from './components/ui/dialog'
import ProductForm from './components/ProductForm'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import { Input } from './components/ui/input'
import { toPeso } from './api/offline'
import dayjs from 'dayjs'
import TransactionDialog from './components/TransactionDialog'

export default function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState(0)
  const [createDialog, setCreateDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [transactionDialog, setTransactionDialog] = useState()

  useEffect(() => {
    refreshProducts()
    refreshCategory()
    refreshTransactions()
  }, [])

  const refreshTransactions = () => {
    indexTransaction().then(res => {
      if(res?.ok)
        setTransactions(res.data)
    })
  }

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

  const focusOnBarcode = (e) => {
    if(e.target.id != 'quantity'){
      const barcode = document.getElementById("barcode")
      barcode.focus()
    }
  }
  
  const totalPrice = useMemo(() => {
    return cart.reduce((prev, cur) => {
      return prev + +cur.quantity * +cur.price
    }, 0)
  }, [cart])


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

  const onBarcodePress = ({target, key}) => {
    if(key === "Enter"){
      const product = products.find(x => x.barcode === target.value)
      const inCart = cart.find(x => x.id === product.id)
      const quantity = +document.getElementById("quantity").value
      if(inCart){
        inCart.quantity = +inCart.quantity + quantity
        setCart([...cart])
      }
      else{
        product.quantity = quantity
        setCart([product, ...cart])
      }
      target.value = ""
      document.getElementById("quantity").value = 1
    }
  }


  const onCartDelete = (id) => {
    const tempCart = cart.filter(x => x.id != id)
    setCart(tempCart)
  }

  const onCheckout = () => {
    if(!loading){
      setLoading(true)
      storeTransaction(cart).then(res => {
        if(res?.ok){
          toast.success(res?.message ?? "Transaction complete!")
        }
        else{
          toast.error(res?.message ?? "Something went wrong!")
        }
      }).finally(() => {
        setLoading(false)
        setCart([])
      })
    }
  }


  const transactionOpen = (transaction) => {
    console.log(transaction)
    setTransactionDialog(transaction)
  }



  return (
  <>
    <div className='min-h-screen flex flex-col'>
      <nav className="p-3 flex text-white bg-blue-500">
        <div className="flex-1 text-3xl font-bold">
          MFI Supermarket
        </div>
        <div>
          <Button onClick={() => setCreateDialog(true)} className="bg-green-400 text-neutral-950 hover:bg-green-950 hover:text-neutral-50">Add Product</Button>
          <Dialog open={createDialog} onOpenChange={() => setCreateDialog(false)}>
            <DialogContent>
              <DialogTitle>Create Product</DialogTitle>
              <DialogDescription></DialogDescription>
              <ProductForm refresh={refreshProducts} close={() => setCreateDialog(false)} categories={categories} />
            </DialogContent>
          </Dialog>
        </div>
      </nav>
      <div className="flex-1 bg-slate-500 flex">
        <nav className="w-[0px] lg:w-[200px] transition-all bg-red-600 flex flex-col text-white items-center">
          
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
          <div className="p-3 text-xl font-bold">
            {categories?.find(x => x.id === category)?.name ?? "All"}
          </div>
          <div className="flex gap-3 p-3 flex-wrap">
            {
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            }
          </div>
        </main>
        <div className="w-[500px] bg-orange-300 shadow-xl relative" onClick={focusOnBarcode}>
          <div className="flex flex-col sticky top-0 h-100vh">
            <div className="text-3xl p-3">
              Cart
            </div>
            <div className="p-5 flex-1 max-h-[600px] overflow-auto bg-secondary">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead>Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {cart.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>{p.description}</TableCell>
                    <TableCell>{toPeso(p.price)}</TableCell>
                    <TableCell>{p.quantity}</TableCell>
                    <TableCell>{toPeso(+p.price * +p.quantity)}</TableCell>
                    <TableCell><Button onClick={() => onCartDelete(p.id)} className="p-1 px-3" variant="destructive">X</Button></TableCell>
                  </TableRow>
                ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="font-extrabold">
                    <TableCell colSpan={3}>Total:</TableCell>
                    <TableCell>{toPeso(totalPrice)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
              {/* {cart.map(p => (
                <div key={p.id} className="text-xl font-bold">{p.description} {toPeso(p.price)} x {p.quantity} - {toPeso(p.price * p.quantity)}</div>
              ))} */}
            </div>
            <div className="p-10 flex gap-2">
              <Input onKeyPress={onBarcodePress} className="bg-white flex-1" placeholder="Barcode" id="barcode" />
              <Input className="bg-white w-20" max="100" min="1" defaultValue="1" placeholder="Quantity" id="quantity" type="number" />
            </div>
            <div className="px-10">
              <Button disabled={loading} onClick={onCheckout} className="w-full" variant="destructive">Checkout</Button>
            </div>
            <div className="px-10 mt-5 bg-secondary">
                {
                  transactions.map(transaction => (
                    <div key={transaction.id} className="border border-primary" onClick={() => transactionOpen(transaction)}>
                        {dayjs(transaction.created_at).format("YYYY-MM-DD HH:mm:ss")}
                    </div>
                  ))
                }
            </div>
          </div>
        </div>
      </div>
    </div>
    <ToastContainer theme="dark" position="top-center" />
    {
      transactionDialog && <TransactionDialog transaction={transactionDialog} onDialogClose={() => setTransactionDialog(null)} />
    }
  </>
  )
}
