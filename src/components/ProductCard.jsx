import React from 'react'

export default function ProductCard({product}) {
  return (
    <div className="flex flex-col p-2 border border-black justify-start items-center w-[200px] min-h-[250px]">
        <div className="flex-1">
        <div className="border h-[100px] w-[100px]" style={{background: `url("http://localhost:8000/storage/uploads/${product.id}.${product.extension}")`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
        </div>
        <div>
            <div className="font-bold">
                {product.description}
            </div>
            <div>
                {new Intl.NumberFormat("en-US", {style:"currency", currency:"php"}).format(product.price) }
            </div>
        </div>
    </div>
  )
}
