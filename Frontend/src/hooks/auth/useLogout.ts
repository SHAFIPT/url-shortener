import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { logoutApi } from '@/lib/auth/api';
import { logout } from '@/redux/slice/userSlice';

export const useLogout = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      dispatch(logout());
    },
  });
};