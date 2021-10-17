import React, { useState, useEffect } from 'react';
import { ListingItem, useListings } from '../domains/marketplace';
import { Select } from '../components/select';
import { Textarea } from '../components/textarea';

const createListing = (data) =>
    fetch('https://ecomm-service.herokuapp.com/marketplace', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json());

const editListing = (data, itemId) =>
    fetch(
        'https://ecomm-service.herokuapp.com/marketplace' +
            '/' +
            String(itemId),
        {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        }
    ).then((res) => res.json());

const usePersistedState = (storageKey, defaultValue) => {
    const [value, setValue] = React.useState(
        () => sessionStorage.getItem(storageKey) || defaultValue
    );

    React.useEffect(() => {
        sessionStorage.setItem(storageKey, value);
    }, [value, storageKey]);

    return [value, setValue];
};

const Marketplace = () => {
    // if null, not editing. otherwise, editing
    const { listings, loadListings, page, setPage } = useListings();

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = usePersistedState('editTitle', '');
    console.log(
        '🚀 ~ file: Marketplace.jsx ~ line 47 ~ Marketplace ~ editTitle',
        editTitle
    );
    const [editPrice, setEditPrice] = usePersistedState('editPrice', '');
    const [editDescription, setEditDescription] = usePersistedState(
        'editDescription',
        ''
    );
    const [editCondition, setEditCondition] = usePersistedState(
        'editCondition',
        'new'
    );
    const [editAvailability, setEditAvailability] = usePersistedState(
        'editAvailability',
        'in-stock'
    );
    const [editNumOfStock, setEditNumOfStock] = usePersistedState(
        'setEditNumOfStock',
        ''
    );

    const [title, setTitle] = usePersistedState('title', '');
    const [price, setPrice] = usePersistedState('price', '');
    const [description, setDescription] = usePersistedState('description', '');
    const [condition, setCondition] = usePersistedState('condition', 'new');
    const [availability, setAvailability] = usePersistedState(
        'availability',
        'in-stock'
    );
    const [numOfStock, setNumOfStock] = usePersistedState('numOfStock', '');

    const titleInputRef = React.useRef();

    useEffect(() => {
        if (editingId) {
            console.log('hello');
            const itemBeingEdited = listings.filter(
                (listing) => listing._id === editingId
            )[0];
            console.log(itemBeingEdited);

            setEditTitle(itemBeingEdited.title);
            setEditPrice(itemBeingEdited.price);
            setEditDescription(itemBeingEdited.description);
            setEditCondition(itemBeingEdited.condition);
            setEditAvailability(itemBeingEdited.availability);
            setEditNumOfStock(itemBeingEdited.numOfStock);
        }
    }, [
        editingId,
        listings,
        setEditTitle,
        setEditPrice,
        setEditDescription,
        setEditCondition,
        setEditAvailability,
        setEditNumOfStock,
    ]);

    const newForm = (
        <form
            onSubmit={(ev) => {
                ev.preventDefault();
                createListing({
                    title,
                    price: Number(price),
                    description,
                    condition,
                    availability,
                    numOfStock: Number(numOfStock),
                }).then(() => {
                    loadListings();
                    setTitle('');
                    setPrice('');
                    setDescription('');
                    setCondition('new');
                    setAvailability('in-stock');
                    setNumOfStock('');

                    if (titleInputRef.current) {
                        titleInputRef.current.focus();
                    }
                });
            }}
        >
            <div className="p-3">New Listing</div>
            <div className="space-y-5 p-3">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(ev) => setTitle(ev.target.value)}
                        required
                        ref={titleInputRef}
                    />
                </div>
                <div>
                    <label
                        htmlFor="price"
                        className="block text-sm font-medium"
                    >
                        Price
                    </label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(ev) => setPrice(ev.target.value)}
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium"
                    >
                        Description
                    </label>
                    <Textarea
                        id="description"
                        value={description}
                        onChangeValue={setDescription}
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="condition"
                        className="block text-sm font-medium"
                    >
                        Condition
                    </label>
                    <Select
                        id="condition"
                        value={condition}
                        onChangeValue={setCondition}
                        required
                    >
                        <option value="new">New</option>
                        <option value="used_like-new">Used (like new)</option>
                        <option value="used_good">Used (good)</option>
                        <option value="used_fair">Used (fair)</option>
                    </Select>
                </div>
                <div>
                    <label
                        htmlFor="availability"
                        className="block text-sm font-medium"
                    >
                        Availability
                    </label>
                    <Select
                        id="availability"
                        value={availability}
                        onChangeValue={setAvailability}
                        required
                    >
                        <option value="in-stock">In Stock</option>
                        <option value="single-item">Single Item</option>
                    </Select>
                </div>
                <div>
                    <label
                        htmlFor="numOfStock"
                        className="block text-sm font-medium"
                    >
                        Number of Available Stock
                    </label>
                    <input
                        type="number"
                        id="numOfStock"
                        value={numOfStock}
                        onChange={(ev) => setNumOfStock(ev.target.value)}
                        required
                    />
                </div>
                <div>
                    <button>ADD</button>
                </div>
            </div>
        </form>
    );

    const editForm = (
        <form
            onSubmit={(ev) => {
                ev.preventDefault();
                editListing(
                    {
                        title: editTitle,
                        price: Number(editPrice),
                        description: editDescription,
                        condition: editCondition,
                        availability: editAvailability,
                        numOfStock: Number(editNumOfStock),
                    },
                    editingId
                ).then(() => {
                    loadListings();
                    setEditTitle('');
                    setEditPrice('');
                    setEditDescription('');
                    setEditCondition('new');
                    setEditAvailability('in-stock');
                    setEditNumOfStock('');
                    setEditingId(null);
                });
            }}
        >
            <div className="p-3">Edit Listing</div>
            <div className="space-y-5 p-3">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={editTitle}
                        onChange={(ev) => setEditTitle(ev.target.value)}
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="price"
                        className="block text-sm font-medium"
                    >
                        Price
                    </label>
                    <input
                        type="number"
                        id="price"
                        value={editPrice}
                        onChange={(ev) => setEditPrice(ev.target.value)}
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium"
                    >
                        Description
                    </label>
                    <Textarea
                        id="description"
                        value={editDescription}
                        onChangeValue={setEditDescription}
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="condition"
                        className="block text-sm font-medium"
                    >
                        Condition
                    </label>
                    <Select
                        id="condition"
                        value={editCondition}
                        onChangeValue={setEditCondition}
                        required
                    >
                        <option value="new">New</option>
                        <option value="used_like-new">Used (like new)</option>
                        <option value="used_good">Used (good)</option>
                        <option value="used_fair">Used (fair)</option>
                    </Select>
                </div>
                <div>
                    <label
                        htmlFor="availability"
                        className="block text-sm font-medium"
                    >
                        Availability
                    </label>
                    <Select
                        id="availability"
                        value={editAvailability}
                        onChangeValue={setEditAvailability}
                        required
                    >
                        <option value="in-stock">In Stock</option>
                        <option value="single-item">Single Item</option>
                    </Select>
                </div>
                <div>
                    <label
                        htmlFor="numOfStock"
                        className="block text-sm font-medium"
                    >
                        Number of Available Stock
                    </label>
                    <input
                        type="number"
                        id="numOfStock"
                        value={editNumOfStock}
                        onChange={(ev) => setEditNumOfStock(ev.target.value)}
                        required
                    />
                </div>
                <div>
                    <button>EDIT</button>
                    <button
                        onClick={() => {
                            setEditTitle('');
                            setEditPrice('');
                            setEditDescription('');
                            setEditCondition('new');
                            setEditAvailability('in-stock');
                            setEditNumOfStock('');
                            setEditingId(null);
                        }}
                    >
                        CANCEL
                    </button>
                </div>
            </div>
        </form>
    );

    return (
        <div>
            {editingId ? editForm : newForm}
            <div className="max-w-7xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between">
                    <button
                        type="button"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Prev
                    </button>
                    <button type="button" onClick={() => setPage(page + 1)}>
                        Next
                    </button>
                </div>
                <div className="grid md:grid-cols-2 gap-x-4 gap-y-8 xl:grid-cols-3 xl:gap-x-6">
                    {listings &&
                        listings.map((item) => (
                            <ListingItem
                                imageUrl={item.imageUrl}
                                title={item.title}
                                description={item.description}
                                price={item.price}
                                availableStock={item.numOfStock}
                                availability={item.availability}
                                onlyOne={item.availability === 'single-item'}
                                itemId={item._id}
                                key={item._id}
                                refreshListings={loadListings}
                                editingId={editingId}
                                setEditingId={setEditingId}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Marketplace;
