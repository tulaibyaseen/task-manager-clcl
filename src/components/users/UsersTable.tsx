import React, { useState } from 'react';
import { Table, Space, Tag, Button, Modal } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { deleteUser } from '../../features/users/usersSlice';
import { AppDispatch } from '../../store';
import { useDispatch } from 'react-redux';
import { User } from '../../types';
import EditUserModal from './EditUserModal';

const { Column } = Table;
const { confirm } = Modal;

interface UsersTableProps {
  users: User[];
  onUserEdited: () => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, onUserEdited }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleEdit = (user: User) => {
    console.log('user', user);

    setSelectedUser(user);
    setEditModalVisible(true);
  };

  const handleCancel = () => {
    setEditModalVisible(false);
    setSelectedUser(null);
  };

  const handleDelete = (userId: number) => {
    console.log('userId', userId);

    confirm({
      title: 'Are you sure delete this user?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone',
      onOk() {
        dispatch(deleteUser(userId));
      },
    });
  };

  const renderRole = (role_id: number) => {
    if (role_id === 1) {
      return 'Admin';
    } else if (role_id === 2) {
      return 'User';
    } else {
      return 'Unknown'; // In case other role_id values exist
    }
  };

  return (
    <>
      <Table dataSource={users} pagination={false}>
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column
          title="Role"
          dataIndex="role_id"
          key="role"
          render={(role_id: number) => renderRole(role_id)}
        />

        <Column title="Created At" dataIndex="created_at" key="createdAt" />
        <Column
          title="Actions"
          key="actions"
          render={(text, record: User) => (
            <Space size="middle">
              <Button type="primary" onClick={() => handleEdit(record)}>
                <EditOutlined />
              </Button>
              <Button
                type="default"
                className="bg-red-500"
                onClick={() => handleDelete(record.id)}
              >
                <DeleteOutlined className="text-white" />
              </Button>
            </Space>
          )}
        />
      </Table>
      <EditUserModal
        visible={editModalVisible}
        onCancel={handleCancel}
        user={selectedUser}
        onUserEdited={onUserEdited}
      />
    </>
  );
};

export default UsersTable;
