import dynamic from "next/dynamic";

const GameContainer = dynamic(() => import("./game"), {
  ssr: false,
  loading: () => <>loading</>,
});

export default function Home() {
  return <GameContainer />;
}
