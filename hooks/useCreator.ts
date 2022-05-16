import useSWR from "swr";

const fetcher = (args: any) => fetch(args).then((res) => res.json());

const useCreator = (address: string) => {
  const { data, error } = useSWR(`http://localhost:3000/api/creators/${address}`, fetcher);

  return {
    creator: data,
    isLoading: !error && !data,
    isError: !!data?.error,
  };
};

export default useCreator;
