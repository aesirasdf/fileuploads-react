import React from 'react'
import Barcode from 'react-barcode'
import defaultpic from '../assets/default.png'
import { toPeso } from '../api/offline'

export default function ProductCard({product}) {
  return (
    <div className="flex flex-col p-2 border border-black justify-start items-center min-w-[250px] min-h-[300px]">
        <div className="flex-1">
        <div className="border h-[200px] w-[200px]" style={{background: `url("${product.extension ? `http://172.17.1.45:8000/storage/uploads/${product.id}.${product.extension}`: defaultpic}")`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
        </div>
        <div>
          <div >
            <Barcode width={2} height={40}  value={product.barcode} />
          </div>
            <div className="font-bold">
                {product.description}
            </div>
            <div>
                {toPeso(product.price) }
            </div>
        </div>
    </div>
  )
}
