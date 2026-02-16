import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Loader2, PlusCircle, Home, MapPin } from 'lucide-react';
import { homestayService } from '../services/homestayService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const CreateHomestay: React.FC = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user already has a homestay
  useEffect(() => {
    const checkExisting = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const existing = await homestayService.getUserHomestay(user.id);
        if (existing) {
          // Already has a homestay, redirect to dashboard
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        console.error('Error checking existing homestay:', err);
      } finally {
        setCheckingStatus(false);
      }
    };
    checkExisting();
  }, [navigate]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!name || !address) {
        throw new Error('Please fill in all fields');
      }

      // 1. Get logged in user
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      if (!userId) {
        throw new Error('User not logged in');
      }

      // 2. Insert homestay with valid owner_id (using auth.uid directly)
      const { error: insertError } = await supabase.from('homestays').insert({
        name,
        address,
        owner_id: userId,
      });

      if (insertError) throw insertError;

      alert('Homestay setup successful!');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Error creating homestay:', err);
      setError(err.message || 'Failed to create homestay');
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Setup Your Homestay</CardTitle>
          <CardDescription>
            One last step to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="homestay-name">Homestay Name</Label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="homestay-name"
                  className="pl-9"
                  placeholder="e.g. Sunny Retreat"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="address"
                  className="pl-9"
                  placeholder="e.g. 123 Mountain View"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
              )}
              Complete Setup
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateHomestay;
