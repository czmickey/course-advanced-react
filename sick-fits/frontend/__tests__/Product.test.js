import { render, screen } from "@testing-library/react"
import Product from "../components/Product";
import { fakeItem } from '../lib/testUtils';
import { MockedProvider } from "@apollo/react-testing";

const product = fakeItem();

describe('<Product/>', () => {
    it('renders out the price tag and title', () => {
        const { container, debug } = render(<MockedProvider><Product product={product} /></MockedProvider>);
        expect(screen.getByText('50 €')).toBeInTheDocument();

        const link = container.querySelector('a');
        expect(link).toHaveAttribute('href', '/product/abc123');
        expect(link).toHaveTextContent(product.name);
    });
});