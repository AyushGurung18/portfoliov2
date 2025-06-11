// hooks/useProjects.ts
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useProjects = () => {
  const { data, error, isLoading } = useSWR('/api/projects', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 1000 * 60 * 5, // cache for 5 minutes
  });

  return {
    projects: data?.projects || [],
    techStack: data?.techStack || {},
    isLoading,
    isError: error,
  };
};
