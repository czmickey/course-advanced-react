import { resetIdCounter, useCombobox } from 'downshift';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/client';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/dist/client/router';

const SEARCH_PRODUCTS_QUERY = gql`
    query SEARCH_PRODUCTS_QUERY($searchTerm: String!) {
        searchTerms: allProducts (
            where: {
                OR: [
                    { name_contains_i: $searchTerm },
                    { description_contains_i: $searchTerm }
                ]
            }
        ) {
            id
            name
            photo {
                image {
                    publicUrlTransformed
                }
            }
        }
    }
`;

export default function Search() {
    const router = useRouter();
    const [findItems, { loading, data, error }] = useLazyQuery(
        SEARCH_PRODUCTS_QUERY,
        {
            fetchPolicy: 'no-cache',
        }
    );
    const items = data?.searchTerms || [];
    console.log(data);
    const findItemsButChill = debounce(findItems, 350);
    resetIdCounter();
    const { isOpen, inputValue, getMenuProps, getInputProps, getComboboxProps, getItemProps, highlightedIndex } = useCombobox({
        items,
        onInputValueChange() {
            console.log('Input changed');
            findItemsButChill({
                variables: {
                    searchTerm: inputValue,
                }
            });
        },
        onSelectedItemChange({ selectedItem }) {
            router.push({
                pathname: `/product/${selectedItem.id}`
            })
            console.log('Selected item change');
        },
        itemToString: item => item?.name || ''
    });

    return (
        <SearchStyles>
            <div {...getComboboxProps()}>
                <input 
                    {...getInputProps({
                        type: 'search',
                        placeholder: 'Search for an Item',
                        id: 'search',
                        className: loading ? 'loading' : '',
                    })} 
                />
            </div>
            <DropDown {...getMenuProps()}>
                {isOpen && items.map((item, index) => (
                    <DropDownItem 
                        key={item.id} {...getItemProps({ item })} 
                        highlighted={index === highlightedIndex}
                    >
                        <img 
                            src={item.photo.image.publicUrlTransformed}
                            alt={item.name} 
                            width="50"
                        />
                        {item.name}
                    </DropDownItem>
                ))}
                {isOpen && !items.length && !loading && (
                    <DropDownItem>Sorry, No items found for {inputValue}</DropDownItem>
                )}
            </DropDown>
        </SearchStyles>
    );
}