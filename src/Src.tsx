import { gql, useLazyQuery } from "@apollo/client";
import React, { useState } from "react";

import debounce from "lodash.debounce";
import { useCombobox } from "downshift";
import styled, { keyframes } from "styled-components";

const SEARCH_QUERY = gql`
  query Search($query: String!) {
    search(query: $query) {
      id
      name
      email
    }
  }
`;

const DropDown = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  z-index: 2;
  border: 1px solid gray;
`;

const DropDownItem = styled.div``;

const SearchStyles = styled.div`
  position: relative;
  height: 50vh;
`;

const Input = styled.input`
  width: 100%;
  font-size: 1em;
  // margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

const Search = () => {
  const [term, setTerm] = useState("");
  const [item, setItem] = useState<Data>();

  // Return type for query
  type Data = {
    id: string;
    name: string;
    email: string;
  };

  const [findItems, { loading, error, data }] = useLazyQuery(SEARCH_QUERY, {
    variables: { query: term },
    fetchPolicy: "no-cache",
  });

  const items: Array<Data> = data?.search || []; // pass items as props to a generic search component
  const findItemsButChill = debounce(findItems, 500); // pass this function as prop onInputValueChange to a search component

  const {
    isOpen,
    inputValue,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items,
    onInputValueChange({ inputValue }) {
      findItemsButChill({
        variables: {
          query: inputValue,
        },
      });
    },
    // onSelectedItemChange({ selectedItem }) {

    // },
    itemToString: (item) => item?.name || "",
  });

  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: "search",
            placeholder: "Search for an Item",
            id: "search",
            className: loading ? "loading" : null,
          })}
        />
      </div>
      <DropDown {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <DropDownItem
              {...getItemProps({ item, index })}
              key={item.id}
              highlighted={index === highlightedIndex}
            >
              {item.name}
            </DropDownItem>
          ))}
        {isOpen && !items.length && !loading && (
          <DropDownItem>Sorry, No items found for {inputValue}</DropDownItem>
        )}
      </DropDown>
    </SearchStyles>
  );
};

export default Search;
