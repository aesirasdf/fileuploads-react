import React, { useMemo } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from './ui/dialog'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './ui/table'
import { toPeso } from '../api/offline'
import { Button } from './ui/button'
import { Preview, print } from 'react-html2pdf'

export default function TransactionDialog({transaction, onDialogClose}) {

    
  const totalPrice = useMemo(() => {
    return transaction?.products?.reduce((prev, cur) => {
      return prev + +cur.pivot.quantity * +cur.pivot.price
    }, 0)
  }, [transaction])
  return (
    <Dialog open={!!transaction} onOpenChange={onDialogClose}>
        <DialogContent>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription></DialogDescription>
            <Preview id="to-be-printed">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                Description
                            </TableHead>
                            <TableHead>
                                Quantity
                            </TableHead>
                            <TableHead>
                                Price
                            </TableHead>
                            <TableHead>
                                Subtotal
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transaction?.products?.map(p => (
                            <TableRow key={p.id}>
                                <TableCell>{p.description}</TableCell>
                                <TableCell>{p.pivot.quantity}</TableCell>
                                <TableCell>{toPeso(p.pivot.price)}</TableCell>
                                <TableCell>{toPeso(p.pivot.quantity)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>
                                Total:
                            </TableCell>
                            <TableCell>
                                {toPeso(totalPrice)}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </Preview>
            <DialogFooter>
                <Button onClick={() => print('a', "to-be-printed")}>Print</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
