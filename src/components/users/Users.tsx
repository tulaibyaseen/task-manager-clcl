import React, { useState, useEffect } from 'react';
import { RootState, AppDispatch } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../features/users/usersSlice';
import UsersTable from './UsersTable';
import CreateUserModal from './CreateUserModal';
import { Button } from 'antd';

const Users: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useSelector((state: RootState) => state.users);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userCreated, setUserCreated] = useState(false);

  console.log('users', users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch, userCreated]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUserCreated = () => {
    setUserCreated((prevState) => !prevState);
    handleCancel();
  };

  const handleUserEdited = () => {
    setUserCreated((prevState) => !prevState);
  };

  if (usersLoading) return <div>Loading...</div>;
  if (usersError) return <div>Error: {usersError}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={showModal}>
          Create User
        </Button>
      </div>
      <UsersTable users={users} onUserEdited={handleUserEdited} />
      <CreateUserModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
};

export default Users;
