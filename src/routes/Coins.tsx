import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { fetchCoins } from "../api";
import { isDarkAtom } from "./atoms";
import { useSetRecoilState } from "recoil";
import { useRecoilValue } from "recoil";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 15px;
  margin-bottom: 10px;
  border: 1px solid white;
  a {
    display: flex;
    align-items: center;
    padding: 20px;
    transition: color 0.2s ease-in;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 500;
  color: ${(props) => props.theme.accentColor};
  flex: 1;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
`;

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

const ToggleBtn = styled.button<{ toggle: boolean }>`
  width: 6rem;
  height: 3rem;
  border-radius: 30px;
  border: 3px solid black;
  cursor: pointer;
  background-color: ${(props) => (props.toggle ? "whitesmoke" : "grey")};
  position: relative;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease-in-out;
`;

const Circle = styled.div<{ toggle: boolean }>`
  background-color: ${(props) => props.theme.accentColor};
  width: 2rem;
  height: 2rem;
  position: absolute;
  border-radius: 50px;
  bottom: 15%;
  transition: all 0.5s ease-in-out;
  ${(props) =>
    props.toggle &&
    css`
      transform: translate(3rem, 0);
      transition: all 0.5s ease-in-out;
    `}
`;

function Coins() {
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
  const isDark = useRecoilValue(isDarkAtom);
  const { isLoading, data } = useQuery<ICoin[]>("allCoins", fetchCoins);
  return (
    <Container>
      <Header>
        <div style={{ flex: 1 }}></div>
        <Title>COINS</Title>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
          }}
        >
          <ToggleBtn onClick={toggleDarkAtom} toggle={isDark}>
            <Circle toggle={isDark} />
            <span>{isDark ? "dark" : "light"}</span>
          </ToggleBtn>
        </div>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {data?.slice(0, 100).map((coin) => (
            <Coin key={coin.id}>
              <Link
                to={{
                  pathname: `/${coin.id}`,
                  state: { name: coin.name },
                }}
              >
                <Img
                  src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                />
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}
export default Coins;
