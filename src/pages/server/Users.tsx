import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { ServerLayout } from '../../layouts/ServerLayout';
import { Plus, Pencil, Trash2, UserCheck, Search } from 'lucide-react';
import { USERS, OUTLETS } from '../../shared/mockData';
import { User, UserRole } from '../../shared/types';

type UserStatus = 'active' | 'inactive';

interface UserWithStatus extends User {
  status: UserStatus;
  pin?: string;
}

const initialUsers: UserWithStatus[] = USERS.map(u => ({ ...u, status: 'active' }));

export const Users: React.FC = () => {
  const [users, setUsers] = useState<UserWithStatus[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithStatus | null>(null);

  const emptyForm = { name: '', email: '', role: 'cashier' as UserRole, outletId: '', pin: '', status: 'active' as UserStatus };
  const [form, setForm] = useState(emptyForm);

  const roleVariant = {
    admin: 'info' as const,
    manager: 'primary' as const,
    cashier: 'success' as const,
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAdd = () => {
    setForm(emptyForm);
    setIsAddModalOpen(true);
  };

  const openEdit = (user: UserWithStatus) => {
    setSelectedUser(user);
    setForm({ name: user.name, email: user.email, role: user.role, outletId: user.outletId ?? '', pin: user.pin ?? '', status: user.status });
    setIsEditModalOpen(true);
  };

  const openDelete = (user: UserWithStatus) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleAdd = () => {
    const newUser: UserWithStatus = {
      id: `u-${Date.now()}`,
      name: form.name,
      email: form.email,
      role: form.role,
      outletId: form.outletId || undefined,
      pin: form.pin,
      status: form.status,
    };
    setUsers(prev => [...prev, newUser]);
    setIsAddModalOpen(false);
  };

  const handleEdit = () => {
    if (!selectedUser) return;
    setUsers(prev => prev.map(u => u.id === selectedUser.id
      ? { ...u, name: form.name, email: form.email, role: form.role, outletId: form.outletId || undefined, pin: form.pin, status: form.status }
      : u
    ));
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
    setIsDeleteModalOpen(false);
  };

  const toggleStatus = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  const UserForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="e.g. John Kimani"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="john@whizpoint.com"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value as UserRole })}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="cashier">Cashier</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Outlet</label>
          <select
            value={form.outletId}
            onChange={e => setForm({ ...form, outletId: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">None (HQ / Admin)</option>
            {OUTLETS.map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Access PIN"
          type="password"
          placeholder="4-digit PIN"
          maxLength={4}
          value={form.pin}
          onChange={e => setForm({ ...form, pin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value as UserStatus })}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <ServerLayout title="Team Management">
      <div className="space-y-6">
        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['admin', 'manager', 'cashier'] as UserRole[]).map(role => (
            <Card key={role} className="p-4 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                ${role === 'admin' ? 'bg-blue-100 text-blue-700' : role === 'manager' ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {users.filter(u => u.role === role).length}
              </div>
              <div>
                <p className="text-xs text-gray-500 capitalize">{role}s</p>
                <p className="text-sm font-semibold text-gray-800">{users.filter(u => u.role === role && u.status === 'active').length} active</p>
              </div>
            </Card>
          ))}
          <Card className="p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
              {users.length}
            </div>
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-sm font-semibold text-gray-800">Team members</p>
            </div>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <Button onClick={openAdd} className="flex items-center gap-2">
            <Plus size={18} />
            Add User
          </Button>
        </div>

        {/* Users Table */}
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Team Members</h3>
            <span className="text-xs text-gray-400">{filtered.length} of {users.length}</span>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Name</TableCell>
                <TableCell header>Role</TableCell>
                <TableCell header>Email</TableCell>
                <TableCell header>Assigned Outlet</TableCell>
                <TableCell header>PIN</TableCell>
                <TableCell header>Status</TableCell>
                <TableCell header>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((user) => {
                const outlet = OUTLETS.find(o => o.id === user.outletId);
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                          ${user.role === 'admin' ? 'bg-blue-100 text-blue-700' : user.role === 'manager' ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleVariant[user.role]}>{user.role.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell className="text-gray-600">{outlet ? outlet.name : <span className="text-gray-400 italic">None</span>}</TableCell>
                    <TableCell>
                      {user.pin
                        ? <span className="font-mono text-gray-500 tracking-widest">{'•'.repeat(user.pin.length)}</span>
                        : <span className="text-gray-400 italic text-xs">Not set</span>
                      }
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors duration-200 cursor-pointer
                          ${user.status === 'active'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(user)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                          title="Edit user"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => openDelete(user)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors duration-200"
                          title="Delete user"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell className="text-center text-gray-400 py-8 col-span-7">
                    No users found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Add Modal */}
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New User" size="md">
          <UserForm />
          <div className="flex gap-3 mt-6">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <UserCheck size={16} />
              Add User
            </Button>
          </div>
        </Modal>

        {/* Edit Modal */}
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit — ${selectedUser?.name}`} size="md">
          <UserForm />
          <div className="flex gap-3 mt-6">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit} className="flex items-center gap-2">
              <Pencil size={16} />
              Save Changes
            </Button>
          </div>
        </Modal>

        {/* Delete Confirm Modal */}
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete User" size="sm">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
              <Trash2 size={20} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-800">
                Are you sure you want to delete <strong>{selectedUser?.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} className="flex-1">Cancel</Button>
              <Button variant="danger" onClick={handleDelete} className="flex-1 flex items-center justify-center gap-2">
                <Trash2 size={16} />
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </ServerLayout>
  );
};
