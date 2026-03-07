export const calculateTotal = (carts) => {
  return carts.reduce((sum, item) => {
    return sum + item.product.price * item.qty;
  }, 0);
};
