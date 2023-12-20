import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRouter } from 'next/router'; // Import useRouter

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  const router = useRouter(); // Use the useRouter hook to access the router object

  return (
    <QueryClientProvider client={queryClient}>
      {/* Add the router's path as a key to the Component */}
      <Component {...pageProps} key={router.asPath} />
    </QueryClientProvider>
  );
}
