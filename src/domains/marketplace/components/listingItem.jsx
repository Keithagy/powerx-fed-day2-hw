import {
    PencilIcon,
    TrashIcon,
    ShoppingCartIcon,
} from '@heroicons/react/solid';
import { Button } from '../../../components/button';
import PropTypes from 'prop-types';
import * as React from 'react';

const EditButton = ({ text, onClick }) => (
    <Button variant="primary" onClick={onClick}>
        <PencilIcon className="h-4 w-4 mr-1.5" />
        {text}
    </Button>
);

const DeleteButton = ({ text, onClick }) => (
    <Button variant="outline" onClick={onClick}>
        <TrashIcon className="w-4 h-4 mr-1.5" />
        {text}
    </Button>
);

const Badge = ({ children }) => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        {children}
    </span>
);

export const ListingItem = (props) => {
    const { refreshListings, itemId, editingId, setEditingId } = props;
    const [isDeleting, setIsDeleting] = React.useState(false);

    const onDeleteListing = () => {
        setIsDeleting(true);
        fetch(
            'https://ecomm-service.herokuapp.com/marketplace' +
                '/' +
                String(itemId),
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        ).then((res) => {
            res.json();
        });
        setIsDeleting(false);
    };

    const onEditListing = () => {
        setEditingId(itemId);
    };

    return (
        <div className="relative flex flex-col">
            <div className="group block w-full rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-pink-500 overflow-hidden">
                <img
                    src={props.imageUrl}
                    alt=""
                    className="object-cover pointer-events-none group-hover:opacity-75 h-48 w-full"
                />
                <button
                    type="button"
                    className="absolute inset-0 focus:outline-none"
                >
                    <span className="sr-only">
                        View details for {props.title}
                    </span>
                </button>
            </div>
            <div className="flex-1 flex md:flex-col justify-between items-start md:items-stretch gap-3 px-2">
                <div className="mt-1 flex-1">
                    <div className="flex justify-between items-center gap-3">
                        <div>
                            RM{' '}
                            <span className="text-2xl font-bold">
                                {props.price}
                            </span>
                        </div>
                        {props.onlyOne ? (
                            <Badge>Only One</Badge>
                        ) : (
                            <div className="text-sm text-gray-500">
                                {props.availableStock} piece available
                            </div>
                        )}
                    </div>
                    <p className="block text-sm font-medium text-gray-900 truncate pointer-events-none">
                        {props.title}
                    </p>
                    <p className="block text-sm font-medium text-gray-500 pointer-events-none">
                        {props.description}
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-3 py-3">
                    {props.onAddToCart ? (
                        <Button variant="primary" onClick={props.onAddToCart}>
                            <ShoppingCartIcon className="h-4 w-4 mr-1.5" /> ADD
                            TO CART
                        </Button>
                    ) : (
                        <>
                            <EditButton
                                text={editingId ? 'EDITING...' : 'EDIT'}
                                onClick={() => onEditListing()}
                            />
                            <DeleteButton
                                text={isDeleting ? 'DELETING...' : 'DELETE'}
                                onClick={() => {
                                    onDeleteListing();
                                    refreshListings();
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

ListingItem.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    imageUrl: PropTypes.string,
    /**
     * Required if `onlyOne` is `false`.
     */
    availableStock: PropTypes.number,
    onlyOne: PropTypes.bool,
};
