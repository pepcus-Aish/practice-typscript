import React from "react";
import { useQuery } from "react-query";
import { useState } from "react";

//Components
import Cart from "./components/Cart/Cart";
import Item from "../src/components/Items/Item";
import Drawer from "@mui/material/Drawer";
import { LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Badge from "@mui/material/Badge";
//styles
import { Wrapper, StyledButton } from "./App.styles";
//Types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
  // rating :object;
};

const getProducts = async (): Promise<CartItemType[]> => {
  return await (await fetch("https://fakestoreapi.com/products")).json();
};

//useQuery arguments query key, function call
const App = () => {
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    "products",
    getProducts
  );

  //functions

  const getTotalItems = (items: CartItemType[]) => {
    return items.reduce((acc: number, item) => acc + item.amount, 0);
  };

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev =>{
      const isItemInCart = prev.find(item=> item.id === clickedItem.id)
    

    if(isItemInCart){
      return prev.map(item => (
        item.id === clickedItem.id ? {...item ,amount: item.amount +  1}
        : item
      ))
    }

    return [...prev,{...clickedItem, amount:1}];
  });
  };

  const handleRemoveFromCart = (id:number) => {
   setCartItems(prev =>(
    prev.reduce((ack,item)=> {
     if(item.id === id){
      if(item.amount === 1 ) return ack;
      return [...ack,{...item, amount: item.amount -1}];
     }else{
      return [...ack, item];
     }
    },[] as CartItemType[])
   ))
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>"Something went wrong..."</div>;
  return (
    <>
      <Wrapper>
        <Drawer
          anchor="right"
          open={cartOpen}
          onClose={() => setCartOpen(false)}
        >
          <Cart
            cartItems={cartItems}
            addToCart={handleAddToCart}
            removeFromCart={handleRemoveFromCart}
          />
        </Drawer>
        <StyledButton onClick={() => setCartOpen(true)}>
          <Badge badgeContent={getTotalItems(cartItems)} color="error"></Badge>
          <AddShoppingCartIcon />
        </StyledButton>
        <Grid container spacing={3}>
          {data?.map((item) => (
            <Grid item key={item.id} xs={12} sm={4}>
              <Item item={item} handleAddToCart={handleAddToCart} />
            </Grid>
          ))}
        </Grid>
      </Wrapper>
    </>
  );
};

export default App;
