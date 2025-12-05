import { MockedProvider } from "@apollo/react-testing";
import SingleProduct, { SINGLE_ITEM_QUERY } from "../components/SingleProduct";
import { fakeItem } from "../lib/testUtils";
import { render, screen } from "@testing-library/react";

const product = fakeItem();

const mocks = [
    {
        // When someone requests this query and variable combo
        request: { 
            query: SINGLE_ITEM_QUERY, 
            variables: {
                id: '123',
            },
        },
        // return this data
        result: {
            data: {
                Product: product,
            }
        }
    }
];

describe('<SingleProduct/>', () => {
    it('renders with proper data', async () => {
        const { container } = render(
            <MockedProvider mocks={mocks}>
                <SingleProduct id="123" />
            </MockedProvider>
        );

        // Wait for the test ID to show up
        await screen.findByTestId('singleProduct');
        expect(container).toMatchSnapshot();
    });

    it('Errors out when an item is not found', async() => {
        const errorMock = [
            {
                // When someone requests this query and variable combo
                request: { 
                    query: SINGLE_ITEM_QUERY, 
                    variables: {
                        id: '123',
                    },
                },
                // return this data
                result: {
                    errors: [{ message: 'Item not found!!!' }],
                },
            }
        ];

        const { container } = render(
            <MockedProvider mocks={errorMock}>
                <SingleProduct id="123" />
            </MockedProvider>
        );

        await screen.findByTestId('graphql-error');

        expect(container).toHaveTextContent('Shoot!');
        expect(container).toHaveTextContent('Item not found!!!');
    });
});