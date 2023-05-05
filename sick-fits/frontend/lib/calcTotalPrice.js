export default function calcTotalPrice(cart) {
    return cart.reduce((tally, cartItem) => {
        if (!cartItem.product) return tally; // removed products could be still in cart
        return tally + cartItem.quantity * cartItem.product.price; 
    }, 0);
}