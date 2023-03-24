import {
  Switch,
  Route,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router";
import styled from "styled-components";
import { fetchCoinTickers } from "../api";
import { useQuery } from "react-query";
import { PriceData } from "./Coin";

const Label = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  opacity: 0.6;
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.accentColor};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PriceCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: 15px;
  padding: 20px 20px;
  background-color: rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
`;

const GridContainer = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  grid-gap: 0.5rem;
`;

const GridItems = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.cardBgColor};
  border-radius: 15px;
  width: 100%;
  padding: 20px 20px;
`;

function Price() {
  const { coinId } = useParams<{ coinId: string }>();
  const { isLoading, data } = useQuery<PriceData>(["tickers", coinId], () =>
    fetchCoinTickers(coinId)
  );
  const quotes = data?.quotes.USD;
  const athDate = new Date(quotes!.ath_date);
  const athDateString = athDate.toLocaleDateString("ko-KR");
  const athTimeString = athDate.toLocaleTimeString("ko-KR");
  return (
    <div>
      {isLoading ? (
        "Loading Price Infomation...."
      ) : (
        <>
          <Container>
            <PriceCard>
              <div>
                {athDateString} {athTimeString}
              </div>
              <br />
              <div>
                <Label>Max Price</Label>
                <div>${quotes?.ath_price.toFixed(2)}</div>
              </div>
            </PriceCard>
            <GridContainer>
              <GridItems>
                <Label>Before 1 Hour</Label>
                {quotes?.percent_change_1h} %
              </GridItems>
              <GridItems>
                <Label>Before 6 Hour</Label>
                {quotes?.percent_change_6h} %
              </GridItems>
              <GridItems>
                <Label>Before 12 Hour</Label>
                {quotes?.percent_change_12h} %
              </GridItems>
              <GridItems>
                <Label>Before 1 Days</Label>
                {quotes?.percent_change_24h} %
              </GridItems>
              <GridItems>
                <Label>Before 7 Days</Label>
                {quotes?.percent_change_7d} %
              </GridItems>
              <GridItems>
                <Label>Before 30 Days</Label>
                {quotes?.percent_change_30d} %
              </GridItems>
            </GridContainer>
          </Container>
        </>
      )}
    </div>
  );
}

export default Price;
