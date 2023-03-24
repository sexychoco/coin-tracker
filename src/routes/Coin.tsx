import {
  Switch,
  Route,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import Chart from "./Chart";
import Price from "./Price";

const Title = styled.h1`
  font-size: 4rem;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Container = styled.div`
  padding: 0px 20px;
  max-width: 40%;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
`;

const Card = styled.div`
  display: flex;
  justify-content: space-around;
  background-color: ${(props) => props.theme.cardBgColor};
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 33%;

  span:first-child {
    font-size: 0.8rem;
    font-weight: 400;
    text-transform: uppercase;
    margin-right: 0.5rem;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
  padding: 0.3rem;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: 400;
  background-color: ${(props) => props.theme.accentColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    padding: 7px 0px;
    display: block;
  }
`;

const LabelTitle = styled.div`
  font-weight: 400;
  font-size: 0.9rem;
  color: ${(props) => props.theme.accentColor};
  margin-right: 0.5rem;
`;

export interface Routeparams {
  coinId: string;
}

export interface Routestate {
  name: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

export interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Coin() {
  const { coinId } = useParams<Routeparams>();
  const { state } = useLocation<Routestate>();
  const priceMatch = useRouteMatch(":/coinId/price");
  const chartMatch = useRouteMatch(":/coinId/chart");
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId)
  );
  const loading = infoLoading || tickersLoading;
  return (
    <Container>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? "loading..." : infoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Main>
            <Card>
              <OverviewItem>
                <LabelTitle>Rank : </LabelTitle>
                <span>{infoData?.rank}</span>
              </OverviewItem>
              <OverviewItem>
                <LabelTitle>Symbol : </LabelTitle>
                <span>{infoData?.symbol}</span>
              </OverviewItem>
              <OverviewItem>
                <LabelTitle>Open source : </LabelTitle>
                <span>{infoData?.open_source ? "Yes" : "No"}</span>
              </OverviewItem>
            </Card>

            <Description>{infoData?.description}</Description>

            <Card>
              <OverviewItem>
                <LabelTitle>Total Suply : </LabelTitle>
                <span>{tickersData?.total_supply}</span>
              </OverviewItem>
              <OverviewItem>
                <LabelTitle>Max Supply : </LabelTitle>
                <span>{tickersData?.max_supply}</span>
              </OverviewItem>
            </Card>
          </Main>

          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
          </Tabs>

          <Switch>
            <Route path={`/:coinId/price`}>
              <Price />
            </Route>
            <Route path={`/:coinId/chart`}>
              <Chart coinId={coinId} />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
}

export default Coin;
