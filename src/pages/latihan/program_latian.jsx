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
  Select,
  Option,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const API_PROGRAM = "http://localhost:8000/api/program-latihan";
const API_TUJUAN = "http://localhost:8000/api/tujuan-latihan";
const BASE_URL = "http://localhost:8000/storage/";

const ProgramLatihan = () => {
  const [data, setData] = useState([]);
  const [tujuanList, setTujuanList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [nama, setNama] = useState("");
  const [tujuanId, setTujuanId] = useState("");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Silakan login terlebih dahulu.");
      return navigate("/auth/login");
    }

    fetchData(token);
    fetchTujuan(token);
  }, []);

  const fetchData = async (token) => {
    try {
      const res = await axios.get(API_PROGRAM, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.error("Gagal fetch program:", err);
    }
  };

  const fetchTujuan = async (token) => {
    try {
      const res = await axios.get(API_TUJUAN, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTujuanList(res.data);
    } catch (err) {
      console.error("Gagal fetch tujuan:", err);
    }
  };

  const handleOpen = (item = null) => {
    setEditId(item?.id || null);
    setNama(item?.nama || "");
    setTujuanId(item?.tujuan_latihan_id || "");
    setFoto(null);
    setPreview(item?.foto ? BASE_URL + item.foto : null);
    setOpen(true);
  };

  const handleClose = () => {
    setEditId(null);
    setNama("");
    setTujuanId("");
    setFoto(null);
    setPreview(null);
    setOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFoto(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSave = async () => {
    if (!nama.trim() || !tujuanId) return;

    const token = localStorage.getItem("access_token");
    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("tujuan_latihan_id", tujuanId);
    if (foto) {
      formData.append("foto", foto);
    }

    try {
      if (editId) {
        await axios.post(`${API_PROGRAM}/${editId}?_method=PUT`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(API_PROGRAM, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      handleClose();
      fetchData(token);
    } catch (err) {
      console.error("Gagal simpan:", err.response?.data || err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("access_token");
    try {
      await axios.delete(`${API_PROGRAM}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData(token);
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  };

  return (
    <div className="mt-10 px-6">
      <Typography variant="h4" className="mb-6 text-blue-gray-700">
        Program Latihan
      </Typography>

      <Button onClick={() => handleOpen()} color="blue" className="mb-4">
        + Tambah Program
      </Button>

      <Card>
        <CardBody className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                <th className="p-2 border-b">#</th>
                <th className="p-2 border-b">Foto</th>
                <th className="p-2 border-b">Nama Program</th>
                <th className="p-2 border-b">Tujuan Latihan</th>
                <th className="p-2 border-b text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="p-2 border-b">{idx + 1}</td>
                    <td className="p-2 border-b">
                      {item.foto ? (
                        <img
                          src={BASE_URL + item.foto}
                          alt={item.nama}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400">Tidak ada foto</span>
                      )}
                    </td>
                    <td className="p-2 border-b">{item.nama}</td>
                    <td className="p-2 border-b">{item.tujuan_latihan_id}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400">
                    Tidak ada data program latihan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Dialog open={open} handler={handleClose}>
        <DialogHeader>
          {editId ? "Edit Program Latihan" : "Tambah Program Latihan"}
        </DialogHeader>
        <DialogBody className="space-y-4">
          <Input
            label="Nama Program"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            crossOrigin=""
          />
          <Select
            label="Pilih Tujuan Latihan"
            value={tujuanId}
            onChange={(val) => setTujuanId(val)}
          >
            {tujuanList.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.nama}
              </Option>
            ))}
          </Select>
          <Input type="file" label="Foto Program" onChange={handleFileChange} />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
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

export default ProgramLatihan;
