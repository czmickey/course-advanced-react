import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import Router from 'next/router';
import CreateProduct, { CREATE_DATA_MUTATION } from '../components/CreateProduct';
import { fakeItem, makePaginationMocksFor } from '../lib/testUtils';
import { ALL_PRODUCTS_QUERY } from '../components/Products';

const item = fakeItem();

describe('<CreateProduct/>', () => {
    it('renders and matches the snapshot', () => {
        const { container } = render(
            <MockedProvider>
                <CreateProduct />
            </MockedProvider>
        );

        expect(container).toMatchSnapshot();
    });

    it('handles the updating', async () => {
        // 1. render the form out
        const { container } = render(
            <MockedProvider>
                <CreateProduct />
            </MockedProvider>
        );

        // 2. type into boxes
        await userEvent.type(screen.getByPlaceholderText(/Name/i), item.name);
        
        // probably because of newer version of packages, input is needed to be cleared first
        // see more on slack thread https://wesbos.slack.com/archives/C9G96G2UB/p1642598592183300?thread_ts=1642560686.178400&cid=C9G96G2UB
        userEvent.clear(screen.getByPlaceholderText(/Price/i));

        await userEvent.type(screen.getByPlaceholderText(/Price/i), item.price.toString());
        await userEvent.type(screen.getByPlaceholderText(/Description/i), item.description);

        // 3. check those boxes are populated
        expect(screen.getByDisplayValue(item.name)).toBeInTheDocument();
        expect(screen.getByDisplayValue(item.price)).toBeInTheDocument();
        expect(screen.getByDisplayValue(item.description)).toBeInTheDocument();
    });
});
