import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000/api/tujuan-latihan";

const TujuanLatihan = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [nama, setNama] = useState("");
  const [foto, setFoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Silakan login terlebih dahulu.");
      return navigate("/auth/login");
    }
    fetchData(token);
  }, []);

  const fetchData = async (token) => {
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error.response?.data || error);
      if (error.response?.status === 401) {
        alert("Sesi Anda telah berakhir. Silakan login kembali.");
        navigate("/auth/login");
      }
    }
  };

  const handleOpen = (item = null) => {
    setEditId(item ? item.id : null);
    setNama(item ? item.nama : "");
    setFoto(null); // reset foto
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setNama("");
    setFoto(null);
  };

  const handleSave = async () => {
    if (!nama.trim()) return;

    const token = localStorage.getItem("access_token");
    const formData = new FormData();
    formData.append("nama", nama);
    if (foto) formData.append("foto", foto);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editId) {
        await axios.post(`${API_URL}/${editId}?_method=PUT`, formData, config);
      } else {
        await axios.post(API_URL, formData, config);
      }

      handleClose();
      fetchData(token);
    } catch (error) {
      console.error("Gagal menyimpan data:", error.response?.data || error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("access_token");
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData(token);
    } catch (error) {
      console.error("Gagal menghapus data:", error.response?.data || error);
    }
  };

  return (
    <div className="mt-10 px-6">
      <Typography variant="h4" className="mb-6 text-blue-gray-700">
        Tujuan Latihan
      </Typography>

      <Button onClick={() => handleOpen()} color="blue" className="mb-4">
        + Tambah Tujuan
      </Button>

      <Card>
        <CardBody className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                <th className="p-2 border-b border-blue-gray-100">#</th>
                <th className="p-2 border-b border-blue-gray-100">Nama Tujuan</th>
                <th className="p-2 border-b border-blue-gray-100">Foto</th>
                <th className="p-2 border-b border-blue-gray-100 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={item.id}>
                  <td className="p-2 border-b">{idx + 1}</td>
                  <td className="p-2 border-b">{item.nama}</td>
                  <td className="p-2 border-b">
                    {item.foto ? (
                      <img
                        src={`http://localhost:8000/${item.foto}`}
                        alt="Foto"
                        className="h-16"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-2 border-b text-right space-x-2">
                    <Button size="sm" onClick={() => handleOpen(item)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      color="red"
                      onClick={() => handleDelete(item.id)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-400">
                    Tidak ada data tujuan latihan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Dialog open={open} handler={handleClose}>
        <DialogHeader>
          {editId ? "Edit Tujuan Latihan" : "Tambah Tujuan Latihan"}
        </DialogHeader>
        <DialogBody className="space-y-4">
          <Input
            label="Nama Tujuan"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            crossOrigin=""
          />
          <Input
            type="file"
            label="Upload Foto"
            onChange={(e) => setFoto(e.target.files[0])}
            crossOrigin=""
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="gray" onClick={handleClose}>
            Batal
          </Button>
          <Button color="blue" onClick={handleSave}>
            Simpan
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default TujuanLatihan;
