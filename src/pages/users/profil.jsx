import React, { useState, useEffect } from 'react';
import {
  UserCircleIcon,
  PencilIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/solid';
import {
  Card,
  Typography,
  Button,
  Avatar,
  Input,
  Textarea,
  Select,
  Option,
} from '@material-tailwind/react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const genderLabel = {
  male: 'Laki-laki',
  female: 'Perempuan',
};

const activityLevelLabel = {
  sedentary: 'Kehidupan Pasif',
  light: 'Aktivitas Ringan',
  moderate: 'Sedang',
  active: 'Aktif',
};

const gymExperienceLabel = {
  beginner: 'Pemula',
  intermediate: 'Menengah',
  advanced: 'Lanjutan',
};

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [tujuanList, setTujuanList] = useState([]);
  const [programList, setProgramList] = useState([]);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    bio: '',
    activity_level: '',
    gym_experience: '',
    selected_tujuan_id: '',
    selected_program_id: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('http://localhost:8000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data;
        const birthYear = user.birth_date
          ? new Date(user.birth_date).getFullYear()
          : null;

        setUserData({
          name: user.full_name || '',
          email: user.email,
          gender: user.gender || '',
          age: birthYear ? new Date().getFullYear() - birthYear : '',
          height: user.height_cm || '',
          weight: user.weight_kg || '',
          bio: user.injury_details || '',
          activity_level: user.activity_level || '',
          gym_experience: user.gym_experience || '',
          selected_tujuan_id: user.tujuan_latihan_id || '',
          selected_program_id: user.program_latihan_id || '',
        });
      } catch (err) {
        console.error('Gagal mengambil data user:', err);
      }
    };

    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const [tujuanRes, programRes] = await Promise.all([
          axios.get('http://localhost:8000/api/tujuan-latihan', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:8000/api/program-latihan', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setTujuanList(tujuanRes.data || []);
        setProgramList(programRes.data || []);
      } catch (error) {
        console.error('Gagal memuat pilihan:', error);
      }
    };

    fetchUser();
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelect = (name, value) => {
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    try {
      const birthDate =
        userData.age && !isNaN(userData.age)
          ? `${new Date().getFullYear() - parseInt(userData.age)}-01-01`
          : null;

      await axios.put(
        'http://localhost:8000/api/user/profile',
        {
          full_name: userData.name,
          gender: userData.gender,
          birth_date: birthDate,
          height_cm: userData.height,
          weight_kg: userData.weight,
          injury_details: userData.bio,
          activity_level: userData.activity_level,
          gym_experience: userData.gym_experience,
          tujuan_latihan_id: userData.selected_tujuan_id,
          program_latihan_id: userData.selected_program_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditMode(false);
    } catch (err) {
      console.error('Gagal update profil:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 py-16 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="text-white hover:text-blue-200">
            <ArrowLeftIcon className="w-6 h-6" />
          </Link>
          <Typography variant="h4" className="text-white font-bold">
            Profil Saya
          </Typography>
          <div className="w-6" />
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 -mt-12">
        <Card className="p-6 shadow-md">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar
              src="/default-avatar.jpg"
              alt="Foto Profil"
              size="xxl"
              className="border-4 border-white shadow"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
            <div className="flex-1 w-full">
              {editMode ? (
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <Input
                    label="Nama Lengkap"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                  />
                  <Input
                    label="Email"
                    name="email"
                    value={userData.email}
                    disabled
                  />
                  <Select
                    label="Jenis Kelamin"
                    value={userData.gender}
                    onChange={(val) => handleSelect('gender', val)}
                  >
                    <Option value="male">Laki-laki</Option>
                    <Option value="female">Perempuan</Option>
                  </Select>
                  <Input
                    label="Usia"
                    name="age"
                    type="number"
                    value={userData.age}
                    onChange={handleChange}
                  />
                  <Input
                    label="Tinggi (cm)"
                    name="height"
                    type="number"
                    value={userData.height}
                    onChange={handleChange}
                  />
                  <Input
                    label="Berat (kg)"
                    name="weight"
                    type="number"
                    value={userData.weight}
                    onChange={handleChange}
                  />
                  <Select
                    label="Aktivitas Harian"
                    value={userData.activity_level}
                    onChange={(val) => handleSelect('activity_level', val)}
                  >
                    <Option value="sedentary">Kehidupan Pasif</Option>
                    <Option value="light">Aktivitas Ringan</Option>
                    <Option value="moderate">Sedang</Option>
                    <Option value="active">Aktif</Option>
                  </Select>
                  <Select
                    label="Pengalaman Gym"
                    value={userData.gym_experience}
                    onChange={(val) => handleSelect('gym_experience', val)}
                  >
                    <Option value="beginner">Pemula</Option>
                    <Option value="intermediate">Menengah</Option>
                    <Option value="advanced">Lanjutan</Option>
                  </Select>
                  <Select
                    label="Tujuan Latihan"
                    value={userData.selected_tujuan_id}
                    onChange={(val) => handleSelect('selected_tujuan_id', val)}
                  >
                    {tujuanList.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.nama_tujuan}
                      </Option>
                    ))}
                  </Select>
                  <Select
                    label="Program Latihan"
                    value={userData.selected_program_id}
                    onChange={(val) => handleSelect('selected_program_id', val)}
                  >
                    {programList.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.nama_program}
                      </Option>
                    ))}
                  </Select>
                  <div className="md:col-span-2">
                    <Textarea
                      label="Catatan / Cedera"
                      name="bio"
                      value={userData.bio}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-2 flex justify-end gap-3 mt-4">
                    <Button
                      variant="outlined"
                      color="red"
                      onClick={() => setEditMode(false)}
                    >
                      Batal
                    </Button>
                    <Button type="submit" color="blue">
                      Simpan
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <Typography variant="h4" className="font-bold">
                        {userData.name}
                      </Typography>
                      <Typography color="gray">{userData.email}</Typography>
                    </div>
                    <Button
                      variant="outlined"
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-2"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <div><strong>Jenis Kelamin:</strong> {genderLabel[userData.gender] || '-'}</div>
                    <div><strong>Usia:</strong> {userData.age || '-'} tahun</div>
                    <div><strong>Tinggi:</strong> {userData.height || '-'} cm</div>
                    <div><strong>Berat:</strong> {userData.weight || '-'} kg</div>
                    <div><strong>Aktivitas:</strong> {activityLevelLabel[userData.activity_level] || '-'}</div>
                    <div><strong>Pengalaman:</strong> {gymExperienceLabel[userData.gym_experience] || '-'}</div>
                    <div><strong>Tujuan Latihan:</strong> {tujuanList.find((t) => t.id === userData.selected_tujuan_id)?.nama_tujuan || '-'}</div>
                    <div><strong>Program Latihan:</strong> {programList.find((p) => p.id === userData.selected_program_id)?.nama_program || '-'}</div>
                    <div className="col-span-2"><strong>Catatan / Cedera:</strong> <div>{userData.bio || '-'}</div></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
