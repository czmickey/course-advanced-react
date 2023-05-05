import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
    return {
        keyArgs: false, // tells apollo we will take care of everything
        read(existing = [], { args, cache }) {
            const { skip, first } = args;

            // read the number of items on the page from the cache
            const data = cache.readQuery({ query: PAGINATION_QUERY });
            const count = data?._allProductsMeta?.count;
            const page = skip / first + 1;
            const pages = Math.ceil(count / first);

            // check if we have existing items
            const items = existing
                .slice(skip, skip + first)
                .filter(x => x); // items can be undefined -> "filter" will filter them out
                
            // if there are items, but there aren't enough items to satisfy requested count but we are on the last page
            if (items.length && items.length !== first && page === pages) {
                return items;
            }

            // don't have any items, we must go to the network to fetch them
            if (items.length !== first) {
                return false;
            }

            // return items if they are in the cache
            if (items.length === first) {
                return items;
            }

            return false; // fallback to network
        },
        merge(existing, incoming, { args }) {
            const { skip } = args;
            // apollo are back from network with our items
            const merged = existing ? existing.slice(0) : [];
            for (let i = skip; i < skip + incoming.length; ++i) {
                merged[i] = incoming[i - skip];
            }
            return merged;
        }
    }
}