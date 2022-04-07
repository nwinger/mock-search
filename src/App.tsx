import { useEffect, useState } from "react";
import "./App.css";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import styled from "styled-components";
import Search from "./Search";
import debounce from "lodash.debounce";

const SEARCH_QUERY = gql`
  query Search($query: String!) {
    search(query: $query) {
      id
      name
      email
    }
  }
`;

const BodyContainer = styled.div`
  height: 100vh;
  width: 100vw;
  font-family: monospace, monospace;
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* background: #043e5c; */
  gap: 5px;
`;

const SelectionContainer = styled.div`
  border-left: 1px dashed tomato;
  padding-left: 5px;
`;

const SearchContainer = styled.div`
  width: 50vw;
  height: 50vw;
  border: 1px solid red;
  background: teal;
`;

const SearchContainerInner = styled.div`
  /* width: 4rem; */
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  width: 75%;
`;

const Title = styled.h4`
  // font-size: 1.5em;
  // text-align: center;
  color: ${(props: any) => (props.highlight ? "palevioletred" : "")};
`;

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  :hover {
    #actionbtn {
      visibility: visible;
    }
  }
  padding: 5px;
  background: ${(props: any) => (props.highlight ? "papayawhip" : "white")};
  display: grid;
  grid-template-columns: 2fr 1fr;
  align-items: center;
`;

const Button = styled.button`
  visibility: hidden;
  display: hidden;
  width: 75%;
  // display: inline-block;
  color: palevioletred;
  background: papayawhip;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
  // display: block;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

function App() {
  const [count, setCount] = useState(0);
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

  const [items, setItems] = useState<Data[]>([]);

  useEffect(() => {
    setItems(data?.search || []);
  }, [data]);

  const foo: Array<Data> = data?.search || []; // pass items as props to a generic search component
  const findItemsButChill = debounce(findItems, 500); // pass this function as prop onInputValueChange to a search component

  return (
    <BodyContainer>
      <SearchContainer>
        <SearchContainerInner>
          <div>Content</div>
          <Search
            loading={loading}
            isOpen={true}
            items={items}
            noItemFoundText="No items found matching your query"
            keyExtractor={(i) => i.name}
            renderItem={(i, highlight) => {
              return (
                <Wrapper
                  highlight={highlight}
                  onClick={(e) => e.stopPropagation()} // Prevent menu from closing when clicking entire row
                >
                  <Title highlight={highlight}>
                    {`${i.name}`}
                    <small>{i.email}</small>
                  </Title>

                  <ButtonWrapper>
                    <Button
                      id="actionbtn"
                      onClick={(e) => {
                        console.log("Btn clicked");
                        // Set active item from here fow now
                        setItem(i);
                      }}
                    >
                      To the moon 🐱‍🚀🚀
                    </Button>
                  </ButtonWrapper>
                </Wrapper>
              );
            }}
            renderSelectedRecord={(i) => `${i.name} `}
            onInputChange={(inputValue) => {
              // Don't query if input is empty
              if (inputValue.length === 0) {
                setItems([]);
                return;
              }

              if (inputValue.length > 0)
                findItemsButChill({
                  variables: { query: inputValue },
                });
            }}
            onItemClick={(item) => setItem(item)}
          />
          <div>Content</div>
          {/* <Search /> */}
        </SearchContainerInner>
        <br />
        <div>Here's some content</div>
      </SearchContainer>
      <SelectionContainer>
        <p>Selected item</p>
        <pre>{JSON.stringify(item, null, 2)}</pre>
      </SelectionContainer>
    </BodyContainer>
  );
}

export default App;
