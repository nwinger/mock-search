import Downshift, {
  DownshiftState,
  useCombobox,
  UseComboboxState,
  UseComboboxStateChange,
  UseComboboxStateChangeOptions,
} from "downshift";
import { useState } from "react";
import React from "react";
import styled, { keyframes } from "styled-components";
import { MdSearch } from "react-icons/md";

const DropDown = styled.div`
  position: absolute;
  width: 100%;
  min-height: auto;
  max-height: 100%;
  overflow-y: scroll;
  z-index: 2;
  border: 1px solid gray;
`;

const DropDownItem = styled.li`
  list-style: none;
`;

const Input = styled.input`
  width: 100%;
  font-size: 1em;
  // margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

// Let's try again
const TopMenuSearch = styled.div`
  border-bottom: 1px solid #f6f6f6;
  flex: 1 1 346px;
  transition: all 0.4s;

  background: #fff;
  border-radius: 3px;
  height: 3rem;
  margin-left: 5px;
  position: relative;
`;

const SearchInput = styled.div`
  height: 100%;
  overflow: hidden;
  padding: 1px 0;
  width: 100%;
`;

const WsSearchInput = styled.div`
  height: 100%;
  box-shadow: none;
  background-color: #fff;
  border-radius: 3px;
  display: flex;
`;

const InputWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const InputIcon = styled.span`
  color: red;
  left: 16px;
  margin-top: -10px;
  pointer-events: none;
  position: absolute;
  top: 50%;
`;

const StyledInput = styled.input`
  appearance: none;
  background-color: transparent;
  border: 0;
  border-radius: 3px;
  box-sizing: border-box;
  display: block;
  font-size: 1rem;
  line-height: 1.5rem;
  margin: 0;
  padding 12px 24px;
  width: 100%;
`;

const SearchSuggestion = styled.div`
  position: absolute;
  margin-top: 4px;
  width: 100%;
  background: #fff;
`;

const StyledUl = styled.ul`
  box-shadow: 0 0 7px 0 rgb(0 0 0 / 20%);
  height: auto;
  left: auto;
  max-height: 70vh;
  min-height: 400px;
  overflow-y: auto;
  list-style-type: none;
  padding: 0px;
  margin: 0px;
  /* position: static; */
`;

export interface SearchProps<T> {
  isOpen?: boolean | undefined; // Control the isOpen property manually from consuming component
  loading?: boolean;
  noItemFoundText?: string;
  placeholder?: string;
  value?: string;
  selectedValue?: string;
  onInputChange: (inputValue: string) => void;
  //   ) => Array<T>;
  onItemClick?: (
    // e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: T
  ) => void;
  renderSelectedRecord: (item: T | null) => string;
  items: Array<T>;
  renderItem: (item: T, highlight: boolean) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

const stateReducer = <T extends unknown>(
  state: UseComboboxState<T>,
  actionAndChanges: UseComboboxStateChangeOptions<T>
) => {
  const { type, changes } = actionAndChanges;

  switch (type) {
    case useCombobox.stateChangeTypes.InputKeyDownEnter:
    case useCombobox.stateChangeTypes.ItemClick:
      // case useCombobox.stateChangeTypes.InputBlur:
      return {
        ...changes,
        isOpen: state.isOpen,
        highlightedIndex: state.highlightedIndex,
      };
    default:
      return changes;
  }

  return changes;
};

// https://medium.com/edonec/creating-a-generic-component-with-react-typescript-2c17f8c4386e
const Search = <T extends unknown>({
  items,
  keyExtractor,
  renderItem,
  renderSelectedRecord,
  onItemClick,
  onInputChange,
  loading,
  noItemFoundText,
  isOpen: externalIsOpen,
}: SearchProps<T>) => {
  const {
    isOpen,
    inputValue,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    highlightedIndex,
    selectedItem,
    selectItem,
  } = useCombobox({
    items,
    stateReducer,
    itemToString: renderSelectedRecord,
    onInputValueChange: ({ inputValue }) => {
      onInputChange(inputValue);
    },
    // onSelectedItemChange: ({ isOpen, selectedItem }) => {
    //   onItemClick !== undefined && onItemClick(selectedItem);
    // },
  });

  return (
    <TopMenuSearch>
      <SearchInput>
        <WsSearchInput>
          <InputWrapper {...getComboboxProps({ id: "searchcombobox" })}>
            {/* <InputIcon>
              <MdSearch />
            </InputIcon> */}
            <StyledInput
              {...getInputProps({
                type: "search",
                placeholder: "Search for an item",
                id: "searchinput",
                className: loading ? "loading" : "",
              })}
            ></StyledInput>
          </InputWrapper>
        </WsSearchInput>
        {isOpen && (
          <SearchSuggestion>
            {/* <StyledUl> */}
            <StyledUl {...getMenuProps({ id: "searchcombobox" })}>
              {items.map((item, index) => {
                return (
                  <DropDownItem
                    {...getItemProps({
                      item,
                      index,
                      // onClick: (e) => {
                      //   console.log('Clicked inside');
                      //   e.stopPropagation();
                      //   onItemClick && onItemClick(item);
                      // },
                      // onSelect: (e) => {
                      //   console.log('Selected inside');
                      //   e.stopPropagation();
                      //   onItemClick && onItemClick(item);
                      // },
                    })}
                    key={keyExtractor(item)}
                    highlighted={index === highlightedIndex}
                    // onClick={onclick}
                    // onClick={
                    //   () => {
                    //     selectItem(item);
                    //     onItemClick(selectedItem);
                    //   }
                    //   // onItemClick
                    //   //   ? (e, item) => {
                    //   //       console.log('In here', selectedItem);
                    //   //       // If onItemClick is defined, we override current behaviour to allow buttons and click events on each item displayed
                    //   //       onItemClick ? onItemClick(e, item) : e.preventDefault();
                    //   //     }
                    //   //   : undefined
                    // }
                  >
                    {renderItem(item, index === highlightedIndex)}
                  </DropDownItem>
                );
              })}
              {loading && isOpen && !items.length && (
                <DropDownItem>
                  <div>Loading...</div>
                </DropDownItem>
              )}
              {!loading && isOpen && !items.length && (
                <DropDownItem>
                  {noItemFoundText ?? `Sorry. No items found for ${inputValue}`}
                </DropDownItem>
              )}
            </StyledUl>
          </SearchSuggestion>
        )}
        {/* {
          <SearchSuggestion>
            <div>
              <StyledUl>
                <li>Content</li>
              </StyledUl>
            </div>
          </SearchSuggestion>
        } */}
      </SearchInput>
    </TopMenuSearch>
    // <SearchStyles>
    //   <p>{items?.length} items matched</p>
    //   {loading ? "Loading" : ""}
    //   <div {...getComboboxProps({ id: "searchcombobox" })}>
    //     <Input
    //       {...getInputProps({
    //         type: "search",
    //         placeholder: " Search for an item",
    //         id: "searchinput",
    //         className: loading ? "loading" : "",
    //       })}
    //       // className: loading ? 'loading' : null,
    //     />
    //   </div>
    //   {isOpen && (
    //     <DropDown {...getMenuProps({ id: "droplist" })}>
    //       {items.map((item, index) => (
    //         <DropDownItem
    //           {...getItemProps({
    //             item,
    //             index,
    //             // onClick: (e) => {
    //             //   console.log('Clicked inside');
    //             //   e.stopPropagation();
    //             //   onItemClick && onItemClick(item);
    //             // },
    //             // onSelect: (e) => {
    //             //   console.log('Selected inside');
    //             //   e.stopPropagation();
    //             //   onItemClick && onItemClick(item);
    //             // },
    //           })}
    //           key={keyExtractor(item)}
    //           highlighted={index === highlightedIndex}
    //           // onClick={onclick}
    //           // onClick={
    //           //   () => {
    //           //     selectItem(item);
    //           //     onItemClick(selectedItem);
    //           //   }
    //           //   // onItemClick
    //           //   //   ? (e, item) => {
    //           //   //       console.log('In here', selectedItem);
    //           //   //       // If onItemClick is defined, we override current behaviour to allow buttons and click events on each item displayed
    //           //   //       onItemClick ? onItemClick(e, item) : e.preventDefault();
    //           //   //     }
    //           //   //   : undefined
    //           // }
    //         >
    //           {renderItem(item, index === highlightedIndex)}
    //         </DropDownItem>
    //       ))}
    //       {!loading && isOpen && !items.length && (
    //         <DropDownItem>
    //           {noItemFoundText ?? `Sorry. No items found for ${inputValue}`}
    //         </DropDownItem>
    //       )}
    //     </DropDown>
    //   )}
    // </SearchStyles>
  );
};

export default Search;
