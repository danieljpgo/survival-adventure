import dynamic from "next/dynamic";

const GameContainer = dynamic(() => import("./game"), {
  ssr: false,
  loading: () => <>loading</>, //@TODO: improve loading exp
});

export default function Home() {
  return <GameContainer />;
}
