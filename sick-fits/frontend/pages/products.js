import Products from "../components/Products";
import Pagination from "../components/Pagination";

const ProductsPage = props => (
    <div>
        <Pagination page={1} />
        <Products />
        <Pagination page={1} />
    </div>
);

export default ProductsPage;