
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, username, role, category, created_at')
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Error fetching users',
          description: error instanceof Error ? error.message : 'An unexpected error occurred',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {user.category}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default UserList;
