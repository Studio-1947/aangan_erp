import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { roomService, type Room } from '../services/roomService';
import { homestayService } from '../services/homestayService';
import { Loader2, Plus, Edit, Trash2, BedDouble, Users, IndianRupee, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { sileo } from 'sileo';

interface RoomFormData {
    name: string;
    type: string;
    capacity: number;
    price: number;
    amenities: string[];
    newAmenity: string;
}

const Rooms: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [homestayId, setHomestayId] = useState<string | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState<RoomFormData>({
        name: '',
        type: 'Single',
        capacity: 1,
        price: 0,
        amenities: [],
        newAmenity: ''
    });

    // Fetch Homestay and Rooms on Mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const homestay = await homestayService.getUserHomestay(user.id);
                if (homestay) {
                    setHomestayId(homestay.id);
                    const roomsData = await roomService.getRoomsByHomestay(homestay.id);
                    setRooms(roomsData || []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                sileo.error({ title: 'Failed to load rooms.' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'Single',
            capacity: 1,
            price: 0,
            amenities: [],
            newAmenity: ''
        });
        setEditingRoom(null);
    };

    const handleOpenAddModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (room: Room) => {
        setEditingRoom(room);
        setFormData({
            name: room.name,
            type: room.type,
            capacity: room.capacity,
            price: room.price,
            amenities: room.amenities || [],
            newAmenity: ''
        });
        setIsModalOpen(true);
    };

    const handleAddAmenity = () => {
        if (formData.newAmenity.trim()) {
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, prev.newAmenity.trim()],
                newAmenity: ''
            }));
        }
    };

    const handleRemoveAmenity = (index: number) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!homestayId) return;

        setSaving(true);
        try {
            const roomData = {
                homestay_id: homestayId,
                name: formData.name,
                type: formData.type,
                capacity: formData.capacity,
                price: formData.price,
                amenities: formData.amenities,
                is_available: true
            };

            if (editingRoom) {
                const updated = await roomService.updateRoom(editingRoom.id, roomData);
                if (updated) {
                    setRooms(prev => prev.map(r => r.id === updated.id ? updated : r));
                    sileo.success({ title: 'Room updated successfully!' });
                }
            } else {
                const created = await roomService.createRoom(roomData);
                if (created) {
                    setRooms(prev => [created, ...prev]);
                    sileo.success({ title: 'Room added successfully!' });
                }
            }
            setIsModalOpen(false);
        } catch (error: any) {
            sileo.error({ title: error.message || 'Failed to save room.' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this room?')) return;

        try {
            await roomService.deleteRoom(id);
            setRooms(prev => prev.filter(r => r.id !== id));
            sileo.success({ title: 'Room deleted.' });
        } catch (error: any) {
            sileo.error({ title: error.message || 'Failed to delete room.' });
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!homestayId) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center h-[calc(100vh-4rem)]">
                <h2 className="text-2xl font-bold mb-2">Homestay Not Found</h2>
                <p className="text-muted-foreground mb-4">You need to set up your homestay before managing rooms.</p>
                <Button asChild>
                    <a href="/onboarding">Setup Homestay</a>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Rooms</h1>
                    <p className="text-muted-foreground">Manage your homestay rooms and amenities.</p>
                </div>
                <Button onClick={handleOpenAddModal} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Room
                </Button>
            </div>

            {rooms.length === 0 ? (
                <div className="rounded-lg p-12 text-center border-dashed border-2 bg-muted/10">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <BedDouble className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No rooms added yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        Start by adding the different types of rooms available at your property.
                    </p>
                    <Button onClick={handleOpenAddModal} variant="outline">
                        Add Your First Room
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <Card key={room.id} className="hover:border-primary/50 transition-colors">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl">{room.name}</CardTitle>
                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground mt-2 inline-block">
                                            {room.type}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold flex items-center justify-end">
                                            <IndianRupee className="h-4 w-4" /> {room.price}
                                        </div>
                                        <span className="text-xs text-muted-foreground">/ night</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>Capacity: {room.capacity} Guests</span>
                                </div>

                                {room.amenities && room.amenities.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {room.amenities.map((amenity, i) => (
                                            <span key={i} className="text-[10px] px-2 py-1 bg-accent/50 rounded-md border border-accent">
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="pt-2 border-t border-border/50 flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleOpenEditModal(room)}>
                                    <Edit className="h-4 w-4 mr-1" /> Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(room.id)}>
                                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add/Edit Room Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
                        <DialogDescription>
                            {editingRoom ? 'Update room details and amenities.' : 'Enter the details for the new room.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="col-span-3"
                                placeholder="e.g. Deluxe Suite 101"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">Type</Label>
                            <div className="col-span-3">
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Single">Single</SelectItem>
                                        <SelectItem value="Double">Double</SelectItem>
                                        <SelectItem value="Suite">Suite</SelectItem>
                                        <SelectItem value="Dormitory">Dormitory</SelectItem>
                                        <SelectItem value="Villa">Villa</SelectItem>
                                        <SelectItem value="Apartment">Apartment</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="capacity" className="text-right">Capacity</Label>
                            <Input
                                id="capacity"
                                type="number"
                                min="1"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right pt-2">Amenities</Label>
                            <div className="col-span-3 space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        value={formData.newAmenity}
                                        onChange={(e) => setFormData({ ...formData, newAmenity: e.target.value })}
                                        placeholder="e.g. Wifi, AC"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddAmenity();
                                            }
                                        }}
                                    />
                                    <Button type="button" onClick={handleAddAmenity} variant="secondary">Add</Button>
                                </div>
                                {formData.amenities.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.amenities.map((amenity, index) => (
                                            <div key={index} className="flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full border border-primary/30">
                                                <span>{amenity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveAmenity(index)}
                                                    className="hover:text-destructive focus:outline-none"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingRoom ? 'Update Room' : 'Create Room'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Rooms;
