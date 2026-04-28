import { handleCreateUserCharity, handleGetUserCharity } from "@/server/userCharity"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useUserCharity = (enabled: boolean) => {
  const getUserCharity = useQuery({
    queryKey: ['getuserCharity'],
    queryFn: handleGetUserCharity,
    enabled,
  });

  const createUserCharity = useMutation({
    mutationFn: handleCreateUserCharity,
  });

  return { getUserCharity, createUserCharity };}