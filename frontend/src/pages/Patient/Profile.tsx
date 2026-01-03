import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';
import { updatePatientProfile } from '../../../services/apiSvc';

interface PatientProfile {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  gender: boolean;
  age: number;
  dob: string;
  address: string;
  profile_picture: string;
}

const PatientProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    password: '',
    gender: false,
    age: '',
    dob: '',
    address: '',
    profile_picture: null as File | null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token) {
      navigate('/login');
      return;
    }

    // Load current user data
    setProfile(user.data);
    setFormData({
      first_name: user.data.first_name || '',
      last_name: user.data.last_name || '',
      phone_number: user.data.phone_number || '',
      email: user.data.email || '',
      password: '',
      gender: user.data.gender || false,
      age: user.data.age || '',
      dob: user.data.dob || '',
      address: user.data.address || '',
      profile_picture: null,
    });
    if (user.data.profile_picture) {
      setPreviewImage(`/${user.data.profile_picture}`);
    }
    setLoading(false);
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        profile_picture: file,
      }));
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      data.append('first_name', formData.first_name);
      data.append('last_name', formData.last_name);
      data.append('phone_number', formData.phone_number);
      data.append('email', formData.email);
      if (formData.password) {
        data.append('password', formData.password);
      }
      data.append('gender', formData.gender.toString());
      data.append('age', formData.age);
      data.append('dob', formData.dob);
      data.append('address', formData.address);
      if (formData.profile_picture) {
        data.append('profile_picture', formData.profile_picture);
      }

      const response = await updatePatientProfile(profile!.id, data);
      if (response.status === 'success') {
        // Update local storage
        const updatedUser = { ...JSON.parse(localStorage.getItem('user') || '{}'), data: response.data.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar role="patient" />
        <main className="container mx-auto py-8 px-4">
          <p>Loading profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar role="patient" />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            ← Back
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password (leave blank to keep current)</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="profile_picture">Profile Picture</Label>
                <Input
                  id="profile_picture"
                  name="profile_picture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {previewImage && (
                  <div className="mt-2">
                    <img src={previewImage} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full" />
                  </div>
                )}
              </div>

              <Button type="submit" disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PatientProfile;