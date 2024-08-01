'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { collection, query, deleteDoc, getDocs, setDoc, getDoc, doc } from 'firebase/firestore';
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material';

export default function Home() {
    const [inventory, setInventory] = useState([]);
    const [open, setOpen] = useState(false);
    const [itemName, setItemName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const updateInventory = async () => {
        const snapshot = query(collection(firestore, 'inventory'));
        const docs = await getDocs(snapshot);
        const inventoryList = [];
        docs.forEach((doc) => {
            inventoryList.push({
                name: doc.id,
                ...doc.data(),
            });
        });
        setInventory(inventoryList);
    };

    const removeItem = async (item) => {
        const docRef = doc(collection(firestore, 'inventory'), item);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const { quantity } = docSnap.data();
            if (quantity === 1) {
                await deleteDoc(docRef);
            } else {
                await setDoc(docRef, { quantity: quantity - 1 });
            }
        }
        updateInventory(); // Refresh inventory after removing an item
    };

    const addItem = async (item) => {
        const docRef = doc(collection(firestore, 'inventory'), item);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const { quantity } = docSnap.data();
            await setDoc(docRef, { quantity: quantity + 1 });
        } else {
            await setDoc(docRef, { quantity: 1 });
        }
        updateInventory(); // Refresh inventory after adding an item
    };

    useEffect(() => {
        updateInventory();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box
            width="100vw"
            height="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
        >
            <Box display="flex" justifyContent="center" marginBottom={2}>
                <TextField
                    variant="outlined"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Box>
            <Modal open={open} onClose={handleClose}>
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    width={400}
                    bgcolor="white"
                    border="2px solid #000"
                    boxShadow={24}
                    p={4}
                    display="flex"
                    flexDirection="column"
                    gap={3}
                    sx={{
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <Typography variant="h6">Add Item</Typography>
                    <Stack width="100%" direction="row" spacing={2}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                        />
                        <Button
                            variant="outlined"
                            onClick={() => {
                                addItem(itemName);
                                setItemName('');
                                handleClose();
                            }}
                        >
                            Add
                        </Button>
                    </Stack>
                </Box>
            </Modal>
            <Button
                variant="contained"
                onClick={handleOpen}
            >
                Add New Item
            </Button>
            <Box
                border="1px solid #333"
                width="400px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                p={2}
            >
                <Box
                    width="100%"
                    height="50px"
                    bgcolor="#ADDBE6"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography
                        variant="h4"
                        color="#333"
                    >
                        Inventory Items
                    </Typography>
                </Box>
                <Stack
                    width="100%"
                    spacing={2}
                    overflow="auto"
                >
                    {filteredInventory.map(({ name, quantity }) => (
                        <Box
                            key={name}
                            width="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            bgcolor="#f0f0f0"
                            padding={2}
                        >
                            <Typography
                                variant="h6"
                                color="#333"
                                textAlign="center"
                            >
                                {name.charAt(0).toUpperCase() + name.slice(1)}
                            </Typography>
                            <Typography
                                variant="h6"
                                color="#333"
                                textAlign="center"
                            >
                                {quantity}
                            </Typography>
                            <Box display="flex" gap={1}>
                                <Button variant="contained" onClick={() => addItem(name)}>
                                    Add
                                </Button>
                                <Button variant="contained" onClick={() => removeItem(name)}>
                                    Remove
                                </Button>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}
