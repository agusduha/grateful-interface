import useSWR from "swr";

const fetcher = (args: any) => fetch(args).then((res) => res.json());

const useLabel = (user: string, creator: string) => {
  const { data, error } = useSWR(`http://localhost:3000/api/labels?user=${user}&creator=${creator}`, fetcher);

  return {
    label: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useLabel;
