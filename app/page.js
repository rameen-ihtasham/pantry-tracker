'use client'
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { firestore } from "@/firebase";
import { Box, Typography, DataGrid, TextField, Button, styled, Stack, Item, ButtonGroup, Alert, AlertTitle } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, setDoc, getDoc } from "firebase/firestore";

const ColorButton = styled(Button)(() => ({
  color: "white",
  backgroundColor: "transparent",
  fontSize: "40px",
  maxHeight: "55px",
  '&:hover': {
    backgroundColor: 'transparent', // Remove the default hover background
    color: 'white',
  }
}));



const CustomTextField = styled(TextField)({
  '& .MuiFilledInput-root': {
    backgroundColor: 'rgba(186, 182, 173, 0.8)',
    color: '#00072D',
    '&:hover': {
      backgroundColor: 'rgba(186, 182, 173, 0.8)', // Same as default to avoid hover effect
      color: '#00072D', // Same as default to avoid hover effect
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(186, 182, 173, 0.8)', // Same as hover
      color: '#00072D', // Same as hover
    },
  },
  '& .MuiInputLabel-root': {
    color: '#00072D',
    '&.Mui-focused': {
      color: '#00072D', // Keep label color the same when focused
    },
  },
  '& .MuiFilledInput-underline:before': {
    borderBottomColor: 'rgba(0, 7, 45, 0.42)',
  },
  '& .MuiFilledInput-underline:hover:before': {
    borderBottomColor: '#00072D',
    borderColor: 'white',
  },
  '& .MuiFilledInput-underline:after': {
    borderBottomColor: 'white',
    borderColor: 'white',
  },
});


export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setQuantity] = useState(0);
  const [tempPantry, setTempPantry] = useState([]);
  const [isOn, setOn] = useState(false);


  const updateInventory = useCallback(async () => {
    const pantryList = [];
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const tempList = [];

    docs.forEach((doc) => {
      tempPantry.map((item) => {
        if (item.name === doc.id) {
          tempList.push({
            name: doc.id,
            ...doc.data()
          });
        }
      })
      pantryList.push({
        name: doc.id,
        ...doc.data()
      });
    });
    setPantry(pantryList);
    if (!isOn) {
      setTempPantry(pantryList);
    }
    else {
      setTempPantry(tempList);
    }


  }, [isOn]);

  const searchItem = (required) => {
    const result = []
    if (required === '') {
      setTempPantry(pantry);
      setOn(false);
    }
    else {
      pantry.map((item) => {
        if (item.name.toLowerCase().includes(required.toLowerCase())) {
          result.push(item);
        }
      })
      setTempPantry(result);
      setOn(true)
    }
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const addItem = async (item, userQuantity = 0) => {
    const docRef = doc(collection(firestore, 'pantry'), item.toLowerCase())
    const docSnap = await getDoc(docRef);
    if (userQuantity === 0) {
      userQuantity = userQuantity + 1
    }
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + userQuantity })
    } else {
      await setDoc(docRef, { quantity: userQuantity })
    }
    await updateInventory()
  }



  useEffect(() => {
    updateInventory();
  }, [updateInventory]);



  return (
    <Box width={"100%"} height={"100%"} bgcolor={"#00072D"}>
      <Box width='100vw' height='15vh' bgcolor='#0A2472' color={"white"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Typography variant="h2" >Pantry Tracker</Typography>
      </Box>

      <Box width='100vw' height='15vh' bgcolor='#051650' color={"white"} display={"flex"} alignItems={"center"} justifyContent={"space-between"} padding={"10px"}>
        <Box display={"flex"} gap={2}>
          <CustomTextField
            key="textfield"
            onChange={(e) => {
              setItemName(e.target.value);
            }}
            id="filled-search"
            label="Item Name"
            type="search"
            variant="filled"
            value={itemName}

          />
          <CustomTextField
            id="filled-number"
            label="Quantity"
            type="number"
            value={itemQuantity}
            onChange={(e) => {
              const numericValue = parseInt(e.target.value, 10); // Convert the string to a number
              setQuantity(numericValue);
            }}
            InputLabelProps={{
              shrink: true,
            }}
            variant="filled"

          />
          <ColorButton onClick={() => {
            if (itemName.length > 0) {
              addItem(itemName, itemQuantity);
              setQuantity(0);
              setItemName("");
            }
          }
          }>+</ColorButton>
        </Box>
        <Box>
          <CustomTextField
            id="filled-search"
            label="Search Item"
            type="search"
            variant="filled"
            onChange={(e) => {
              const value = e.target.value;
              searchItem(value);
            }}
          />
        </Box>
      </Box>

      <Box display={"flex"} justifyContent={"center"} paddingTop={"20px"} gap={4} flexDirection={"column"} alignItems={"center"}>
        {tempPantry.map((item) => {
          return <Box minHeight={"100px"} key={item.name} width={"50%"} color={"white"} display={"flex"} alignItems={"center"} justifyContent={"space-around"} bgcolor={"#3c435e"} borderRadius={"10px"}>
            <Typography> {item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Typography>
            <Typography>Quantity: {item.quantity}</Typography>
            {!isOn ? (<ButtonGroup
              orientation="vertical"
              aria-label="Vertical button group"
              variant="text"
            >
              <Button data-item={item.name} onClick={() => {
                addItem(item.name);
              }}>+</Button>
              <Button data-item={item.name} onClick={() => {
                removeItem(item.name);
              }}>-</Button>
            </ButtonGroup>) : null}


          </Box>
        })}
      </Box>

    </Box>

  );
}