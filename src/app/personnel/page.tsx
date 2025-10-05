
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Role } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { PersonnelDataTable } from './components/personnel-data-table';
import { getColumns } from './components/personnel-columns';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const REGISTER_COLLECTIONS = ["concrete_cubes_register", "cylinders_register", "pavers_register", "bricks_blocks_register", "water_absorption_register"];


export default function PersonnelPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { laboratoryId } = useAuth();

  const fetchData = useCallback(async () => {
    if (!laboratoryId) return;
    setLoading(true);
    
    try {
      const usersSnapshot = await getDocs(query(collection(db, "users"), where("laboratoryId", "==", laboratoryId)));
      const rolesSnapshot = await getDocs(query(collection(db, "roles"), where("laboratoryId", "==", laboratoryId)));
      
      const rolesData = rolesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Role));
      setRoles(rolesData);
      
      const workloadPromises = usersSnapshot.docs.map(async (userDoc) => {
          const userId = userDoc.id;
          let taskCount = 0;
          
          for (const coll of REGISTER_COLLECTIONS) {
              const q = query(collection(db, coll), where('technicianId', '==', userId), where('status', 'in', ['Pending Test', 'Rejected']));
              const snapshot = await getDocs(q);
              taskCount += snapshot.size;
          }
          return { id: userId, workload: taskCount };
      });
      
      const workloads = await Promise.all(workloadPromises);
      const workloadMap = new Map(workloads.map(w => [w.id, w.workload]));

      const usersData = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          name: data.name,
          email: data.email,
          photoURL: data.photoURL,
          status: data.status,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date(data.createdAt).toISOString(),
          laboratoryId: data.laboratoryId,
          roleId: data.roleId,
          workload: workloadMap.get(doc.id) || 0,
        } as User;
      });
      
      setUsers(usersData);

    } catch (error) {
      console.error("Error fetching data: ", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch data",
        description: "Could not load personnel data from Firestore.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, laboratoryId]);

  useEffect(() => {
    if(laboratoryId) {
      fetchData();
    }
  }, [fetchData, laboratoryId]);

  const columns = getColumns({ roles });

  return (
    <div className="space-y-6">
       <Card>
          <CardHeader>
            <CardTitle>Personnel Management</CardTitle>
            <CardDescription>
              An overview of all personnel in the laboratory.
            </CardDescription>
          </CardHeader>
        </Card>
      
       <PersonnelDataTable columns={columns} data={users} loading={loading} />
    </div>
  );
}
