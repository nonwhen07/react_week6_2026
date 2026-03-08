const CategoryCard = ({ category }) => {
  return (
    <div className="category-card">
      <img src={category.image} />

      <h3>{category.title}</h3>
    </div>
  );
};

export default CategoryCard;
