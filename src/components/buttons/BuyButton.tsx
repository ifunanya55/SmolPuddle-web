import React from 'react'
import { Button } from "@material-ui/core";
import { ethers } from "ethers";
import { useState } from "react";
import { SmolPuddleAbi } from "../../abi/SmolPuddle";
import { SmolPuddleContract } from "../../constants";
import { useObservable, useStore } from "../../stores";
import { OrderbookStore } from "../../stores/OrderbookStore";
import { Web3Store } from "../../stores/Web3Store";
import { Order, orderAbiEncode } from "../../types/order";

export function BuyButton(props: { order?: Order, variant: 'text' | 'outlined' | 'contained' | undefined }) {
  const { order, variant } = props

  const web3Store = useStore(Web3Store)
  const orderbookStore = useStore(OrderbookStore)

  const [pending, setPending] = useState(false)

  const account = useObservable(web3Store.account)

  const buy = () => {
    if (!order) return console.warn("no order found")

    const signer = web3Store.injected.get()?.getSigner()
    if (signer === undefined) {
      web3Store.connect().then(() => buy())
      return
    }

    const contract = new ethers.Contract(SmolPuddleContract, SmolPuddleAbi).connect(signer)
    contract.swap(orderAbiEncode(order), order.signature).then((tx: ethers.providers.TransactionResponse) => {
      setPending(true)
      tx.wait().then(() => {
        orderbookStore.refreshStatus(order).then(() => {
          setPending(false)
        })
      })
    })
  }

  return <>
  { (order && order.seller !== account) && <Button variant={variant} disabled={pending} size="small" color="primary" onClick={buy}>
    { pending ? 'Buying...' : 'Buy' } - {ethers.utils.formatEther(order.ask.amountOrId)} ETH
  </Button> }
  </>
}
