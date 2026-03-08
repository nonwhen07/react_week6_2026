const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />

      <h3>{product.title}</h3>

      <p className="price">${product.price}</p>

      <button className="btn-primary">Add to Cart</button>
    </div>
  );
};

export default ProductCard;
